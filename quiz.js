/*--------------------------------------------*/
/*----------- HTML/File References -----------*/
/*--------------------------------------------*/
const quizContainer = document.getElementsByClassName('container')[0];
const themeButton = document.getElementById('question-theme');
const quizNumber = document.getElementById('question-number');
const quizQuestion = document.getElementById('question-text');
const quizAnswers = document.getElementById('options');
const quizSubmit = document.getElementById('question-nxt');
const timerDisplay = document.getElementById('question-timer');
const correctSound = new Audio('./resources/correct.mp3');
const incorrectSound = new Audio('./resources/incorrect.mp3');



/*----------------------------------------*/
/*----------- Global Variables -----------*/
/*----------------------------------------*/
let answerList = [];
let currentlySelected = -1;
let currentlyCorrect = -1;
let questionIndex = 0;
const DEFAULT_TIMER = 30;
let timer = 0;
let timerInterval = null;


/*----------------------------------------*/
/*------------ Quiz Functions ------------*/
/*----------------------------------------*/

/*--------- Fill From Data ---------*/
fillQuiz();
checkTheme();
function fillQuiz() {
    timer = DEFAULT_TIMER;
    resetTimer();
    resetData();
    timerDisplay.innerHTML = `Remaining Time: <b>0:${timer}</b>`;
    //--add info from data to html--
    quizSubmit.disabled = true;
    let questionData = data[questionIndex];
    quizNumber.innerHTML = "QUESTION " + (questionIndex + 1) + "/" + data.length;
    quizQuestion.innerHTML = questionData.question;
    quizAnswers.innerHTML = "";
    for (let i = 0; i < Object.keys(questionData.answers).length; i++) {
        let answer = questionData.answers["answer_" + String.fromCharCode(97 + i)];
        let correct =  questionData.correct_answers["answer_" + String.fromCharCode(97 + i) + "_correct"];
        if (answer) {
            quizAnswers.innerHTML+=`<div>
                                        <input type="radio" value="${i}" id="opt${i}" name="answer" onchange="selectOption(event, ${i})" required/>
                                        <label class="option" for="opt${i}">
                                            <p class="option-letter">${String.fromCharCode(97 + i).toUpperCase()}</p>
                                            <p class="option-txt">${formatString(answer)}</p>
                                        </label>

                                    </div>`
        }
        if(correct == "true"){
            currentlyCorrect = i;
        }
    }
}
/*----Fill correct answers array----*/
function resetData(){
    try{
        if(localStorage.getItem("answers")){
            answerList = JSON.parse(localStorage.getItem("answers"));
            questionIndex = parseInt(localStorage.getItem("questionIndex"));
        }
    }catch(e){
        if(questionIndex == 0){
            for (let i = 0; i < data.length; i++) {
                answerList.push(false);
            }
            localStorage.setItem("answers", JSON.stringify(answerList));
            localStorage.setItem("questionIndex", questionIndex);
        }
    }    
}
/*----Set Timer with everything----*/
function resetTimer(){
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    if(localStorage.getItem("timer")){
        timer = parseInt(localStorage.getItem("timer"));
    }
    timerInterval = setInterval(() => {
        timer--;
        const timerText = timer < 10 ? "0" + timer : timer;
        timerDisplay.innerHTML = `Remaining Seconds: <b>${timerText}</b>`;
        localStorage.setItem("timer", timer);
        if(timer <= 0) {
            clearInterval(timerInterval);
            checkResult();
        }
    }, 1000);
}
/*----Special characters----*/
function formatString(str){
    return str
    .replace(/&/g, '&amp;') 
    .replace(/</g, '&lt;')   
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;') 
    .replace(/'/g, '&#39;');
}


/*---------------------------------------*/
/*---------- Question Handling ----------*/
/*---------------------------------------*/

/*--------- Select Answer Form ---------*/
function selectOption(e, index) {
    currentlySelected = index;
    quizSubmit.disabled = false;
}

/*--------- Submit Answer Form ---------*/
function submitAnswer(e) {
    e.preventDefault();
    checkResult();
}
function checkResult(){
    //--check if correct, last question or ended--
    console.log("Selected: " + currentlySelected + " Correct: " + currentlyCorrect);
    if(currentlyCorrect == currentlySelected){
        answerList[questionIndex] = true;
        correctSound.play().catch(e => console.log("Audio play failed:", e));
    }else{
        answerList[questionIndex] = false;
        incorrectSound.play().catch(e => console.log("Audio play failed:", e));
    }
    questionIndex++;
    if(questionIndex == data.length-1){
        quizSubmit.innerHTML = "End";
    }
    console.log(questionIndex >= data.length);
    if(questionIndex >= data.length){
        window.location.href = "end.html";
    }
    //--next question
    localStorage.setItem("answers", JSON.stringify(answerList));
    localStorage.setItem("questionIndex", questionIndex);
    localStorage.removeItem("timer");
    fillQuiz();
}


/*--------------------------------------*/
/*------------ UI Functions ------------*/
/*--------------------------------------*/

/*--------- Switch Light on load ---------*/

function checkTheme(){
    if (localStorage.getItem("theme") == "dark") {
        quizContainer.classList.remove('container-quiz-light');
        quizContainer.classList.add('container-quiz-dark');
        themeButton.innerHTML = "Light"
    } 
    if (localStorage.getItem("theme") == "light") {
        quizContainer.classList.remove('container-quiz-dark');
        quizContainer.classList.add('container-quiz-light');
        themeButton.innerHTML = "Dark"
    }
}

/*--------- Switch Light or Dark Theme ---------*/
function changeTheme(){
    if (quizContainer.classList.contains('container-quiz-dark')) {
        //--light theme--
        quizContainer.classList.remove('container-quiz-dark');
        quizContainer.classList.add('container-quiz-light');
        themeButton.innerHTML = "Dark"
        localStorage.setItem("theme", "light");
    } else {
        //--dark theme--
        quizContainer.classList.remove('container-quiz-light');
        quizContainer.classList.add('container-quiz-dark');
        themeButton.innerHTML = "Light"
        localStorage.setItem("theme", "dark");
    }
}


