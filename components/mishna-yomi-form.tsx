'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { generateMishnaYomiSchedule } from '@/lib/schedule';
import { Schedule } from '@/lib/types';
import { Printer } from 'lucide-react';
import { getStartDate } from '@/lib/date-utils';
import { Spinner } from './ui/spinner';

interface Props {
	onScheduleGenerated: (schedule: Schedule) => void;
	isPrinting?: boolean;
}

export default function MishnaYomiForm({ onScheduleGenerated, isPrinting }: Props) {
	const [startDate, setStartDate] = useState(getStartDate().toISOString().split('T')[0]);
	const [mishnayotPerDay, setMishnayotPerDay] = useState(2);
	const [name, setName] = useState(localStorage.getItem('mishnaYomiName') || '');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!startDate || mishnayotPerDay <= 0) return;

		generateMishnaYomiSchedule(new Date(startDate), mishnayotPerDay).then((schedule) => {
			schedule.name = name.trim() || undefined;
			// Save name to local storage
			if (name.trim()) {
				localStorage.setItem('mishnaYomiName', name.trim());
			} else {
				localStorage.removeItem('mishnaYomiName');
			}
			onScheduleGenerated(schedule);
		});
	};

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<div className="flex flex-col">
				<label htmlFor="name" className="font-medium">
					Your Name (optional)
				</label>
				<Input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
			</div>
			<div className="flex flex-col">
				<label htmlFor="start-date" className="font-medium">
					Start Date
				</label>
				<Input
					type="date"
					id="start-date"
					value={startDate}
					onChange={(e) => setStartDate(e.target.value)}
				/>
			</div>

			<div className="flex flex-col">
				<label htmlFor="mishnayot-per-day" className="font-medium">
					Mishnayot Per Day
				</label>
				<Input
					type="number"
					id="mishnayot-per-day"
					min={1}
					value={mishnayotPerDay}
					onChange={(e) => setMishnayotPerDay(Number(e.target.value))}
				/>
			</div>

			<Button type="submit" className="gap-2" disabled={isPrinting}>
				{isPrinting ? <Spinner /> : <Printer className="h-4 w-4" />}
				Download PDF
			</Button>
		</form>
	);
}
