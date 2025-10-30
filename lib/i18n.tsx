'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Locale = 'en' | 'he';

export type Messages = Record<string, string>;

const en: Messages = {
	'app.title': 'Daily Mishna Tracker',
	'app.subtitle': 'Track your journey through all {count} mishnayot',
	'tabs.today': 'Today',
	'tabs.all': 'All Tractates',
	'tabs.calendar': 'Calendar',
	'today.title': "Today's Mishnayot",
	'recent.title': 'Recent Mishnayot',
	'reset.title': 'Reset Progress?',
	'reset.desc':
		'This will clear all your completed mishnayot and reset your streaks. This action cannot be undone.',
	'reset.btn': 'Reset',
	'cancel.btn': 'Cancel',
	loading: 'Loading...',
	'auth.signIn': 'Sign in',
	'auth.signOut': 'Sign out',
	'auth.loading': 'Loading…',
	'auth.account': 'Account',
	'progress.overall': 'Overall Progress',
	'progress.chaptersCompleted': 'Mishnayot Completed',
	'progress.percentComplete': '{percent}% Complete',
	'progress.currentStreak': 'Current Streak',
	'progress.bestStreak': 'Best Streak',
	'progress.days': 'days',
	'progress.lastStudy': 'Last Study',
	'print.open': 'Print Schedule',
	'print.title': 'Mishna Yomi Schedule',
	'print.generator': 'Mishna Yomi Schedule Generator',
	'mishna.today': "Today's Chapter",
	'mishna.read': 'Read',
	'tractate.mishnayotCount': '{count} mishnayot',
	'tractate.mishnaCount.one': '{count} mishna',
	'tractate.mishnaCount.other': '{count} mishnayot',
	'printForm.nameLabel': 'Your Name (optional)',
	'printForm.startDate': 'Start Date',
	'printForm.mishnayotPerDay': 'Mishnayot Per Day',
	'printForm.downloadPdf': 'Download PDF',
	'printable.startDate': 'Start Date',
	'printable.endDate': 'End Date',
	'printable.table.date': 'Date',
	'printable.table.seder': 'Seder',
	'printable.table.mishnayot': 'Mishnayot',
	'dialog.lang.hebrewOnly': 'Hebrew Only',
	'dialog.lang.englishOnly': 'English Only',
	'dialog.lang.both': 'Both',
	'dialog.loadError.title': 'Failed to load Mishna text',
	'dialog.loadError.subtitle': 'Please try again or visit Sefaria directly',
};

const he: Messages = {
	'app.title': 'מעקב משנה יומי',
	'app.subtitle': 'עקוב אחר ההתקדמות שלך דרך כל {count} משניות',
	'tabs.today': 'היום',
	'tabs.all': 'כל המסכתות',
	'tabs.calendar': 'לוח שנה',
	'today.title': 'משניות של היום',
	'recent.title': 'משניות אחרונות',
	'reset.title': 'לאפס התקדמות?',
	'reset.desc': 'פעולה זו תמחק את כל המשניות שסומנו ותאפס רצפים. לא ניתן לבטל.',
	'reset.btn': 'איפוס',
	'cancel.btn': 'ביטול',
	loading: 'טוען...',
	'auth.signIn': 'התחבר',
	'auth.signOut': 'התנתק',
	'auth.loading': 'טוען…',
	'auth.account': 'חשבון',
	'progress.overall': 'התקדמות כללית',
	'progress.chaptersCompleted': 'משניות שהושלמו',
	'progress.percentComplete': '{percent}% הושלם',
	'progress.currentStreak': 'רצף נוכחי',
	'progress.bestStreak': 'הרצף הטוב ביותר',
	'progress.days': 'ימים',
	'progress.lastStudy': 'לימוד אחרון',
	'print.open': 'הדפס לוח',
	'print.title': 'לוח משנה יומית',
	'print.generator': 'מחולל לוח משנה יומית',
	'mishna.today': 'משנה של היום',
	'mishna.read': 'פתח',
	'tractate.mishnayotCount': '{count} משניות',
	'tractate.mishnaCount.one': '{count} משנה',
	'tractate.mishnaCount.other': '{count} משניות',
	'printForm.nameLabel': 'שמך (אופציונלי)',
	'printForm.startDate': 'תאריך התחלה',
	'printForm.mishnayotPerDay': 'משניות ליום',
	'printForm.downloadPdf': 'הורד PDF',
	'printable.startDate': 'תאריך התחלה',
	'printable.endDate': 'תאריך סיום',
	'printable.table.date': 'תאריך',
	'printable.table.seder': 'סדר',
	'printable.table.mishnayot': 'משניות',
	'dialog.lang.hebrewOnly': 'עברית בלבד',
	'dialog.lang.englishOnly': 'אנגלית בלבד',
	'dialog.lang.both': 'שניהם',
	'dialog.loadError.title': 'טעינת טקסט המשנה נכשלה',
	'dialog.loadError.subtitle': 'אנא נסה שוב או בקר בספריא ישירות',
};

const LOCALE_KEY = 'mishna-locale';

function getInitialLocale(): Locale {
	if (typeof window === 'undefined') return 'en';
	const stored = localStorage.getItem(LOCALE_KEY) as Locale | null;
	if (stored === 'he' || stored === 'en') return stored;
	const prefersHe = typeof navigator !== 'undefined' && navigator.language?.startsWith('he');
	return prefersHe ? 'he' : 'en';
}

const catalogs: Record<Locale, Messages> = { en, he };

function format(template: string, vars?: Record<string, string | number>): string {
	if (!vars) return template;
	return template.replace(/\{(.*?)\}/g, (_, k) => String(vars[k] ?? ''));
}

interface I18nContextValue {
	locale: Locale;
	messages: Messages;
	t: (key: string, vars?: Record<string, string | number>) => string;
	setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
	const [locale, setLocaleState] = useState<Locale>('en');

	useEffect(() => {
		setLocaleState(getInitialLocale());
	}, []);

	const setLocale = (next: Locale) => {
		setLocaleState(next);
		if (typeof window !== 'undefined') localStorage.setItem(LOCALE_KEY, next);
	};

	const messages = catalogs[locale];

	const t = useMemo(() => {
		return (key: string, vars?: Record<string, string | number>) => {
			const msg = messages[key] ?? key;
			return format(msg, vars);
		};
	}, [messages]);

	const value = useMemo<I18nContextValue>(
		() => ({ locale, messages, t, setLocale }),
		[locale, messages, t]
	);

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
	const ctx = useContext(I18nContext);
	if (!ctx) throw new Error('useI18n must be used within I18nProvider');
	return ctx;
}
