// 认识时间 - 专用脚本

// 设置整时钟表
function setWholeHour(hour) {
    const hourHand = document.getElementById('hour-hand');
    const minuteHand = document.getElementById('minute-hand');
    const currentTime = document.getElementById('current-time');
    
    if (!hourHand || !minuteHand) return;
    
    // 计算角度（每个数字 30 度）
    const hourAngle = (hour % 12) * 30;
    
    // 使用 SVG transform 属性旋转（围绕中心点 100,100）
    hourHand.setAttribute('transform', `rotate(${hourAngle}, 100, 100)`);
    minuteHand.setAttribute('transform', `rotate(0, 100, 100)`);
    
    // 更新时间显示
    if (currentTime) {
        currentTime.textContent = `${hour}:00`;
    }
    
    // 更新按钮状态
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.getAttribute('data-hour')) === hour) {
            btn.classList.add('active');
        }
    });
}

// 初始化整时按钮
function initWholeHourButtons() {
    const timeBtns = document.querySelectorAll('.time-btn');
    
    timeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const hour = parseInt(this.getAttribute('data-hour'));
            setWholeHour(hour);
        });
    });
}

// 显示答案按钮
function initShowAnswerButtons() {
    const showAnswerBtns = document.querySelectorAll('.show-answer');
    
    showAnswerBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.time-example-card');
            const answerTime = card.querySelector('.answer-time');
            
            if (answerTime.style.visibility === 'hidden' || answerTime.textContent === '') {
                answerTime.style.visibility = 'visible';
                answerTime.textContent = this.getAttribute('data-answer') || answerTime.textContent;
                this.textContent = '隐藏答案';
            } else {
                answerTime.style.visibility = 'hidden';
                answerTime.textContent = '';
                this.textContent = '显示答案';
            }
        });
    });
}

// 检查时间答案
function checkTimeAnswer() {
    // 测验钟表显示的是 3:00（时针指向 3，分针指向 12）
    const correctHour = 3;
    const correctMinute = 0;
    
    const hourInput = document.querySelector('.time-hour');
    const minuteInput = document.querySelector('.time-minute');
    const feedback = document.querySelector('.quiz-feedback');
    
    if (!hourInput || !minuteInput || !feedback) return;
    
    const userHour = parseInt(hourInput.value);
    const userMinute = parseInt(minuteInput.value);
    
    if (userHour === correctHour && userMinute === correctMinute) {
        feedback.textContent = '✓ 回答正确！';
        feedback.className = 'quiz-feedback success';
        hourInput.classList.add('correct');
        minuteInput.classList.add('correct');
    } else {
        feedback.textContent = '✗ 再想想，时针指向几？分针指向几？';
        feedback.className = 'quiz-feedback error';
        hourInput.classList.add('incorrect');
        minuteInput.classList.add('incorrect');
    }
}

// 时间格式配对练习
function initTimeMatch() {
    const matchItems = document.querySelectorAll('.match-item');
    let selectedChinese = null;
    let selectedDigital = null;
    
    matchItems.forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('matched')) return;
            
            // 清除之前的选择
            matchItems.forEach(i => i.classList.remove('selected'));
            
            this.classList.add('selected');
            
            if (this.classList.contains('chinese')) {
                selectedChinese = this;
            } else {
                selectedDigital = this;
            }
            
            // 检查是否都选择了
            if (selectedChinese && selectedDigital) {
                const chineseMatch = selectedChinese.getAttribute('data-match');
                const digitalMatch = selectedDigital.getAttribute('data-match');
                
                if (chineseMatch === digitalMatch) {
                    // 匹配正确
                    selectedChinese.classList.add('matched');
                    selectedDigital.classList.add('matched');
                    selectedChinese.classList.remove('selected');
                    selectedDigital.classList.remove('selected');
                    selectedChinese = null;
                    selectedDigital = null;
                } else {
                    // 匹配错误
                    setTimeout(() => {
                        if (selectedChinese) selectedChinese.classList.remove('selected');
                        if (selectedDigital) selectedDigital.classList.remove('selected');
                        selectedChinese = null;
                        selectedDigital = null;
                    }, 500);
                }
            }
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化整时按钮
    initWholeHourButtons();
    
    // 初始化显示答案按钮
    initShowAnswerButtons();
    
    // 绑定检查答案按钮
    const btnCheckTime = document.getElementById('btn-check-time');
    if (btnCheckTime) {
        btnCheckTime.addEventListener('click', checkTimeAnswer);
    }
    
    // 初始化时间配对练习
    initTimeMatch();
    
    // 设置初始时间（8:00）
    setTimeout(() => {
        setWholeHour(8);
    }, 500);
});
