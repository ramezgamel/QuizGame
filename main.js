let myHttp = new XMLHttpRequest();
let questions;
let currentIndex = 0;
let rightAnswers = 0;
let timer = 15;
let countdownInterval;

//Get Random Category
let listOfCategory = [
  "Json/generalInformation1.json",
  "Json/generalInformation2.json",
  "Json/sports.json",
  "Json/theater.json",
];
let itemCategory = listOfCategory[Math.floor(Math.random() * listOfCategory.length)];

myHttp.open("GET", itemCategory);
myHttp.send();
myHttp.addEventListener("readystatechange", () => {
  if (myHttp.readyState == 4 && myHttp.status === 200) {
    questions = JSON.parse(myHttp.response).results;

    shuffle(questions);
    createDynamicItems();
    createQuestion();
    countdown(timer);

    $("button").click(function () {
      checkAnswer();
      currentIndex++;
      $(".quiz-area").html(``);
      createQuestion();
      handleBullets();
      showResult();
      clearInterval(countdownInterval);
      countdown(timer);
    });
  }
});
function createDynamicItems() {
  $(".cat span").text(`${questions[currentIndex].category}`);
  $(".question-count span").text(`${questions.length}`);
  for (let i = 0; i < questions.length; i++) {
    let span = document.createElement("span");
    $(".bullets").append(span);
  }
  $(".bullets span:first").addClass("on");
}
function handleBullets() {
  let arrayOfBullet = Array.from(document.querySelectorAll(".bullets span"));
  arrayOfBullet.forEach((bullet, index) => {
    if (currentIndex === index) {
      bullet.className = "on";
    } else {
      bullet.classList.remove("on");
    }
  });
}
function createQuestion() {
  if (currentIndex < questions.length) {
    let answers = questions[currentIndex].answers;
    shuffle(answers);
    $(".quiz-area").html(`
    <h2>${questions[currentIndex].question}</h2>
    <div class="answer">
      <input type="radio" id="answer-1" name="questions" data-ans="${answers[0]}">
      <label for="answer-1">${answers[0]}</label>
    </div>
    <div class="answer">
      <input type="radio" id="answer-2" name="questions" data-ans="${answers[1]}">
      <label for="answer-2">${answers[1]}</label>
    </div>
    <div class="answer">
      <input type="radio" id="answer-3" name="questions" data-ans="${answers[2]}">
      <label for="answer-3">${answers[2]}</label>
    </div>
    <div class="answer">
      <input type="radio" id="answer-4" name="questions" data-ans="${answers[3]}">
      <label for="answer-4">${answers[3]}</label>
    </div>`);
  }
  checkIsEmpty();
}
function checkIsEmpty() {
  let answers = document.querySelectorAll("input[name='questions']");
  let chosenAnswer = Array.from(answers).filter((ans) => ans.checked);
  if (chosenAnswer.length == 0) {
    $("button").attr("disabled", "disabled");
    $("button").addClass("disabled");
  }
  $(".answer label").click((e) => {
    $("button").removeAttr("disabled");
    $("button").removeClass("disabled");
  });
}
function checkAnswer() {
  let answers = Array.from(
    document.querySelectorAll("input[name='questions']")
  );
  let bullets = Array.from(document.querySelectorAll(".bullets span"));
  let chosenAnswer = answers.filter((ans) => ans.checked);
  if (chosenAnswer.length == 0) {
    bullets[currentIndex].classList.add("wrong");
  } else if (
    chosenAnswer[0].dataset.ans == questions[currentIndex].correct_answer
  ) {
    bullets[currentIndex].classList.add("right");
    rightAnswers++;
    $(".result span").text(`${rightAnswers}`);
  } else {
    bullets[currentIndex].classList.add("wrong");
  }
}
function showResult() {
  if (currentIndex == questions.length) {
    $(".quiz-area").html(`
    <h2> Your Result Is ${rightAnswers} From ${questions.length} </h2>
    `);
  }
}

function countdown(duration) {
  if (currentIndex < questions.length) {
    let min, sec;
    let reset = duration;
    countdownInterval = setInterval(function () {
      min = parseInt(duration / 60);
      sec = parseInt(duration % 60);
      min = min < 10 ? `0${min}` : min;
      sec = sec < 10 ? `0${sec}` : sec;

      if (--duration < 0) {
        duration = reset;
        $("button").click();
        if (currentIndex == questions.length) {
          clearInterval(countdownInterval);
        }
      }
      $(".count-down").html(`${min}:${sec}`);
    }, 1000);
  }
}
function shuffle(array) {
  let ii = array.length;
  let randomIndex;

  while (ii != 0) {
    randomIndex = Math.floor(Math.random() * ii);
    ii--;

    [array[ii], array[randomIndex]] = [array[randomIndex], array[ii]];
  }

  return array;
}
