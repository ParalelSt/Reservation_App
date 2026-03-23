import { auth0 } from '@/lib/auth0';
import { BookingPageClient } from '@/components/booking/BookingPageClient';

export default async function BookPage() {
  const session = await auth0.getSession();

  const user = session
    ? {
        id: session.user.sub as string,
        name: (session.user.name as string) ?? 'User',
        email: (session.user.email as string) ?? '',
      }
    : null;

  const today = new Date().toISOString().split('T')[0];

  return <BookingPageClient user={user} today={today} />;
}
