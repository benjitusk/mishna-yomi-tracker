// components/MishnaYomiScheduleTable.tsx
'use client';

import { formatLocation } from '@/lib/mishna-data';
import { DailyAssignment, Schedule } from '@/lib/types';

// MishnaYomiScheduleTable Component
export default function MishnaYomiScheduleTable({ schedule }: { schedule: Schedule }) {
	return (
		<div
			className="flex-grow overflow-y-auto border border-gray-200 rounded-lg mt-4"
			style={{ maxHeight: 'calc(90vh - 250px)' }}
		>
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50 sticky top-0">
					<tr>
						<th
							scope="col"
							className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Date
						</th>
						<th
							scope="col"
							className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Start Mishna
						</th>
						<th
							scope="col"
							className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							End Mishna
						</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{schedule.assignments.map((item, index) => (
						<tr key={index} className="hover:bg-gray-50">
							<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
								{new Date(item.date).toLocaleDateString(undefined, {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{`${
								item.start.seder
							}, ${formatLocation(item.start)}`}</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{`${
								item.end.seder
							}, ${formatLocation(item.end)}`}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
