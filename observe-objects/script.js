// 观察物体 - 专用脚本

// 数方块练习检查
function checkBlockCounts() {
    const blockInputs = document.querySelectorAll('.block-count-input');
    const feedback = document.getElementById('blocks-feedback');
    let allCorrect = true;
    let correctCount = 0;
    
    blockInputs.forEach(input => {
        const correct = parseInt(input.getAttribute('data-correct'));
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
            feedback.textContent = `答对了 ${correctCount}/${blockInputs.length} 题，再试一次吧！`;
            feedback.className = 'feedback error';
        }
    }
}

// 判断对错练习初始化
function initTrueFalseQuiz() {
    const tfBtns = document.querySelectorAll('.tf-btn');
    
    tfBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.closest('.tf-question');
            const feedback = parent.querySelector('.tf-feedback');
            const isCorrect = this.getAttribute('data-correct') === 'true';
            
            // 重置按钮状态
            parent.querySelectorAll('.tf-btn').forEach(b => {
                b.classList.remove('correct', 'incorrect');
            });
            
            // 显示答案
            if (isCorrect) {
                this.classList.add('correct');
                feedback.textContent = '✓ 回答正确！';
                feedback.className = 'tf-feedback success';
            } else {
                this.classList.add('incorrect');
                feedback.textContent = '✗ 不对哦，再想想';
                feedback.className = 'tf-feedback error';
            }
        });
    });
}

// 配对练习初始化（茶壶视图）
function initTeapotMatch() {
    const viewOptions = document.querySelectorAll('.view-option');
    
    viewOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 重置所有选项
            viewOptions.forEach(opt => opt.style.borderColor = 'transparent');
            
            // 高亮选中项
            this.style.borderColor = '#667eea';
        });
    });
}

// 配对练习初始化（小汽车视图）
function initCarMatch() {
    const matchViews = document.querySelectorAll('.match-view');
    
    matchViews.forEach(view => {
        view.addEventListener('click', function() {
            // 切换选中状态
            this.classList.toggle('selected');
        });
    });
}

// 配对练习初始化（圆柱体视图）
function initCylinderMatch() {
    const matchOptions = document.querySelectorAll('.match-option');
    
    matchOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 切换选中状态
            this.classList.toggle('selected');
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 绑定检查答案按钮
    const btnCheckBlocks = document.getElementById('btn-check-blocks');
    if (btnCheckBlocks) {
        btnCheckBlocks.addEventListener('click', checkBlockCounts);
    }
    
    // 初始化判断对错练习
    initTrueFalseQuiz();
    
    // 初始化配对练习
    initTeapotMatch();
    initCarMatch();
    initCylinderMatch();
    
    // 为观察者添加点击效果
    const observers = document.querySelectorAll('.observer');
    observers.forEach(observer => {
        observer.addEventListener('click', function() {
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
});
