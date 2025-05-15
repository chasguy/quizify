document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const nextButton = document.getElementById('next-btn');
    const prevButton = document.getElementById('prev-btn');
    const questionCounterElement = document.getElementById('question-counter');
    const progressBarElement = document.querySelector('.progress');
    const scoreElement = document.getElementById('score');
    const quizAppElement = document.querySelector('.quiz-app');
    const quizResultsElement = document.querySelector('.quiz-results');
    const finalScoreElement = document.getElementById('final-score');
    const totalQuestionsElement = document.getElementById('total-questions');
    const resultMessageElement = document.getElementById('result-message');
    const restartButton = document.getElementById('restart-btn');
    const quizCategoryElement = document.getElementById('quiz-category');
    const quizDifficultyElement = document.getElementById('quiz-difficulty');

    // Quiz state
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];
    let userAnswers = [];

    // Quiz categories and difficulties (can be expanded)
    const categories = {
        general: 'General Knowledge',
        science: 'Science',
        history: 'History',
        math: 'Mathematics'
    };

    const difficulties = {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard'
    };

    // Initialize the quiz
    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        scoreElement.textContent = score;
        loadQuestions();
    }

    // Load questions (in a real app, you might fetch these from an API)
    function loadQuestions() {
        // This is sample data - in a real app you would fetch from an API
        questions = [
            {
                question: "What is the capital of France?",
                answers: [
                    { text: "Berlin", correct: false },
                    { text: "Madrid", correct: false },
                    { text: "Paris", correct: true },
                    { text: "Rome", correct: false }
                ],
                category: "general",
                difficulty: "easy"
            },
            {
                question: "Which planet is known as the Red Planet?",
                answers: [
                    { text: "Venus", correct: false },
                    { text: "Mars", correct: true },
                    { text: "Jupiter", correct: false },
                    { text: "Saturn", correct: false }
                ],
                category: "science",
                difficulty: "easy"
            },
            {
                question: "What is 2 + 2?",
                answers: [
                    { text: "3", correct: false },
                    { text: "4", correct: true },
                    { text: "5", correct: false },
                    { text: "6", correct: false }
                ],
                category: "math",
                difficulty: "easy"
            },
            {
                question: "Who painted the Mona Lisa?",
                answers: [
                    { text: "Vincent van Gogh", correct: false },
                    { text: "Pablo Picasso", correct: false },
                    { text: "Leonardo da Vinci", correct: true },
                    { text: "Michelangelo", correct: false }
                ],
                category: "history",
                difficulty: "medium"
            },
            {
                question: "What is the largest mammal?",
                answers: [
                    { text: "Elephant", correct: false },
                    { text: "Blue Whale", correct: true },
                    { text: "Giraffe", correct: false },
                    { text: "Polar Bear", correct: false }
                ],
                category: "science",
                difficulty: "medium"
            }
        ];

        showQuestion();
    }

    // Display the current question
    function showQuestion() {
        resetState();
        const currentQuestion = questions[currentQuestionIndex];
        const questionNo = currentQuestionIndex + 1;
        
        // Update question counter and progress bar
        questionCounterElement.textContent = `Question ${questionNo} of ${questions.length}`;
        progressBarElement.style.width = `${(questionNo / questions.length) * 100}%`;
        
        // Update category and difficulty
        quizCategoryElement.textContent = categories[currentQuestion.category] || 'General';
        quizDifficultyElement.textContent = difficulties[currentQuestion.difficulty] || 'Medium';
        
        // Set the question text
        questionElement.textContent = currentQuestion.question;
        
        // Create answer buttons
        currentQuestion.answers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer.text;
            button.classList.add('btn');
            if (userAnswers[currentQuestionIndex] !== undefined) {
                if (answer.correct) {
                    button.classList.add('correct');
                } else if (userAnswers[currentQuestionIndex] === answer.text && !answer.correct) {
                    button.classList.add('incorrect');
                }
                button.disabled = true;
            }
            button.addEventListener('click', () => selectAnswer(answer));
            answerButtonsElement.appendChild(button);
        });
        
        // Update navigation buttons
        prevButton.disabled = currentQuestionIndex === 0;
        nextButton.textContent = currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next';
        
        // If we've already answered this question, show the correct answer
        if (userAnswers[currentQuestionIndex] !== undefined) {
            const correctAnswer = currentQuestion.answers.find(answer => answer.correct);
            const buttons = answerButtonsElement.querySelectorAll('.btn');
            buttons.forEach(button => {
                if (button.textContent === correctAnswer.text && !button.classList.contains('correct')) {
                    button.classList.add('correct');
                }
                button.disabled = true;
            });
        }
    }

    // Reset the quiz state before showing a new question
    function resetState() {
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
    }

    // Handle answer selection
    function selectAnswer(answer) {
        const currentQuestion = questions[currentQuestionIndex];
        const correct = answer.correct;
        
        // Store the user's answer
        userAnswers[currentQuestionIndex] = answer.text;
        
        // Highlight selected answer
        const buttons = answerButtonsElement.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.disabled = true;
            if (button.textContent === answer.text) {
                button.classList.add(correct ? 'correct' : 'incorrect');
            }
        });
        
        // If correct, increment score
        if (correct) {
            score++;
            scoreElement.textContent = score;
        }
        
        // Highlight correct answer if user was wrong
        if (!correct) {
            const correctAnswer = currentQuestion.answers.find(a => a.correct);
            buttons.forEach(button => {
                if (button.textContent === correctAnswer.text) {
                    button.classList.add('correct');
                }
            });
        }
    }

    // Show the final results
    function showResults() {
        quizAppElement.classList.add('hidden');
        quizResultsElement.classList.remove('hidden');
        
        finalScoreElement.textContent = score;
        totalQuestionsElement.textContent = questions.length;
        
        // Calculate percentage
        const percentage = (score / questions.length) * 100;
        
        // Set result message based on performance
        if (percentage >= 80) {
            resultMessageElement.textContent = 'Excellent work! You really know your stuff.';
        } else if (percentage >= 60) {
            resultMessageElement.textContent = 'Good job! You have a solid understanding.';
        } else if (percentage >= 40) {
            resultMessageElement.textContent = 'Not bad! Keep practicing to improve.';
        } else {
            resultMessageElement.textContent = 'Keep studying! You\'ll do better next time.';
        }
    }

    // Event listeners
    nextButton.addEventListener('click', () => {
        if (userAnswers[currentQuestionIndex] === undefined) {
            alert('Please select an answer before proceeding.');
            return;
        }
        
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            showResults();
        }
    });
    
    prevButton.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion();
        }
    });
    
    restartButton.addEventListener('click', () => {
        quizResultsElement.classList.add('hidden');
        quizAppElement.classList.remove('hidden');
        startQuiz();
    });

    // Start the quiz when the page loads
    startQuiz();
});