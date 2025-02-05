
const readline = require('readline');

async function askQuestionsRecursively(questions, finalFunction) {
  const answers = {};

  async function askNextQuestion(index) {
    if (index === questions.length) {
      return finalFunction(answers); // All questions asked, process with final function
    }

    const question = questions[index];
    const readline = readline.createInterface({
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

async function askNestedQuestionsRecursively(questions, finalFunction) {
  const answers = {};

  async function askNextQuestion(index) {
    if (index === questions.length) {
      return finalFunction(answers);
    }

    const questionData = questions[index];
    const questionText = questionData.question;
    const options = questionData.options;
    const followUpQuestions = questionData.followUpQuestions || []; // Questions based on answer

    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      console.log(questionText);

      if (options && options.length > 0) {
        options.forEach((option, i) => {
          console.log(`${i + 1}. ${option}`);
        });

        rl.question('Enter your choice (number): ', async (answer) => {
          const selectedOptionIndex = parseInt(answer) - 1;

          if (selectedOptionIndex >= 0 && selectedOptionIndex < options.length) {
            const selectedOption = options[selectedOptionIndex];
            answers[questionText] = selectedOption; // Store selected option

            rl.close();

            // Ask follow-up questions if any
            if (followUpQuestions[selectedOption]) {
              const followUpAnswers = await askQuestionsRecursively(followUpQuestions[selectedOption], () => { }); // Ask follow-ups recursively
              Object.assign(answers, followUpAnswers); // Merge follow-up answers
            }

            resolve(askNextQuestion(index + 1));
          } else {
            console.log('Invalid choice. Please enter a number from the options.');
            rl.close();
            resolve(askNextQuestion(index)); // Ask the same question again
          }
        });
      } else { // No options, free text answer
        rl.question(questionText + ': ', (answer) => {
          answers[questionText] = answer;
          rl.close();
          resolve(askNextQuestion(index + 1));
        });
      }
    });
  }

  return askNextQuestion(0);
}

module.exports = { askQuestionsRecursively, askNestedQuestionsRecursively };

