'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AccountMenu() {
	const { user, loading, signInWithGoogle, signOut } = useAuth();

	if (loading) {
		return (
			<Button variant="outline" disabled>
				Loading…
			</Button>
		);
	}

	if (!user) {
		return (
			<Button variant="outline" onClick={signInWithGoogle}>
				Sign in
			</Button>
		);
	}

	const display = user.displayName || user.email || 'Account';

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">{display}</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{user.email ? <DropdownMenuItem disabled>{user.email}</DropdownMenuItem> : null}
				<DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
