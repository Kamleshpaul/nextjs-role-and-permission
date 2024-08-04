import Link from 'next/link';
import LoginForm from './form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function SignInPage() {
  const session = await auth();
  if (session) {
    redirect('/')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <LoginForm />
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            {"Don't have an account?"} {''}
            <Link href="/register" className="text-blue-600 hover:underline">
              register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
