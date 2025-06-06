import Image, { type ImageProps } from 'next/image';
import { Button } from '@antho/ui/components/button';

export default function Home() {
  return (
    <div>
      <main>
        <ol>
          <li>
            Get started by editing <code>apps/docs/app/page.tsx</code>
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div>
          <a
            href='https://vercel.com/new/clone?demo-description=Learn+to+implement+a+monorepo+with+a+two+Next.js+sites+that+has+installed+three+local+packages.&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4K8ZISWAzJ8X1504ca0zmC%2F0b21a1c6246add355e55816278ef54bc%2FBasic.png&demo-title=Monorepo+with+Turborepo&demo-url=https%3A%2F%2Fexamples-basic-web.vercel.sh%2F&from=templates&project-name=Monorepo+with+Turborepo&repository-name=monorepo-turborepo&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fturborepo%2Ftree%2Fmain%2Fexamples%2Fbasic&root-directory=apps%2Fdocs&skippable-integrations=1&teamSlug=vercel&utm_source=create-turbo'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              src='/vercel.svg'
              alt='Vercel logomark'
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href='https://turbo.build/repo/docs?utm_source'
            target='_blank'
            rel='noopener noreferrer'
          >
            Read our docs
          </a>
        </div>
        <Button variant='secondary'>Open alert</Button>
      </main>
      <footer>
        <a
          href='https://vercel.com/templates?search=turborepo&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image
            aria-hidden
            src='/window.svg'
            alt='Window icon'
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href='https://turbo.build?utm_source=create-turbo'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image
            aria-hidden
            src='/globe.svg'
            alt='Globe icon'
            width={16}
            height={16}
          />
          Go to turbo.build →
        </a>
      </footer>
    </div>
  );
}
