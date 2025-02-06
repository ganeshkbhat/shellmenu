
const { askQuestionsRecursively, askNestedQuestionsRecursively } = require("../index");
// Example usage:

const questions = [
  "What is your name?",
  "What is your favorite color?",
  "What is your age?",
];

async function processAnswers(answers) {
  console.log("\nAll answers received:");
  console.log(answers);

  // Perform operations with the answers here.  For example:
  const name = answers["What is your name?"];
  const color = answers["What is your favorite color?"];
  const age = parseInt(answers["What is your age?"]); // Convert to integer

  console.log(`\nHello, ${name}! I see you like ${color} and are ${age} years old.`);

  // Example of more complex processing
  if (age >= 18) {
    console.log("You are an adult.");
  } else {
    console.log("You are a minor.");
  }
}



async function main() {
  try {
    await askQuestionsRecursively(questions, processAnswers);
    console.log("Finished processing.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();


