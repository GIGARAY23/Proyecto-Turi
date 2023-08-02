import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
const firebaseConfig = {
  apiKey: "AIzaSyDrZSZ_x-V-VoIFXaHli_DI0rSxRKRxMQ4",
  authDomain: "proyecto-turi.firebaseapp.com",
  projectId: "proyecto-turi",
  storageBucket: "proyecto-turi.appspot.com",
  messagingSenderId: "802196561720",
  appId: "1:802196561720:web:baa42c347ae4338cf02bcd"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export async function uploadFile(file) {
  const storageRef = ref(storage, v4());
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}
