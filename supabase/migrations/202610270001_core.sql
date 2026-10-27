-- AHCAS institutional backend. Apply through Supabase CLI migrations.
create extension if not exists pgcrypto;
create type public.staff_role as enum ('applicant','student','lecturer','bursar','registrar','super_admin');
create type public.admission_status as enum ('draft','submitted','under_review','admitted','rejected');
create type public.payment_status as enum ('pending','successful','failed','refunded');

create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 full_name text not null default '',
 phone text,
 role public.staff_role not null default 'applicant',
 created_at timestamptz not null default now()
);
create table public.programmes (
 id uuid primary key default gen_random_uuid(),
 code text not null unique,
 title text not null,
 active boolean not null default true,
 created_at timestamptz not null default now()
);
create table public.applications (
 id uuid primary key default gen_random_uuid(),
 applicant_id uuid not null references public.profiles(id),
 programme_id uuid not null references public.programmes(id),
 reference text not null unique default ('AHCAS-' || upper(encode(gen_random_bytes(6),'hex'))),
 status public.admission_status not null default 'draft',
 details jsonb not null default '{}'::jsonb,
 submitted_at timestamptz,
 reviewed_by uuid references public.profiles(id),
 reviewed_at timestamptz,
 created_at timestamptz not null default now(),
 constraint review_requires_reviewer check (reviewed_at is null or reviewed_by is not null)
);
create table public.students (
 id uuid primary key default gen_random_uuid(),
 profile_id uuid not null unique references public.profiles(id),
 application_id uuid unique references public.applications(id),
 matric_number text not null unique,
 programme_id uuid not null references public.programmes(id),
 admitted_at timestamptz not null default now()
);
create table public.courses (
 id uuid primary key default gen_random_uuid(),
 programme_id uuid not null references public.programmes(id),
 code text not null unique,
 title text not null,
 credits integer not null check (credits > 0)
);
create table public.course_registrations (
 student_id uuid not null references public.students(id),
 course_id uuid not null references public.courses(id),
 session text not null,
 semester text not null,
 status text not null default 'pending' check (status in ('pending','approved','rejected')),
 primary key(student_id,course_id,session,semester)
);
create table public.results (
 id uuid primary key default gen_random_uuid(),
 student_id uuid not null references public.students(id),
 course_id uuid not null references public.courses(id),
 session text not null,
 semester text not null,
 ca_score numeric(5,2) check (ca_score between 0 and 100),
 exam_score numeric(5,2) check (exam_score between 0 and 100),
 published boolean not null default false,
 entered_by uuid references public.profiles(id),
 unique(student_id,course_id,session,semester)
);
create table public.payments (
 id uuid primary key default gen_random_uuid(),
 payer_id uuid not null references public.profiles(id),
 application_id uuid references public.applications(id),
 provider text not null check (provider in ('paystack','remita')),
 provider_reference text not null unique,
 amount_kobo bigint not null check (amount_kobo > 0),
 currency text not null default 'NGN',
 status public.payment_status not null default 'pending',
 verified_at timestamptz,
 created_at timestamptz not null default now()
);
create table public.audit_events (
 id bigint generated always as identity primary key,
 actor_id uuid,
 action text not null,
 subject_id uuid,
 metadata jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now()
);
create index on public.applications(applicant_id);
create index on public.payments(payer_id);
create index on public.results(student_id);
create index on public.audit_events(created_at desc);

-- Privilege lookup uses trusted database role, never client-supplied role claims.
create function public.is_staff(allowed public.staff_role[]) returns boolean
language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = any(allowed))
$$;
revoke all on function public.is_staff(public.staff_role[]) from public;
grant execute on function public.is_staff(public.staff_role[]) to authenticated;

-- Every new authenticated account starts as an applicant.
create function public.on_auth_signup() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
 insert into public.profiles (id, full_name)
 values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''));
 return new;
end $$;
create trigger create_profile after insert on auth.users
for each row execute function public.on_auth_signup();

alter table public.profiles enable row level security;
alter table public.programmes enable row level security;
alter table public.applications enable row level security;
alter table public.students enable row level security;
alter table public.courses enable row level security;
alter table public.course_registrations enable row level security;
alter table public.results enable row level security;
alter table public.payments enable row level security;
alter table public.audit_events enable row level security;

