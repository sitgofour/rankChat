
const hostName = "https://poet-post.herokuapp.com";
const postsUrl = "https://poet-post.herokuapp.com/posts";
const updateUrl = "https://poet-post.herokuapp.com/vote";


// retrieves all posts from database
const queryAllPosts = async () => {
    try {
        const posts = await fetch(postsUrl);
        const postsArr = await posts.json();
        displayAllPosts(postsArr);
    } 
    catch(err) {
        console.log("error while gathering db posts" + err);
    }
    
}

//sort posts by votes, then iterate and display
const displayAllPosts = (postsArr) => {

    // reset post wrapper to blank as order will change
    postsDiv.innerHTML = "";

    const sortedPosts = sortPosts(postsArr);

    for(let post of sortedPosts) {
        //create wrapper elements for post elements
        let newPost = document.createElement("div");
        let voteDiv = document.createElement("div");
        let postContent = document.createElement("div");

        //create html elements for username, post, and date
        let user = document.createElement("h4");
        user.textContent = post.user;

        let postText = document.createElement("p");
        postText.innerText = post.post;

        let postDate = document.createElement("h5");
        postDate.textContent = post.date;


        ////////////////////////////////////////////////
        // attach elements to parent
        postContent.appendChild(user);
        postContent.appendChild(postText);
        postContent.appendChild(postDate);


        ////////////////////////////////////////////////
        //create html elements for upvotes and downvotes
        let voteTotal = document.createElement("p");
        voteTotal.innerText = post.voteTotal;

        let upButton = document.createElement("button");
        upButton.innerText = "up";
        upButton.addEventListener("click", castVote(post._id, "up"));

        let downButton = document.createElement("button");
        downButton.innerText = "down";
        downButton.addEventListener("click", castVote(post._id, "down"));

        
        ////////////////////////////////////////////////
        // attach upvote and downvote html elements to parent
        voteDiv.appendChild(upButton);
        voteDiv.appendChild(voteTotal);
        voteDiv.appendChild(downButton);

        newPost.appendChild(postContent);
        newPost.appendChild(voteDiv);


        ////////////////////////////////////////////////
        //Determine post background color based on voteTotal
        const colorClass = selectColorClass(post.voteTotal); 


        ////////////////////////////////////////////////
        //adding relevant css classes for styling
        voteDiv.classList.add("vote-div");
        postContent.classList.add("post-content");
        newPost.classList.add("post-div");
        newPost.classList.add(colorClass.bgColor);
        newPost.classList.add(colorClass.textColor);

        upButton.classList.add("vote-button");
        downButton.classList.add("down-button");


        ////////////////////////////////////////////////
        //append new post div to div wrapper element
        postsDiv.appendChild(newPost);
    }
}

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

/////////////////////////////////////////////////////////////
//returns onClick function with enclosed reference to postID
const castVote = (postId, direction) => {
    return function() {
        fetch(updateUrl, {
            method: "POST",
            body: JSON.stringify({
                id: postId,
                direction: direction
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.text())
        .then(data => {
            if(data === "vote made") {
                queryAllPosts();
            }
        })
        .catch(err => console.log(err)) 
    }   
}

// sorts post according to vote total
const sortPosts = (arr) => {
    return arr.sort((a,b) => (a.voteTotal <= b.voteTotal) ? 1 : -1);
}

// selects post background and text color based on vote total
const selectColorClass = (voteTotal) => {
    let bgColor = "";
    let textColor = "";
    switch (true){
        case voteTotal > 40:
            bgColor = "green-3";
            textColor = "white-text";
            break;
        case voteTotal > 30:
            bgColor = "green-2";
            textColor = "black-text";
            break;
        case voteTotal > 20:
            bgColor = "green-1";
            textColor = "black-text";
            break;
        case voteTotal > 10:
            bgColor = "yellow-1";
            textColor = "black-text";
            break;
        case voteTotal > 0:
            bgColor = "yellow-2";
            textColor = "black-text";
            break;
        case voteTotal > -10:
            bgColor = "orange-1";
            textColor = "black-text";
            break;
        case voteTotal > -20:
            bgColor = "orange-2";
            textColor = "black-text";
            break;
        case voteTotal > -30:
            bgColor = "red-1";
            textColor = "white-text";
            break;
        case voteTotal > -40:
            bgColor = "red-2";
            textColor = "white-text";
            break;
        case voteTotal > -Infinity:
            bgColor = "red-3";
            textColor = "white-text";
            break;
        default: 
            bgColor = "default-bg";
            break;
    }
    return {
        "bgColor": bgColor,
        "textColor": textColor
    };
}

// form element selectors
const form = document.querySelector(".post-form");
const postsDiv = document.querySelector(".posts-wrapper");

// submit listener for new post
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formContent = new FormData(form);
    const newPost = {
        name: formContent.get("username"),
        post: formContent.get("post")
    }
    newPostToDB(newPost);
    form.reset();  
});

//shows posts when page loads
queryAllPosts();
