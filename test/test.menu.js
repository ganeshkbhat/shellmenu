const assert = require('chai').assert;
const sinon = require('sinon');
const { askQuestionsRecursively, askNestedQuestionsRecursively, processAnswersSingleLevel } = require('../index'); // Assuming your function is in ask_questions.js

// const questions = [
//     {
//         "question": "What is your name?",
//     },
//     {
//         "question": "What is your age?",
//     },
//     {
//         "question": "What is your favorite color?",
//         "options": ["Red", "Green", "Blue", "Yellow"],
//         "follow_up": {
//             "Blue": [
//                 { "question": "What shade of blue?", "options": ["Sky blue", "Navy blue", "Teal"] },
//             ],
//             "Red": [
//                 { "question": "Do you prefer bright or dark red?", "options": ["Bright", "Dark"] }
//             ]
//         }
//     },
//     {
//         "question": "Do you like coding?",
//         "options": ["Yes", "No"],
//         "follow_up": {
//             "Yes": [
//                 { "question": "What is your favorite programming language?", "options": ["Python", "Java", "JavaScript", "C++"] }
//             ],
//             "No": [
//                 { "question": "What do you like to do instead?", "options": ["Reading", "Sports", "Music"] }
//             ]
//         }
//     },
// ];


describe('askNestedQuestionsRecursively', () => {
    let readlineInterfaceStub;

    beforeEach(() => {
        readlineInterfaceStub = {
            question: sinon.stub(),
            close: sinon.stub(),
        };
        sinon.stub(require('readline'), 'createInterface').returns(readlineInterfaceStub);
    });

    afterEach(() => {
        sinon.restore(); // Restore all stubs after each test
    });

    it('should call the final function with the correct answers', async () => {
        const questions = ['Name?', 'Age?'];
        const finalFunction = sinon.spy();

        readlineInterfaceStub.question.onCall(0).callsFake((questions, callback) => {
            callback('John');
        });
        readlineInterfaceStub.question.onCall(1).callsFake((questions, callback) => {
            callback('30');
        });

        await askNestedQuestionsRecursively(questions, finalFunction);

        assert(finalFunction.calledOnce);
        assert.deepEqual(finalFunction.firstCall.args[0], { 'Name?': 'John', 'Age?': '30' });
    });

    it('should handle asynchronous user input correctly', async () => {
        const questions = ['Name?', 'Age?'];
        const finalFunction = sinon.spy();

        // Simulate asynchronous input (using Promises)
        readlineInterfaceStub.question.onCall(0).callsFake((questions, callback) => {
            setTimeout(() => callback('Alice'), 50); // Simulate delay
        });
        readlineInterfaceStub.question.onCall(1).callsFake((questions, callback) => {
            setTimeout(() => callback('25'), 50); // Simulate delay
        });

        await askNestedQuestionsRecursively(questions, finalFunction);

        assert(finalFunction.calledOnce);
        assert.deepEqual(finalFunction.firstCall.args[0], { 'Name?': 'Alice', 'Age?': '25' });
    });

    it('should handle an empty array of questions', async () => {
        const questions = [];
        const finalFunction = sinon.spy();

        await askNestedQuestionsRecursively(questions, finalFunction);

        assert(finalFunction.calledOnce);
        assert.deepEqual(finalFunction.firstCall.args[0], {}); // Empty answers object
    });

    it('should handle a single question', async () => {
        const questions = ['Favorite Color?'];
        const finalFunction = sinon.spy();

        readlineInterfaceStub.question.callsFake((questions, callback) => {
            callback('Blue');
        });

        await askNestedQuestionsRecursively(questions, finalFunction);

        assert(finalFunction.calledOnce);
        assert.deepEqual(finalFunction.firstCall.args[0], { 'Favorite Color?': 'Blue' });
    });


    it('should handle errors gracefully (e.g., readline error)', async () => {
        const questions = ['Name?'];
        const finalFunction = sinon.spy();

        const readlineStub = require('readline');
        // const createInterfaceStub = sinon.stub(readlineStub, 'createInterface');

        // createInterfaceStub.throws(new Error("Readline error")); // Simulate an error
        readlineInterfaceStub.throws(new Error("Readline error"));

        try {
            await askNestedQuestionsRecursively(questions, finalFunction);
            assert.fail("Should have thrown an error"); // Test should fail if no error is thrown
        } catch (error) {
            assert.equal(error.message, "Readline error");
        }

        assert(finalFunction.notCalled); // finalFunction should not be called if there's an error
    });
});


