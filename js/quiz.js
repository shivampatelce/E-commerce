/** 
Name: Shivam Patel
Student Number: 8994760 
*/

// Quiz questions list
const quiz = [
  {
    question: "What does HTML stand for?",
    options: [
      "HyperText Markup Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
      "Hypertext Machine Language",
    ],
    correctAnswer: "HyperText Markup Language",
  },
  {
    question: "Who is making the Web standards?",
    options: ["Google", "Microsoft", "The World Wide Web Consortium", "Apple"],
    correctAnswer: "The World Wide Web Consortium",
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Creative Style Sheets",
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Colorful Style Sheets",
    ],
    correctAnswer: "Cascading Style Sheets",
  },
  {
    question: "Which HTML attribute is used to define inline styles?",
    options: ["class", "style", "font", "styles"],
    correctAnswer: "style",
  },
];

let currentQuestionIndex = 0;
let selectedAnswers = [];

// Display questions
const displayQuestion = () => {
  const { question, options } = quiz[currentQuestionIndex];
  $("#question").text(`${currentQuestionIndex + 1}. ${question}`);
  $("#option-container").html("");
  options.forEach((option) => {
    const button = $(`<button class="option">${option}</button>`);
    $("#option-container").append(button);
    button.on("click", () => {
      selectedAnswers.push(option);
      currentQuestionIndex++;
      if (currentQuestionIndex < 4) {
        displayQuestion();
      } else {
        displayResult();
      }
    });
  });
};

// Display result
const displayResult = () => {
  $(".container").html("");
  $(".container").html(`
        <h1>Result</h1>
    `);

  quiz.forEach(({ question, options, correctAnswer }, index) => {
    const selectedAnswer = selectedAnswers[index];
    const isRightAnswer = selectedAnswer === correctAnswer;
    $(".container").append(`
            <div id="question">
                ${index + 1}. ${question}
            </div>
        `);

    options.forEach((option) => {
      $(".container").append(
        `<button class="option ${
          selectedAnswer !== option ? "" : isRightAnswer ? "right" : "wrong"
        }">${option}</button>`
      );
    });
  });

  $("#result-msg").removeClass("hide");
  if (isAllAnswersCorrect()) {
    $("#result-msg").html(`
      <div>You've won a 5% discount coupon! You can apply it during checkout.</div>
      <button id="cart-btn">Go To Cart</button>
    `);
    localStorage.setItem("hasCoupon", true);
    localStorage.setItem("couponWinningTime", JSON.stringify(new Date()));
  } else {
    $("#result-msg").html(`
      <div>Unfortunately, you didn't provide 4 correct answers this time, so you won't receive the 5% discount coupon. Better luck next time!</div>
      <button id="cart-btn">Go To Cart</button>
    `);
  }

  $("#cart-btn").on("click", () => {
    window.location.href = "../pages/cart.html";
  });
};

const isAllAnswersCorrect = () => {
  let isAnyAnswerWrong = false;
  quiz.forEach(({ correctAnswer }, index) => {
    if (correctAnswer != selectedAnswers[index]) {
      isAnyAnswerWrong = true;
    }
  });
  return !isAnyAnswerWrong;
};

$(() => {
  displayQuestion();
});