create policy "profiles read self or staff" on public.profiles for select to authenticated
using (id = (select auth.uid()) or public.is_staff(array['registrar','super_admin']::public.staff_role[]));
create policy "programmes public read active" on public.programmes for select to anon,authenticated using (active);
create policy "programmes staff manage" on public.programmes for all to authenticated
using (public.is_staff(array['registrar','super_admin']::public.staff_role[]))
with check (public.is_staff(array['registrar','super_admin']::public.staff_role[]));
create policy "applications read own or staff" on public.applications for select to authenticated
using (applicant_id = (select auth.uid()) or public.is_staff(array['registrar','super_admin']::public.staff_role[]));
create policy "applications applicant create draft" on public.applications for insert to authenticated
with check (applicant_id = (select auth.uid()) and status = 'draft' and submitted_at is null);
create policy "applications applicant edit draft" on public.applications for update to authenticated
using (applicant_id = (select auth.uid()) and status = 'draft')
with check (applicant_id = (select auth.uid()) and status in ('draft','submitted') and reviewed_by is null and reviewed_at is null);
create policy "applications registrar update" on public.applications for update to authenticated
using (public.is_staff(array['registrar','super_admin']::public.staff_role[]))
with check (public.is_staff(array['registrar','super_admin']::public.staff_role[]));
create policy "students read self staff" on public.students for select to authenticated
using (profile_id = (select auth.uid()) or public.is_staff(array['registrar','super_admin']::public.staff_role[]));
create policy "courses read" on public.courses for select to authenticated using (true);
create policy "courses manage" on public.courses for all to authenticated
using (public.is_staff(array['registrar','super_admin']::public.staff_role[]))
with check (public.is_staff(array['registrar','super_admin']::public.staff_role[]));
create policy "registrations read" on public.course_registrations for select to authenticated
using (exists(select 1 from public.students s where s.id=student_id and s.profile_id=(select auth.uid()))
 or public.is_staff(array['registrar','lecturer','super_admin']::public.staff_role[]));
create policy "registrations self insert" on public.course_registrations for insert to authenticated
with check (status='pending' and exists(select 1 from public.students s where s.id=student_id and s.profile_id=(select auth.uid())));
create policy "registrations staff review" on public.course_registrations for update to authenticated
using (public.is_staff(array['registrar','super_admin']::public.staff_role[]))
with check (public.is_staff(array['registrar','super_admin']::public.staff_role[]));
create policy "results read published or staff" on public.results for select to authenticated
using ((published and exists(select 1 from public.students s where s.id=student_id and s.profile_id=(select auth.uid())))
 or public.is_staff(array['lecturer','registrar','super_admin']::public.staff_role[]));
create policy "results staff write" on public.results for insert to authenticated
with check (public.is_staff(array['lecturer','registrar','super_admin']::public.staff_role[]));
create policy "results staff update" on public.results for update to authenticated
using (public.is_staff(array['lecturer','registrar','super_admin']::public.staff_role[]))
with check (public.is_staff(array['lecturer','registrar','super_admin']::public.staff_role[]));
create policy "payments read own or bursar" on public.payments for select to authenticated
using (payer_id=(select auth.uid()) or public.is_staff(array['bursar','super_admin']::public.staff_role[]));
create policy "audit read super admin" on public.audit_events for select to authenticated
using (public.is_staff(array['super_admin']::public.staff_role[]));

-- Do not grant client update access to profiles.role, payments.status or audit events.
revoke all on public.profiles, public.applications, public.students, public.course_registrations,
 public.results, public.payments, public.audit_events from anon, authenticated;
grant select on public.profiles,public.applications,public.students,public.course_registrations,
 public.results,public.payments,public.audit_events to authenticated;
grant insert on public.applications, public.course_registrations, public.results to authenticated;
grant update (details,status,submitted_at) on public.applications to authenticated;
grant update (status) on public.course_registrations to authenticated;
grant update (ca_score,exam_score,published,entered_by) on public.results to authenticated;
grant select on public.programmes,public.courses to anon,authenticated;
grant insert,update,delete on public.programmes,public.courses to authenticated;
-- Review and admission provisioning must occur in trusted Edge Functions/service-role transactions.
