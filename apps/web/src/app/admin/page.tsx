import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import { getAllReservations } from '@/lib/actions/reservations';
import { AdminPageClient } from '@/components/admin/AdminPageClient';

export default async function AdminPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const roles = session.user?.['https://reservehub.com/roles'];
  const isAdmin = Array.isArray(roles) && roles.includes('admin');

  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim()) ?? [];
  const userEmail = typeof session.user?.email === 'string' ? session.user.email : '';
  const isAdminByEmail = adminEmails.includes(userEmail);

  if (!isAdmin && !isAdminByEmail) {
    redirect('/');
  }

  const reservations = await getAllReservations();

  return <AdminPageClient initialReservations={reservations} />;
}
