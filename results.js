/*--------------------------------------------*/
/*----------- HTML/File References -----------*/
/*--------------------------------------------*/
numbers = document.getElementById("numbers");
respText = document.getElementById("response-text");
const finalSound = new Audio('./resources/final.mp3');

finalSound.play().catch((e)=> {console.log("Audio play failed:", e)});

/*-----------------------------------*/
/*------------SHOW SCORE ------------*/
/*-----------------------------------*/
if(localStorage.getItem("answers")){
    answerList = JSON.parse(localStorage.getItem("answers"));
    const trueCount = answerList.filter(answer => answer === true).length;
    numbers.innerHTML = trueCount + "/" + answerList.length;
    if(trueCount >= 5){
        respText.innerHTML = "BRAVO!"
    }else{
        respText.innerHTML = "WELP..."
    }
    localStorage.removeItem("answers");
    localStorage.removeItem("questionIndex");
    localStorage.removeItem("timer");
}

