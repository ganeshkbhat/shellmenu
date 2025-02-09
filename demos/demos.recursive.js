
const { askQuestionsRecursively, askNestedQuestionsRecursively } = require("../index");
// Example usage:

const questions = [
  "What is your name?",
  "What is your favorite color?",
  "What is your age?",
];

// function processAnswers(answers) {
//   console.log("\nAll answers received:");
//   console.log(answers);
// 
//   // Perform operations with the answers here.  For example:
//   const name = answers["What is your name?"];
//   const color = answers["What is your favorite color?"];
//   const age = parseInt(answers["What is your age?"]); // Convert to integer
//   var ageComment = "";
//   if (age >= 18) { ageComment = "You are an adult." } else { ageComment = "You are a minor." }
// 
//   console.log(`\nHello, ${name}! I see you like ${color} and are ${age} years old.`, ageComment);
// 
// }

function processAnswers(answers) {
  let arr = []
  questions.forEach(questionData => {
    const questionText = questionData;
    const answer = answers[questionText];
    arr.push({ [questionText]: answer })
  })
  console.log(arr);
}

async function main() {
  try {
    await askQuestionsRecursively(questions, processAnswers);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();


