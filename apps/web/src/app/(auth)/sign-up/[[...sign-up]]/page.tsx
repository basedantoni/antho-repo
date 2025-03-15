import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <main className='grid place-items-center pt-4'>
      <SignUp fallbackRedirectUrl={'/dashboard'} />
    </main>
  );
}
