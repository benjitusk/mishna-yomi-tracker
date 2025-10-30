'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import {
	onAuthStateChanged,
	signInWithPopup,
	signOut as fbSignOut,
	type User,
} from 'firebase/auth';

interface AuthContextValue {
	user: User | null;
	loading: boolean;
	signInWithGoogle: () => Promise<void>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (u) => {
			setUser(u);
			setLoading(false);
		});
		return () => unsub();
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({
			user,
			loading,
			async signInWithGoogle() {
				await signInWithPopup(auth, googleProvider);
			},
			async signOut() {
				await fbSignOut(auth);
			},
		}),
		[user, loading]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}
