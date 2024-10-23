// /app/layout.js
import './globals.css'; // Ensure the path is correct for your global CSS file

import { Bebas_Neue, Lexend_Deca } from "next/font/google"; // Import Google fonts

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'], // Specify the weights you need
  variable: '--font-bebas', // Variable to use in CSS
});

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  weight: ['400', '700'], // Specify the weights you need
  variable: '--font-lexend', // Variable to use in CSS
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${lexendDeca.variable}`}>
      <head>
        <title>My App</title>
        <meta name="description" content="Your content companion" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${bebasNeue.variable} ${lexendDeca.variable}`}>
        {children}
      </body>
    </html>
  );
}