import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main className='grid place-items-center pt-4'>
      <SignIn fallbackRedirectUrl={'/posts'} />
    </main>
  );
}
