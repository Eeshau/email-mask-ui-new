import { Space_Grotesk } from '@next/font/google';
import './globals.css';

// Load Space Grotesk with font optimization
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // Add required font weights
  variable: '--font-space-grotesk',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.variable}>
        {children}
      </body>
    </html>
  );
}
