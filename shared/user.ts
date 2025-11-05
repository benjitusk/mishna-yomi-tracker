export type AppLocale = 'en' | 'he' | 'system';

export interface UserSettings {
	locale: AppLocale;
}

export interface UserDocument {
	email: string | null;
	createdAtMs: number;
	settings: UserSettings;
}

export function createInitialUserDocument(params: {
	email?: string | null;
	locale?: AppLocale;
}): UserDocument {
	return {
		email: params.email ?? null,
		createdAtMs: Date.now(),
		settings: {
			locale: params.locale ?? 'system',
		},
	};
}


