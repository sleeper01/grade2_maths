// 角的初步认识 - 专用脚本

/**
 * 向量法绘制直角标记（通用方案）
 * @param {SVGElement} svg - SVG 容器
 * @param {number} vx, vy - 角的顶点坐标
 * @param {number} x1, y1 - 第一条边上的一点
 * @param {number} x2, y2 - 第二条边上的一点
 * @param {number} size - 标记大小（像素）
 * @returns {SVGPathElement} 直角标记路径元素
 */
function drawRightAngleMark(svg, vx, vy, x1, y1, x2, y2, size = 6) {
    // 计算从顶点到两个点的方向向量
    let dx1 = x1 - vx;
    let dy1 = y1 - vy;
    let dx2 = x2 - vx;
    let dy2 = y2 - vy;
    
    // 归一化方向向量
    let len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    let len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    
    if (len1 === 0 || len2 === 0) return null;
    
    dx1 /= len1;
    dy1 /= len1;
    dx2 /= len2;
    dy2 /= len2;
    
    // 沿每条边走 size 像素
    let px1 = vx + dx1 * size;
    let py1 = vy + dy1 * size;
    let px2 = vx + dx2 * size;
    let py2 = vy + dy2 * size;
    
    // 计算角点（向量加法）
    let cornerX = vx + (dx1 + dx2) * size;
    let cornerY = vy + (dy1 + dy2) * size;
    
    // 创建路径：点 1 → 角点 → 点 2
    const ns = "http://www.w3.org/2000/svg";
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", `M ${px1.toFixed(2)} ${py1.toFixed(2)} L ${cornerX.toFixed(2)} ${cornerY.toFixed(2)} L ${px2.toFixed(2)} ${py2.toFixed(2)}`);
    
    return path;
}

/**
 * 初始化所有直角标记
 * 从 DOM 的 data 属性读取坐标信息
 */
function initRightAngleMarks() {
    const marks = document.querySelectorAll('.right-angle-mark');
    
    marks.forEach(mark => {
        const vx = parseFloat(mark.getAttribute('data-vx'));
        const vy = parseFloat(mark.getAttribute('data-vy'));
        const x1 = parseFloat(mark.getAttribute('data-x1'));
        const y1 = parseFloat(mark.getAttribute('data-y1'));
        const x2 = parseFloat(mark.getAttribute('data-x2'));
        const y2 = parseFloat(mark.getAttribute('data-y2'));
        const size = parseFloat(mark.getAttribute('data-size')) || 6;
        
        // 清空现有内容
        mark.innerHTML = '';
        
        // 创建直角标记路径
        const path = drawRightAngleMark(mark, vx, vy, x1, y1, x2, y2, size);
        if (path) {
            mark.appendChild(path);
        }
    });
}

/**
 * 触发幻灯片动画
 * @param {number} sectionIndex - 章节索引
 * @param {number} slideIndex - 幻灯片索引
 */
function triggerSlideAnimation(sectionIndex, slideIndex) {
    // 在 Section 3（认识直角）的第 0 张幻灯片初始化直角标记
    if (sectionIndex === 3 && slideIndex === 0) {
        setTimeout(() => {
            initRightAngleMarks();
        }, 300);
    }
    
    // Section 3.1 直角符号
    if (sectionIndex === 3 && slideIndex === 1) {
        setTimeout(() => {
            initRightAngleMarks();
        }, 300);
    }
    
    // Section 3.2 三角板判断直角
    if (sectionIndex === 3 && slideIndex === 2) {
        setTimeout(() => {
            initRightAngleMarks();
        }, 300);
    }
    
    // Section 4.0 角大小比较
    if (sectionIndex === 4 && slideIndex === 0) {
        setTimeout(() => {
            initRightAngleMarks();
        }, 300);
    }
    
    // Section 4.1 角分类卡片
    if (sectionIndex === 4 && slideIndex === 1) {
        setTimeout(() => {
            initRightAngleMarks();
        }, 300);
    }
}

// 画角演示动画
let drawAnimationTimer = null;
let currentDrawStep = 0;

