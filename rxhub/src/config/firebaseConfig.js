
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAudNjhD_oxNnDlVNXDDbl7QTtc3DJtcSk",
  authDomain: "rxhub-c68a1.firebaseapp.com",
  projectId: "rxhub-c68a1",
  storageBucket: "rxhub-c68a1.appspot.com",
  messagingSenderId: "493467111684",
  appId: "1:493467111684:web:4477872afad92539564051",
  measurementId: "G-096N3WGG9W"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };