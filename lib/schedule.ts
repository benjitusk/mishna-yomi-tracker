// utils/schedule.ts
import { getMishnaFromIndex, TOTAL_MISHNAYOT } from './mishna-data';
import { DailyAssignment, Schedule } from './types';

export async function generateMishnaYomiSchedule(
	startDate: Date,
	mishnayotPerDay: number
): Promise<Schedule> {
	const schedule: DailyAssignment[] = [];
	const targetEndDate = new Date(startDate);
	targetEndDate.setUTCDate(
		startDate.getUTCDate() + Math.ceil(TOTAL_MISHNAYOT / mishnayotPerDay) - 1
	);
	let currentIndex = 0;
	let currentDate = new Date(startDate);

	while (currentIndex < TOTAL_MISHNAYOT) {
		const startMishna = getMishnaFromIndex(currentIndex);
		const endIndex = Math.min(currentIndex + mishnayotPerDay - 1, TOTAL_MISHNAYOT - 1);
		const endMishna = getMishnaFromIndex(endIndex);

		schedule.push({
			date: currentDate.toISOString().split('T')[0],
			start: startMishna,
			end: endMishna,
		});

		currentIndex += mishnayotPerDay;
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return {
		startDate: startDate.toISOString().split('T')[0],
		endDate: targetEndDate.toISOString().split('T')[0],
		mishnayotPerDay,
		assignments: schedule,
	};
}
