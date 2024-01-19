document.addEventListener("DOMContentLoaded", () => {
  // HTML ELEMENTS - views
  const quizView = document.getElementById("quizView");
  const endView = document.getElementById("endView");

  // HTML ELEMENTS - quiz view
  const progressBar = document.getElementById("progressBar");
  const questionCount = document.getElementById("questionCount");
  const questionContainer = document.getElementById("question");
  const choiceContainer = document.getElementById("choices");
  const nextButton = document.getElementById("nextButton");

  // HTML ELEMENTS - end view
  const resultContainer = document.getElementById("result");

  // SET VISIBILITY OF VIEWS
  // Show the quiz view (div#quizView) and hide the end view (div#endView)
  quizView.style.display = "block";
  endView.style.display = "none";

  // QUIZ DATA
  // Array with the quiz questions
  const questions = [
    new Question("What is 2 + 2?", ["3", "4", "5", "6"], "4", 1),
    new Question(
      "What is the capital of France?",
      ["Miami", "Paris", "Oslo", "Rome"],
      "Paris",
      1
    ),
    new Question(
      "Who created JavaScript?",
      ["Plato", "Brendan Eich", "Lea Verou", "Bill Gates"],
      "Brendan Eich",
      2
    ),
    new Question(
      "What is the mass–energy equivalence equation?",
      ["E = mc^2", "E = m*c^2", "E = m*c^3", "E = m*c"],
      "E = mc^2",
      3
    ),
    // Add more questions here
  ];
  const quizDuration = 120; // 120 seconds (2 minutes)

  // QUIZ INSTANCE
  // Create a new Quiz instance object
  const quiz = new Quiz(questions, quizDuration, quizDuration);

  // Shuffle the quiz questions

  quiz.shuffleQuestions();

  // SHOW TIME REMAINING
  // Convert the time remaining in seconds to minutes and seconds, and pad the numbers with zeros if needed
  const minutes = Math.floor(quiz.timeRemaining / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (quiz.timeRemaining % 60).toString().padStart(2, "0");

  // Display the time remaining in the time remaining container
  const timeRemainingContainer = document.getElementById("timeRemaining");
  timeRemainingContainer.innerText = `${minutes}:${seconds}`;

  // TIMER
  let timer = setInterval(() => {
    // Convert the time remaining in seconds to minutes and seconds, and pad the numbers with zeros if needed
    const minutes = Math.floor(quiz.timeRemaining / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (quiz.timeRemaining % 60).toString().padStart(2, "0");

    // Display the time remaining in the time remaining container
    const timeRemainingContainer = document.getElementById("timeRemaining");
    timeRemainingContainer.innerText = `${minutes}:${seconds}`;

    // Update the time remaining
    quiz.timeRemaining--;

    // If the time has run out, show the results
    if (quiz.timeRemaining <= 0) {
      clearInterval(timer);
      showResults();
    }
  }, 1000);

  // SHOW FIRST QUESTION
  showQuestion();

  // EVENT LISTENERS
  nextButton.addEventListener("click", nextButtonHandler);
  // nextButton.addEventListener("click", () => {
  //   nextButtonHandler();
  // });

  function nextButtonHandler() {
    let selectedAnswer;
    const choices = document.querySelectorAll("input[name=choice]");
    choices.forEach((choice) => {
      if (choice.checked) {
        selectedAnswer = choice.value;
      }
    });
    if (selectedAnswer) {
      quiz.checkAnswer(selectedAnswer);
      quiz.moveToNextQuestion();
      showQuestion();
    }
  }

  function showQuestion() {
    if (quiz.hasEnded()) {
      showResults();
      clearInterval(timer);
      return;
    }

    questionContainer.innerText = "";
    choiceContainer.innerHTML = "";
    const question = quiz.getQuestion();
    question.shuffleChoices();
    questionContainer.innerText = question.text;

    const progressPercentage =
      (quiz.currentQuestionIndex / quiz.questions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    const questionCountText = `Question ${quiz.currentQuestionIndex + 1} of ${
      quiz.questions.length
    }`;
    questionCount.innerText = questionCountText;

    question.choices.forEach((choice) => {
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "choice";
      radio.value = choice;
      choiceContainer.appendChild(radio);

      const label = document.createElement("label");
      label.innerText = choice;
      choiceContainer.appendChild(label);

      const br = document.createElement("br");
      choiceContainer.appendChild(br);
    });
  }

  function showResults() {
    quizView.style.display = "none";
    endView.style.display = "flex";
    resultContainer.innerText = `You scored ${quiz.correctAnswers} out of ${quiz.questions.length} correct answers!`;
  }

  document.getElementById("restartButton").addEventListener("click", () => {
    window.location.reload();
  });
});
