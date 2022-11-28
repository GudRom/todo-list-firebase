import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App/App";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAb0a5osLtSvMephkJvKE8daIQrkncgNZc",
  authDomain: "todo-list-firebase-fcbb1.firebaseapp.com",
  projectId: "todo-list-firebase-fcbb1",
  storageBucket: "todo-list-firebase-fcbb1.appspot.com",
  messagingSenderId: "1041473605275",
  appId: "1:1041473605275:web:a1df1e4c139bb3f44e003e",
  measurementId: "G-ZKLJE6XX64",
};

export const Context = createContext(null);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Context.Provider value={{ app, db, storage }}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Context.Provider>
);
