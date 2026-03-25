import { redirect } from 'next/navigation';
import { auth0 } from '@/lib/auth0';
import { getReservationsByUser } from '@/lib/actions/reservations';
import { syncUser } from '@/lib/actions/users';
import { ProfilePageClient } from '@/components/profile/ProfilePageClient';

export default async function ProfilePage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const auth0Id = session.user.sub as string;

  // Sync user to DB on every profile visit
  await syncUser({
    auth0Id,
    email: (session.user.email as string) ?? '',
    name: (session.user.name as string) ?? 'Korisnik',
    picture: (session.user.picture as string) ?? null,
  });

  const reservations = await getReservationsByUser(auth0Id);

  const user = {
    id: auth0Id,
    name: (session.user.name as string) ?? 'Korisnik',
    email: (session.user.email as string) ?? '',
    picture: (session.user.picture as string) ?? '',
  };

  return <ProfilePageClient user={user} initialReservations={reservations} />;
}
