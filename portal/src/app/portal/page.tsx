import { redirect } from 'next/navigation';
import { getServerSessionUser } from '../../lib/auth/session';
import { getPrimaryDashboardForRoles } from '../../lib/auth/roles';

export default async function PortalGatewayPage() {
  const user = await getServerSessionUser();

  if (!user) {
    redirect('/portal/login');
  }

  const dashboard = getPrimaryDashboardForRoles(user.roles);
  redirect(dashboard);
}
