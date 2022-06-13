// Giving variables to all document elements 
const startGameButton = document.getElementById('start-game');
const sectionTimer = document.getElementById('section-timer');
const timerEl = document.getElementById('timer');
const sectionQuestion = document.getElementById ('section-question');
const sectionEndGame = document.getElementById ('section-endgame');
const sectionWelcome = document.getElementById ('section-welcome');
const sectionHighScores = document.getElementById ('section-high-score')
const finalScoreEl = document.getElementById ('result-span');
const answerFeedback = document.getElementById('header-feedback');
const saveInitialsButton = document.getElementById('save');
const inputInitials = document.getElementById('input-initials');
const questionTitleEl = document.getElementById('question-title');
const questionChoicesEl = document.getElementById('multiple-choices');
const homeButton = document.getElementById('home-button')
const highScoreList = document.getElementById('highscore-list')
const clearHighscoreButton = document.getElementById('clear-score-btn')

// Re-setting defaults of variables
let scoreList = [];
let userScore = 0;
let timeRemaining = 60;
let timerId;

// Calling past scores from local storage
getScores();

// When i click the start button
startGameButton.addEventListener('click', function(event) {
    // manipulate DOM to move into questions section
    timerEl.textContent = timeRemaining;
    sectionWelcome.classList.add('hide');
    sectionQuestion.classList.remove('hide');
    sectionHighScores.classList.add('hide');

    // Start the timer and render the first question
    startTimer();
    renderQuestion(0);  
});

// Starts the interval countdown
function startTimer() {
    sectionTimer.classList.remove('hide');

    const timerId = setInterval (function(){
        timeRemaining = timeRemaining - 1;
        timerEl.textContent = timeRemaining;

        if (timeRemaining <= 0) {
            endGame();
        }
    }, 1000)
};

// Manipulates DOM & clears timer
function endGame () {
    clearInterval(timerId);
    sectionEndGame.classList.remove('hide');
    sectionQuestion.classList.add('hide');
    sectionTimer.classList.add('hide');
    sectionWelcome.classList.add('hide');
    finalScoreEl.textContent = userScore;
    answerFeedback.classList.add('hide');
    homeButton.classList.remove('hide');
}

// Function to add score to local storage
function saveScore () {
    localStorage.setItem("highscore", JSON.stringify(scoreList));
}

// Function to retrieve score from local storage
function getScores () {
    const storedScores = JSON.parse(localStorage.getItem("highscore"));
    if (storedScores !== null) {
        scoreList = storedScores;
    }
}

// Function to render past scores into the DOM
function renderScores () {
    // Sorting list of top scores from best to worst
    scoreList.sort((a, b) => {
        return b.score - a.score;
    });

    // Taking the top 5 best scores
    topFive = scoreList.slice(0,5);

    // Variables for the table & header row
    let table = document.createElement('table');
    let headerRow = document.createElement('tr');
    // Array with header names
    let headers = ['Name', 'Score'];

    // For every header, create corresponding cells for inputs
    headers.forEach (headerText => {
        let header = document.createElement('th');
        let textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        headerRow.appendChild(header)
    });

    // Header becomes a child of the table
    table.appendChild(headerRow);

    // For each of the top scores, create a new table row and input the values
    topFive.forEach(emp => {
        let row = document.createElement('tr')
        
        Object.values(emp).forEach(text => {
            let cell = document.createElement('td');
            let textNode = document.createTextNode(text);
            cell.appendChild(textNode);
            row.appendChild(cell);
        })
        table.appendChild(row)

    })
    // Append the new elements to the corresponding section
    sectionHighScores.appendChild(table);
    
}


// Function that saves user's initials & trims any spaces
saveInitialsButton.addEventListener ('click', function (event) {
    event.preventDefault();
    const playerInitials = inputInitials.value.trim();
    const lastScore = {
        player: playerInitials,
        score: userScore,
    }
    // Pushes latest score to array
    scoreList.push(lastScore);
    // Calls function to save scores to local storage
    saveScore();
    // Renders out the scores
    sectionHighScores.classList.remove('hide');
    renderScores();
}) 


function renderQuestion(questionIndex) {
    // A question is defined as an index in the questions array
    const question = questions[questionIndex];

    // Set question title
    questionTitleEl.textContent = question.title;

    // Set choice title
    const choices = question.choices;
    
    // Emptying pre-existing choice & question
    questionChoicesEl.textContent = " ";
    answerFeedback.textContent = " ";
    answerFeedback.classList.remove('hide');

    // Loops through choices, creates buttons & adds them to a list
    for (let index = 0; index < choices.length; index++) {
        const choice = choices[index];
        const li = document.createElement('li');
        const button = document.createElement('button');
        li.classList.add('list-style-none')
        button.classList.add('question-choice', 'btn', 'btn-primary', 'p-1', 'm-1')
        button.textContent = choice.title;        
        // When an answer button is clicked
        button.addEventListener('click', function(){
            // if the answer is correct, give 10 score & feedback
            if (choice.isAnswer) {
                userScore = userScore + 10;
                answerFeedback.textContent = 'Correct!'
            // Else remove 10 seconds of time & give feedback               
            } else {
                timeRemaining = timeRemaining - 10;             
                answerFeedback.textContent = 'Incorrect.'
            }

            // Move on to next question
            const nextQuestionIndex = questionIndex +1;

            // If it's the last question, end the game with a 500ms delay so user can see their feedback first
            if (nextQuestionIndex >= questions.length) {
                setTimeout(() => {return endGame()}, 600);
            } else {
            // else render the next question 
                setTimeout(() => {renderQuestion(nextQuestionIndex);}, 600);
            }
        });

        // Button becomes a child of  the list
        li.appendChild(button); 

        // List is appended to the correct section
        questionChoicesEl.append(li);   
    }
}

// Adds functionality to "return to home"
homeButton.addEventListener('click', function (){reload = location.reload()});

// Function to delete past high scores from local storage
clearHighscoreButton.addEventListener('click', function() {
    // If the scorelist isn't already empty, empty it.
    if (scoreList != null) {
        sectionHighScores.innerHTML = '';
        scoreList = [];
        localStorage.setItem('highscore', JSON.stringify(scoreList))
    }

});
