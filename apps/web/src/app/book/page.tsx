import { redirect } from 'next/navigation';
import { auth0 } from '@/lib/auth0';
import { syncUser } from '@/lib/actions/users';
import { BookingPageClient } from '@/components/booking/BookingPageClient';

export default async function BookPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const auth0Id = session.user.sub as string;

  // Sync user to DB on booking page visit
  await syncUser({
    auth0Id,
    email: (session.user.email as string) ?? '',
    name: (session.user.name as string) ?? 'User',
    picture: (session.user.picture as string) ?? null,
  });

  const user = {
    id: auth0Id,
    name: (session.user.name as string) ?? 'User',
    email: (session.user.email as string) ?? '',
  };

  const today = new Date().toISOString().split('T')[0];

  return <BookingPageClient user={user} today={today} />;
}
