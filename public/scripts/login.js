// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBHTXl0ZWaBohywZCEam2rgSLnyUqw0Gnc",
    authDomain: "j-k-m-s.firebaseapp.com",
    projectId: "j-k-m-s",
    storageBucket: "j-k-m-s.firebasestorage.app",
    messagingSenderId: "471173542503",
    appId: "1:471173542503:web:3001f5ab65ba7c87965ac2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log("This is working.")

export const db = getFirestore();
export const auth = getAuth()

onAuthStateChanged(auth, async (user) => {
    const msg = document.querySelector("#signup-message, #login-message");
    if (user) {
        // User logged in already or has just logged in.
        try {
            const userRef = doc(db, "users", user.uid)


            const docSnap = await getDoc(userRef)
            if (docSnap.exists()) {

                await setDoc(userRef, {
                    lastLogin: new Date(),
                    email: user.email,
                    uid: user.uid,
                }, {merge:true})

                const data = docSnap.data()
                
                console.log(docSnap.data())
                if (msg) {msg.innerHTML = `You're logged in as <b>${data.username?? "John Doe"}</b>`}

            } else {/*your data wasn't able to load properly*/}

        } catch(err) {
            console.error(err)
        }

        console.log(`Logged in as ${user.uid}`);
    } else {
        if (msg) {msg.innerText = "You are not logged in"}
    }
});
