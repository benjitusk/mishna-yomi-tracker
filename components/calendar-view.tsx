'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMishnayotForDate, getStartDate } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';

interface CalendarViewProps {
	completedChapters: Set<number>;
}

export function CalendarView({ completedChapters }: CalendarViewProps) {
	const [currentMonth, setCurrentMonth] = useState(new Date());

	const year = currentMonth.getFullYear();
	const month = currentMonth.getMonth();

	// Get first day of month and number of days
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);
	const daysInMonth = lastDay.getDate();
	const startingDayOfWeek = firstDay.getDay();

	// Generate calendar days
	const days = [];
	for (let i = 0; i < startingDayOfWeek; i++) {
		days.push(null);
	}
	for (let i = 1; i <= daysInMonth; i++) {
		days.push(i);
	}

	const goToPreviousMonth = () => {
		setCurrentMonth(new Date(year, month - 1, 1));
	};

	const goToNextMonth = () => {
		setCurrentMonth(new Date(year, month + 1, 1));
	};

	const getDayStatus = (day: number) => {
		const date = new Date(year, month, day);
		const chapters = getMishnayotForDate(date);

		const allCompleted = chapters.every((idx) => completedChapters.has(idx));
		const someCompleted = chapters.some((idx) => completedChapters.has(idx));
		const isToday = date.toDateString() === new Date().toDateString();
		const isFuture = date > new Date();
		const isBeforeStart = date < getStartDate();

		return {
			allCompleted,
			someCompleted,
			isToday,
			isFuture,
			isBeforeStart,
			chapters,
		};
	};

	const { locale } = useI18n();
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>
						{currentMonth.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
					</CardTitle>
					<div className="flex gap-2" dir="ltr">
						<Button variant="outline" size="icon" onClick={goToPreviousMonth}>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="icon" onClick={goToNextMonth}>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-7 gap-2">
					{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
						<div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
							{day}
						</div>
					))}

					{days.map((day, index) => {
						if (day === null) {
							return <div key={`empty-${index}`} />;
						}

						const status = getDayStatus(day);

						return (
							<div
								key={day}
								className={cn(
									'aspect-square p-2 rounded-lg border text-center flex flex-col items-center justify-center text-sm transition-colors',
									status.isToday && 'ring-2 ring-accent',
									status.isFuture && 'opacity-40',
									status.isBeforeStart && 'opacity-20',
									status.allCompleted &&
										!status.isFuture &&
										'bg-green-100 dark:bg-green-900/30 border-green-300',
									status.someCompleted &&
										!status.allCompleted &&
										'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300',
									!status.someCompleted &&
										!status.isFuture &&
										!status.isBeforeStart &&
										'hover:bg-muted'
								)}
							>
								<span className="font-medium">{day}</span>
								{status.allCompleted && !status.isFuture && (
									<span className="text-xs text-green-600 dark:text-green-400">✓</span>
								)}
							</div>
						);
					})}
				</div>

				<div className="mt-4 flex flex-wrap gap-4 text-xs">
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30 border border-green-300" />
						<span>Completed</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300" />
						<span>Partial</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded border ring-2 ring-accent" />
						<span>Today</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
