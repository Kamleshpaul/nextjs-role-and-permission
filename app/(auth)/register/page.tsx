
import Link from 'next/link';
import RegisterForm from './form';
import { getRoles } from '@/server/queries/user';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Register() {
  const session = await auth();
  if (session) {
    redirect('/')
  }
  const roles = await getRoles();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <RegisterForm roles={roles} />
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
