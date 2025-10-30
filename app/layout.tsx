import type React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { ThemeProvider } from '@/hooks/use-theme';
import { AuthProvider } from '@/hooks/use-auth';
import localFont from 'next/font/local';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Daily Mishna Tracker',
	description: 'Track your daily Mishna learning progress',
};

const shofar = localFont({
	src: './fonts/Shofar.woff2',
	variable: '--font-shofar',
	display: 'swap',
});
const garamond = localFont({
	src: './fonts/Garamond.woff2',
	variable: '--font-garamond',
	display: 'swap',
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`font-sans antialiased ${shofar.variable} ${garamond.variable}`}>
				<AuthProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
						<Analytics />
					</ThemeProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
