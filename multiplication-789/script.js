// 表内乘法（二）- 7、8、9 乘法口诀专用脚本

// 检查计算练习
function checkCalculationProblems() {
    const calcInputs = document.querySelectorAll('.calc-input');
    const feedback = document.getElementById('calc-feedback');
    let allCorrect = true;
    let correctCount = 0;
    
    calcInputs.forEach(input => {
        const correct = parseInt(input.getAttribute('data-answer'));
        const userAnswer = parseInt(input.value);
        
        if (userAnswer === correct) {
            input.classList.add('correct');
            input.classList.remove('incorrect');
            correctCount++;
        } else {
            input.classList.add('incorrect');
            input.classList.remove('correct');
            allCorrect = false;
        }
    });
    
    if (feedback) {
        if (allCorrect) {
            feedback.textContent = '🎉 太棒了！全部正确！';
            feedback.className = 'feedback success';
        } else {
            feedback.textContent = `答对了 ${correctCount}/${calcInputs.length} 题，再试一次吧！`;
            feedback.className = 'feedback error';
        }
    }
}

// 检查应用题
function checkWordProblems() {
    const wordInputs = document.querySelectorAll('.word-input');
    const feedback = document.getElementById('words-feedback');
    let allCorrect = true;
    let correctCount = 0;
    
    // 第 1 题：8 × 7 = 56
    // 第 2 题：9 × 6 = 54
    // 第 3 题：9 × 8 = 72
    const answers = [56, 54, 72];
    
    wordInputs.forEach((input, index) => {
        const correct = answers[index];
        const userAnswer = parseInt(input.value);
        
        if (userAnswer === correct) {
            input.classList.add('correct');
            input.classList.remove('incorrect');
            correctCount++;
        } else {
            input.classList.add('incorrect');
            input.classList.remove('correct');
            allCorrect = false;
        }
    });
    
    if (feedback) {
        if (allCorrect) {
            feedback.textContent = '🎉 太棒了！全部正确！';
            feedback.className = 'feedback success';
        } else {
            feedback.textContent = `答对了 ${correctCount}/${wordInputs.length} 题，再试一次吧！`;
            feedback.className = 'feedback error';
        }
    }
}

// 口诀练习初始化
function initKoujueQuiz() {
    const quizQuestions = document.querySelectorAll('.quiz-question');
    
    quizQuestions.forEach(question => {
        const options = question.querySelectorAll('.quiz-option');
        const feedback = question.querySelector('.quiz-feedback');
        
        options.forEach(option => {
            option.addEventListener('click', function() {
                // 重置选项状态
                options.forEach(opt => opt.classList.remove('correct', 'incorrect'));
                
                // 检查答案
                const isCorrect = this.getAttribute('data-answer') !== null;
                if (isCorrect) {
                    this.classList.add('correct');
                    feedback.textContent = '✓ 回答正确！';
                    feedback.className = 'quiz-feedback success';
                } else {
                    this.classList.add('incorrect');
                    feedback.textContent = '✗ 不对哦，再想想';
                    feedback.className = 'quiz-feedback error';
                }
            });
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 绑定检查答案按钮
    const btnCheckCalc = document.getElementById('btn-check-calc');
    if (btnCheckCalc) {
        btnCheckCalc.addEventListener('click', checkCalculationProblems);
    }
    
    const btnCheckWords = document.getElementById('btn-check-words');
    if (btnCheckWords) {
        btnCheckWords.addEventListener('click', checkWordProblems);
    }
    
    // 初始化口诀练习
    initKoujueQuiz();
    
    // 为口诀卡片添加点击效果
    const koujueRows = document.querySelectorAll('.koujue-row');
    koujueRows.forEach(row => {
        row.addEventListener('click', function() {
            this.style.background = '#E8F5E9';
            setTimeout(() => {
                this.style.background = '#FAFAFA';
            }, 300);
        });
    });
});
