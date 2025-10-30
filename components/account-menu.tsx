'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useI18n } from '@/lib/i18n';

export function AccountMenu() {
	const { user, loading, signInWithGoogle, signOut } = useAuth();
	const { t } = useI18n();

	if (loading) {
		return (
			<Button variant="outline" disabled>
				{t('auth.loading')}
			</Button>
		);
	}

	if (!user) {
		return (
			<Button variant="outline" onClick={signInWithGoogle}>
				{t('auth.signIn')}
			</Button>
		);
	}

	const display = user.displayName || user.email || t('auth.account');

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">{display}</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{user.email ? <DropdownMenuItem disabled>{user.email}</DropdownMenuItem> : null}
				<DropdownMenuItem onClick={() => signOut()}>{t('auth.signOut')}</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
