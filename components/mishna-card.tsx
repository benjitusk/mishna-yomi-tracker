'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Seder } from '@/lib/mishna-data';
import { MishnaTextDialog } from './mishna-text-dialog';
import { getSederHebrewName, MISHNA_STRUCTURE } from '@/lib/mishna-data';
import { useI18n } from '@/lib/i18n';

interface MishnaCardProps {
	seder: Seder;
	tractate: string;
	chapter: number;
	index: number;
	isCompleted: boolean;
	isToday: boolean;
	onToggle: () => void;
}

const SEDER_COLORS: Record<Seder, string> = {
	Zeraim: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
	Moed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
	Nashim: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
	Nezikin: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
	Kodashim: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
	Tohorot: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
};

export function MishnaCard({
	seder,
	tractate,
	chapter,
	index,
	isCompleted,
	isToday,
	onToggle,
}: MishnaCardProps) {
	const { locale, t } = useI18n();
	const isHebrew = locale === 'he';
	const sederDisplay = isHebrew ? getSederHebrewName(seder) : seder;
	const tractateDisplay = isHebrew
		? MISHNA_STRUCTURE[seder].tractates[tractate]?.metadata.hebrewName || tractate
		: tractate;

	return (
		<Card
			className={cn(
				'transition-all hover:shadow-md',
				isToday && 'ring-2 ring-accent',
				isCompleted && 'opacity-75'
			)}
		>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between gap-2">
					<div className="flex-1">
						<Badge className={cn('mb-2', SEDER_COLORS[seder])} variant="secondary">
							{sederDisplay}
						</Badge>
						<CardTitle className="text-lg leading-tight">
							{tractateDisplay} {chapter}:{index}
						</CardTitle>
					</div>
					<Checkbox
						checked={isCompleted}
						onCheckedChange={onToggle}
						onClick={(e) => e.stopPropagation()}
						className="mt-1"
					/>
				</div>
			</CardHeader>
			<CardContent className="pt-0 flex items-center justify-between gap-2">
				<div>
					{isToday && (
						<Badge variant="outline" className="text-xs">
							{t('mishna.today')}
						</Badge>
					)}
				</div>
				<MishnaTextDialog
					seder={seder}
					tractate={tractate}
					chapter={chapter}
					highlightIndex={index}
				>
					<Button variant="ghost" size="sm" className="h-8">
						<BookOpen className="h-4 w-4 me-1" />
						{t('mishna.read')}
					</Button>
				</MishnaTextDialog>
			</CardContent>
		</Card>
	);
}
