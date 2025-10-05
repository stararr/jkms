import { auth, db } from "./login.js"
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { doc, setDoc, getDoc, addDoc, onSnapshot, collection, query, orderBy, where, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { getDate } from "./functions.js"

const postContainer = document.querySelector("#posts")

async function addPost(postRef) {
    const postData = postRef.data()
    const userRef = doc(db, "users", postData.author)
    const postsQuery = await(getDocs(query(collection(db, "posts"), where("author","==",postData.author))))
    const totalPosts = postsQuery.size
    

    const docSnap = await getDoc(userRef)
    if (docSnap.exists()) {
        const data = docSnap.data()
        
        var post = document.createElement("div")
        

        post.className = "post"

        post.innerHTML = `
                <div class="post-header">
                    <div class="post-title">${postData.title}</div>
                    <div class="post-options">
                        <input type="button" value="x" onclick="removePostHandler('${postRef.id}')">
                    </div>
                </div>
                <div class="post-body">                    
                    <div class="post-content">
                        ${postData.content}
                    </div>
                    <div class="post-sidebar">
                        <img class="author-img" src=${data.pfp?? "./media/sacabambaspis.png"}>
                        <a class="author-name" href="profile/${postData.author}">${data.username?? "John Doe"}</a>
                        <ul class="author-info">
                            <li class="author-join-date"><b>Joined on:</b> ${getDate(data.joinDate)}</li>
                            <li class="author-last-login"><b>Last login:</b> ${getDate(data.lastLogin)}</li>
                            <li class="author-post-count"><b>Post count:</b> ${totalPosts}</li>
                        </ul>
                    </div>
                </div>
                `
        
        return post
    } else {console.log("Your data wasn't able to load properly")}
}

async function submitPost(formData) {
    console.log("hello!")
    if (auth.currentUser) {
        // User logged in already or has just logged in.
        try {

            const userRef = doc(db, "users", auth.currentUser.uid)
            await setDoc(userRef, {lastLogin: new Date()}, {merge:true}) // force handshake with the server
            var title = formData.get("title")
            title = !title.trim() ? "New post" : title

            var content = formData.get("content")
            // add post, locally *not in use currently

            //addPost(auth.currentUser.uid)

            // add post, globally
            
            const postRef = collection(db, "posts")

            await addDoc(postRef, {
                title: title,
                content: content,
                author: auth.currentUser.uid,
                dateCreated: new Date()
            })


        } catch(err) {
            console.error(err)
            console.log("There was an error whilst trying to post")
        }

    } else {
        console.log("You are not logged in!")
    }
}

const postForm = document.querySelector("#create-a-new-post")
if (postForm) {
    postForm.addEventListener("submit", async (event) => {
        event.preventDefault()
        submitPost(new FormData(event.target))
    })
}

var loading = true

/*onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User logged in already or has just logged in.
        try {
            const q = query(collection(db, "posts"), orderBy("dateCreated", "desc"))
            const querySnapshot = await getDocs(q)
            postContainer.innerHTML = ""
            querySnapshot.forEach((post) => {
                addPost(post.data())
            });

        } catch(err) {
            console.error(err)
        }
    } else {
        console.log("You are not logged in!")
    }
});*/

const postListener = onSnapshot(query(collection(db, "posts"), orderBy("dateCreated", "desc")), async (snapshot)=>{
    if (loading) {loading=false;}
    snapshot.docChanges().forEach
    postContainer.innerHTML = ""
    const posts = await Promise.all(snapshot.docs.map(post => addPost(post)))
    posts.forEach(post => {
        if (post) {postContainer.appendChild(post)}
    })
})

async function removePost(id) {
    if (auth.currentUser) {
        // User logged in already or has just logged in.
        try {
            const post = doc(db, "posts", id)

            const docSnap = await getDoc(post)
            if (docSnap.exists()) {

                const data = docSnap.data()
                if (data.author==auth.currentUser.uid) {
                    await deleteDoc(docSnap.ref)
                }
                else {
                    console.log("There was an error whilst trying to remove the post: That post isn't yours!")
                }
            } else {
                console.log("There was an error whilst trying to remove the post: That post doesn't exist!")
            }
        }
        catch(err) {
            console.error(err)
        }
    } else {
        console.log("You are not logged in!")
    }
}

window.removePostHandler = async (id) => {
    await removePost(id)
}