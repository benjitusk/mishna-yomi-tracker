import { metadata } from '@/app/layout';

export const MISHNA_STRUCTURE = {
	Zeraim: {
		Berakhot: 9,
		Peah: 8,
		Demai: 7,
		Kilayim: 9,
		Sheviit: 10,
		Terumot: 11,
		Maasrot: 5,
		'Maaser Sheni': 5,
		Challah: 4,
		Orlah: 3,
		Bikkurim: 4,
	},
	Moed: {
		Shabbat: 24,
		Eruvin: 10,
		Pesachim: 10,
		Shekalim: 8,
		Yoma: 8,
		Sukkah: 5,
		Beitzah: 5,
		'Rosh Hashanah': 4,
		Taanit: 4,
		Megillah: 4,
		'Moed Katan': 3,
		Chagigah: 3,
	},
	Nashim: {
		Yevamot: 16,
		Ketubot: 13,
		Nedarim: 11,
		Nazir: 9,
		Sotah: 9,
		Gittin: 9,
		Kiddushin: 4,
	},
	Nezikin: {
		'Bava Kamma': 10,
		'Bava Metzia': 10,
		'Bava Batra': 10,
		Sanhedrin: 11,
		Makkot: 3,
		Shevuot: 8,
		Eduyot: 8,
		'Avodah Zarah': 5,
		Avot: 6,
		Horayot: 3,
	},
	Kodashim: {
		Zevachim: 14,
		Menachot: 13,
		Chullin: 12,
		Bekhorot: 9,
		Arakhin: 9,
		Temurah: 7,
		Keritot: 6,
		Meilah: 6,
		Tamid: 7,
		Middot: 5,
		Kinnim: 3,
	},
	Tahorot: {
		Kelim: 30,
		Oholot: 18,
		Negaim: 14,
		Parah: 12,
		Tahorot: 10,
		Mikvaot: 10,
		Niddah: 10,
		Makhshirin: 6,
		Zavim: 5,
		'Tevul Yom': 4,
		Yadayim: 4,
		Oktzin: 3,
	},
} as const;

export type Seder = keyof typeof MISHNA_STRUCTURE;
export type Tractate = {
	[K in Seder]: keyof (typeof MISHNA_STRUCTURE)[K];
}[Seder];

// Calculate total chapters in Mishna
export const TOTAL_CHAPTERS = Object.values(MISHNA_STRUCTURE).reduce(
	(total, seder) => total + Object.values(seder).reduce((sum, chapters) => sum + chapters, 0),
	0
);

// Get all tractates in order
export function getAllTractates(): Array<{ seder: Seder; tractate: string; chapters: number }> {
	const tractates: Array<{ seder: Seder; tractate: string; chapters: number }> = [];

	for (const [seder, tractateMap] of Object.entries(MISHNA_STRUCTURE)) {
		for (const [tractate, chapters] of Object.entries(tractateMap)) {
			tractates.push({
				seder: seder as Seder,
				tractate,
				chapters,
			});
		}
	}

	return tractates;
}

// Get chapter index (0-based) in the entire Mishna
export function getChapterIndex(tractate: string, chapter: number): number {
	let index = 0;

	for (const [_seder, tractateMap] of Object.entries(MISHNA_STRUCTURE)) {
		for (const [currentTractate, chapters] of Object.entries(tractateMap)) {
			if (currentTractate === tractate) {
				return index + chapter - 1;
			}
			index += chapters;
		}
	}

	return -1;
}

// Get tractate and chapter from global index
export function getChapterFromIndex(
	index: number
): { seder: Seder; tractate: string; chapter: number } | null {
	let currentIndex = 0;

	for (const [seder, tractateMap] of Object.entries(MISHNA_STRUCTURE)) {
		for (const [tractate, chapters] of Object.entries(tractateMap)) {
			if (index < currentIndex + chapters) {
				return {
					seder: seder as Seder,
					tractate,
					chapter: index - currentIndex + 1,
				};
			}
			currentIndex += chapters;
		}
	}

	return null;
}
