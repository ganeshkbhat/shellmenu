
const { askQuestionsRecursively, askFollowupQuestionRecursively } = require("../index");


const questions = [
    {
        "question": "What is your name?",
    },
    {
        "question": "What is your age?",
    },
    {
        "question": "What is your favorite color?",
        "options": ["Red", "Green", "Blue", "Yellow"],
        "follow_up": {
            "Blue": [
                { "question": "What shade of blue?", "options": ["Sky blue", "Navy blue", "Teal"] },
            ],
            "Red": [
                { "question": "Do you prefer bright or dark red?", "options": ["Bright", "Dark"] }
            ]
        }
    },
    {
        "question": "Do you like coding?",
        "options": ["Yes", "No"],
        "follow_up": {
            "Yes": [
                { "question": "What is your favorite programming language?", "options": ["Python", "Java", "JavaScript", "C++"] }
            ],
            "No": [
                { "question": "What do you like to do instead?", "options": ["Reading", "Sports", "Music"] }
            ]
        }
    },
];


// const questions = [
//     {
//         question: "What is your favorite programming language?",
//         options: ["JavaScript", "Python", "Java", "C++"],
//         followUpQuestions: {
//             "JavaScript": [
//                 {
//                     question: "Which JavaScript framework do you prefer?",
//                     options: ["React", "Angular", "Vue"],
//                 },
//             ],
//             "Python": [
//                 {
//                     question: "Which Python framework do you prefer?",
//                     options: ["Django", "Flask"],
//                 },
//             ],
//         },
//     },
//     {
//         question: "What is your experience level?",
//         options: ["Beginner", "Intermediate", "Expert"],
//     },
//     {
//         question: "What is your name?", // Free-text question
//     },
// ];


askFollowupQuestionRecursively(questions).then((answers) => {
    console.log(answers)
})
