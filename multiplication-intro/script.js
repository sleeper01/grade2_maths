// 表内乘法 - 专用脚本

// 看图列式练习检查
function checkPictureProblems() {
    const problemCards = document.querySelectorAll('.problem-card');
    const feedback = document.getElementById('problems-feedback');
    let allCorrect = true;
    let correctCount = 0;
    
    // 第 1 题：4 束花，每束 5 朵 = 4 × 5 = 20 或 5 × 4 = 20
    const problem1 = problemCards[0];
    const num1_1 = parseInt(problem1.querySelector('.problem-num1').value);
    const num2_1 = parseInt(problem1.querySelector('.problem-num2').value);
    const result1 = parseInt(problem1.querySelector('.problem-result').value);
    
    const inputs1 = problem1.querySelectorAll('input');
    if ((num1_1 === 4 && num2_1 === 5 && result1 === 20) || 
        (num1_1 === 5 && num2_1 === 4 && result1 === 20)) {
        inputs1.forEach(input => input.classList.add('correct'));
        correctCount++;
    } else {
        inputs1.forEach(input => input.classList.add('incorrect'));
        allCorrect = false;
    }
    
    // 第 2 题：5 串气球，每串 3 个 = 5 × 3 = 15 或 3 × 5 = 15
    const problem2 = problemCards[1];
    const num1_2 = parseInt(problem2.querySelector('.problem-num1').value);
    const num2_2 = parseInt(problem2.querySelector('.problem-num2').value);
    const result2 = parseInt(problem2.querySelector('.problem-result').value);
    
    const inputs2 = problem2.querySelectorAll('input');
    if ((num1_2 === 5 && num2_2 === 3 && result2 === 15) || 
        (num1_2 === 3 && num2_2 === 5 && result2 === 15)) {
        inputs2.forEach(input => input.classList.add('correct'));
        correctCount++;
    } else {
        inputs2.forEach(input => input.classList.add('incorrect'));
        allCorrect = false;
    }
    
    if (feedback) {
        if (allCorrect) {
            feedback.textContent = '🎉 太棒了！全部正确！';
            feedback.className = 'feedback success';
        } else {
            feedback.textContent = `答对了 ${correctCount}/${problemCards.length} 题，再试一次吧！`;
            feedback.className = 'feedback error';
        }
    }
}

// 计算练习检查
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

// 口诀练习初始化
function initKoujueQuiz() {
    const quizQuestions = document.querySelectorAll('.quiz-question');
    
    quizQuestions.forEach(question => {
        const options = question.querySelectorAll('.quiz-option');
        const feedback = question.querySelector('.quiz-feedback');
        
        options.forEach(option => {
            option.addEventListener('click', function() {
                const isCorrect = this.getAttribute('data-answer') !== '';
                
                // 重置选项状态
                options.forEach(opt => opt.classList.remove('correct', 'incorrect'));
                
                // 检查答案
                const correctAnswer = this.getAttribute('data-answer');
                if (correctAnswer) {
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
    const btnCheckProblems = document.getElementById('btn-check-problems');
    if (btnCheckProblems) {
        btnCheckProblems.addEventListener('click', checkPictureProblems);
    }
    
    const btnCheckCalc = document.getElementById('btn-check-calc');
    if (btnCheckCalc) {
        btnCheckCalc.addEventListener('click', checkCalculationProblems);
    }
    
    // 初始化口诀练习
    initKoujueQuiz();
    
    // 为乘法口诀卡片添加点击朗读效果
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
