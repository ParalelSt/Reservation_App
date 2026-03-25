import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { auth0 } from '@/lib/auth0';
import { Providers } from '@/components/Providers';
import { AppShell } from '@/components/layout/AppShell';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ReserveHub - Rezervacije',
  description: 'Sustav za rezervaciju privatnih sesija u glazbenom studiju, sauni i teretani',
  manifest: '/manifest.json',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();

  const sessionUser = session?.user;
  const user = sessionUser
    ? {
        id: typeof sessionUser.sub === 'string' ? sessionUser.sub : '',
        name: typeof sessionUser.name === 'string' ? sessionUser.name : undefined,
        picture: typeof sessionUser.picture === 'string' ? sessionUser.picture : undefined,
        email: typeof sessionUser.email === 'string' ? sessionUser.email : undefined,
      }
    : null;

  // Admin detection: Auth0 roles claim OR email-based list
  const roles = session?.user?.['https://reservehub.com/roles'];
  const isAdminByRole = Array.isArray(roles) && roles.includes('admin');
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim()) ?? [];
  const userEmail = typeof session?.user?.email === 'string' ? session.user.email : '';
  const isAdmin = isAdminByRole || adminEmails.includes(userEmail);

  return (
    <html lang="hr" className={inter.variable}>
      <body className="font-sans antialiased">
        <Providers>
          <AppShell user={user} isAdmin={isAdmin}>
            {children}
          </AppShell>
        </Providers>
      </body>
    </html>
  );
}
