const quizData = [
    {
        question: "What is the capital of France?",
        options: ["Paris", "Rome", "Madrid", "Berlin"],
        answer: "Paris"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        answer: "Mars"
    },
    {
        question: "Who wrote 'To Kill a Mockingbird'?",
        options: ["Harper Lee", "J.K. Rowling", "Stephen King", "Mark T Sullivan"],
        answer: "Harper Lee"
    },
    {
        question: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "O2", "H2SO4"],
        answer: "H2O"
    },
    {
        question: "What is the largest mammal?",
        options: ["Elephant", "BlueWhale", "Giraffe", "Hippo"],
        answer: "BlueWhale"
    }
];
let currentQuestionIndex = 0; 
const userAnswers = {};
let userName, userRollNo;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function displayQuestion(index) {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const currentQuestion = quizData[index];
  
    questionElement.innerHTML = `<p class="question fs-4">${currentQuestion.question}</p>`;
  
    let optionsHTML = "<div class=''>"; 
    currentQuestion.options.forEach((option, i) => {
      optionsHTML += `
        <div class="row justify-content-center align-items-center text-center">
          <label>
            <input type="radio" name="option" value="${i}" class="btn-check" autocomplete="off">
            <span class="btn btn-secondary btn-option common-size my-2 mx-2" style="background-color: grey;">${option}</span>
          </label>
        </div>`;
      if (i === 1) {
        optionsHTML += `</div><div class=''>`; 
      }
    });
    optionsHTML += `</div>`; 
    optionsElement.innerHTML = optionsHTML;
  
    document.querySelectorAll('.btn-option').forEach(button => {
      button.addEventListener('click', function() {
      
        document.querySelectorAll('.btn-option').forEach(option => {
          option.style.backgroundColor = 'grey';
        });
  
     
        this.style.backgroundColor = '#FAC344';
        this.disabled = true; 
      });
    });
  }
  
function startQuiz() {
    shuffleArray(quizData); 
    displayQuestion(0); 
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-option')) {
        const selectedOption = event.target.textContent;
        const currentQuestion = quizData[currentQuestionIndex].question;
        userAnswers[currentQuestion] = selectedOption;
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const userInfoModal = new bootstrap.Modal(document.getElementById('userInfoModal'), {
        backdrop: 'static', 
        keyboard: false 
    });
    const nextBtn = document.getElementById('nextBtn');
    const quizOptions = document.querySelectorAll('.btn-option');

    nextBtn.disabled = true;
    quizOptions.forEach(option => {
        option.disabled = true;
    });

    document.getElementById('userInfoForm').addEventListener('submit', function (event) {
        event.preventDefault();
        userName = document.getElementById('userName').value;
        userRollNo = document.getElementById('userRollNo').value;

        if (userName.trim() !== '' && userRollNo.trim() !== '') {
            localStorage.setItem('userName', userName);
            localStorage.setItem('userRollNo', userRollNo);
            userInfoModal.hide();
            nextBtn.disabled = false;
            quizOptions.forEach(option => {
                option.disabled = false;
            });
            startQuiz();
        } else {
            alert('Please enter your name and roll number.');
        }
    });

    userInfoModal.show();
});



const submitDataToGoogleSheets = async (name, rollNo, marks) => {
    const url = 'https://script.google.com/macros/s/AKfycbwIw5PZPsIpgdN3IRpciUVMH3dNwlZVjfin66eE78y3_NCBwjvbH2X05yrNzcXHH-S6OQ/exec'; // Replace with your deployed Google Apps Script URL

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `name=${encodeURIComponent(name)}&rollNo=${encodeURIComponent(rollNo)}&marks=${encodeURIComponent(marks)}`,
        });

        if (response.ok) {
            console.log('Data sent to Google Sheets successfully.');
        } else {
            console.error('Failed to send data to Google Sheets.');
        }
    } catch (error) {
        console.error('Error sending data:', error);
    }
};

function showResult() {
    let correctAnswers = 0;
    quizData.forEach(question => {
        if (question.answer === userAnswers[question.question]) {
            correctAnswers++;
        }
    });

    const totalQuestions = quizData.length;
    const marks = correctAnswers;

    swal({
        title: "Quiz Result",
        text: `Name: ${userName}\nRoll Number: ${userRollNo}\nTotal Marks: ${marks} out of ${totalQuestions}`,
        icon: "success",
        buttons: {
            confirm: {
                className: 'btn btn-warning',
                text: 'Back to Home',
            },
        },
        className: "custom-swal",
        closeOnClickOutside: false,
    }).then(() => {
        window.location.href = "index.html";
    });

    submitDataToGoogleSheets(userName, userRollNo, marks);
};

document.getElementById('nextBtn').addEventListener('click', function() {
    if (currentQuestionIndex === quizData.length - 1) {
        showResult();
    } else {
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
    }
});

window.onload = startQuiz;
