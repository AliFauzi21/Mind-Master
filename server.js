const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const OpenAI = require('openai');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Game state
let gameState = {
  currentQuestion: null,
  gameActive: false,
  askedQuestions: [] // Simpan riwayat soal yang sudah pernah keluar (global)
};

// Language-specific prompts
const languagePrompts = {
    id: {
        questionPrompt: (topic) => `Buat satu soal quiz tentang "${topic}" dengan format berikut:
- Soal harus menarik dan menantang
- Berikan 4 pilihan jawaban (A, B, C, D)
- Hanya satu jawaban yang benar
- Berikan penjelasan detail mengapa jawaban tersebut benar
- Gunakan bahasa Indonesia yang baik dan benar

Format response:
SOAL: [pertanyaan]
A. [opsi A]
B. [opsi B]
C. [opsi C]
D. [opsi D]
JAWABAN: [huruf jawaban benar]
PENJELASAN: [penjelasan detail dalam bahasa Indonesia]`,

        motivationalPrompt: (score, correct, wrong) => `Buat pesan motivasi dalam bahasa Indonesia untuk pemain quiz yang:
- Skor akhir: ${score}
- Jawaban benar: ${correct}
- Jawaban salah: ${wrong}

Pesan harus:
- Memberikan semangat dan motivasi
- Mengakui usaha pemain
- Memberikan saran untuk perbaikan
- Menggunakan bahasa Indonesia yang sopan dan ramah
- Maksimal 2-3 kalimat

Format: [pesan motivasi saja, tanpa format tambahan]`
    },

    en: {
        questionPrompt: (topic) => `Create one quiz question about "${topic}" with the following format:
- Question should be interesting and challenging
- Provide 4 answer options (A, B, C, D)
- Only one answer should be correct
- Provide detailed explanation why that answer is correct
- Use clear and proper English

Response format:
QUESTION: [question]
A. [option A]
B. [option B]
C. [option C]
D. [option D]
ANSWER: [correct answer letter]
EXPLANATION: [detailed explanation in English]`,

        motivationalPrompt: (score, correct, wrong) => `Create a motivational message in English for a quiz player who has:
- Final score: ${score}
- Correct answers: ${correct}
- Wrong answers: ${wrong}

Message should:
- Provide encouragement and motivation
- Acknowledge the player's effort
- Give suggestions for improvement
- Use friendly and supportive English
- Maximum 2-3 sentences

Format: [motivational message only, no additional formatting]`
    },

    ja: {
        questionPrompt: (topic) => `"${topic}"についてのクイズ問題を1つ作成してください。以下の形式で：
- 問題は興味深く、挑戦的であること
- 4つの選択肢（A、B、C、D）を提供
- 正解は1つだけ
- その答えが正しい理由の詳細な説明を提供
- 適切な日本語を使用

回答形式：
問題：[問題文]
A. [選択肢A]
B. [選択肢B]
C. [選択肢C]
D. [選択肢D]
答え：[正解の文字]
説明：[日本語での詳細な説明]`,

        motivationalPrompt: (score, correct, wrong) => `以下のクイズプレイヤーへの励ましメッセージを日本語で作成してください：
- 最終スコア：${score}
- 正解数：${correct}
- 不正解数：${wrong}

メッセージは：
- 励ましとモチベーションを提供
- プレイヤーの努力を認める
- 改善のための提案を提供
- 親しみやすく、サポート的な日本語を使用
- 最大2-3文

形式：[励ましメッセージのみ、追加の形式なし]`
    },

    zh: {
        questionPrompt: (topic) => `创建一个关于"${topic}"的测验问题，格式如下：
- 问题应该有趣且具有挑战性
- 提供4个选项（A、B、C、D）
- 只有一个正确答案
- 提供详细解释为什么该答案正确
- 使用清晰正确的中文

回答格式：
问题：[问题]
A. [选项A]
B. [选项B]
C. [选项C]
D. [选项D]
答案：[正确答案字母]
解释：[用中文详细解释]`,

        motivationalPrompt: (score, correct, wrong) => `为测验玩家创建中文激励信息，该玩家：
- 最终得分：${score}
- 正确答案：${correct}
- 错误答案：${wrong}

信息应该：
- 提供鼓励和动力
- 认可玩家的努力
- 提供改进建议
- 使用友好支持的中文
- 最多2-3句话

格式：[仅激励信息，无额外格式]`
    }
};

