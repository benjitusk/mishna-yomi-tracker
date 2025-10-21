'use client';

import { useState, useEffect } from 'react';
import { MishnaCard } from '@/components/mishna-card';
import { ProgressStats } from '@/components/progress-stats';
import { AllTractatesView } from '@/components/all-tractates-view';
import { CalendarView } from '@/components/calendar-view';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Moon, Sun, RotateCcw, BookOpen, Calendar } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { getChapterFromIndex, TOTAL_CHAPTERS } from '@/lib/mishna-data';
import { getMishnayotForDate } from '@/lib/date-utils';
import { loadProgress, toggleChapter, resetProgress, type MishnaProgress } from '@/lib/storage';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function MishnaTracker() {
	const { theme, toggleTheme } = useTheme();
	const [progress, setProgress] = useState<MishnaProgress | null>(null);
	const [todayChapters, setTodayChapters] = useState<number[]>([]);
	const [activeTab, setActiveTab] = useState('today');

	useEffect(() => {
		setProgress(loadProgress());
		setTodayChapters(getMishnayotForDate());
	}, []);

	const handleToggle = (chapterIndex: number) => {
		const newProgress = toggleChapter(chapterIndex);
		setProgress(newProgress);
	};

	const handleReset = () => {
		resetProgress();
		setProgress(loadProgress());
	};

	if (!progress) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-muted-foreground">Loading...</p>
			</div>
		);
	}

	// Get today's chapters with details
	const todayMishnayotDetails = todayChapters
		.map((index) => {
			const chapter = getChapterFromIndex(index);
			if (!chapter) return null;
			return {
				...chapter,
				index,
				isCompleted: progress.completedChapters.has(index),
			};
		})
		.filter(Boolean);

	// Get recent chapters (last 10 days)
	const recentChapters = Array.from({ length: 20 }, (_, i) => {
		const index = Math.max(0, todayChapters[0] - 20 + i);
		const chapter = getChapterFromIndex(index);
		if (!chapter || index >= TOTAL_CHAPTERS) return null;
		return {
			...chapter,
			index,
			isCompleted: progress.completedChapters.has(index),
			isToday: todayChapters.includes(index),
		};
	}).filter(Boolean);

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b bg-card sticky top-0 z-10">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-balance">Daily Mishna Tracker</h1>
							<p className="text-sm text-muted-foreground">
								Track your journey through all {TOTAL_CHAPTERS} chapters
							</p>
						</div>
						<div className="flex items-center gap-2">
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="outline" size="icon">
										<RotateCcw className="h-4 w-4" />
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Reset Progress?</AlertDialogTitle>
										<AlertDialogDescription>
											This will clear all your completed chapters and reset your streaks. This
											action cannot be undone.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
							<Button variant="outline" size="icon" onClick={toggleTheme}>
								{theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				<div className="grid lg:grid-cols-3 gap-8">
					{/* Left Column - Main Content */}
					<div className="lg:col-span-2">
						<Tabs value={activeTab} onValueChange={setActiveTab}>
							<TabsList className="grid w-full grid-cols-3 mb-6">
								<TabsTrigger value="today" className="flex items-center gap-2">
									<BookOpen className="h-4 w-4" />
									<span className="hidden sm:inline">Today</span>
								</TabsTrigger>
								<TabsTrigger value="all" className="flex items-center gap-2">
									<BookOpen className="h-4 w-4" />
									<span className="hidden sm:inline">All Tractates</span>
								</TabsTrigger>
								<TabsTrigger value="calendar" className="flex items-center gap-2">
									<Calendar className="h-4 w-4" />
									<span className="hidden sm:inline">Calendar</span>
								</TabsTrigger>
							</TabsList>

							<TabsContent value="today" className="space-y-6">
								<section>
									<h2 className="text-xl font-semibold mb-4">Today's Mishnayot</h2>
									<div className="grid md:grid-cols-2 gap-4">
										{todayMishnayotDetails.map((mishna) => (
											<MishnaCard
												key={mishna.index}
												seder={mishna.seder}
												tractate={mishna.tractate}
												chapter={mishna.chapter}
												index={mishna.index}
												isCompleted={mishna.isCompleted}
												isToday={true}
												onToggle={() => handleToggle(mishna.index)}
											/>
										))}
									</div>
								</section>

								<section>
									<h2 className="text-xl font-semibold mb-4">Recent Chapters</h2>
									<div className="grid md:grid-cols-2 gap-4">
										{recentChapters.map((chapter) => (
											<MishnaCard
												key={chapter.index}
												seder={chapter.seder}
												tractate={chapter.tractate}
												chapter={chapter.chapter}
												isCompleted={chapter.isCompleted}
												isToday={chapter.isToday}
												onToggle={() => handleToggle(chapter.index)}
											/>
										))}
									</div>
								</section>
							</TabsContent>

							<TabsContent value="all">
								<AllTractatesView
									completedChapters={progress.completedChapters}
									onChapterClick={handleToggle}
								/>
							</TabsContent>

							<TabsContent value="calendar">
								<CalendarView completedChapters={progress.completedChapters} />
							</TabsContent>
						</Tabs>
					</div>

					{/* Right Column - Stats */}
					<div className="lg:col-span-1">
						<div className="sticky top-24">
							<ProgressStats
								completedCount={progress.completedChapters.size}
								currentStreak={progress.currentStreak}
								longestStreak={progress.longestStreak}
								lastStudyDate={progress.lastStudyDate}
							/>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
