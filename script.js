const API_URL = "https://kanji-api-sepia.vercel.app/kanji/random";
let questionsList = [];
let currentIndex = 0;
let score = 0;

async function fetchKanji() {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (result.status === "success" && result.data.kanji.length > 0) {
      questionsList = result.data.kanji;
      currentIndex = 0;
      score = 0;

      document.getElementById("total-num").innerText = questionsList.length;
      document.getElementById("loader").style.display = "none";
      document.getElementById("quiz-info").classList.remove("hidden");

      showQuestion();
    }
  } catch (error) {
    document.getElementById("loader").innerText = "Gagal memuat kuis.";
  }
}

function showQuestion() {
  const data = questionsList[currentIndex];

  document.getElementById("current-num").innerText = currentIndex + 1;
  document.getElementById("quiz-content").classList.remove("hidden");
  document.getElementById("next-btn").classList.add("hidden");
  document.getElementById("message").innerText = "";

  document.getElementById("question-text").innerText = data.question;

  const choices = [
    { text: data.correctAnswer, correct: true },
    { text: data.incorrectAnswer1, correct: false },
    { text: data.incorrectAnswer2, correct: false },
    { text: data.incorrectAnswer3, correct: false },
  ].sort(() => Math.random() - 0.5);

  const container = document.getElementById("options-container");
  container.innerHTML = "";

  choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.innerText = choice.text;
    btn.onclick = () => {
      document
        .querySelectorAll("#options-container button")
        .forEach((b) => (b.disabled = true));
      if (choice.correct) {
        score++;
        btn.classList.add("correct");
        document.getElementById("message").innerText = "Benar! ✨";
      } else {
        btn.classList.add("wrong");
        document.getElementById("message").innerText =
          `Salah, yang benar: ${data.correctAnswer}`;
      }
      document.getElementById("next-btn").classList.remove("hidden");

      if (currentIndex === questionsList.length - 1) {
        document.getElementById("next-btn").innerText = "Lihat Hasil Akhir";
      }
    };
    container.appendChild(btn);
  });
}

function showNextQuestion() {
  currentIndex++;

  if (currentIndex < questionsList.length) {
    showQuestion();
  } else {
    document.getElementById("quiz-content").classList.add("hidden");
    document.getElementById("quiz-info").classList.add("hidden");
    document.getElementById("result-screen").classList.remove("hidden");
    document.getElementById("final-score").innerText = score;
    document.getElementById("final-total").innerText = questionsList.length;
  }
}

fetchKanji();
