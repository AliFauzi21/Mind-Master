// Game State
let gameState = {
    playerName: '',
    currentScore: 0,
    currentLives: 5,
    correctAnswers: 0,
    wrongAnswers: 0,
    currentQuestion: null,
    selectedAnswer: null,
    socket: null,
    joined: false
};

// DOM Elements
const screens = {
    loading: document.getElementById('loading-screen'),
    welcome: document.getElementById('welcome-screen'),
    topic: document.getElementById('topic-screen'),
    game: document.getElementById('game-screen'),
    gameOver: document.getElementById('game-over-screen'),
    results: document.getElementById('results-screen')
};

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    // Sembunyikan semua screen, tampilkan loading
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens.loading.classList.add('active');
    initializeGame();
    setupEventListeners();
});

function initializeGame() {
    // Simulate loading
    setTimeout(() => {
        // Pastikan hanya welcome yang aktif
        Object.values(screens).forEach(screen => screen.classList.remove('active'));
        screens.welcome.classList.add('active');
    }, 2000);
}

function setupEventListeners() {
    // Welcome screen
    document.getElementById('start-game-btn').addEventListener('click', startGame);
    document.getElementById('player-name').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            startGame();
        }
    });

    // Topic selection
    document.querySelectorAll('.topic-card').forEach(card => {
        card.addEventListener('click', function() {
            const topic = this.dataset.topic;
            selectTopic(topic);
        });
    });

    document.getElementById('custom-topic-btn').addEventListener('click', function() {
        const customTopic = document.getElementById('custom-topic').value.trim();
        if (customTopic) {
            selectTopic(customTopic);
        } else {
            alert('Silakan masukkan topik yang diinginkan!');
        }
    });

    // Game screen
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            if (!gameState.currentQuestion || gameState.selectedAnswer !== null) return;
            selectAnswer(parseInt(this.dataset.index));
        });
    });

    document.getElementById('new-question-btn').addEventListener('click', function() {
        if (gameState.socket && gameState.joined) {
            gameState.socket.emit('request-question', gameState.currentTopic);
        }
    });

    document.getElementById('back-to-topics-btn').addEventListener('click', function() {
        showScreen('topic');
    });

    document.getElementById('next-question-btn').addEventListener('click', function() {
        if (gameState.socket && gameState.joined) {
            gameState.socket.emit('request-question', gameState.currentTopic);
        }
    });

    // Game over screen
    document.getElementById('play-again-game-over-btn').addEventListener('click', function() {
        // Reset skor, nyawa, dsb, tapi JANGAN reset currentTopic
        gameState.currentScore = 0;
        gameState.currentLives = 5;
        gameState.correctAnswers = 0;
        gameState.wrongAnswers = 0;
        gameState.currentQuestion = null;
        gameState.selectedAnswer = null;

        // Reset UI
        document.getElementById('current-score').textContent = '0';
        document.getElementById('current-lives').textContent = '5';
        // Jangan reset player name dan custom topic

        // Disconnect socket jika ada
        if (gameState.socket) {
            gameState.socket.disconnect();
            gameState.socket = null;
        }
        // Mulai ulang game pada topik yang sama
        initializeSocket();
        showScreen('game');
        document.getElementById('player-name-display').textContent = gameState.playerName;
    });

    document.getElementById('new-game-game-over-btn').addEventListener('click', function() {
        resetGameExceptTopic();
        showScreen('topic');
    });

    // Results screen
    document.getElementById('play-again-btn').addEventListener('click', function() {
        resetGame();
        showScreen('topic');
    });

    document.getElementById('new-game-btn').addEventListener('click', function() {
        resetGame();
        showScreen('welcome');
    });
}

function startGame() {
    const playerName = document.getElementById('player-name').value.trim();
    if (!playerName) {
        alert('Silakan masukkan nama Anda!');
        return;
    }
    gameState.playerName = playerName;
    showScreen('topic');
}

function selectTopic(topic) {
    gameState.currentTopic = topic;
    initializeSocket();
    showScreen('game');
    // Update player name display
    document.getElementById('player-name-display').textContent = gameState.playerName;
    // Request first question DIPINDAH ke event 'game-joined'
}

