document.addEventListener('DOMContentLoaded', () => {
    loadTweetsFromLocalStorage();
});

function postTweet() {
    const tweetInput = document.getElementById('tweet-input');
    const tweetText = tweetInput.value.trim();

    if (tweetText !== '') {
        const tweet = {
            id: new Date().getTime(),
            text: tweetText,
            likes: 0,
            comments: []
        };

        saveTweetToLocalStorage(tweet);
        displayTweet(tweet);
        tweetInput.value = '';
    }
}

function saveTweetToLocalStorage(tweet) {
    const tweets = JSON.parse(localStorage.getItem('tweets')) || [];
    tweets.push(tweet);
    localStorage.setItem('tweets', JSON.stringify(tweets));
}

function loadTweetsFromLocalStorage() {
    const tweets = JSON.parse(localStorage.getItem('tweets')) || [];
    tweets.forEach(tweet => displayTweet(tweet));
}
// function loadTweetsFromLocalStorage() {
//     const tweets = getTweetsFromLocalStorage();
//     tweets.forEach(tweet => displayTweet(tweet));
// }


function displayTweet(tweet) {
    const tweetDisplay = document.getElementById('tweet-display');
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-tweet-id', tweet.id);

    card.innerHTML = `
    <div class="profile">
    <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/031/original/profile_image.png?1706888739">
    <span class="profile-username">@john doe</span>
    
    </div>
    
        <p>${tweet.text}</p>
     
       
        <button onclick="toggleLike(${tweet.id})" id="like-btn-${tweet.id}"><img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/025/original/state_clicked.png?1706888455"> (${tweet.likes})</button>
        <button onclick="deleteTweet(${tweet.id})"><img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/030/original/delete-color-filled.png?1706888714" alt="Delete">
        </button>
        <div id="comment-section-${tweet.id}">
            <input type="text" id="comment-input-${tweet.id}" placeholder="Add a comment.." style="background:whitesmoke; border:none; border-radius:5px; height:50px; width:80%; margin-top:15px; ">
            <button onclick="addComment(${tweet.id})"><img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/026/original/comment.png?1706888619" alt="comment"><p style="margin-top:2px;">comment</p></button>
            <div id="comments-${tweet.id}"></div>
        </div>
    `;

    tweet.comments.forEach(comment => displayComment(tweet.id, comment));

    tweetDisplay.prepend(card);
}

function toggleLike(tweetId) {
    const likeButton = document.getElementById(`like-btn-${tweetId}`);
    const tweets = getTweetsFromLocalStorage();
    const tweet = tweets.find(t => t.id === tweetId);

    if (tweet) {
        if (!tweet.isLiked) {
            tweet.likes++;
            tweet.isLiked = true;
        } else {
            tweet.likes--;
            tweet.isLiked = false;
        }

        updateLikeButton(likeButton, tweet.likes);
        updateLocalStorage(tweets);
        animateLike();
    }
}

function animateLike() {
    const likeButton = event.target;
    likeButton.style.animation = 'likeAnimation 0.5s ease';
    setTimeout(() => {
        likeButton.style.animation = '';
    }, 500);
}

function updateLikeButton(button, likes) {
    button.textContent = `Like (${likes})`;
}

function deleteTweet(tweetId) {
    const tweetElement = document.querySelector(`.card[data-tweet-id="${tweetId}"]`);
    const tweets = getTweetsFromLocalStorage();
    const updatedTweets = tweets.filter(tweet => tweet.id !== tweetId);

    tweetElement.remove();
    updateLocalStorage(updatedTweets);
}

function addComment(tweetId) {
    const commentInput = document.getElementById(`comment-input-${tweetId}`);
    const commentText = commentInput.value.trim();

    if (commentText !== '') {
        const tweets = getTweetsFromLocalStorage();
        const tweet = tweets.find(t => t.id === tweetId);

        if (tweet) {
            const comment = {
                id: new Date().getTime(),
                text: commentText
            };

            tweet.comments.push(comment);
            updateLocalStorage(tweets);
            displayComment(tweetId, comment);
            commentInput.value = '';
        }
    }
}

// function displayComment(tweetId, comment) {
//     const commentsSection = document.getElementById(`comments-${tweetId}`);
//     const commentDiv = document.createElement('div');
//     commentDiv.classList.add('comment');
//     commentDiv.innerHTML = `
//         <p>${comment.text}</p>
//         <button onclick="deleteComment(${tweetId}, ${comment.id})">Delete</button>
//     `;

//     commentsSection.appendChild(commentDiv);
// }
function displayComment(tweetId, comment) {
    const commentsSection = document.getElementById(`comments-${tweetId}`);
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');
    commentDiv.innerHTML = `
        <p>${comment.text}</p>
        <button class="delete-button" onclick="deleteComment(${tweetId}, ${comment.id})">
            <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/027/original/delete.png?1706888643" alt="Delete">
        </button>
    `;

    commentsSection.appendChild(commentDiv);
}


function deleteComment(tweetId, commentId) {
    const tweets = getTweetsFromLocalStorage();
    const tweet = tweets.find(t => t.id === tweetId);

    if (tweet) {
        tweet.comments = tweet.comments.filter(comment => comment.id !== commentId);
        updateLocalStorage(tweets);
        reloadComments(tweetId);
    }
}

function reloadComments(tweetId) {
    const commentsSection = document.getElementById(`comments-${tweetId}`);
    commentsSection.innerHTML = '';

    const tweets = getTweetsFromLocalStorage();
    const tweet = tweets.find(t => t.id === tweetId);

    tweet.comments.forEach(comment => displayComment(tweetId, comment));
}

function getTweetsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tweets')) || [];
}

function updateLocalStorage(tweets) {
    localStorage.setItem('tweets', JSON.stringify(tweets));
}


