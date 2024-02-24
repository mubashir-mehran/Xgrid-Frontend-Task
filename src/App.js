import DetailForm from "./pages/DetailForm";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyArQvT9y-z_D7_Xc7azefrSzh3SGWXaXWw",
  authDomain: "test-tezeract.firebaseapp.com",
  projectId: "test-tezeract",
  storageBucket: "test-tezeract.appspot.com",
  messagingSenderId: "341103227495",
  appId: "1:341103227495:web:f475c8407ef36fbe9fdac2",
  measurementId: "G-MLEEDTW5WK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

function App() {
  return <DetailForm />;
}
export default App;
