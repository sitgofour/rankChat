console.log("new script attached...");

// html element selectors
const form = document.querySelector(".post-form");
const postsDiv = document.querySelector(".posts-wrapper");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formContent = new FormData(form);
    const newPost = {
        name: formContent.get("username"),
        post: formContent.get("post")
    }
    newPostToDB(newPost);    
});

const postsUrl = "http://localhost:3000/posts";
const updateUrl = "http://localhost:3000/vote";
const newPostToDB = async (newPost) => {
    try {
        await fetch(postsUrl, {
            method: "POST",
            body: JSON.stringify(newPost),
            headers: {
                "Content-Type": "application/json"
            }
        });
        queryAllPosts()
    }
    catch {
        console.log("error while posting");
    }
}

const queryAllPosts = async () => {
    const posts = await fetch(postsUrl);
    console.log(posts);
    const postsArr = await posts.json();
    console.log(postsArr);
    displayAllPosts(postsArr);
}

const displayAllPosts = (postsArr) => {
    //sort posts by votes, then iterate and display
    // const rankedPosts = sortByVotes(postsArr);
    // for(let post of rankedPosts)...

    postsDiv.innerHTML = "";

    for(let post of postsArr) {
        //create wrapper elements for post elements
        let newPost = document.createElement("div");
        let voteDiv = document.createElement("div");
        let postContent = document.createElement("div");

        //create html elements for username, post, and date
        let user = document.createElement("h4");
        user.textContent = post.user;

        let postText = document.createElement("p");
        postText.textContent = post.post;

        let postDate = document.createElement("h5");
        postDate.textContent = post.date;

        postContent.appendChild(user);
        postContent.appendChild(postText);
        postContent.appendChild(postDate);

        //create html elements for upvotes and downvotes
        let upVotes = document.createElement("p");
        upVotes.innerText = post.upVotes;

        let downVotes = document.createElement("p");
        downVotes.innerText = post.downVotes;

        let upButton = document.createElement("button");
        upButton.innerText = "yesss!";
        upButton.addEventListener("click", upVote(post._id));

        let downButton = document.createElement("button");
        downButton.innerText = "boo";
        downButton.addEventListener("click", downVote(post._id));

        voteDiv.appendChild(upVotes);
        voteDiv.appendChild(upButton);
        voteDiv.appendChild(downVotes);
        voteDiv.appendChild(downButton);

        newPost.appendChild(postContent);
        newPost.appendChild(voteDiv);

        //adding relevant css classes for styling
        voteDiv.classList.add("vote-div");
        postContent.classList.add("post-content");
        newPost.classList.add("post-div");

        upButton.classList.add("vote-button");
        downButton.classList.add("down-button");

        //append new post div to div wrapper element
        postsDiv.appendChild(newPost);
    }
}
//returns onClick function with enclosed reference to postID
const upVote = (postId) => {
    return function() {
        fetch(updateUrl, {
            method: "POST",
            body: JSON.stringify({id: postId}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.text())
        .then(data => console.log(data))
        // .then(data => console.log(data))
        .catch(err => console.log(err))
    }    
}
//returns onClick function with enclosed reference to postID
const downVote = (postId) => {
    return function() {
        console.log(postId);
    }
}

//shows posts when page loads
queryAllPosts();