// Default language
const defaultLanguage = 'id';

// Function to get OpenAI API key
function getOpenAIKey() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY tidak ditemukan di environment variables. Silakan buat file .env dengan OPENAI_API_KEY=your_api_key_here');
    }
    return apiKey;
}

// Function to call OpenAI API
async function callOpenAI(prompt, language = defaultLanguage) {
    try {
        const apiKey = getOpenAIKey();
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: language === 'id' ? 
                            'Anda adalah asisten AI yang ahli dalam membuat soal quiz yang menarik dan mendidik. Gunakan bahasa Indonesia yang baik dan benar.' :
                            language === 'en' ?
                            'You are an AI assistant expert in creating interesting and educational quiz questions. Use clear and proper English.' :
                            language === 'ja' ?
                            'あなたは興味深く教育的なクイズ問題を作成するAIアシスタントです。適切な日本語を使用してください。' :
                            '您是一位AI助手，专门创建有趣且具有教育意义的测验问题。请使用清晰正确的中文。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        throw error;
    }
}

// Function to parse quiz question from AI response
function parseQuizQuestion(aiResponse, language = defaultLanguage) {
    try {
        const lines = aiResponse.split('\n').filter(line => line.trim());
        
        let question = '';
        let options = [];
        let correctAnswer = 0;
        let explanation = '';
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Extract question
            if (line.startsWith('SOAL:') || line.startsWith('QUESTION:') || line.startsWith('問題：') || line.startsWith('问题：')) {
                question = line.split(':')[1]?.trim() || line.split('：')[1]?.trim() || '';
            }
            // Extract options
            else if (line.match(/^[A-D]\./)) {
                const optionText = line.substring(2).trim();
                options.push(optionText);
            }
            // Extract correct answer
            else if (line.startsWith('JAWABAN:') || line.startsWith('ANSWER:') || line.startsWith('答え：') || line.startsWith('答案：')) {
                const answer = line.split(':')[1]?.trim() || line.split('：')[1]?.trim() || '';
                correctAnswer = answer.toUpperCase().charCodeAt(0) - 65; // Convert A=0, B=1, etc.
            }
            // Extract explanation
            else if (line.startsWith('PENJELASAN:') || line.startsWith('EXPLANATION:') || line.startsWith('説明：') || line.startsWith('解释：')) {
                explanation = line.split(':')[1]?.trim() || line.split('：')[1]?.trim() || '';
            }
        }
        
        // If explanation is not found, try to get it from remaining lines
        if (!explanation) {
            const explanationStart = lines.findIndex(line => 
                line.includes('PENJELASAN') || line.includes('EXPLANATION') || line.includes('説明') || line.includes('解释')
            );
            if (explanationStart !== -1) {
                explanation = lines.slice(explanationStart + 1).join(' ').trim();
            }
        }
        
        // Validate parsed data
        if (!question || options.length !== 4 || correctAnswer < 0 || correctAnswer > 3) {
            throw new Error('Invalid question format from AI response');
        }
        
        return {
            question,
            options,
            correctAnswer,
            explanation: explanation || 'Penjelasan tidak tersedia'
        };
    } catch (error) {
        console.error('Error parsing quiz question:', error);
        // Return fallback question
        return {
            question: language === 'id' ? 'Terjadi kesalahan dalam memuat soal. Silakan coba lagi.' :
                     language === 'en' ? 'Error loading question. Please try again.' :
                     language === 'ja' ? '問題の読み込みエラー。もう一度お試しください。' :
                     '加载问题时出错。请重试。',
            options: ['A', 'B', 'C', 'D'],
            correctAnswer: 0,
            explanation: language === 'id' ? 'Silakan pilih jawaban yang menurut Anda benar.' :
                        language === 'en' ? 'Please select the answer you think is correct.' :
                        language === 'ja' ? '正しいと思う答えを選んでください。' :
                        '请选择您认为正确的答案。'
        };
    }
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/generate-question', async (req, res) => {
  try {
    const { topic } = req.body;
    const question = await generateQuizQuestion(topic);
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: 'Gagal generate soal' });
  }
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-game', (playerName) => {
    console.log('Player joined:', playerName);
    socket.emit('game-joined', { message: `Selamat datang, ${playerName}!` });
  });

  socket.on('request_question', async (data) => {
    try {
      const { topic, language = defaultLanguage } = data;
      let question = null;
      let aiResponse = '';
      let attempt = 0;
      const maxAttempts = 5;
      // Ambil 10 soal terakhir yang sudah pernah keluar
      const recentQuestions = gameState.askedQuestions.slice(-10).map(q => `- ${q.question}`).join('\n');
      // Tambahkan instruksi anti duplikat ke prompt
      const extraInstruction = recentQuestions.length > 0
        ? `\n\nSoal yang sudah pernah keluar pada sesi ini:\n${recentQuestions}\n\nJANGAN ulangi atau buat soal yang mirip dengan daftar di atas. Buat soal yang benar-benar baru dan berbeda!`
        : '\n\nBuat soal yang benar-benar baru dan belum pernah keluar pada sesi ini!';
      while (attempt < maxAttempts) {
        const basePrompt = languagePrompts[language]?.questionPrompt(topic) || languagePrompts[defaultLanguage].questionPrompt(topic);
        const prompt = basePrompt + extraInstruction;
        aiResponse = await callOpenAI(prompt, language);
        question = parseQuizQuestion(aiResponse, language);
        // Cek apakah soal sudah pernah keluar di sesi ini
        const isDuplicate = gameState.askedQuestions.some(q => q.question === question.question);
        if (!isDuplicate) break;
        attempt++;
      }
      // Tambahkan ke riwayat soal global
      gameState.askedQuestions.push({ question: question.question });
      gameState.currentQuestion = question;
      gameState.gameActive = true;
      io.emit('new-question', question);
    } catch (error) {
      console.error('Error generating question:', error);
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('submit-answer', async (answerIndex) => {
    // Tidak perlu logika player, cukup kirim jawaban benar/salah dan penjelasan
    const isCorrect = answerIndex === gameState.currentQuestion.correctAnswer;
    socket.emit('answer-result', {
      correct: isCorrect,
      correctAnswer: gameState.currentQuestion.correctAnswer,
      explanation: gameState.currentQuestion.explanation
    });
  });

  socket.on('request_motivational_message', async (data) => {
    console.log('Requesting motivational message:', data);
    try {
      const { score = 0, correctAnswers = 0, wrongAnswers = 0, language = defaultLanguage } = data;
      const prompt = languagePrompts[language]?.motivationalPrompt(score, correctAnswers, wrongAnswers) || 
                    languagePrompts[defaultLanguage].motivationalPrompt(score, correctAnswers, wrongAnswers);
      console.log('Generating motivational message with prompt:', prompt);
      const motivationalMessage = await callOpenAI(prompt, language);
      console.log('Motivational message generated:', motivationalMessage);
      socket.emit('motivational_message', { message: motivationalMessage });
    } catch (error) {
      console.error('Error generating motivational message:', error);
      const fallbackMessage = language === 'id' ? 'Terima kasih telah bermain! Tetap semangat dan terus belajar!' :
                             language === 'en' ? 'Thank you for playing! Keep up the spirit and continue learning!' :
                             language === 'ja' ? 'プレイしていただきありがとうございます！元気を出して、学習を続けてください！' :
                             '感谢您的参与！保持精神，继续学习！';
      socket.emit('motivational_message', { message: fallbackMessage });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Quiz AI Game Server berjalan di port ${PORT}`);
    console.log(`🌐 Buka browser dan kunjungi: http://localhost:${PORT}`);
    console.log(`🎮 Fitur Multi-Bahasa: Indonesia, English, 日本語, 中文`);
    console.log(`🤖 AI Powered dengan OpenAI GPT-3.5 Turbo`);
    console.log(`�� Pastikan file .env sudah dibuat dengan OPENAI_API_KEY`);
}); 