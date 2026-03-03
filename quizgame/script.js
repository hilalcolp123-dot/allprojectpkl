// DOM Elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");

// Quiz Data
const quizQuestions = [
  {
    question: "Apa ibukota Indonesia?",
    answers: [
      { text: "Jakarta", correct: true },
      { text: "Bandung", correct: false },
      { text: "Surabaya", correct: false },
      { text: "Medan", correct: false },
    ],
  },
  {
    question: "Siapa presiden pertama Indonesia?",
    answers: [
      { text: "Soekarno", correct: true },
      { text: "Soeharto", correct: false },
      { text: "Joko Widodo", correct: false },
      { text: "B.J. Habibie", correct: false },
    ],
  },
  {
    question: "Apa lambang negara Indonesia?",
    answers: [
      { text: "Garuda Pancasila", correct: true },
      { text: "Bendera Merah Putih", correct: false },
      { text: "Pohon Beringin", correct: false },
      { text: "Monas", correct: false },
    ],
  },
  {
    question: "Kapan Indonesia merdeka?",
    answers: [
      { text: "17 Agustus 1945", correct: true },
      { text: "17 Agustus 1946", correct: false },
      { text: "17 Desember 1945", correct: false },
      { text: "17 Desember 1946", correct: false },
    ],
  },
  {
    question:
      "Siapa pahlawan nasional yang dikenal sebagai 'Bapak Pendidikan Indonesia'?",
    answers: [
      { text: "Dr. Cipto Mangunkusumo", correct: true },
      { text: "Soekarno", correct: false },
      { text: "Mohammad Hatta", correct: false },
      { text: "Ki Hajar Dewantara", correct: false },
    ],
  },
];

// State
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

// Event Listeners
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

function startQuiz() {
  // Reset state
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = 0;

  startScreen.classList.remove("active");
  quizScreen.classList.add("active");

  showQuestion();
}
function showQuestion() {
  // Reset state
  answersDisabled = false;

  const currentQuestion = quizQuestions[currentQuestionIndex];

  currentQuestionSpan.textContent = currentQuestionIndex + 1;

  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
  progressBar.style.width = progressPercent + "%";

  questionText.textContent = currentQuestion.question;

  answersContainer.innerHTML = "";

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("answer-btn");

    // Set data attribute untuk jawaban benar/salah
    button.dataset.correct = answer.correct;

    button.addEventListener("click", selectAnswer);
    answersContainer.appendChild(button);
  });
}

function selectAnswer(e) {
  // Optimization: Cegah klik ganda
  if (answersDisabled) return;
  answersDisabled = true;
  const selectedButton = e.target;
  const isCorrect = selectedButton.dataset.correct === "true";

  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else if (button === selectedButton) {
      button.classList.add("incorrect");
    }
  });

  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
  }

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 1000);
}

function showResult() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  finalScoreSpan.textContent = score;

  const percentage = (score / quizQuestions.length) * 100;

  if (percentage === 100) {
    resultMessage.textContent = "Luar biasa! Kamu mendapatkan nilai sempurna!";
  } else if (percentage >= 80) {
    resultMessage.textContent =
      "Hebat! Kamu mendapatkan nilai yang sangat baik!";
  } else if (percentage >= 60) {
    resultMessage.textContent =
      "Bagus! Kamu mendapatkan nilai yang cukup baik!";
  } else if (percentage >= 40) {
    resultMessage.textContent =
      "Coba lagi untuk mendapatkan nilai yang lebih baik!";
  } else {
    resultMessage.textContent = "Jangan menyerah! Terus belajar dan coba lagi!";
  }
}

function restartQuiz() {
  resultScreen.classList.remove("active");
  startQuiz();
}
