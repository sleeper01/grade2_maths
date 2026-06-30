// 第 8 单元 数学广角 - 搭配问题 交互脚本

// 通用 Quiz 设置函数
function setupQuiz(quizId, feedbackId, correctAnswer, explanation) {
    const quizDiv = document.getElementById(quizId);
    if (!quizDiv) return;
    
    const buttons = quizDiv.querySelectorAll('.option-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            const answer = this.getAttribute('data-answer');
            const feedbackDiv = document.getElementById(feedbackId);
            
            // 重置所有按钮
            buttons.forEach(b => {
                b.classList.remove('correct', 'incorrect');
                b.disabled = true;
            });
            
            if (answer === correctAnswer) {
                this.classList.add('correct');
                feedbackDiv.innerHTML = '<span style="color: #4CAF50;">✅ 回答正确！</span>';
            } else {
                this.classList.add('incorrect');
                // 显示正确答案
                buttons.forEach(b => {
                    if (b.getAttribute('data-answer') === correctAnswer) {
                        b.classList.add('correct');
                    }
                });
                feedbackDiv.innerHTML = `<span style="color: #F44336;">❌ 不对哦</span><br><span style="color: #666; font-size: 0.9em;">${explanation}</span>`;
            }
        });
    });
}

// 食物搭配连线
document.getElementById('show-food-match')?.addEventListener('click', function() {
    const countDiv = document.getElementById('food-match-count');
    countDiv.innerHTML = '<span style="color: #F57C00; font-size: 1.5em;">🎉 3 × 2 = 6 种搭配</span>';
    
    // 添加动画效果
    const foodItems = document.querySelectorAll('.food-item');
    foodItems.forEach(item => {
        item.style.animation = 'popIn 0.5s ease-out';
    });
});

// 数字排列生成
document.getElementById('generate-numbers')?.addEventListener('click', function() {
    const resultDiv = document.querySelector('.result-numbers');
    const numbers = ['12', '13', '21', '23', '31', '32'];
    
    resultDiv.innerHTML = '';
    numbers.forEach((num, index) => {
        setTimeout(() => {
            const numEl = document.createElement('div');
            numEl.className = 'result-number';
            numEl.textContent = num;
            resultDiv.appendChild(numEl);
        }, index * 200);
    });
    
    setTimeout(() => {
        const summary = document.createElement('p');
        summary.style.cssText = 'margin-top: 20px; font-size: 1.2em; color: #666;';
        summary.innerHTML = '一共可以组成 <strong style="color: #F57C00; font-size: 1.3em;">6</strong> 个不同的两位数';
        resultDiv.appendChild(summary);
    }, numbers.length * 200 + 500);
});

// 握手问题
document.getElementById('show-handshake')?.addEventListener('click', function() {
    const svg = document.getElementById('handshake-svg');
    const countDiv = document.getElementById('handshake-count');
    
    // 清除旧线
    svg.querySelectorAll('line').forEach(line => line.remove());
    
    // 添加握手连线
    const lines = [
        { x1: 80, y1: 100, x2: 220, y2: 100 }, // 小明 - 小红
        { x1: 80, y1: 100, x2: 150, y2: 170 }, // 小明 - 小刚
        { x1: 220, y1: 100, x2: 150, y2: 170 }  // 小红 - 小刚
    ];
    
    lines.forEach((line, index) => {
        setTimeout(() => {
            const lineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            lineEl.setAttribute('x1', line.x1);
            lineEl.setAttribute('y1', line.y1);
            lineEl.setAttribute('x2', line.x2);
            lineEl.setAttribute('y2', line.y2);
            lineEl.setAttribute('stroke', '#F57C00');
            lineEl.setAttribute('stroke-width', '3');
            lineEl.setAttribute('stroke-dasharray', '5, 5');
            lineEl.classList.add('show');
            svg.appendChild(lineEl);
        }, index * 500);
    });
    
    setTimeout(() => {
        countDiv.innerHTML = '<span style="color: #F57C00; font-size: 1.5em;">🎉 2 + 1 = 3 次握手</span>';
    }, lines.length * 500 + 300);
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有 Quiz
    setupQuiz('quiz1', 'feedback1', 'C', '3 件上衣 × 2 条裤子 = 6 种搭配');
    setupQuiz('quiz2', 'feedback2', 'D', '5、7、9 可以组成：57、59、75、79、95、97，共 6 个');
    setupQuiz('quiz3', 'feedback3', 'D', '3 个人排队：3 × 2 × 1 = 6 种站法');
    setupQuiz('quiz4', 'feedback4', 'B', '从 A 到 C：2 × 3 = 6 种走法');
    
    // 衣服搭配互动
    document.querySelectorAll('.clothing-item').forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('selected');
        });
    });
});
