// ===== DARK MODE TOGGLE (localStorage) =====
const themeBtn = document.getElementById('themeBtn');

function applyTheme(isDark) {
  document.body.classList.toggle('dark', isDark);
  if (themeBtn) themeBtn.textContent = isDark ? '☀️ Light' : '🌙 Dark';
}

const savedTheme = localStorage.getItem('theme');
applyTheme(savedTheme === 'dark');

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark');
    applyTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// ===== ACTIVE NAV LINK =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
});


// ===== CONTACT FORM (General Enquiry) =====
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Check if all required fields are valid
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    // Show success message
    const alertBox = document.getElementById("formAlert");
    const name = document.getElementById("fullName").value;

    alertBox.style.display = "block";
    alertBox.className = "alert alert-success";
    alertBox.textContent =
      "Message sent successfully! Thank you, " + name + ".";

    // Clear the form
    contactForm.reset();
  });
}


// ===== VOLUNTEER FORM =====
const volunteerForm = document.getElementById("volunteerForm");

if (volunteerForm) {
  volunteerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Check form validity
    if (!volunteerForm.checkValidity()) {
      volunteerForm.reportValidity();
      return;
    }

    // Show success message
    const alertBox = document.getElementById("volunteerAlert");
    const name = document.getElementById("vName").value;

    alertBox.style.display = "block";
    alertBox.className = "alert alert-success";
    alertBox.textContent =
      "Thank you for applying, " + name + "! We will contact you soon.";

    // Clear the form
    volunteerForm.reset();
  });
}


// ===== FEEDBACK FORM =====
const feedbackForm = document.getElementById("feedbackForm");

if (feedbackForm) {
  feedbackForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Check if a rating is selected
    const rating = document.querySelector('input[name="rating"]:checked');
    const alertBox = document.getElementById("feedbackAlert");

    // If no rating is selected
    if (!rating) {
      alertBox.style.display = "block";
      alertBox.className = "alert alert-error";
      alertBox.textContent = "Please select a feedback rating.";
      return;
    }

    // Get name (optional)
    let name = document.getElementById("fbName").value.trim();

    if (name === "") {
      name = "Anonymous";
    }

    // Show success message
    alertBox.style.display = "block";
    alertBox.className = "alert alert-success";
    alertBox.textContent =
      "Thank you for your feedback, " + name + "!";

    // Clear the form
    feedbackForm.reset();
  });
}

// ===== MORSE CODE CONVERTER =====
const morseMap = {
  A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',
  I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',
  Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',
  Y:'-.--',Z:'--..',' ':'/'
};

const textInput = document.getElementById('textInput');
const outputEl  = document.getElementById('output');

if (textInput && outputEl) {
  textInput.addEventListener('input', function () {
    const text = this.value.toUpperCase();
    const result = [...text].map(ch => morseMap[ch] || '').filter(Boolean).join(' ');
    outputEl.textContent = result || 'Morse code will appear here...';
  });

}

// ===== QUIZ SYSTEM =====
const allQuestions = [
  { question: "What is the Morse code for S?",     options: ["...", "---", "-.-"],      answer: "..." },
  { question: "What is the Morse code for O?",     options: ["---", "...", ".-"],       answer: "---" },
  { question: "How many dots does Braille use?",   options: ["4", "6", "8"],            answer: "6" },
  { question: "Braille is primarily read by?",     options: ["Touch", "Sight", "Sound"], answer: "Touch" },
  { question: "Sign language is primarily?",        options: ["Visual", "Audio", "Text"], answer: "Visual" },
  { question: "Who invented Braille?",             options: ["Louis Braille", "Samuel Morse", "Alexander Bell"], answer: "Louis Braille" },
  { question: "Morse for SOS is?",                 options: ["...---...", ".-.-.-.","---...---"], answer: "...---..." },
];

function getRandomQuestions(arr, n) {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
}

const quizQuestions = getRandomQuestions(allQuestions, 3);
let currentQ = 0;
let score    = 0;

