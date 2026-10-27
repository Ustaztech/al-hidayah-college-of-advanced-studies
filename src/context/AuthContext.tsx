import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabaseApi, type AuthSession } from '../services/supabaseApi';
import type { UserAccount } from '../services/db';
import type { StudentRecord, ApplicationRecord } from '../types';

export type UserRole = 'GUEST'|'APPLICANT'|'STUDENT'|'LECTURER'|'BURSAR'|'REGISTRAR'|'SUPER_ADMIN';
type Context = {
 currentUser: UserAccount | null; role: UserRole;
 studentData: StudentRecord | null; applicantData: ApplicationRecord | null;
 login: (email: string, password: string) => Promise<void>;
 register: (name:string,email:string,password:string,role:'APPLICANT'|'STUDENT'|'STAFF',subRole?:unknown,phone?:string)=>Promise<void>;
 switchDemoView: (type:'STUDENT'|'APPLICANT'|'REGISTRAR'|'BURSAR'|'SUPER_ADMIN')=>void;
 logout:()=>void; authError:string;setAuthError:(error:string)=>void;refreshUserData:()=>void;
};
const AuthContext = createContext<Context|undefined>(undefined);
const STORAGE_KEY = 'ahcas_supabase_session';
const staff = ['LECTURER','BURSAR','REGISTRAR','SUPER_ADMIN'];
function toAccount(profile: {id:string;full_name:string;role:string;phone?:string},email:string): UserAccount {
 const role = profile.role.toUpperCase();
 return {id: profile.id,name:profile.full_name,email,passwordHash:'',role:staff.includes(role)?'STAFF':role==='STUDENT'?'STUDENT':'APPLICANT',subRole:staff.includes(role)?role as UserAccount['subRole']:undefined,phone:profile.phone,createdAt:''};
}
export const AuthProvider: React.FC<{children:React.ReactNode}> = ({children})=>{
 const [currentUser,setCurrentUser]=useState<UserAccount|null>(null);
 const [authError,setAuthError]=useState('');
 const [loading,setLoading]=useState(true);
 const [session,setSession]=useState<AuthSession|null>(null);
 const [studentData]=useState<StudentRecord|null>(null);
 const [applicantData]=useState<ApplicationRecord|null>(null);
 const persist=(value:AuthSession|null)=>{
  setSession(value);
  if(value) sessionStorage.setItem(STORAGE_KEY,JSON.stringify(value));
  else sessionStorage.removeItem(STORAGE_KEY);
 };
 const loadProfile=useCallback(async(value:AuthSession)=>{
  const profiles=await supabaseApi.getMyProfile(value.access_token);
  if(!profiles.length) throw new Error('Account profile is not available.');
  const account=toAccount(profiles[0],value.user.email||'');
  setCurrentUser(account);
 },[]);
 useEffect(()=>{
  let active=true;
  const restore=async()=>{
   try {
    const raw=sessionStorage.getItem(STORAGE_KEY);
    if(raw) {
     const old=JSON.parse(raw) as AuthSession;
     const refreshed=await supabaseApi.refresh(old.refresh_token);
     if(!active)return;
     await loadProfile(refreshed);
     if(active)persist(refreshed);
    }
   } catch {
    if(active){persist(null);setCurrentUser(null);}
   } finally {if(active)setLoading(false);}
  };
  void restore();
  return ()=>{active=false;};
 },[loadProfile]);
 // Access tokens remain in session-only storage; never use the legacy db session.
 useEffect(()=>{
  if(!session?.refresh_token)return;
  const delay=Math.max(30000,(session.expires_in-90)*1000);
  const timer=window.setTimeout(async()=>{
   try {
    const updated=await supabaseApi.refresh(session.refresh_token);
    await loadProfile(updated);persist(updated);
   } catch {persist(null);setCurrentUser(null);}
  },delay);
  return ()=>window.clearTimeout(timer);
 },[session,loadProfile]);
 const login=async(email:string,password:string)=>{
  setAuthError('');
  try {
   const next=await supabaseApi.signIn(email,password);
   await loadProfile(next);persist(next);
  } catch(e){const message=e instanceof Error?e.message:'Sign in failed';setAuthError(message);throw e;}
 };
 const register=async(name:string,email:string,password:string,role:'APPLICANT'|'STUDENT'|'STAFF')=>{
  setAuthError('');
  if(role!=='APPLICANT')throw new Error('Student and staff accounts must be provisioned by the Registrar.');
  try{
   const next=await supabaseApi.signUp(email,password,name);
   if(!next.access_token) throw new Error('Account registered. Please complete email confirmation before signing in.');
   await loadProfile(next);persist(next);
  }catch(e){const message=e instanceof Error?e.message:'Registration failed';setAuthError(message);throw e;}
 };
 const logout=()=>{persist(null);setCurrentUser(null);};
 const role:UserRole=!currentUser?'GUEST':currentUser.role==='STAFF'?(currentUser.subRole||'GUEST'):currentUser.role;
 const refreshUserData=()=>{if(session)void loadProfile(session).catch(()=>logout());};
 const switchDemoView=()=>{setAuthError('Demo role switching is disabled for security.');};
 return <AuthContext.Provider value={{currentUser,role,studentData,applicantData,login,register,switchDemoView,logout,authError,setAuthError,refreshUserData}}>
 {loading?<div className="min-h-screen flex items-center justify-center text-emerald-900">Checking secure session…</div>:children}
 </AuthContext.Provider>;
};
export function useAuth(){const ctx=useContext(AuthContext);if(!ctx)throw new Error('AuthProvider is required');return ctx;}
