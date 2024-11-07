import { Newsreader } from '@next/font/google';
import './globals.css';
import { FileProvider } from './FileContext';

// Load the Newsreader font
const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  
});

export const metadata = {
  title: 'ZK Email Email Masking',
  description: 'Generate ZK proofs on Masked Emails',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="[forced-color-adjust:none]" >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fustat:wght@200..800&family=Newsreader&display=swap"
          rel="stylesheet"
        />
        <meta name="color-scheme" content="only light" />
      </head>
      <body className="font-fustat bg-[#0F1112]">
        <FileProvider>
          {children}
        </FileProvider>
      </body>
    </html>
  );
}
