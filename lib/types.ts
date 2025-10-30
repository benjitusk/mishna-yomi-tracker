// types.ts
export interface MishnaLocation {
	seder: string;
	tractate: string;
	chapter: number;
	index: number;
}

export interface DailyAssignment {
	date: string; // ISO string
	start: MishnaLocation;
	end: MishnaLocation;
}

export interface Schedule {
	startDate: string; // ISO string
	endDate: string; // ISO string
	mishnayotPerDay: number;
	assignments: DailyAssignment[];
	name?: string;
}

// Mishnah structure types (from data/mishnah_full.ts)
export interface SederMetadata {
	order: number;
	hebrewName: string;
	safariaName: string;
}

export interface TractateMetadata {
	order: number;
	hebrewName: string;
	safariaName: string;
}

export interface ChapterInfo {
	hebrewName: string;
	numberOfMishnayot: number;
}

export interface TractateInfo {
	metadata: TractateMetadata;
	chapters: Record<string, ChapterInfo>; // keys are 1-based chapter numbers as strings
}

export interface SederInfo {
	metadata: SederMetadata;
	tractates: Record<string, TractateInfo>;
}

export type MishnaStructure = Record<string, SederInfo>; // keys are seder names

// Core domain models
export interface MishnaRef extends MishnaLocation {
	globalIndex: number; // 0-based global index across all mishnayot
}

export interface MishnaResolved extends MishnaRef {
	sederHebrewName: string;
	tractateHebrewName: string;
	chapterHebrewName: string;
}

export interface MishnaProgressModel {
	completedChapters: Set<number>;
	lastStudyDate: string | null;
	currentStreak: number;
	longestStreak: number;
	startDate: string;
}
