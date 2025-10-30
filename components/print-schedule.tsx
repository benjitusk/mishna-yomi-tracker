'use client';

import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Printer } from 'lucide-react';
import MishnaYomiForm from './mishna-yomi-form';
import { Schedule } from '@/lib/types';
import { PrintableLayout } from './printable-layout';
import { useI18n } from '@/lib/i18n';

export function PrintSchedule() {
	const { t } = useI18n();
	const [isOpen, setIsOpen] = useState(false);
	const [schedule, setSchedule] = useState<Schedule | null>(null);
	const [isPrinting, setIsPrinting] = useState(false);
	const printableComponentRef = useRef<HTMLDivElement>(null);
	// react-to-print handler
	const executePrint = useReactToPrint({
		contentRef: printableComponentRef,
		onAfterPrint: () => setIsPrinting(false),
			documentTitle: t('print.title'),
		pageStyle: `
			@page {
				size: auto;
				margin: 15mm;
			}
			body {
				-webkit-print-color-adjust: exact;
				print-color-adjust: exact;
                --font-garamond: 'garamond';
                --font-shofar: 'shofar';
			}


		`,
	});

	useEffect(() => {
		if (schedule && printableComponentRef.current) {
			executePrint();
			setSchedule(null);
		}
	}, [schedule]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="gap-2 bg-transparent">
					<Printer className="h-4 w-4" />
					<span className="hidden sm:inline">{t('print.open')}</span>
				</Button>
			</DialogTrigger>

			<DialogContent className="xl:max-w-7xl w-7xl max-h-[90vh] overflow-hidden flex flex-col overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{t('print.title')}</DialogTitle>
				</DialogHeader>

				<div className="p-8">
					<h1 className="text-2xl font-bold mb-4">{t('print.generator')}</h1>
					<MishnaYomiForm
						onScheduleGenerated={(schedule) => {
							setIsPrinting(true);
							setSchedule(schedule);
						}}
						isPrinting={isPrinting}
					/>

					{schedule && (
						<>
							{/* <MishnaYomiScheduleTable schedule={schedule} /> */}

							{/* Hidden printable layout */}
							<div className="hidden">
								<div ref={printableComponentRef}>
									<PrintableLayout schedule={schedule} />
								</div>
							</div>
						</>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
