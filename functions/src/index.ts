import { https } from 'firebase-functions/v2';
import { auth } from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { z } from 'zod';
import { createInitialUserDocument, type UserDocument } from '../../shared/user';

if (!admin.apps.length) {
	admin.initializeApp();
}

const db = admin.firestore();

// Firestore data converter for strong typing of the user document
const userConverter: FirebaseFirestore.FirestoreDataConverter<UserDocument> = {
  toFirestore(user: UserDocument): FirebaseFirestore.DocumentData {
    return user;
  },
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): UserDocument {
    const data = snapshot.data();
    return data as UserDocument;
  },
};

// Auth trigger: initialize user document structure
export const onUserCreate = auth.user().onCreate(async (user) => {
	const userRef = db.collection('users').withConverter(userConverter).doc(user.uid);
	const base = createInitialUserDocument({ email: user.email ?? null, locale: 'system' });
	// Write the typed base document
	await userRef.set(base, { merge: true });
	// Add server-side timestamp (field not part of the shared type)
	await db.collection('users').doc(user.uid).set(
		{ createdAt: admin.firestore.FieldValue.serverTimestamp() },
		{ merge: true }
	);

	// Initialize default mishna progress similar to client localStorage defaults
	const todayIso = new Date().toISOString().split('T')[0];
	const progressRef = userRef.collection('data').doc('mishnaProgress');
	await progressRef.set(
		{
			completedChapters: [], // store as array in Firestore
			lastStudyDate: null,
			currentStreak: 0,
			longestStreak: 0,
			startDate: todayIso,
			updatedAt: admin.firestore.FieldValue.serverTimestamp(),
		},
		{ merge: false }
	);
});

// Callable: upsert progress (server authoritative timestamp)
const progressSchema = z.object({
	completedChapters: z.array(z.number()),
	lastStudyDate: z.string().nullable(),
	currentStreak: z.number(),
	longestStreak: z.number(),
	startDate: z.string(),
});

export const syncProgress = https.onCall(async (request) => {
	if (!request.auth) {
		throw new https.HttpsError('unauthenticated', 'Authentication required');
	}

	const parse = progressSchema.safeParse(request.data);
	if (!parse.success) {
		throw new https.HttpsError('invalid-argument', 'Invalid progress payload');
	}

	const uid = request.auth.uid;
	const ref = db.collection('users').doc(uid).collection('data').doc('mishnaProgress');
	await ref.set(
		{
			...parse.data,
			updatedAt: admin.firestore.FieldValue.serverTimestamp(),
		},
		{ merge: true }
	);

	return { ok: true };
});
