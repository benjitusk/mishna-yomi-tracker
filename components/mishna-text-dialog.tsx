'use client';

import type React from 'react';
import parse from 'html-react-parser';
import { useState, useEffect, useRef } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, BookOpen } from 'lucide-react';
import { fetchMishnaText, getSefariaUrl, type SefariaText } from '@/lib/sefaria-api';
import type { Seder } from '@/lib/mishna-data';
import _ from 'lodash';
import SafariaLogo from './safaria-logo';
import { useI18n } from '@/lib/i18n';
import { getSederHebrewName, getTractateHebrewName } from '@/lib/mishna-data';

interface MishnaTextDialogProps {
	seder: Seder;
	tractate: string;
	chapter: number;
	highlightIndex?: number; // 1-based mishna number within chapter to highlight
	children: React.ReactNode;
}

enum LanguageMode {
	HebrewOnly,
	EnglishOnly,
	Both,
}

export function MishnaTextDialog({
	seder,
	tractate,
	chapter,
	highlightIndex,
	children,
}: MishnaTextDialogProps) {
	const { t, locale } = useI18n();
	const isHebrew = locale === 'he';
	const [open, setOpen] = useState(false);
	const [text, setText] = useState<SefariaText | null>(null);
	const [loading, setLoading] = useState(false);
	const [languageMode, setLanguageMode] = useState<LanguageMode>(LanguageMode.HebrewOnly);
	const hasScrolledRef = useRef(false);
	const lastScrollKeyRef = useRef<string | null>(null);

	useEffect(() => {
		if (open && !text) {
			setLoading(true);
			fetchMishnaText(tractate, chapter)
				.then((data) => {
					setText(data);
					setLoading(false);
				})
				.catch(() => {
					setLoading(false);
				});
		}
	}, [open, text, tractate, chapter]);

	// Reset scroll flags whenever the dialog opens
	useEffect(() => {
		if (open) {
			hasScrolledRef.current = false;
			lastScrollKeyRef.current = null;
		}
	}, [open]);

	// Scroll active mishna to top when content is ready or language mode changes
	useEffect(() => {
		if (!open || !text || !highlightIndex) return;
		const key = `${languageMode}-${highlightIndex}`;
		if (lastScrollKeyRef.current === key) return;

		const id = `mishna-item-${highlightIndex}`;
		const handle = window.setTimeout(() => {
			const el = document.getElementById(id);
			if (el) {
				el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
				lastScrollKeyRef.current = key;
				hasScrolledRef.current = true;
			}
		}, 0);
		return () => window.clearTimeout(handle);
	}, [open, text, highlightIndex, languageMode]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent
				className={`max-h-[85vh] overflow-x-auto max-w-none ${
					languageMode === LanguageMode.Both ? 'sm:max-w-6xl' : 'sm:max-w-3xl'
				}`}
			>
				<DialogHeader>
					<div className="flex items-start justify-between mr-4">
						<div>
							<DialogTitle className="text-2xl">
								{isHebrew ? getTractateHebrewName(seder, tractate) : tractate} {chapter}
							</DialogTitle>
							<DialogDescription className="mt-1">
								<Badge variant="secondary" className="text-xs">
									{isHebrew ? getSederHebrewName(seder) : seder}
								</Badge>
							</DialogDescription>
						</div>
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setLanguageMode((prev) => {
										switch (prev) {
											case LanguageMode.HebrewOnly:
												return LanguageMode.EnglishOnly;
											case LanguageMode.EnglishOnly:
												return LanguageMode.Both;
											case LanguageMode.Both:
												return LanguageMode.HebrewOnly;
										}
									});
								}}
							>
								<BookOpen className="h-4 w-4 me-2" />
								{languageMode === LanguageMode.HebrewOnly
									? t('dialog.lang.hebrewOnly')
									: languageMode === LanguageMode.EnglishOnly
									? t('dialog.lang.englishOnly')
									: t('dialog.lang.both')}
							</Button>
							<Button variant="outline" size="sm" asChild>
								<a
									href={getSefariaUrl(tractate, chapter)}
									target="_blank"
									rel="noopener noreferrer"
								>
									<SafariaLogo className="h-4 fill-current !w-auto" />
									<ExternalLink className="h-4 w-4 me-2" />
								</a>
							</Button>
						</div>
					</div>
				</DialogHeader>

				<ScrollArea className="h-[70vh] pr-4">
					<div className="h-4" />
					<div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent z-1" />

					{loading && (
						<div className="space-y-4">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="space-y-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-5/6" />
								</div>
							))}
						</div>
					)}

					{!loading && !text && (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
							<p className="text-muted-foreground">{t('dialog.loadError.title')}</p>
							<p className="text-sm text-muted-foreground mt-2">{t('dialog.loadError.subtitle')}</p>
						</div>
					)}

					{!loading && text && (
						<div className="space-y-6">
							<MishnaText languageMode={languageMode} text={text} highlightIndex={highlightIndex} />
						</div>
					)}
					<div className="h-4" />
					<div className="absolute inset-x-0 bottom-[-1px] h-12 bg-gradient-to-t from-background to-transparent z-1" />
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}

