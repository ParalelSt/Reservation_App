import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import { AdminPageClient } from '@/components/admin/AdminPageClient';

export default async function AdminPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  // Check admin role from Auth0 custom claims or app_metadata
  const roles = session.user?.['https://reservehub.com/roles'];
  const isAdmin = Array.isArray(roles) && roles.includes('admin');

  // Also check the email-based admin list as a fallback during development
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim()) ?? [];
  const userEmail = typeof session.user?.email === 'string' ? session.user.email : '';
  const isAdminByEmail = adminEmails.includes(userEmail);

  if (!isAdmin && !isAdminByEmail) {
    redirect('/');
  }

  return <AdminPageClient />;
}
