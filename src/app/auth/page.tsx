// app/(auth)/page.tsx
import AuthForm from '@/components/AuthForm';
import Navbar from '@/components/Navbar';

export default function AuthPage() {
  return (
    <main>
      <Navbar/>
      <AuthForm />
    </main>
  );
}