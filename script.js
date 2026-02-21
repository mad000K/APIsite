const jokesContainer = document.getElementById('jokes_container');

const jokeForm = document.getElementById('joke_form');

let currentLength = 0;

const xhr = new XMLHttpRequest();
xhr.open('GET', 'http://localhost:3000/jokes');
xhr.send();
xhr.responseType = 'json';
xhr.onload = () => {
    const jokes = xhr.response;
    if(jokes.length) {
        jokesContainer.innerHTML = '';
        jokes.forEach(joke => {
            jokesContainer.innerHTML += getJokeHTML(joke);
        });
        currentLength = jokes.length;
    }
};

function getJokeHTML(joke) {
    return `
    <div class="joke" id="joke_${joke.id}">
        <div class="joke__content">
            ${joke.content}
        </div>
        <div class="joke__footer">
            <div class="joke__likes">
                <span>${joke.likes}</span>
                <button class="joke__btn" onclick="like(${joke.id})">
                    <span class="material-symbols-outlined">
                        thumb_up
                    </span>
                </button>
            </div>
            <div class="joke__likes">
                <span>${joke.dislikes}</span>
                <button class="joke__btn" onclick="dislike(${joke.id})">
                    <span class="material-symbols-outlined">
                        thumb_down
                    </span>
                </button>
            </div>
        </div>
    </div>
    `;
}