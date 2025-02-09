
async function askQuestionsRecursively(questions, finalFunction) {
  const answers = {};

  async function askNextQuestion(index) {
    if (index === questions.length) {
      return finalFunction(answers); // All questions asked, process with final function
    }

    const question = questions[index];
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      readline.question(question + ": ", (answer) => {
        answers[question] = answer; // Store the answer
        readline.close();
        resolve(askNextQuestion(index + 1)); // Ask the next question
      });
    });
  }

  return askNextQuestion(0); // Start asking from the first question
}

function askFollowupQuestionRecursively(questions, printAnswer = true) {

  return new Promise(function (resolve, reject) {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    function askQuestions(questions, answers = {}) {
      return new Promise((resolve, reject) => {
        function askNextQuestion(index) {
          if (index >= questions.length) {
            resolve(answers); // All questions asked
            return;
          }

          const questionData = questions[index];
          const questionText = questionData.question;
          const options = questionData.options;

          console.log(questionText);

          if (options) { // Multiple choice
            options.forEach((option, i) => console.log(`${i + 1}. ${option}`));

            readline.question("Enter your choice (number): ", (choice) => {
              const numChoice = parseInt(choice);
              if (1 <= numChoice && numChoice <= options.length) {
                answers[questionText] = options[numChoice - 1];

                // Handle follow-up questions
                if (questionData.follow_up && questionData.follow_up[options[numChoice - 1]]) {
                  askQuestions(questionData.follow_up[options[numChoice - 1]], answers).then((updatedAnswers) => {
                    Object.assign(answers, updatedAnswers); // Merge follow-up answers
                    askNextQuestion(index + 1);
                  });
                } else {
                  askNextQuestion(index + 1);
                }
              } else {
                console.log("Invalid choice. Please enter a number from the options.");
                askNextQuestion(index); // Ask the same question again
              }
            });
          } else { // Open-ended
            readline.question("Enter your answer: ", (answer) => {
              answers[questionText] = answer;
              askNextQuestion(index + 1);
            });
          }
        }

        askNextQuestion(0); // Start asking questions from the beginning
      });
    }

    function processAnswers(questions, answers, printAnswer) {
      if (!!printAnswer) askFollowupQuestionRecursively(questions).then((answers) => {
        console.log(answers)
      });
    }
    return askQuestions(questions).then(function (answers) {
      processAnswers(questions, answers, printAnswer);
      readline.close(); // Close the readline interface when done
      resolve(answers);
    }.bind(this));
  });
}

module.exports = { askQuestionsRecursively, askFollowupQuestionRecursively };

