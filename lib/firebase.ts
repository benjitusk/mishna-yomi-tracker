import { getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyAhx1WK3Dx8WLf_m6Z0Ow7-vywX4OATkVo',
	authDomain: 'mishna-yomi-tracker.firebaseapp.com',
	projectId: 'mishna-yomi-tracker',
	storageBucket: 'mishna-yomi-tracker.firebasestorage.app',
	messagingSenderId: '396745728561',
	appId: '1:396745728561:web:8b4dc786d673cbf1c8ab10',
};

const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
