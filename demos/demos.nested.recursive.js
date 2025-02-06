
const { askQuestionsRecursively, askNestedQuestionsRecursively } = require("../index");
// Example usage:

const questions = [
    {
        question: "What is your favorite programming language?",
        options: ["JavaScript", "Python", "Java", "C++"],
        followUpQuestions: {
            "JavaScript": [
                {
                    question: "Which JavaScript framework do you prefer?",
                    options: ["React", "Angular", "Vue"],
                },
            ],
            "Python": [
                {
                    question: "Which Python framework do you prefer?",
                    options: ["Django", "Flask"],
                },
            ],
        },
    },
    {
        question: "What is your experience level?",
        options: ["Beginner", "Intermediate", "Expert"],
    },
    {
        question: "What is your name?", // Free-text question
    },
];

async function processAnswers(answers) {
    console.log("\nAll answers received:");
    console.log(answers);

    // Process the answers here
    const language = answers["What is your favorite programming language?"];
    const experience = answers["What is your experience level?"];
    const name = answers["What is your name?"];
    const framework = answers["Which JavaScript framework do you prefer?"] || answers["Which Python framework do you prefer?"] || "None"; // Handle cases where no framework is selected

    console.log(`\nHello ${name}! You prefer ${language} (${framework}) and are an ${experience}.`);
}


async function main() {
    try {
        await askNestedQuestionsRecursively(questions, processAnswers);
        console.log("Finished processing.");
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

main();