function MishnaText({
	languageMode,
	text,
	highlightIndex,
}: {
	languageMode: LanguageMode;
	text: SefariaText;
	highlightIndex?: number;
}) {
	const scrollMarginClass = languageMode === LanguageMode.Both ? 'scroll-mt-28' : 'scroll-mt-16';
	switch (languageMode) {
		case LanguageMode.EnglishOnly:
			return (
				<div className="space-y-4">
					{text.text.map((mishna, index) => {
						const isActive = highlightIndex === index + 1;
						const id = `mishna-item-${index + 1}`;
						const classes = `${isActive ? 'bg-accent/15 rounded-md ' : ''}${scrollMarginClass}`;
						return (
							<TextContainer key={index} className={classes} id={id}>
								<div className="flex gap-3 p-4 border-b last:border-0">
									<Badge variant={isActive ? 'default' : 'outline'} className="shrink-0 h-6">
										{index + 1}
									</Badge>
									<p className="text-base leading-relaxed font-garamond text-xl">{parse(mishna)}</p>
								</div>
							</TextContainer>
						);
					})}
				</div>
			);
		case LanguageMode.HebrewOnly:
			return (
				<div className="space-y-4" dir="rtl">
					{text.he.map((mishna, index) => {
						const isActive = highlightIndex === index + 1;
						const id = `mishna-item-${index + 1}`;
						const classes = `${isActive ? 'bg-accent/15 rounded-md ' : ''}${scrollMarginClass}`;
						return (
							<TextContainer key={index} className={classes} id={id}>
								<div className="flex gap-3">
									<Badge variant={isActive ? 'default' : 'outline'} className="shrink-0 h-6">
										{index + 1}
									</Badge>
									<p className="text-base leading-relaxed font-shofar text-xl" lang="he">
										{mishna}
									</p>
								</div>
							</TextContainer>
						);
					})}
				</div>
			);

		case LanguageMode.Both:
			return (
				<div className="space-y-4">
					{_.range(text.he.length).map((index) => {
						const isActive = highlightIndex === index + 1;
						const id = `mishna-item-${index + 1}`;
						const base = 'md:flex md:gap-6 text-justify border-b last:border-0 pb-8';
						const classes = `${base} ${
							isActive ? 'bg-accent/15 rounded-md' : ''
						} ${scrollMarginClass}`;
						return (
							<TextContainer key={index} className={classes} id={id}>
								{/* English */}
								<div className="flex-1 relative">
									<div key={index} className="sticky top-4">
										<div className="flex gap-3">
											<p className="text-base leading-relaxed font-garamond text-xl">
												{parse(text.text[index])}
											</p>
										</div>
									</div>
								</div>

								<Badge
									variant={isActive ? 'default' : 'outline'}
									className="shrink-0 h-6 sticky top-4"
								>
									{index + 1}
								</Badge>
								{/* Hebrew */}
								<div className="flex-1 relative" dir="rtl">
									<div key={index} className="sticky top-4">
										<div className="flex gap-3">
											<p className="text-base leading-relaxed font-shofar text-xl" lang="he">
												{text.he[index]}
											</p>
										</div>
									</div>
								</div>
							</TextContainer>
						);
					})}
				</div>
			);
	}
}

function TextContainer({
	className,
	children,
	id,
}: {
	className?: string;
	children: React.ReactNode;
	id?: string;
}) {
	return (
		<div
			id={id}
			className={`
        text-xl
  p-4
  border
  last:border-0
  group
  border-t-transparent border-l-transparent border-r-transparent
  hover:border-t-inherit hover:border-l-inherit hover-border-r-inherit
  transition-colors
  duration-200
  rounded-md
  ${className}
`}
		>
			{children}
		</div>
	);
}