function startDrawAnimation() {
    const svg = document.getElementById('draw-demo-angle');
    const stepText = document.getElementById('draw-step-text');
    const btnStart = document.getElementById('btn-start-draw');
    const btnReset = document.getElementById('btn-reset-draw');
    
    if (!svg) return;
    
    // 清空 SVG
    svg.innerHTML = '';
    currentDrawStep = 0;
    
    btnStart.disabled = true;
    btnReset.disabled = false;
    
    // 步骤 1: 画顶点
    stepText.textContent = '步骤 1: 先画一个顶点';
    const vertex = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    vertex.setAttribute('cx', '150');
    vertex.setAttribute('cy', '150');
    vertex.setAttribute('r', '6');
    vertex.setAttribute('fill', '#F44336');
    vertex.classList.add('vertex-dot');
    svg.appendChild(vertex);
    
    // 步骤 2: 画第一条边（1.5 秒后）
    setTimeout(() => {
        if (currentDrawStep !== 0) return;
        stepText.textContent = '步骤 2: 从顶点画第一条边';
        const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line1.setAttribute('x1', '150');
        line1.setAttribute('y1', '150');
        line1.setAttribute('x2', '230');
        line1.setAttribute('y2', '150');
        line1.setAttribute('stroke', '#2196F3');
        line1.setAttribute('stroke-width', '4');
        line1.setAttribute('stroke-linecap', 'round');
        line1.classList.add('draw-line');
        svg.appendChild(line1);
        currentDrawStep = 1;
    }, 1500);
    
    // 步骤 3: 画第二条边（3 秒后）
    setTimeout(() => {
        if (currentDrawStep !== 1) return;
        stepText.textContent = '步骤 3: 从顶点画第二条边';
        const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line2.setAttribute('x1', '150');
        line2.setAttribute('y1', '150');
        line2.setAttribute('x2', '100');
        line2.setAttribute('y2', '80');
        line2.setAttribute('stroke', '#2196F3');
        line2.setAttribute('stroke-width', '4');
        line2.setAttribute('stroke-linecap', 'round');
        line2.classList.add('draw-line');
        svg.appendChild(line2);
        currentDrawStep = 2;
        
        // 画角标记
        setTimeout(() => {
            const angleMark = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            angleMark.setAttribute('d', 'M 150 150 L 158 150 A 8 8 0 0 0 155 143 Z');
            angleMark.setAttribute('fill', '#FF9800');
            angleMark.setAttribute('opacity', '0.6');
            svg.appendChild(angleMark);
            
            stepText.textContent = '完成！一个角画好了';
            btnStart.disabled = false;
        }, 1500);
    }, 3000);
}

function resetDrawAnimation() {
    const svg = document.getElementById('draw-demo-angle');
    const stepText = document.getElementById('draw-step-text');
    const btnStart = document.getElementById('btn-start-draw');
    const btnReset = document.getElementById('btn-reset-draw');
    
    if (svg) {
        svg.innerHTML = '';
    }
    if (stepText) {
        stepText.textContent = '点击"开始"按钮';
    }
    if (btnStart) {
        btnStart.disabled = false;
    }
    if (btnReset) {
        btnReset.disabled = true;
    }
    currentDrawStep = 0;
}

// 数角练习检查
function checkCountAnswers() {
    const inputs = document.querySelectorAll('.answer-input');
    const feedback = document.getElementById('quiz-feedback');
    let allCorrect = true;
    let correctCount = 0;
    
    inputs.forEach(input => {
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
            feedback.textContent = `答对了 ${correctCount}/${inputs.length} 题，再试一次吧！`;
            feedback.className = 'feedback error';
        }
    }
}

// 判断对错练习
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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 绑定画角按钮事件
    const btnStartDraw = document.getElementById('btn-start-draw');
    const btnResetDraw = document.getElementById('btn-reset-draw');
    
    if (btnStartDraw) {
        btnStartDraw.addEventListener('click', startDrawAnimation);
    }
    
    if (btnResetDraw) {
        btnResetDraw.addEventListener('click', resetDrawAnimation);
    }
    
    // 绑定检查答案按钮
    const btnCheckAnswers = document.getElementById('btn-check-answers');
    if (btnCheckAnswers) {
        btnCheckAnswers.addEventListener('click', checkCountAnswers);
    }
    
    // 初始化判断对错练习
    initTrueFalseQuiz();
    
    // 监听幻灯片切换事件（由通用脚本触发）
    document.addEventListener('slideChanged', function(e) {
        triggerSlideAnimation(e.detail.section, e.detail.slide);
    });
    
    // 初始加载 Section 3 时初始化直角标记
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
        const sectionIndex = parseInt(activeSection.getAttribute('data-section'));
        const activeSlide = activeSection.querySelector('.slide.active');
        const slideIndex = activeSlide ? parseInt(activeSlide.getAttribute('data-slide')) : 0;
        triggerSlideAnimation(sectionIndex, slideIndex);
    }
});

// 重写导航功能以支持直角标记初始化
const originalGoToSlide = window.goToSlide;
if (originalGoToSlide) {
    window.goToSlide = function(direction) {
        originalGoToSlide(direction);
        
        // 延迟触发直角标记初始化
        setTimeout(() => {
            const activeSection = document.querySelector('.section.active');
            if (activeSection) {
                const sectionIndex = parseInt(activeSection.getAttribute('data-section'));
                const activeSlide = activeSection.querySelector('.slide.active');
                const slideIndex = activeSlide ? parseInt(activeSlide.getAttribute('data-slide')) : 0;
                triggerSlideAnimation(sectionIndex, slideIndex);
            }
        }, 100);
    };
}
