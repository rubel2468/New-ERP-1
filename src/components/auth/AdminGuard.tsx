import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';

export default async function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  if ((session.user as any).role !== 'Admin') {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
