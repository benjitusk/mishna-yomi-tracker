import { data } from '@/data/mishnah_full';
import _ from 'lodash';
import { MishnaLocation, MishnaResolved, MishnaStructure } from './types';
export const MISHNA_STRUCTURE: MishnaStructure = data as unknown as MishnaStructure;

export type Seder = keyof typeof MISHNA_STRUCTURE;
export type Tractate = {
	[K in Seder]: keyof (typeof MISHNA_STRUCTURE)[K]['tractates'];
}[Seder];

// Calculate total chapters in Mishna
export const TOTAL_MISHNAYOT = _.values(MISHNA_STRUCTURE).reduce(
	(total, seder) =>
		total +
		_.values(seder.tractates).reduce(
			(sum, tractate) =>
				sum + _.reduce(tractate.chapters, (acc, chapter) => acc + chapter.numberOfMishnayot, 0),
			0
		),
	0
);

// Get all tractates in order
export function getAllTractates(): Array<{
	seder: Seder;
	tractate: Tractate;
	mishnayot: number;
	chapters: number;
}> {
	const tractates: Array<{
		seder: Seder;
		tractate: Tractate;
		mishnayot: number;
		chapters: number;
	}> = [];

	// Iterate over each Seder (Order)
	for (const [sederName, sederValue] of _.entries(MISHNA_STRUCTURE) as [
		Seder,
		(typeof MISHNA_STRUCTURE)[Seder]
	][]) {
		// Within each Seder, iterate over each Tractate
		for (const [tractateName, tractateValue] of _.entries(sederValue.tractates)) {
			// Number of chapters in this tractate
			const totalChapters = _.size(tractateValue.chapters);
			// Sum total mishnayot across all chapters
			const totalMishnayot = _.sumBy(
				_.values(tractateValue.chapters),
				(chapter) => chapter.numberOfMishnayot
			);

			tractates.push({
				seder: sederName,
				tractate: tractateName as Tractate,
				chapters: totalChapters,
				mishnayot: totalMishnayot,
			});
		}
	}

	// Sort first by seder order, then tractate order
	return _.sortBy(tractates, [
		(t) => MISHNA_STRUCTURE[t.seder].metadata.order,
		(t) =>
			(MISHNA_STRUCTURE[t.seder].tractates as Record<string, { metadata: { order: number } }>)[
				t.tractate as string
			]?.metadata.order ?? 0,
	]);
}

// Get the global index of a mishna given its tractate and local mishna number
export function getMishnaIndex(tractate: Tractate, mishnaLocalIndex: number): number {
	let index = 0;

	// Iterate over sedarim in canonical order
	const sortedSedarim = _.entries(MISHNA_STRUCTURE).sort(
		([, a], [, b]) => a.metadata.order - b.metadata.order
	) as [Seder, (typeof MISHNA_STRUCTURE)[Seder]][];

	for (const [, sederValue] of sortedSedarim) {
		// Iterate over tractates within seder in canonical order
		const sortedTractates = _.entries(sederValue.tractates).sort(
			([, a], [, b]) => a.metadata.order - b.metadata.order
		);

		for (const [tractateName, tractateValue] of sortedTractates) {
			if (tractateName === tractate) {
				// We reached the target tractate — return total so far + local index
				return index + mishnaLocalIndex;
			}

			// Otherwise, add all mishnayot in this tractate
			for (const chapter of _.values(tractateValue.chapters)) {
				index += chapter.numberOfMishnayot;
			}
		}
	}

	throw new Error(`Tractate "${tractate}" not found in MISHNA_STRUCTURE`);
}

// Get tractate and chapter from global index
export function getMishnaFromIndex(globalIndex: number): MishnaResolved {
	let count = 0;

	// Sort sedarim by canonical order
	const sortedSedarim = _.entries(MISHNA_STRUCTURE).sort(
		([, a], [, b]) => a.metadata.order - b.metadata.order
	) as [Seder, (typeof MISHNA_STRUCTURE)[Seder]][];

	for (const [sederName, sederValue] of sortedSedarim) {
		// Sort tractates by canonical order
		const sortedTractates = _.entries(sederValue.tractates).sort(
			([, a], [, b]) => a.metadata.order - b.metadata.order
		);

		for (const [tractateName, tractateValue] of sortedTractates) {
			for (const [chapterKey, chapterValue] of _.entries(tractateValue.chapters)) {
				const chapterNumber = Number(chapterKey);
				const { numberOfMishnayot } = chapterValue;
				if (globalIndex < count + numberOfMishnayot) {
					// strictly less than
					// The mishna is within this chapter
					const mishnaNumber = globalIndex - count + 1; // +1 to make mishna # 1-based within the chapter

					return {
						seder: sederName,
						tractate: tractateName as Tractate,
						chapter: chapterNumber,
						index: mishnaNumber,
						globalIndex: globalIndex,
						sederHebrewName: MISHNA_STRUCTURE[sederName].metadata.hebrewName,
						tractateHebrewName:
							MISHNA_STRUCTURE[sederName].tractates[tractateName as string].metadata.hebrewName,
						chapterHebrewName: chapterValue.hebrewName,
					};
				}

				count += numberOfMishnayot;
			}
		}
	}

	throw new Error(`Global mishna index ${globalIndex} exceeds total mishnayot.`);
}
export function formatLocation(loc: MishnaLocation): string {
	return `${loc.seder}, ${loc.tractate} ${loc.chapter}:${loc.index}`;
}

export function getSederHebrewName(seder: Seder): string {
	return MISHNA_STRUCTURE[seder].metadata.hebrewName;
}

export function getTractateHebrewName(seder: Seder, tractate: Tractate): string {
	return MISHNA_STRUCTURE[seder].tractates[tractate as string].metadata.hebrewName;
}
