import { auth, db } from "./login.js"
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const pfpAddress = document.querySelector("#pfp-address")
const pfpPreview = document.querySelector("#pfp-preview")
const username = document.querySelector("#username")
const msg = document.querySelector("#editor-message");

pfpAddress.addEventListener("change", (event) => {
    var img = new Image()

    img.onload = function() {
        pfpPreview.src = pfpAddress.value
        msg.innerText=""
    }

    img.onerror = function() {
        pfpAddress.value==""
        pfpPreview.src = "./media/sacabambaspis.png"
        editorLog("That image could not be loaded.")
    }
    img.src = event.target.value
})

function editorLog(text) {
    msg.innerText = text
    setTimeout(function(){if (msg.innerText===text) {msg.innerText=""}}, 2500)
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User logged in already or has just logged in.
        try {
            const userRef = doc(db, "users", user.uid)

            await setDoc(userRef, {lastLogin: new Date()}, {merge:true}) // force handshake with the server

            const docSnap = await getDoc(userRef)
            console.log(docSnap.data())
            if (docSnap.exists()) {

                const data = docSnap.data()
                username.value = data.username?? "John Doe"
                pfpAddress.value = data.pfp?? ""
                pfpPreview.src = data.pfp?? "./media/sacabambaspis.png"

            } else {/*your data wasn't able to load properly*/}

        } catch(err) {
            console.error(err)
        }
    } else {
        editorLog("You are not logged in!")
    }
});

async function setProfile(formData) {
    if (auth.currentUser) {
        // User logged in already or has just logged in.
        try {
            const userRef = doc(db, "users", auth.currentUser.uid)

            await setDoc(userRef, {
                username: formData.get("username"),
                pfp: formData.get("pfp")
            }, {merge:true})
            editorLog("Your profile information has been saved successfully!")

        } catch(err) {
            console.error(err)
            editorLog("There was an error whilst trying to save your profile information")
        }

    } else {
        editorLog("You are not logged in!")
    }
}

const setButton = document.querySelector("#setprofile")
if (setButton) {
    setButton.addEventListener("submit", async (event) => {
        event.preventDefault()
        setProfile(new FormData(event.target))
    })
}