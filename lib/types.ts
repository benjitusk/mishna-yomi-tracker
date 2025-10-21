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
