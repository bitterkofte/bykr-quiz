let questions = await getQuestions();
questions = questions.slice(0, 10);
let selectedQuestion = 0;
let selectedOption = "";
let timerInterval;
let clickable = false;
let optionsArray;
const results = [];
const container = document.getElementById("container");
const questionText = document.getElementById("question");
const titleText = document.getElementById("title");
const optionsContainer = document.getElementById("options");
const nextButton = document.querySelector(".next");
const finishButton = document.querySelector(".finish");
nextButton.addEventListener("click", nextQuestion);
finishButton.addEventListener("click", finish);

window.addEventListener("beforeunload", () => {
  alert("You will lost your progress!");
});

async function getQuestions() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    throw error;
  }
}

function showQuestion() {
  titleText.textContent =
    questions[selectedQuestion].id + "- " + questions[selectedQuestion].title;
  optionParser(questions[selectedQuestion].body);
  startTimer(30);
}

const optionParser = (options) => {
  optionsContainer.innerHTML = "";
  options.split("\n").map((o, i) => {
    optionsContainer.insertAdjacentHTML(
      "beforeend",
      `<p class="option" id="&#${65 + i}">&#${65 + i}) ${o}</p>`
    );
  });
  optionsArray = document.querySelectorAll(".option");
  optionsArray.forEach((option) => {
    option.addEventListener("click", selectOption);
  });
};

function selectOption(option) {
  if (clickable) {
    optionsArray.forEach((option) => {
      option.classList.remove("selected");
    });
    selectedOption = option.target.textContent;
    results[selectedQuestion] = selectedOption;
    option.target.classList.add("selected");
  } else {
    option.style.cursor = "not-allowed";
  }
}

function startTimer(time) {
  deactivateOptions();
  timer.textContent = `${time}`;
  let timeRemaining = time - 1;
  timerInterval = setInterval(() => {
    timer.textContent = `${timeRemaining}`;
    if (timeRemaining <= 20) activateOptions();
    if (timeRemaining <= 5) timer.style.backgroundColor = "#c031317a";
    timeRemaining--;
    if (timeRemaining < 0) nextQuestion();
  }, 1000);
}

function activateOptions() {
  optionsArray.forEach((option) => {
    option.classList.remove("deactive");
    option.classList.add("active");
  });
  timer.style.backgroundColor = "#0067607a";
  clickable = true;
}
function deactivateOptions() {
  optionsArray.forEach((option) => {
    option.classList.remove("active");
    option.classList.add("deactive");
  });
  timer.style.backgroundColor = "#6d6d6d7a";
  clickable = false;
}

function nextQuestion() {
  clearInterval(timerInterval);
  if (selectedQuestion === 9) {
    finish();
    return;
  }
  if (selectedQuestion < questions.length - 1) {
    selectedQuestion++;
    showQuestion();
    if (selectedQuestion === 9) {
      nextButton.style.display = "none";
      finishButton.style.display = "block";
    }
  } else {
    container.innerHTML =
      "Manipulation detected! Your results won't be considered.";
  }
}

function finish() {
  container.innerHTML = `
  <table id="table">
    <tr>
      <th class="tl">Question</th>
      <th class="tr">Your Answer</th>
    </tr>
    ${Array(10)
      .fill(0)
      .map(
        (_, i) =>
          `<tr><td>${i + 1}</td><td>${
            results[i] || "<i>NOT ANSWERED</i>"
          }</td></tr>`
      )
      .join("")}
  <table>
  `;
  clearInterval(timerInterval);
  timer.innerHTML = "<p class='slide-down'>✅ Test ended<p>";
  timer.style.backgroundColor = "#00672d7a";
  finishButton.style.display = "none";
}

//Start Quiz
showQuestion();
