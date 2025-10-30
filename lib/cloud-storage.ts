import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import type { MishnaProgress } from '@/lib/storage';

const COLLECTION = 'users';
const DOC_ID = 'mishnaProgress';

export async function fetchCloudProgress(uid: string): Promise<MishnaProgress | null> {
	const ref = doc(db, COLLECTION, uid, 'data', DOC_ID);
	const snap = await getDoc(ref);
	if (!snap.exists()) return null;
	const data = snap.data() as any;
	return {
		...data,
		completedChapters: new Set<number>(data.completedChapters ?? []),
	};
}

export async function saveCloudProgress(uid: string, progress: MishnaProgress): Promise<void> {
	const ref = doc(db, COLLECTION, uid, 'data', DOC_ID);
	const toStore = {
		...progress,
		completedChapters: Array.from(progress.completedChapters),
	};
	await setDoc(ref, toStore, { merge: true });
}

export async function resetCloudProgress(uid: string): Promise<void> {
	const ref = doc(db, COLLECTION, uid, 'data', DOC_ID);
	await deleteDoc(ref);
}
