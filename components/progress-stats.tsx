'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, BookOpen, Trophy, Calendar } from 'lucide-react';
import { TOTAL_MISHNAYOT } from '@/lib/mishna-data';
import { useI18n } from '@/lib/i18n';

interface ProgressStatsProps {
	completedCount: number;
	currentStreak: number;
	longestStreak: number;
	lastStudyDate: string | null;
}

export function ProgressStats({
	completedCount,
	currentStreak,
	longestStreak,
	lastStudyDate,
}: ProgressStatsProps) {
	const progressPercentage = (completedCount / TOTAL_MISHNAYOT) * 100;
	const { t, locale } = useI18n();
	const isHebrew = locale === 'he';
	const dateLocale = isHebrew ? 'he-IL' : 'en-US';

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-base flex items-center gap-2">
						<BookOpen className="h-5 w-5 text-primary" />
						{t('progress.overall')}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">{t('progress.chaptersCompleted')}</span>
							<span className="font-semibold" dir="ltr">
								{completedCount} / {TOTAL_MISHNAYOT}
							</span>
						</div>
						<Progress value={progressPercentage} className="h-2" />
						<p className="text-xs text-muted-foreground text-right">
							{t('progress.percentComplete', { percent: progressPercentage.toFixed(1) })}
						</p>
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-2 gap-4">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm flex items-center gap-2">
							<Flame className="h-4 w-4 text-orange-500" />
							{t('progress.currentStreak')}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">{currentStreak}</p>
						<p className="text-xs text-muted-foreground mt-1">{t('progress.days')}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm flex items-center gap-2">
							<Trophy className="h-4 w-4 text-accent" />
							{t('progress.bestStreak')}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">{longestStreak}</p>
						<p className="text-xs text-muted-foreground mt-1">{t('progress.days')}</p>
					</CardContent>
				</Card>
			</div>

			{lastStudyDate && (
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-sm flex items-center gap-2">
							<Calendar className="h-4 w-4 text-primary" />
							{t('progress.lastStudy')}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm">
							{new Date(lastStudyDate).toLocaleDateString(dateLocale, {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
