// Internationalization (i18n) System for Quiz AI Game
class I18n {
    constructor() {
        this.currentLanguage = 'id'; // Default language
        this.translations = {
            id: {
                // Loading Screen
                loading_title: "Quiz AI Game",
                loading_subtitle: "Memuat AI Quiz Engine...",
                
                // Welcome Screen
                welcome_title: "Mind Master",
                welcome_subtitle: "Bermain dan Belajar dengan AI",
                player_name_label: "Masukkan Nama Anda:",
                player_name_placeholder: "Nama Pemain",
                start_game: "Mulai Permainan",
                
                // Features
                feature_ai_title: "AI Powered",
                feature_ai_desc: "Soal dibuat oleh AI OpenAI",
                feature_lives_title: "5 Nyawa",
                feature_lives_desc: "Jawab salah = kehilangan nyawa",
                feature_score_title: "Scoring System",
                feature_score_desc: "Dapatkan poin dan naik level",
                feature_explanation_title: "Penjelasan Detail",
                feature_explanation_desc: "Pelajari dari setiap jawaban",
                
                // Topic Selection
                topic_title: "Pilih Topik Quiz",
                topic_subtitle: "Pilih topik yang ingin Anda pelajari",
                custom_topic_title: "Atau pilih topik custom:",
                custom_topic_placeholder: "Masukkan topik yang diinginkan...",
                generate_question: "Generate Soal",
                
                // Topics
                topic_history: "Sejarah Indonesia",
                topic_history_desc: "Pelajari sejarah bangsa Indonesia",
                topic_science: "Sains & Teknologi",
                topic_science_desc: "Eksplorasi dunia sains modern",
                topic_geography: "Geografi Dunia",
                topic_geography_desc: "Jelajahi dunia dan benua",
                topic_math: "Matematika",
                topic_math_desc: "Latih kemampuan berhitung",
                topic_arts: "Seni & Budaya",
                topic_arts_desc: "Kenali seni dan budaya dunia",
                topic_sports: "Olahraga",
                topic_sports_desc: "Test pengetahuan olahraga",
                
                // Game Screen
                new_question: "Soal Baru",
                change_topic: "Ganti Topik",
                loading_question: "Memuat soal...",
                loading_options: "Memuat opsi...",
                explanation_title: "Penjelasan",
                next_question: "Soal Berikutnya",
                
                // Game Over Screen
                game_over_title: "Game Over!",
                game_over_subtitle: "Nyawa Anda telah habis",
                final_score: "Skor Akhir",
                correct_answers: "Jawaban Benar",
                wrong_answers: "Jawaban Salah",
                ai_message_title: "Pesan dari AI",
                loading_motivation: "Memuat pesan motivasi...",
                play_again: "Main Lagi",
                main_menu: "Menu Utama",
                
                // Results Screen
                results_title: "Hasil Permainan",
                final_score_label: "Skor Akhir Anda:",
                accuracy: "Akurasi",
                
                // Alerts
                enter_name: "Silakan masukkan nama Anda!",
                enter_topic: "Silakan masukkan topik yang diinginkan!",
                server_error: "Terjadi kesalahan: ",
                
                // Language Selector
                language: "Bahasa",
                select_language: "Pilih Bahasa"
            },
            
            en: {
                // Loading Screen
                loading_title: "Quiz AI Game",
                loading_subtitle: "Loading AI Quiz Engine...",
                
                // Welcome Screen
                welcome_title: "Mind Master",
                welcome_subtitle: "Play and Learn with AI",
                player_name_label: "Enter Your Name:",
                player_name_placeholder: "Player Name",
                start_game: "Start Game",
                
                // Features
                feature_ai_title: "AI Powered",
                feature_ai_desc: "Questions created by OpenAI AI",
                feature_lives_title: "5 Lives",
                feature_lives_desc: "Wrong answer = lose a life",
                feature_score_title: "Scoring System",
                feature_score_desc: "Earn points and level up",
                feature_explanation_title: "Detailed Explanations",
                feature_explanation_desc: "Learn from every answer",
                
                // Topic Selection
                topic_title: "Choose Quiz Topic",
                topic_subtitle: "Select a topic you want to learn",
                custom_topic_title: "Or choose custom topic:",
                custom_topic_placeholder: "Enter desired topic...",
                generate_question: "Generate Question",
                
                // Topics
                topic_history: "Indonesian History",
                topic_history_desc: "Learn Indonesian history",
                topic_science: "Science & Technology",
                topic_science_desc: "Explore modern science world",
                topic_geography: "World Geography",
                topic_geography_desc: "Explore world and continents",
                topic_math: "Mathematics",
                topic_math_desc: "Practice calculation skills",
                topic_arts: "Arts & Culture",
                topic_arts_desc: "Discover world arts and culture",
                topic_sports: "Sports",
                topic_sports_desc: "Test sports knowledge",
                
                // Game Screen
                new_question: "New Question",
                change_topic: "Change Topic",
                loading_question: "Loading question...",
                loading_options: "Loading options...",
                explanation_title: "Explanation",
                next_question: "Next Question",
                
                // Game Over Screen
                game_over_title: "Game Over!",
                game_over_subtitle: "You've run out of lives",
                final_score: "Final Score",
                correct_answers: "Correct Answers",
                wrong_answers: "Wrong Answers",
                ai_message_title: "Message from AI",
                loading_motivation: "Loading motivational message...",
                play_again: "Play Again",
                main_menu: "Main Menu",
                
                // Results Screen
                results_title: "Game Results",
                final_score_label: "Your Final Score:",
                accuracy: "Accuracy",
                
                // Alerts
                enter_name: "Please enter your name!",
                enter_topic: "Please enter desired topic!",
                server_error: "An error occurred: ",
                
                // Language Selector
                language: "Language",
                select_language: "Select Language"
            },
            
            ja: {
                // Loading Screen
                loading_title: "クイズAIゲーム",
                loading_subtitle: "AIクイズエンジンを読み込み中...",
                
                // Welcome Screen
                welcome_title: "Mind Master",
                welcome_subtitle: "AIと一緒に遊んで学ぼう",
                player_name_label: "お名前を入力してください:",
                player_name_placeholder: "プレイヤー名",
                start_game: "ゲーム開始",
                
                // Features
                feature_ai_title: "AI搭載",
                feature_ai_desc: "OpenAI AIが問題を作成",
                feature_lives_title: "5ライフ",
                feature_lives_desc: "間違えるとライフが減る",
                feature_score_title: "スコアシステム",
                feature_score_desc: "ポイントを獲得してレベルアップ",
                feature_explanation_title: "詳細説明",
                feature_explanation_desc: "各回答から学習",
                
                // Topic Selection
                topic_title: "クイズトピックを選択",
                topic_subtitle: "学習したいトピックを選択してください",
                custom_topic_title: "またはカスタムトピックを選択:",
                custom_topic_placeholder: "希望するトピックを入力...",
                generate_question: "問題生成",
                
                // Topics
                topic_history: "インドネシア歴史",
                topic_history_desc: "インドネシアの歴史を学ぶ",
                topic_science: "科学・技術",
                topic_science_desc: "現代科学の世界を探検",
                topic_geography: "世界地理",
                topic_geography_desc: "世界と大陸を探索",
                topic_math: "数学",
                topic_math_desc: "計算スキルを練習",
                topic_arts: "芸術・文化",
                topic_arts_desc: "世界の芸術と文化を発見",
                topic_sports: "スポーツ",
                topic_sports_desc: "スポーツ知識をテスト",
                
                // Game Screen
                new_question: "新しい問題",
                change_topic: "トピック変更",
                loading_question: "問題を読み込み中...",
                loading_options: "選択肢を読み込み中...",
                explanation_title: "説明",
                next_question: "次の問題",
                
                // Game Over Screen
                game_over_title: "ゲームオーバー！",
                game_over_subtitle: "ライフがなくなりました",
                final_score: "最終スコア",
                correct_answers: "正解数",
                wrong_answers: "不正解数",
                ai_message_title: "AIからのメッセージ",
                loading_motivation: "励ましメッセージを読み込み中...",
                play_again: "もう一度プレイ",
                main_menu: "メインメニュー",
                
                // Results Screen
                results_title: "ゲーム結果",
                final_score_label: "あなたの最終スコア:",
                accuracy: "正答率",
                
                // Alerts
                enter_name: "お名前を入力してください！",
                enter_topic: "希望するトピックを入力してください！",
                server_error: "エラーが発生しました: ",
                
                // Language Selector
                language: "言語",
                select_language: "言語を選択"
            },
            
            zh: {
                // Loading Screen
                loading_title: "问答AI游戏",
                loading_subtitle: "正在加载AI问答引擎...",
                
                // Welcome Screen
                welcome_title: "Mind Master",
                welcome_subtitle: "与AI一起游戏学习",
                player_name_label: "请输入您的姓名:",
                player_name_placeholder: "玩家姓名",
                start_game: "开始游戏",
                
                // Features
                feature_ai_title: "AI驱动",
                feature_ai_desc: "由OpenAI AI创建问题",
                feature_lives_title: "5条生命",
                feature_lives_desc: "答错会失去生命",
                feature_score_title: "计分系统",
                feature_score_desc: "获得积分并升级",
                feature_explanation_title: "详细解释",
                feature_explanation_desc: "从每个答案中学习",
                
                // Topic Selection
                topic_title: "选择问答主题",
                topic_subtitle: "选择您想学习的主题",
                custom_topic_title: "或选择自定义主题:",
                custom_topic_placeholder: "输入所需主题...",
                generate_question: "生成问题",
                
                // Topics
                topic_history: "印尼历史",
                topic_history_desc: "学习印尼历史",
                topic_science: "科学与技术",
                topic_science_desc: "探索现代科学世界",
                topic_geography: "世界地理",
                topic_geography_desc: "探索世界和大陆",
                topic_math: "数学",
                topic_math_desc: "练习计算技能",
                topic_arts: "艺术与文化",
                topic_arts_desc: "发现世界艺术和文化",
                topic_sports: "体育",
                topic_sports_desc: "测试体育知识",
                
                // Game Screen
                new_question: "新问题",
                change_topic: "更改主题",
                loading_question: "正在加载问题...",
                loading_options: "正在加载选项...",
                explanation_title: "解释",
                next_question: "下一题",
                
                // Game Over Screen
                game_over_title: "游戏结束！",
                game_over_subtitle: "您的生命值已用完",
                final_score: "最终得分",
                correct_answers: "正确答案",
                wrong_answers: "错误答案",
                ai_message_title: "AI消息",
                loading_motivation: "正在加载激励消息...",
                play_again: "再玩一次",
                main_menu: "主菜单",
                
                // Results Screen
                results_title: "游戏结果",
                final_score_label: "您的最终得分:",
                accuracy: "准确率",
                
                // Alerts
                enter_name: "请输入您的姓名！",
                enter_topic: "请输入所需主题！",
                server_error: "发生错误: ",
                
                // Language Selector
                language: "语言",
                select_language: "选择语言"
            }
        };
        
        this.init();
    }
    
    init() {
        // Load saved language preference
        const savedLanguage = localStorage.getItem('quiz_ai_language');
        if (savedLanguage && this.translations[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        }
        
        // Apply current language
        this.applyLanguage();
    }
    
    setLanguage(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            localStorage.setItem('quiz_ai_language', language);
            this.applyLanguage();
        }
    }
    
    getText(key) {
        const translation = this.translations[this.currentLanguage];
        return translation && translation[key] ? translation[key] : key;
    }
    
    applyLanguage() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const text = this.getText(key);
            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        });
        
        // Update language selector
        this.updateLanguageSelector();
    }
    
    updateLanguageSelector() {
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            languageSelector.value = this.currentLanguage;
        }
    }
    
    getAvailableLanguages() {
        return Object.keys(this.translations).map(code => ({
            code: code,
            name: this.getLanguageName(code)
        }));
    }
    
    getLanguageName(code) {
        const names = {
            'id': 'Bahasa Indonesia',
            'en': 'English',
            'ja': '日本語',
            'zh': '中文'
        };
        return names[code] || code;
    }
}

// Initialize i18n
const i18n = new I18n();

// Export for use in other files
window.i18n = i18n; 