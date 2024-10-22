import { Newsreader } from '@next/font/google';
import './globals.css';
import { FileProvider } from './FileContext';

// Load the Newsreader font
const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={newsreader.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fustat:wght@200..800&family=Newsreader&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-fustat">
        <FileProvider>
          {children}
        </FileProvider>
      </body>
    </html>
  );
}
