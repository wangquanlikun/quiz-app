let questions = [];
let currentQuestionIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            const questionNumberInput = document.getElementById('question-input');
            questionNumberInput.placeholder += (": 1 ~ " + questions.length);

            const savedQuestionIndex = localStorage.getItem('currentQuestionIndex');
            if (savedQuestionIndex) {
                currentQuestionIndex = parseInt(savedQuestionIndex);
            }

            showQuestion(currentQuestionIndex);
        });
});

function showQuestion(index) {
    currentQuestionIndex = index;
    const question = questions[index];

    localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
    
    document.getElementById('question-number').innerText = `问题 ${index + 1}`;
    document.getElementById('question-container').innerText = question.question;
    if (question.answer_num != 1) {
        document.getElementById('question-number').innerText += " (多选题)";
        const confirmContainer = document.getElementById('confirm-container');
        confirmContainer.classList.remove('hidden');

        const confirmButton = document.getElementById('confirm-button');
        confirmButton.onclick = () => showAnswer(question.answer, question.explanation);
    }
    else {
        document.getElementById('question-number').innerText += " (单选题)";
        const confirmContainer = document.getElementById('confirm-container');
        confirmContainer.classList.add('hidden');
    }
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    question.options.forEach((option, idx) => {
        const button = document.createElement('button');
        button.innerText = `${optionLabels[idx]}: ${option}`;
        if (question.answer_num === 1) {
            button.onclick = () => showAnswer(question.answer, question.explanation);
        }
        else {
            button.onclick = () => {
                button.classList.toggle('clicked-answer-button');
            };
        }
        optionsContainer.appendChild(button);
    });
    
    document.getElementById('answer-container').classList.add('hidden');
    document.getElementById('explanation-container').classList.add('hidden');
}

function showAnswer(correct, explanation) {
    const answerContainer = document.getElementById('answer-container');
    const explanationContainer = document.getElementById('explanation-container');
    
    answerContainer.innerText = `正确答案: ${correct}`;
    explanationContainer.innerText = `答案解析: ${explanation}`;
    
    answerContainer.classList.remove('hidden');
    explanationContainer.classList.remove('hidden');
}

function showNextQuestion() {
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    showQuestion(currentQuestionIndex);
}

function showPrevQuestion() {
    currentQuestionIndex = (currentQuestionIndex - 1 + questions.length) % questions.length;
    showQuestion(currentQuestionIndex);
}

function goToQuestion() {
    const questionInput = document.getElementById('question-input').value;
    const questionNumber = parseInt(questionInput);
    
    if (questionNumber > 0 && questionNumber <= questions.length) {
        showQuestion(questionNumber - 1);
    }
}