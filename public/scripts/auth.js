import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { db } from "./login.js"


// Initialize Firebase

function logIn(formData) {

    let email = formData.get("email")
    let password = formData.get("password")

    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
    
    .then((userCredential) => {

        const user = userCredential.user;
        
    })

    .catch((error) => {

        const errorCode = error.code;
        const errorMessage = error.message;

        const msg = document.getElementById("login-message")
        if (msg) {msg.innerText = "There was an error while logging into your account"}

    })
}

function signUp(formData) {
    let email = formData.get("email")
    let password = formData.get("password")
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        // Signed up 
        const user = userCredential.user;
        const msg = document.getElementById("signup-message")
        if (msg) {msg.innerText = `You've successfully created a new account!`}
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            username: "John Doe",
            pfp: "./media/sacabambaspis.png",
            joinDate: new Date()
        }, {merge:true})
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const msg = document.getElementById("signup-message")
        if (msg) {msg.innerText = `Oops! There was an error while trying to create your account!`}
        // ..
    });
}

const signup = document.getElementById("signup")
if (signup) {
    signup.addEventListener("submit", (event) => {
        event.preventDefault()
        signUp(new FormData(event.target))
    })
}

const login = document.getElementById("login")
if (login) {
    login.addEventListener("submit", (event) => {
        event.preventDefault()
        logIn(new FormData(event.target))
    })
}

var QOVisPlaying = false
function unmuteQOV() {
    if (QOVisPlaying) {return;}
    document.getElementById("qov").src = "https://www.youtube.com/embed/EpbhsrYuQJ4?autoplay=1&loop=1&playlist=EpbhsrYuQJ4"
    if (document.getElementById("qov").src == "https://www.youtube.com/embed/EpbhsrYuQJ4?autoplay=1&loop=1&playlist=EpbhsrYuQJ4") {QOVisPlaying=true; console.log('correct')}
}

window.addEventListener("click", unmuteQOV)