function initializeSocket() {
    // Connect to Socket.IO server
    gameState.socket = io();

    gameState.socket.on('connect', () => {
        console.log('Connected to server');
        gameState.socket.emit('join-game', gameState.playerName);
    });

    gameState.socket.on('game-joined', (data) => {
        console.log('Joined game:', data.message);
        gameState.joined = true;
        // Request first question setelah join-game sukses
        if (gameState.currentTopic) {
            gameState.socket.emit('request-question', gameState.currentTopic);
        }
    });

    gameState.socket.on('new-question', (question) => {
        displayQuestion(question);
    });

    gameState.socket.on('answer-result', (result) => {
        handleAnswerResult(result);
    });

    gameState.socket.on('game-over', (data) => {
        handleGameOver(data);
    });

    gameState.socket.on('motivational_message', (msgData) => {
        console.log('Received motivational message:', msgData);
        document.getElementById('motivational-text').textContent = msgData.message;
    });

    gameState.socket.on('error', (error) => {
        console.error('Server error:', error);
        alert('Terjadi kesalahan: ' + error);
    });
}

function displayQuestion(question) {
    gameState.currentQuestion = question;
    gameState.selectedAnswer = null;

    // Update question text
    document.getElementById('question-text').textContent = question.question;

    // Update options
    question.options.forEach((option, index) => {
        const optionElement = document.getElementById(`option-${index}`);
        optionElement.textContent = option;
        
        // Reset option styling
        const optionContainer = optionElement.parentElement;
        optionContainer.className = 'option';
        optionContainer.dataset.index = index;
    });

    // Hide explanation
    document.getElementById('explanation-container').style.display = 'none';
}

function selectAnswer(answerIndex) {
    if (gameState.selectedAnswer !== null) return;

    gameState.selectedAnswer = answerIndex;

    // Update UI to show selected answer
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`[data-index="${answerIndex}"]`).classList.add('selected');

    // Submit answer to server
    if (gameState.socket) {
        gameState.socket.emit('submit-answer', answerIndex);
    }
}

function handleAnswerResult(result) {
    const options = document.querySelectorAll('.option');
    
    // Show correct and incorrect answers
    options.forEach((option, index) => {
        option.classList.remove('selected', 'correct', 'incorrect');
        
        if (index === result.correctAnswer) {
            option.classList.add('correct');
        } else if (index === gameState.selectedAnswer && !result.correct) {
            option.classList.add('incorrect');
        }
    });

    // Update game state
    if (result.correct) {
        gameState.currentScore += 10;
        gameState.correctAnswers += 1;
    } else {
        gameState.currentLives -= 1;
        gameState.wrongAnswers += 1;
    }

    // Update UI
    document.getElementById('current-score').textContent = gameState.currentScore;
    document.getElementById('current-lives').textContent = gameState.currentLives;

    // Show explanation
    const explanationContainer = document.getElementById('explanation-container');
    const explanationText = document.getElementById('explanation-text');
    
    explanationText.textContent = result.explanation;
    explanationContainer.style.display = 'block';

    // Add success/failure animation
    const questionContainer = document.querySelector('.question-container');
    questionContainer.style.animation = result.correct ? 'fadeInUp 0.5s ease' : 'shake 0.5s ease';
    
    setTimeout(() => {
        questionContainer.style.animation = '';
    }, 500);

    // Add particle effect for correct answers
    if (result.correct) {
        addParticleEffect();
    }

    // Add life lost effect for wrong answers
    if (!result.correct) {
        addLifeLostEffect();
    }

    // Check if game over
    if (gameState.currentLives <= 0) {
        setTimeout(() => {
            handleGameOver({
                finalScore: gameState.currentScore,
                correctAnswers: gameState.correctAnswers,
                wrongAnswers: gameState.wrongAnswers,
                motivationalMessage: '' // Nanti diisi dari server
            });
        }, 1000);
    }
}

function handleGameOver(data) {
    console.log('Game over triggered with data:', data);
    document.getElementById('game-over-score').textContent = data.finalScore;
    document.getElementById('game-over-correct').textContent = data.correctAnswers;
    document.getElementById('game-over-wrong').textContent = data.wrongAnswers;
    // Selalu request pesan motivasi baru dari server
    document.getElementById('motivational-text').textContent = 'Memuat pesan motivasi...';
    if (gameState.socket && gameState.joined !== false) {
        console.log('Requesting motivational message from server...');
        gameState.socket.emit('request_motivational_message', {
            score: data.finalScore,
            correctAnswers: data.correctAnswers,
            wrongAnswers: data.wrongAnswers,
            language: i18n && i18n.currentLanguage ? i18n.currentLanguage : 'id'
        });
    } else {
        console.log('Socket not available, using fallback message');
        document.getElementById('motivational-text').textContent = data.motivationalMessage || '';
    }
    showScreen('gameOver');
}

function showScreen(screenName) {
    // Sembunyikan semua screen
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    // Tampilkan hanya screen yang diinginkan
    if (screens[screenName]) {
        screens[screenName].classList.add('active');
    }
}