const quizForm     = document.getElementById('quizForm');
const questionArea = document.getElementById('questionArea');

function loadQuestion() {
  if (!questionArea) return;
  const q = quizQuestions[currentQ];

  // createElement + append (DOM manipulation requirement)
  questionArea.innerHTML = '';

  const heading = document.createElement('h3');
  heading.textContent = `${currentQ + 1}. ${q.question}`;
  questionArea.appendChild(heading);

  q.options.forEach(opt => {
    const label = document.createElement('label');
    label.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 14px;border:2px solid var(--border);border-radius:8px;margin-bottom:8px;cursor:pointer;transition:border-color 0.2s;';
    label.innerHTML = `<input type="radio" name="q" value="${opt}" style="width:16px;height:16px;"> ${opt}`;
    label.addEventListener('mouseover', () => label.style.borderColor = 'var(--primary)');
    label.addEventListener('mouseout',  () => { if (!label.querySelector('input').checked) label.style.borderColor = 'var(--border)'; });
    questionArea.appendChild(label);
  });

  const progressText = document.getElementById('progressText');
  const progressFill = document.getElementById('progressFill');
  if (progressText) progressText.textContent = `Question ${currentQ + 1} of ${quizQuestions.length}`;
  if (progressFill) {
    const pct = (currentQ / quizQuestions.length) * 100;
    progressFill.style.width = pct + '%';
    progressFill.parentElement?.setAttribute('aria-valuenow', pct);
  }
}

if (quizForm && questionArea) {
  loadQuestion();

  quizForm.addEventListener('submit', e => {
    e.preventDefault();
    const quizError = document.getElementById('quizError');
    const selected  = document.querySelector('input[name="q"]:checked');

    if (!selected) {
      if (quizError) quizError.classList.add('show');
      return;
    }
    if (quizError) quizError.classList.remove('show');

    if (selected.value === quizQuestions[currentQ].answer) score++;
    currentQ++;

    if (currentQ < quizQuestions.length) {
      loadQuestion();
    } else {
      const progressFill = document.getElementById('progressFill');
      if (progressFill) { progressFill.style.width = '100%'; progressFill.parentElement?.setAttribute('aria-valuenow', 100); }

      // innerHTML update (DOM manipulation)
      quizForm.innerHTML = `
        <h2 style="margin-bottom:12px;">🎉 Quiz Complete!</h2>
        <p style="font-size:1.1rem;margin-bottom:4px;">Your Score: <strong style="color:var(--primary);">${score} / ${quizQuestions.length}</strong></p>
        <p style="margin-bottom:20px;">${score === quizQuestions.length ? '🏆 Perfect score! Excellent work!' : score >= 2 ? '👍 Well done! Keep practising.' : '📚 Keep learning — you\'ll get there!'}</p>
        <div class="form-group">
          <label for="username">Enter your name for the certificate:</label>
          <input type="text" id="username" placeholder="Your full name" pattern="[A-Za-z\\s]{2,50}" required />
        </div>
        <button type="button" class="btn gradient" style="width:100%;" onclick="saveName()">Get Certificate →</button>
      `;
    }
  });
}

// ===== SAVE NAME AND OPEN CERTIFICATE =====
function saveName() {
  const nameInput = document.getElementById("username");

  // Check if name is entered
  if (!nameInput.value.trim()) {
    alert("Please enter your name.");
    return;
  }

  // Save name to localStorage
  localStorage.setItem("username", nameInput.value.trim());

  // Open certificate page
  window.location.href = "certificate.html";
}

// ===== CERTIFICATE PAGE =====
const certName = document.getElementById('certName');

if (certName) {
  const savedName = localStorage.getItem('username');
  certName.textContent = savedName || 'Your Name';
  }

function downloadPDF() {
  const element = document.querySelector('.certificate');
  if (!element) return;
  const opt = {
    margin: 0.5,
    filename: 'AccessComm_Certificate.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
  };
  html2pdf().set(opt).from(element).save();
}