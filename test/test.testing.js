const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');
const readline = require('readline'); // Import readline for stubbing

// The code you want to test (questionnaire.js) - Assuming you have it in a separate file
const { askQuestions } = require('./questionnaire'); // Adjust path as needed


describe('askQuestions', () => {
    let rlStub;

    beforeEach(() => {
        // Stub readline interface for consistent testing
        rlStub = {
            question: sinon.stub(),
            close: sinon.stub(),
        };
        sinon.stub(readline, 'createInterface').returns(rlStub);
    });

    afterEach(() => {
        sinon.restore(); // Restore all stubs after each test
    });

    it('should ask open-ended questions and store answers', async () => {
        const questions = [{ question: 'What is your name?' }];
        rlStub.question.callsFake((_, callback) => callback('John Doe')); // Simulate user input

        const answers = await askQuestions(questions);
        expect(answers).to.deep.equal({ 'What is your name?': 'John Doe' });
    });

    it('should ask multiple-choice questions and store answers', async () => {
        const questions = [{ question: 'What is your favorite color?', options: ['Red', 'Blue'] }];
        rlStub.question.callsFake((_, callback) => callback('2')); // Simulate user input (choice 2)

        const answers = await askQuestions(questions);
        expect(answers).to.deep.equal({ 'What is your favorite color?': 'Blue' });
    });

    it('should handle follow-up questions', async () => {
        const questions = [
            {
                question: 'Do you like coding?',
                options: ['Yes', 'No'],
                follow_up: {
                    Yes: [{ question: 'What is your favorite language?' }],
                },
            },
        ];

        rlStub.question.callsFake((prompt, callback) => {
            if (prompt.includes("Do you like coding?")) {
                return callback("Yes");
            } else if (prompt.includes("What is your favorite language?")) {
                return callback("JavaScript");
            }
        });

        const answers = await askQuestions(questions);
        expect(answers).to.deep.equal({
            'Do you like coding?': 'Yes',
            'What is your favorite language?': 'JavaScript',
        });
    });

    it('should handle invalid input for multiple-choice questions', async () => {
        const questions = [{ question: 'What is your favorite color?', options: ['Red', 'Blue'] }];
        let callCount = 0;
        rlStub.question.callsFake((_, callback) => {
            if (callCount === 0) {
                callCount++;
                return callback('3'); // Invalid input
            } else if (callCount === 1) {
                return callback('1'); // Valid Input
            }
        });

        const answers = await askQuestions(questions);
        expect(answers).to.deep.equal({ 'What is your favorite color?': 'Red' });
    });

});



describe('processAnswers', () => {
    let consoleLogSpy;

    beforeEach(() => {
        consoleLogSpy = sinon.spy(console, 'log'); // Spy on console.log
    });

    afterEach(() => {
        consoleLogSpy.restore(); // Restore console.log
    });

    it('should print questions and answers to the console', () => {
        const questions = [
            { question: 'What is your name?' },
            { question: 'What is your favorite color?', options: ['Red', 'Blue'] },
        ];
        const answers = {
            'What is your name?': 'John Doe',
            'What is your favorite color?': 'Blue',
        };

        // Call the version of processAnswers that is exported by the module
        const { processAnswers } = require('./questionnaire');
        processAnswers(questions, answers);


        assert(consoleLogSpy.calledWith('Question: "What is your name?"'));
        assert(consoleLogSpy.calledWith('Answer: "John Doe"'));
        assert(consoleLogSpy.calledWith('Question: "What is your favorite color?"'));
        assert(consoleLogSpy.calledWith('Answer: "Blue"'));
    });

    it('should handle multiple-choice specific logic', () => {
        const questions = [{ question: 'What is your favorite color?', options: ['Red', 'Blue'] }];
        const answers = { 'What is your favorite color?': 'Blue' };

        const { processAnswers } = require('./questionnaire');
        processAnswers(questions, answers);

        assert(consoleLogSpy.calledWith('Blue is a popular choice!'));
    });

    it('should handle open-ended specific logic', () => {
        const questions = [{ question: 'What is your name?' }];
        const answers = { 'What is your name?': 'test' };

        const { processAnswers } = require('./questionnaire');
        processAnswers(questions, answers);

        assert(consoleLogSpy.calledWith('Hello, Test user!'));
    });

    it('should handle missing answers gracefully', () => {
        const questions = [{ question: 'What is your name?' }, { question: 'What is your age?' }];
        const answers = { 'What is your name?': 'John Doe' }; // Age is missing

        const { processAnswers } = require('./questionnaire');
        processAnswers(questions, answers);

        assert(consoleLogSpy.calledWith('Question: "What is your name?"'));
        assert(consoleLogSpy.calledWith('Answer: "John Doe"'));
        assert(!consoleLogSpy.calledWith('Question: "What is your age?"')); // Should not be called
    });


});