function resetGame() {
    gameState.currentScore = 0;
    gameState.currentLives = 5;
    gameState.correctAnswers = 0;
    gameState.wrongAnswers = 0;
    gameState.currentQuestion = null;
    gameState.selectedAnswer = null;
    gameState.currentTopic = null;

    // Reset UI
    document.getElementById('current-score').textContent = '0';
    document.getElementById('current-lives').textContent = '5';
    // Jangan reset player name di sini
    // document.getElementById('player-name').value = '';
    document.getElementById('custom-topic').value = '';

    // Disconnect socket if exists
    if (gameState.socket) {
        gameState.socket.disconnect();
        gameState.socket = null;
    }
}

function resetGameExceptTopic() {
    gameState.currentScore = 0;
    gameState.currentLives = 5;
    gameState.correctAnswers = 0;
    gameState.wrongAnswers = 0;
    gameState.currentQuestion = null;
    gameState.selectedAnswer = null;
    // TIDAK reset currentTopic

    // Reset UI
    document.getElementById('current-score').textContent = '0';
    document.getElementById('current-lives').textContent = '5';
    // Jangan reset player name di sini
    // document.getElementById('player-name').value = '';
    document.getElementById('custom-topic').value = '';

    // Disconnect socket if exists
    if (gameState.socket) {
        gameState.socket.disconnect();
        gameState.socket = null;
    }
}

function showResults() {
    const totalQuestions = gameState.correctAnswers + gameState.wrongAnswers;
    const accuracy = totalQuestions > 0 ? Math.round((gameState.correctAnswers / totalQuestions) * 100) : 0;

    document.getElementById('final-score').textContent = gameState.currentScore;
    document.getElementById('correct-answers').textContent = gameState.correctAnswers;
    document.getElementById('wrong-answers').textContent = gameState.wrongAnswers;
    document.getElementById('accuracy').textContent = accuracy + '%';

    showScreen('results');
}

// Add shake animation for wrong answers
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Auto-request new question after showing explanation
document.getElementById('next-question-btn').addEventListener('click', function() {
    if (gameState.socket && gameState.currentTopic && gameState.joined) {
        gameState.socket.emit('request-question', gameState.currentTopic);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (screens.game.classList.contains('active') && gameState.currentQuestion && gameState.selectedAnswer === null && gameState.joined) {
        const key = e.key.toLowerCase();
        const answerMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
        
        if (answerMap.hasOwnProperty(key)) {
            selectAnswer(answerMap[key]);
        }
    }
});

// Add some fun sound effects (optional)
function playSound(type) {
    // You can add sound effects here if desired
    // For now, we'll just add visual feedback
    console.log(`Playing ${type} sound`);
}

// Add particle effects for correct answers
function addParticleEffect() {
    const particles = document.createElement('div');
    particles.className = 'particles';
    particles.innerHTML = '🎉';
    particles.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3rem;
        pointer-events: none;
        z-index: 1000;
        animation: particleFloat 2s ease-out forwards;
    `;
    
    document.body.appendChild(particles);
    
    setTimeout(() => {
        particles.remove();
    }, 2000);
}

// Add life lost effect
function addLifeLostEffect() {
    const lifeLost = document.createElement('div');
    lifeLost.className = 'life-lost';
    lifeLost.innerHTML = '💔';
    lifeLost.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 4rem;
        pointer-events: none;
        z-index: 1000;
        animation: lifeLostFloat 1.5s ease-out forwards;
    `;
    
    document.body.appendChild(lifeLost);
    
    setTimeout(() => {
        lifeLost.remove();
    }, 1500);
}

// Add particle animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2) translateY(-100px);
        }
    }
    
    @keyframes lifeLostFloat {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.5) translateY(-50px);
        }
    }
