'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useI18n } from '@/lib/i18n';

export function LanguageSwitcher() {
	const { locale, setLocale, t } = useI18n();
	const label = locale === 'he' ? 'עברית' : 'English';
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">{label}</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setLocale('en')}>English</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setLocale('he')}>עברית</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
