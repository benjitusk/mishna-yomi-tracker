'use client';

import type React from 'react';
import parse from 'html-react-parser';
import { useState, useEffect } from 'react';
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

interface MishnaTextDialogProps {
	seder: Seder;
	tractate: string;
	chapter: number;
	children: React.ReactNode;
}

enum LanguageMode {
	HebrewOnly,
	EnglishOnly,
	Both,
}

export function MishnaTextDialog({ seder, tractate, chapter, children }: MishnaTextDialogProps) {
	const [open, setOpen] = useState(false);
	const [text, setText] = useState<SefariaText | null>(null);
	const [loading, setLoading] = useState(false);
	const [languageMode, setLanguageMode] = useState<LanguageMode>(LanguageMode.HebrewOnly);

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

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent
				className={`max-h-[85vh] overflow-x-auto max-w-none ${
					languageMode === LanguageMode.Both ? 'sm:max-w-6xl' : 'sm:max-w-3xl'
				}`}
			>
				<DialogHeader>
					<div className="flex items-start justify-between gap-4 mr-4">
						<div>
							<DialogTitle className="text-2xl">
								{tractate} {chapter}
							</DialogTitle>
							<DialogDescription className="mt-1">
								<Badge variant="secondary" className="text-xs">
									{seder}
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
								<BookOpen className="h-4 w-4 mr-2" />
								{languageMode === LanguageMode.HebrewOnly
									? 'Hebrew Only'
									: languageMode === LanguageMode.EnglishOnly
									? 'English Only'
									: 'Both'}
							</Button>
							<Button variant="outline" size="sm" asChild>
								<a
									href={getSefariaUrl(tractate, chapter)}
									target="_blank"
									rel="noopener noreferrer"
								>
									<SafariaLogo className="h-4 fill-current !w-auto" />
									<ExternalLink className="h-4 w-4 mr-2" />
								</a>
							</Button>
						</div>
					</div>
				</DialogHeader>

				<ScrollArea className="h-[75vh] pr-4">
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
							<p className="text-muted-foreground">Failed to load Mishna text</p>
							<p className="text-sm text-muted-foreground mt-2">
								Please try again or visit Sefaria directly
							</p>
						</div>
					)}

					{!loading && text && (
						<div className="space-y-6">
							<MishnaText languageMode={languageMode} text={text} />
						</div>
					)}
					<div className="h-4" />
					<div className="absolute inset-x-0 bottom-[-1px] h-12 bg-gradient-to-t from-background to-transparent z-1" />
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}

function MishnaText({ languageMode, text }: { languageMode: LanguageMode; text: SefariaText }) {
	switch (languageMode) {
		case LanguageMode.EnglishOnly:
			return (
				<div className="space-y-4">
					{text.text.map((mishna, index) => (
						<TextContainer key={index}>
							<div className="flex gap-3 p-4 border-b last:border-0">
								<Badge variant="outline" className="shrink-0 h-6">
									{index + 1}
								</Badge>
								<p className="text-base leading-relaxed">{parse(mishna)}</p>
							</div>
						</TextContainer>
					))}
				</div>
			);
		case LanguageMode.HebrewOnly:
			return (
				<div className="space-y-4" dir="rtl">
					{text.he.map((mishna, index) => (
						<TextContainer key={index}>
							<div className="flex gap-3">
								<Badge variant="outline" className="shrink-0 h-6">
									{index + 1}
								</Badge>
								<p className="text-base leading-relaxed font-shofar text-xl" lang="he">
									{mishna}
								</p>
							</div>
						</TextContainer>
					))}
				</div>
			);

		case LanguageMode.Both:
			return (
				<div className="space-y-4">
					{_.range(text.he.length).map((index) => (
						<TextContainer
							className="md:flex md:gap-6 text-justify border-b last:border-0 pb-8"
							key={index}
						>
							{/* English */}
							<div className="flex-1 relative">
								<div key={index} className="sticky top-4">
									<div className="flex gap-3">
										<p className="text-base leading-relaxed">{parse(text.text[index])}</p>
									</div>
								</div>
							</div>

							<Badge variant="outline" className="shrink-0 h-6 sticky top-4">
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
					))}
				</div>
			);
	}
}

function TextContainer({ className, children }: { className?: string; children: React.ReactNode }) {
	return (
		<div
			className={`
  p-4
  border
  last:border-0
  group
  border-t-transparent border-l-transparent border-r-transparent
  hover:border-t-gray-200 hover:border-l-gray-200 hover:border-r-gray-200
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