`;
document.head.appendChild(particleStyle);

// Quiz AI Game - Main Script dengan Multi-Bahasa Support
class QuizGame {
    constructor() {
        this.socket = io();
        this.currentScreen = 'loading';
        this.playerName = '';
        this.currentTopic = '';
        this.currentQuestion = null;
        this.score = 0;
        this.lives = 5;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.selectedOption = null;
        this.isAnswerSubmitted = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupSocketListeners();
        this.startLoadingAnimation();
        
        // Initialize language system
        this.setupLanguageSelector();
    }
    
    setupLanguageSelector() {
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            languageSelector.addEventListener('change', (e) => {
                const selectedLanguage = e.target.value;
                i18n.setLanguage(selectedLanguage);
            });
        }
    }
    
    setupEventListeners() {
        // Welcome screen
        document.getElementById('start-game-btn').addEventListener('click', () => {
            this.startGame();
        });
        
        // Topic selection
        document.querySelectorAll('.topic-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectTopic(card.dataset.topic);
            });
        });
        
        document.getElementById('custom-topic-btn').addEventListener('click', () => {
            this.selectCustomTopic();
        });
        
        // Game screen
        document.getElementById('new-question-btn').addEventListener('click', () => {
            this.requestNewQuestion();
        });
        
        document.getElementById('back-to-topics-btn').addEventListener('click', () => {
            this.showTopicScreen();
        });
        
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectOption(option);
            });
        });
        
        document.getElementById('next-question-btn').addEventListener('click', () => {
            this.nextQuestion();
        });
        
        // Game over screen
        document.getElementById('play-again-game-over-btn').addEventListener('click', () => {
            this.playAgain();
        });
        
        document.getElementById('new-game-game-over-btn').addEventListener('click', () => {
            this.newGame();
        });
        
        // Results screen
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.playAgain();
        });
        
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.newGame();
        });
        
        // Enter key support
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (this.currentScreen === 'welcome') {
                    this.startGame();
                } else if (this.currentScreen === 'topic') {
                    this.selectCustomTopic();
                }
            }
        });
    }
    
    setupSocketListeners() {
        this.socket.on('question', (data) => {
            this.displayQuestion(data);
        });
        
        this.socket.on('motivational_message', (data) => {
            this.displayMotivationalMessage(data.message);
        });
        
        this.socket.on('error', (data) => {
            alert(i18n.getText('server_error') + data.message);
        });
    }
    
    startLoadingAnimation() {
        setTimeout(() => {
            this.showWelcomeScreen();
        }, 3000);
    }
    
    showWelcomeScreen() {
        this.hideAllScreens();
        document.getElementById('welcome-screen').classList.add('active');
        this.currentScreen = 'welcome';
        
        // Focus on player name input
        setTimeout(() => {
            document.getElementById('player-name').focus();
        }, 500);
    }
    
    startGame() {
        const playerNameInput = document.getElementById('player-name');
        this.playerName = playerNameInput.value.trim();
        
        if (!this.playerName) {
            alert(i18n.getText('enter_name'));
            return;
        }
        
        this.showTopicScreen();
    }
    
    showTopicScreen() {
        this.hideAllScreens();
        document.getElementById('topic-screen').classList.add('active');
        this.currentScreen = 'topic';
    }
    
    selectTopic(topic) {
        this.currentTopic = topic;
        this.startQuiz();
    }
    
    selectCustomTopic() {
        const customTopicInput = document.getElementById('custom-topic');
        const topic = customTopicInput.value.trim();
        
        if (!topic) {
            alert(i18n.getText('enter_topic'));
            return;
        }
        
        this.currentTopic = topic;
        this.startQuiz();
    }
    
    startQuiz() {
        this.resetGameState();
        this.showGameScreen();
        this.requestNewQuestion();
    }
    
    resetGameState() {
        this.score = 0;
        this.lives = 5;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.selectedOption = null;
        this.isAnswerSubmitted = false;
        this.updateGameStats();
    }
    
    showGameScreen() {
        this.hideAllScreens();
        document.getElementById('game-screen').classList.add('active');
        this.currentScreen = 'game';
        
        // Update player name display
        document.getElementById('player-name-display').textContent = this.playerName;
    }
    
    requestNewQuestion() {
        this.socket.emit('request_question', {
            topic: this.currentTopic,
            language: i18n.currentLanguage
        });
        
        // Show loading state
        document.getElementById('question-text').textContent = i18n.getText('loading_question');
        for (let i = 0; i < 4; i++) {
            document.getElementById(`option-${i}`).textContent = i18n.getText('loading_options');
        }
        
        // Reset option states
        this.resetOptionStates();
        this.hideExplanation();
    }
    
    displayQuestion(data) {
        this.currentQuestion = data;
        
        // Update question text
        document.getElementById('question-text').textContent = data.question;
        
        // Update options
        data.options.forEach((option, index) => {
            document.getElementById(`option-${index}`).textContent = option;
        });
        
        // Reset states
        this.selectedOption = null;
        this.isAnswerSubmitted = false;
        this.resetOptionStates();
        this.hideExplanation();
    }
    
    selectOption(optionElement) {
        if (this.isAnswerSubmitted) return;
        
        // Remove previous selection
        if (this.selectedOption) {
            this.selectedOption.classList.remove('selected');
        }
        
        // Select new option
        this.selectedOption = optionElement;
        optionElement.classList.add('selected');
        
        // Auto-submit after selection
        setTimeout(() => {
            this.submitAnswer();
        }, 500);
    }
    
    submitAnswer() {
        if (!this.selectedOption || this.isAnswerSubmitted) return;
        
        this.isAnswerSubmitted = true;
        const selectedIndex = parseInt(this.selectedOption.dataset.index);
        const correctIndex = this.currentQuestion.correctAnswer;
        
        // Show correct/incorrect states
        this.showAnswerResult(selectedIndex, correctIndex);
        
        // Update game state
        if (selectedIndex === correctIndex) {
            this.correctAnswers++;
            this.score += 10;
            this.addCorrectAnswerEffect();
        } else {
            this.wrongAnswers++;
            this.lives--;
            this.addLifeLostEffect();
        }
        
        this.updateGameStats();
        
        // Show explanation
        this.showExplanation();
        
        // Check if game over
        if (this.lives <= 0) {
            setTimeout(() => {
                this.gameOver();
            }, 3000);
        }
    }
    
    showAnswerResult(selectedIndex, correctIndex) {
        // Mark correct answer
        document.querySelector(`[data-index="${correctIndex}"]`).classList.add('correct');
        
        // Mark selected answer if wrong
        if (selectedIndex !== correctIndex) {
            document.querySelector(`[data-index="${selectedIndex}"]`).classList.add('incorrect');
        }
    }
    
    showExplanation() {
        const explanationContainer = document.getElementById('explanation-container');
        const explanationText = document.getElementById('explanation-text');
        
        explanationText.textContent = this.currentQuestion.explanation;
        explanationContainer.style.display = 'block';
        
        // Add animation
        explanationContainer.style.animation = 'fadeInUp 0.5s ease';
    }
    
    hideExplanation() {
        document.getElementById('explanation-container').style.display = 'none';
    }
    
    nextQuestion() {
        if (this.lives > 0) {
            this.requestNewQuestion();
        } else {
            this.gameOver();
        }
    }
    
    resetOptionStates() {
        document.querySelectorAll('.option').forEach(option => {
            option.classList.remove('selected', 'correct', 'incorrect');
        });
    }
    
    updateGameStats() {
        document.getElementById('current-score').textContent = this.score;
        document.getElementById('current-lives').textContent = this.lives;
    }
    
    gameOver() {
        this.hideAllScreens();
        document.getElementById('game-over-screen').classList.add('active');
        this.currentScreen = 'game-over';
        
        // Update final stats
        document.getElementById('game-over-score').textContent = this.score;
        document.getElementById('game-over-correct').textContent = this.correctAnswers;
        document.getElementById('game-over-wrong').textContent = this.wrongAnswers;
        
        // Request motivational message
        this.socket.emit('request_motivational_message', {
            score: this.score,
            correctAnswers: this.correctAnswers,
            wrongAnswers: this.wrongAnswers,
            language: i18n.currentLanguage
        });
    }
    
    displayMotivationalMessage(message) {
        document.getElementById('motivational-text').textContent = message;
    }
    
    playAgain() {
        this.startQuiz();
    }
    
    newGame() {
        this.showWelcomeScreen();
        document.getElementById('player-name').value = '';
        document.getElementById('custom-topic').value = '';
    }
    
    hideAllScreens() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
    }
    
    // Visual Effects
    addCorrectAnswerEffect() {
        // Add particle effect
        this.createParticles('#00ff88', 20);
        
        // Add score animation
        const scoreElement = document.getElementById('current-score');
        scoreElement.style.transform = 'scale(1.2)';
        scoreElement.style.color = '#00ff88';
        setTimeout(() => {
            scoreElement.style.transform = 'scale(1)';
            scoreElement.style.color = 'white';
        }, 500);
    }
    
    addLifeLostEffect() {
        // Add red particle effect
        this.createParticles('#ff6b6b', 15);
        
        // Add screen shake
        document.body.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    }
    
    createParticles(color, count) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.backgroundColor = color;
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            
            // Random position around center
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const angle = (Math.PI * 2 * i) / count;
            const distance = 100 + Math.random() * 100;
            
            particle.style.left = (centerX + Math.cos(angle) * distance) + 'px';
            particle.style.top = (centerY + Math.sin(angle) * distance) + 'px';
            
            document.body.appendChild(particle);
            
            // Animate particle
            const animation = particle.animate([
                {
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1
                },
                {
                    transform: `translate(${Math.cos(angle) * 200}px, ${Math.sin(angle) * 200}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 1000,
                easing: 'ease-out'
            });
            
            animation.onfinish = () => {
                particle.remove();
            };
        }
    }
}

// Add CSS animations
const style2 = document.createElement('style');
style2.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style2);

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuizGame();
}); 