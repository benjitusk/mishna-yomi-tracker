'use client';

import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n';

export function DirManager() {
	const dir = useDir();
	const { locale } = useI18n();
	useEffect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.setAttribute('dir', dir);
			document.body?.setAttribute('dir', dir);
			document.documentElement.lang = locale;
		}
	}, [locale]);

	return null;
}

export function useDir() {
	const { locale } = useI18n();
	if (locale === 'he') return 'rtl';
	return 'ltr';
}
