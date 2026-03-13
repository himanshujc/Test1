import type {Metadata} from 'next';
import './globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'PocketTrack - Daily Expense Tracker & Pocket Tracker',
  description: 'Track your daily expenses with AI insights and interactive charts. PocketTrack is the ultimate Daily Expense Tracker and Pocket Tracker for your finances.',
  keywords: ['Daily Expense Tracker', 'Pocket Tracker', 'Expense Tracker', 'Financial AI', 'Spending Insights'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>      
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="keywords" content="Daily Expense Tracker, Pocket Tracker" />
        <meta name="google-adsense-account" content="ca-pub-7525000535202715" />
       
      </head>
      <body className="font-body antialiased bg-gray-200">
        {children}
      </body>
    </html>
  );
}
