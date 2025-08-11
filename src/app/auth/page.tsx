import Navbar from '@/components/Navbar';
import dynamic from 'next/dynamic';

const AuthForm = dynamic(() => import('@/components/AuthForm'), { ssr: false });

export default function AuthPage() {
  return (
    <main>
      <Navbar />
      <AuthForm />
    </main>
  );
}
