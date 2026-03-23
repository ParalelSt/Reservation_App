import { redirect } from 'next/navigation';
import { auth0 } from '@/lib/auth0';
import { ProfilePageClient } from '@/components/profile/ProfilePageClient';

export default async function ProfilePage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const user = {
    id: session.user.sub as string,
    name: (session.user.name as string) ?? 'Korisnik',
    email: (session.user.email as string) ?? '',
    picture: (session.user.picture as string) ?? '',
  };

  return <ProfilePageClient user={user} />;
}
