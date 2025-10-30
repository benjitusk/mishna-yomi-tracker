'use client';

import { useState, useEffect } from 'react';
import { MishnaCard } from '@/components/mishna-card';
import { ProgressStats } from '@/components/progress-stats';
import { AllTractatesView } from '@/components/all-tractates-view';
import { CalendarView } from '@/components/calendar-view';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RotateCcw, BookOpen, Calendar } from 'lucide-react';
import { getMishnaFromIndex, TOTAL_MISHNAYOT } from '@/lib/mishna-data';
import { getMishnayotForDate } from '@/lib/date-utils';
import { loadProgress, toggleChapter, resetProgress, type MishnaProgress } from '@/lib/storage';
import { fetchCloudProgress, saveCloudProgress, resetCloudProgress } from '@/lib/cloud-storage';
import { useAuth } from '@/hooks/use-auth';
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
import _ from 'lodash';
import { ModeToggle } from '@/components/theme-toggle';
import { PrintSchedule } from '@/components/print-schedule';
import { AccountMenu } from '@/components/account-menu';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useI18n } from '@/lib/i18n';
import { useDir } from '@/components/dir-manager';

export default function MishnaTracker() {
	const [progress, setProgress] = useState<MishnaProgress | null>(null);
	const [todayMishnayot, setTodayMishnayot] = useState<number[]>([]);
	const [activeTab, setActiveTab] = useState('today');
	const { user } = useAuth();
	const { t, locale } = useI18n();
	const isHebrew = locale === 'he';

	useEffect(() => {
		setProgress(loadProgress());
		setTodayMishnayot(getMishnayotForDate());
	}, []);

	// When a user logs in, hydrate from cloud and merge if necessary
	useEffect(() => {
		async function syncFromCloud() {
			if (!user) return;
			const cloud = await fetchCloudProgress(user.uid);
			if (cloud) {
				setProgress(cloud);
			} else {
				const local = loadProgress();
				// If local has any data, seed cloud with it
				if (local.completedChapters.size > 0) {
					await saveCloudProgress(user.uid, local);
				}
			}
		}
		syncFromCloud();
	}, [user]);

	const handleToggle = (globalIndex: number) => {
		const newProgress = toggleChapter(globalIndex);
		setProgress(newProgress);
		if (user) {
			// fire-and-forget save; no need to block UI
			saveCloudProgress(user.uid, newProgress);
		}
	};

	const handleReset = () => {
		resetProgress();
		setProgress(loadProgress());
		if (user) {
			resetCloudProgress(user.uid);
		}
	};

	if (!progress) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-muted-foreground">{t('loading')}</p>
			</div>
		);
	}

	// Get today's chapters with details
	const todayMishnayotDetails = _(todayMishnayot)
		.map((index) => {
			const mishna = getMishnaFromIndex(index);
			if (!mishna) return null;
			return {
				...mishna,
				isCompleted: progress.completedChapters.has(index),
			};
		})
		.compact()
		.value();

	// Get recent chapters (last 10 days)
	const recentMishnayot = _.compact(
		Array.from({ length: 20 }, (_, i) => {
			const index = todayMishnayot[0] - 20 + i;
			if (index < 0) return null;
			const chapter = getMishnaFromIndex(index);
			if (!chapter || index >= TOTAL_MISHNAYOT) return null;
			return {
				...chapter,
				isCompleted: progress.completedChapters.has(index),
				isToday: todayMishnayot.includes(index),
			};
		})
	);

	const dir = useDir();
	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b bg-card sticky top-0 z-10" dir={isHebrew ? 'rtl' : 'ltr'}>
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-balance">{t('app.title')}</h1>
							<p className="text-sm text-muted-foreground">
								{t('app.subtitle', { count: TOTAL_MISHNAYOT })}
							</p>
						</div>
						<div className="flex items-center gap-2">
							<PrintSchedule />
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="outline" size="icon">
										<RotateCcw className="h-4 w-4" />
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>{t('reset.title')}</AlertDialogTitle>
										<AlertDialogDescription>{t('reset.desc')}</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>{t('cancel.btn')}</AlertDialogCancel>
										<AlertDialogAction onClick={handleReset}>{t('reset.btn')}</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
							<ModeToggle />
							<LanguageSwitcher />
							<AccountMenu />
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				<div className="grid lg:grid-cols-3 gap-8">
					{/* Left Column - Main Content */}
					<div className={'lg:col-span-2 lg:row-start-1 lg:col-start-1'}>
						<Tabs value={activeTab} onValueChange={setActiveTab} dir={dir}>
							<TabsList className="grid w-full grid-cols-3 mb-6">
								<TabsTrigger value="today" className="flex items-center gap-2">
									<BookOpen className="h-4 w-4" />
									<span className="hidden sm:inline">{t('tabs.today')}</span>
								</TabsTrigger>
								<TabsTrigger value="all" className="flex items-center gap-2">
									<BookOpen className="h-4 w-4" />
									<span className="hidden sm:inline">{t('tabs.all')}</span>
								</TabsTrigger>
								<TabsTrigger value="calendar" className="flex items-center gap-2">
									<Calendar className="h-4 w-4" />
									<span className="hidden sm:inline">{t('tabs.calendar')}</span>
								</TabsTrigger>
							</TabsList>

							<TabsContent value="today" className="space-y-6">
								<section>
									<h2 className="text-xl font-semibold mb-4">{t('today.title')}</h2>
									<div className="grid md:grid-cols-2 gap-4">
										{todayMishnayotDetails.map((mishna) => (
											<MishnaCard
												key={`${mishna.tractate}-${mishna.chapter}-${mishna.index}`}
												seder={mishna.seder}
												tractate={mishna.tractate}
												chapter={mishna.chapter}
												index={mishna.index}
												isCompleted={mishna.isCompleted}
												isToday={true}
												onToggle={() => handleToggle(mishna.globalIndex)}
											/>
										))}
									</div>
								</section>

								<section>
									<h2 className="text-xl font-semibold mb-4">{t('recent.title')}</h2>
									<div className="grid md:grid-cols-2 gap-4">
										{recentMishnayot.toReversed().map((mishna) => (
											<MishnaCard
												key={`${mishna.tractate}-${mishna.chapter}-${mishna.index}`}
												seder={mishna.seder}
												tractate={mishna.tractate}
												chapter={mishna.chapter}
												index={mishna.index}
												isCompleted={mishna.isCompleted}
												isToday={mishna.isToday}
												onToggle={() => handleToggle(mishna.globalIndex)}
											/>
										))}
									</div>
								</section>
							</TabsContent>

							<TabsContent value="all">
								<AllTractatesView completedMishnayotIndices={progress.completedChapters} />
							</TabsContent>

							<TabsContent value="calendar">
								<CalendarView completedChapters={progress.completedChapters} />
							</TabsContent>
						</Tabs>
					</div>

					{/* Right Column - Stats (moves to left in Hebrew) */}
					<div
						className={`lg:col-span-1 lg:row-start-1 ${
							isHebrew ? 'lg:col-start-3' : 'lg:col-start-3'
						}`}
					>
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
