import {
	formatLocation,
	getSederHebrewName,
	getTractateHebrewName,
	type Seder,
} from '@/lib/mishna-data';
import { Schedule } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { forwardRef } from 'react';
import { useI18n } from '@/lib/i18n';

function formatDate(dateString: string) {
	const date = new Date(dateString);
	return date.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

export const PrintableLayout = forwardRef<HTMLDivElement, { schedule: Schedule }>(
	({ schedule }, ref) => {
		if (!schedule || schedule.assignments.length === 0) return null;

		const { t, locale } = useI18n();
		const isHebrew = locale === 'he';

		const formattedStartDate = new Date(schedule.startDate).toLocaleDateString(
			isHebrew ? 'he-IL' : undefined,
			{ year: 'numeric', month: 'long', day: 'numeric' }
		);
		const formattedEndDate = new Date(schedule.endDate).toLocaleDateString(
			isHebrew ? 'he-IL' : undefined,
			{ year: 'numeric', month: 'long', day: 'numeric' }
		);

		const formatLocationLocalized = (loc: {
			seder: string;
			tractate: string;
			chapter: number;
			index: number;
		}) => {
			if (!isHebrew) return formatLocation(loc);
			const heSeder = getSederHebrewName(loc.seder as Seder);
			const heTractate = getTractateHebrewName(loc.seder as Seder, loc.tractate);
			return `${heTractate} ${loc.chapter}:${loc.index}`;
		};
		return (
			<div ref={ref} className={`p-15 ${isHebrew ? 'font-shofar' : 'font-garamond'}`}>
				<div className="print-bs-d">בס״ד</div>
				{/* Cover Page */}
				<div
					className="flex flex-col items-center justify-center text-center"
					style={{ height: 'calc(100vh - 5rem)' }}
				>
					<div className="w-full max-w-2xl mx-auto p-8 border-4 border-gray-800 rounded-lg bg-gray-50">
						<h1 className="text-5xl font-bold tracking-wider text-gray-900 font-shofar">
							משנה יומית
						</h1>
						{schedule.name && (
							<h2 className="text-3xl font-bold text-gray-700 mt-13">{schedule.name}</h2>
						)}
						<div className="mt-13 text-lg space-y-2 text-gray-600">
							<p>
								<strong>{t('printable.startDate')}:</strong> {formattedStartDate}
							</p>
							<p>
								<strong>{t('printable.endDate')}:</strong> {formattedEndDate}
							</p>
							<p className="mt-6 font-shofar">
								<strong>״בְּכָל־יוֹם יִהְיוּ בְעֵינֶיךָ כַּחֲדָשִׁים״</strong>
							</p>
							<p className="italic font-shofar text-sm">שולחן ערוך, אורח חיים סימן ס״א סעיף ב׳</p>
						</div>
					</div>
				</div>

				{/* Schedule Pages */}
				<div style={{ pageBreakBefore: 'always' }}>
					<table className="min-w-full text-sm">
						<thead className="border-b-2 border-gray-800">
							<tr>
								<th />
								<th className="py-3 text-left font-bold text-gray-800 [font-variant:small-caps] tracking-wider">
									{t('printable.table.date')}
								</th>
								<th className="py-3 text-left font-bold text-gray-800 [font-variant:small-caps] tracking-wider">
									{t('printable.table.seder')}
								</th>
								<th className="py-3 text-left font-bold text-gray-800 [font-variant:small-caps] tracking-wider">
									{t('printable.table.mishnayot')}
								</th>
							</tr>
						</thead>
						<tbody>
							{schedule.assignments.map((item, index) => (
								<tr
									key={index}
									className="border-b border-gray-200"
									style={{ pageBreakInside: 'avoid' }}
								>
									<td className="py-3 pr-4 whitespace-nowrap text-gray-700 font-medium">
										<Checkbox />
									</td>
									<td className="py-3 pr-4 whitespace-nowrap text-gray-700 font-medium">
										{new Date(item.date).toLocaleDateString(isHebrew ? 'he-IL' : undefined, {
											weekday: 'short',
											year: 'numeric',
											month: 'short',
											day: 'numeric',
										})}
									</td>
									<td className="py-3 pr-4 whitespace-nowrap text-gray-600">
										{isHebrew ? getSederHebrewName(item.start.seder as Seder) : item.start.seder}
									</td>
									<td className="py-3 pr-4 whitespace-nowrap text-gray-600">
										{formatLocationLocalized(item.start)} - {formatLocationLocalized(item.end)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
);
