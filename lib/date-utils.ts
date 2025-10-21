const MISHNA_START_DATE = new Date('2024-01-01'); // Adjust this to your actual start date
const CHAPTERS_PER_DAY = 2;

export function getDaysSinceStart(date: Date = new Date()): number {
	const start = new Date(MISHNA_START_DATE);
	start.setHours(0, 0, 0, 0);

	const current = new Date(date);
	current.setHours(0, 0, 0, 0);

	const diffTime = current.getTime() - start.getTime();
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

	return Math.max(0, diffDays);
}

export function getExpectedChapterIndex(date: Date = new Date()): number {
	const days = getDaysSinceStart(date);
	return days * CHAPTERS_PER_DAY;
}

export function getMishnayotForDate(date: Date = new Date()): number[] {
	debugger;
	const baseIndex = getExpectedChapterIndex(date);
	return Array.from({ length: CHAPTERS_PER_DAY }, (_, i) => baseIndex + i);
}

export function formatHebrewDate(date: Date): string {
	// Simple Hebrew date formatting - in production, use a proper Hebrew calendar library
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};
	return date.toLocaleDateString('en-US', options);
}

export function getStartDate(): Date {
	return new Date(MISHNA_START_DATE);
}

export function setStartDate(date: Date): void {
	// In a real app, this would persist to localStorage or a database
	localStorage.setItem('mishna-start-date', date.toISOString());
}
