/* ============= 全局状态 ============= */
const state = {
    currentSection: 0,
    maxSection: 5,
    currentSlide: 0, // 每个 section 内独立计数
    quizAnswered: 0,
    quizCorrect: 0,
    quizTotal: 4
};

/* ============= 工具函数 ============= */
function $(sel, ctx = document) { return ctx.querySelector(sel); }
function $$(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getCurrentSection() {
    return $(`.section[data-section="${state.currentSection}"]`);
}

/* ============= 章节导航 ============= */
function goToSection(idx) {
    if (idx < 0 || idx > state.maxSection) return;

    // 隐藏所有章节
    $$('.section').forEach(s => s.classList.remove('active'));

    // 显示目标章节
    const targetSection = $(`.section[data-section="${idx}"]`);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 更新进度点
    $$('.dot').forEach((d, i) => {
        d.classList.remove('active', 'completed');
        if (i === idx) d.classList.add('active');
        else if (i < idx) d.classList.add('completed');
    });

    // 更新顶部导航按钮
    $('#btnPrev').disabled = idx === 0;
    $('#btnNext').disabled = idx === state.maxSection;

    state.currentSection = idx;
    state.currentSlide = 0; // 进入新章节时重置幻灯片

    // 重置该章节的幻灯片到第一张
    resetSlides(idx);

    // 触发该章节的动画
    triggerSectionAnimations(idx);
}

/* ============= 幻灯片导航 ============= */
function resetSlides(sectionIdx) {
    const section = $(`.section[data-section="${sectionIdx}"]`);
    if (!section) return;

    const slides = section.querySelectorAll('.slide');
    slides.forEach((s, i) => {
        s.classList.remove('active', 'slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right');
        if (i === 0) s.classList.add('active');
    });

    updateSlideUI(section);
}

function goToSlide(slideIdx) {
    const section = getCurrentSection();
    if (!section) return;

    const slides = section.querySelectorAll('.slide');
    const totalSlides = slides.length;

    if (slideIdx < 0 || slideIdx >= totalSlides) return;
    if (slideIdx === state.currentSlide) return;

    const currentEl = slides[state.currentSlide];
    const nextEl = slides[slideIdx];
    const direction = slideIdx > state.currentSlide ? 'forward' : 'backward';

    // 当前幻灯片滑出
    currentEl.classList.remove('active');
    currentEl.classList.add(direction === 'forward' ? 'slide-out-left' : 'slide-out-right');

    // 新幻灯片从对应方向滑入
    setTimeout(() => {
        currentEl.classList.remove('slide-out-left', 'slide-out-right');

        // 设置新幻灯片初始位置（从右侧或左侧进入）
        nextEl.style.opacity = '0';
        nextEl.style.transform = direction === 'forward' ? 'translateX(60px)' : 'translateX(-60px)';
        nextEl.classList.add('active');

        // 强制重排后启动动画
        void nextEl.offsetWidth;
        nextEl.style.transition = 'opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        nextEl.style.opacity = '1';
        nextEl.style.transform = 'translateX(0)';

        setTimeout(() => {
            nextEl.style.transition = '';
            nextEl.style.opacity = '';
            nextEl.style.transform = '';
        }, 500);
    }, 100);

    state.currentSlide = slideIdx;
    updateSlideUI(section);

    // 触发该幻灯片的动画
    triggerSlideAnimation(state.currentSection, slideIdx);
}

function nextSlide() {
    const section = getCurrentSection();
    if (!section) return;
    const total = section.querySelectorAll('.slide').length;
    if (state.currentSlide < total - 1) {
        goToSlide(state.currentSlide + 1);
    }
}

function prevSlide() {
    if (state.currentSlide > 0) {
        goToSlide(state.currentSlide - 1);
    }
}

function updateSlideUI(section) {
    if (!section) return;
    const slides = section.querySelectorAll('.slide');
    const total = slides.length;
    const current = state.currentSlide + 1;

    // 更新计数器
    const counter = section.querySelector('.current-slide');
    const totalEl = section.querySelector('.total-slides');
    if (counter) counter.textContent = current;
    if (totalEl) totalEl.textContent = total;

    // 更新按钮状态
    const prevBtn = section.querySelector('.btn-slide-prev');
    const nextBtn = section.querySelector('.btn-slide-next');
    const nextSectionBtn = section.querySelector('.btn-next-section');

    if (prevBtn) prevBtn.disabled = state.currentSlide === 0;
    if (nextBtn) nextBtn.disabled = state.currentSlide === total - 1;

    // 最后一页才显示"下一节"按钮
    if (nextSectionBtn) {
        nextSectionBtn.style.display = (state.currentSlide === total - 1) ? 'block' : 'none';
    }
}

/* ============= 章节动画触发 ============= */
function triggerSectionAnimations(idx) {
    // 进入章节时，第一张幻灯片（slide 0）的动画会自动播放
    triggerSlideAnimation(idx, 0);
}

function triggerSlideAnimation(sectionIdx, slideIdx) {
    // 根据 (section, slide) 组合触发对应动画
    if (sectionIdx === 1 && slideIdx === 0) {
        setTimeout(runPencilCompare, 200);
    }
    if (sectionIdx === 2 && slideIdx === 2) {
        setTimeout(runMeterFill, 200);
    }
    if (sectionIdx === 3 && slideIdx === 1) {
        setTimeout(runDrawLine, 200);
    }
    if (sectionIdx === 3 && slideIdx === 2) {
        setTimeout(runMeasureLines, 200);
    }
    if (sectionIdx === 4) {
        initQuiz();
    }
}

/* ============= 第 1 节：铅笔对比 ============= */
function runPencilCompare() {
    const pencil1 = $('.section.active .pencil-1');
    const pencil2 = $('.section.active .pencil-2');
    if (!pencil1 || !pencil2) return;

    pencil1.classList.remove('slide-in');
    pencil2.classList.remove('slide-in');
    void pencil1.offsetWidth;
    pencil1.classList.add('slide-in');
    setTimeout(() => pencil2.classList.add('slide-in'), 400);
}

/* ============= 第 1 节：1cm 概念 ============= */
function runCmConcept() {
    // CSS 自动动画
}

/* ============= 第 1 节：量铅笔 ============= */
function runMeasurePencil() {
    const ruler = $('#measureRuler');
    const result = $('#measureResult');
    if (!ruler || !result) return;

    ruler.classList.remove('slide-in');
    result.classList.remove('show');
    void ruler.offsetWidth;
    ruler.classList.add('slide-in');
    setTimeout(() => result.classList.add('show'), 300);
}

/* ============= 第 2 节：1m 概念 ============= */
function runMeterConcept() {
    // CSS 自动动画
}

/* ============= 第 2 节：1m=100cm 填充 ============= */
async function runMeterFill() {
    const track = $('#fillTrack');
    const counter = $('#counterNum');
    const conclusion = $('#fillConclusion');
    if (!track || !counter || !conclusion) return;

    // 清空
    track.innerHTML = '';
    counter.textContent = '0';
    conclusion.classList.remove('show');

    // 生成 100 个小方块
    for (let i = 1; i <= 100; i++) {
        const cube = document.createElement('div');
        cube.className = 'fill-cube';
        cube.style.animationDelay = `${(i - 1) * 0.04}s`;
        track.appendChild(cube);

        if (i % 5 === 0 || i === 100) {
            counter.textContent = i;
            await sleep(20);
        }
    }

    await sleep(500);
    conclusion.classList.add('show');
    triggerConfetti();
}

/* ============= 第 3 节：画线段 ============= */
function runDrawLine() {
    const line = $('#drawLine');
    const pencil = $('#drawPencil');
    const result = $('#drawResult');
    if (!line || !pencil || !result) return;

    line.classList.remove('draw');
    pencil.classList.remove('show');
    result.classList.remove('show');
    void line.offsetWidth;
    line.classList.add('draw');
    pencil.classList.add('show');
    setTimeout(() => result.classList.add('show'), 2800);
}

/* ============= 第 3 节：量线段（点击交互） ============= */
function runMeasureLines() {
    const section = getCurrentSection();
    if (!section) return;
    const measureLines = section.querySelectorAll('.measure-line');

    measureLines.forEach(line => {
        const lengthEl = line.querySelector('.ml-length');
        if (!lengthEl) return;

        lengthEl.classList.remove('show');
        lengthEl.textContent = '';

        const newLine = line.cloneNode(true);
        line.parentNode.replaceChild(newLine, line);

        newLine.addEventListener('click', () => {
            const length = newLine.dataset.length;
            const newLengthEl = newLine.querySelector('.ml-length');
            if (newLengthEl) {
                newLengthEl.textContent = `${length} 厘米`;
                newLengthEl.classList.add('show');
                triggerMiniConfetti(newLine);
            }
        });
    });
}

/* ============= 第 4 节：互动练习 ============= */
const quizData = [
    { emoji: '✏️', title: '铅笔的长度', hint: '小手能拿住的小东西', answer: 'cm' },
    { emoji: '📘', title: '数学课本的宽', hint: '捧在手里看的书', answer: 'cm' },
    { emoji: '🚪', title: '教室门的高度', hint: '比宝宝高很多哦', answer: 'm' },
    { emoji: '🏃', title: '操场跑道一圈', hint: '要跑很久很久的路', answer: 'm' }
];

function initQuiz() {
    const quizList = $('#quizList');
    if (!quizList) return;

    state.quizAnswered = 0;
    state.quizCorrect = 0;

    $('#quizSummary').style.display = 'none';
    $('#btnGoSummary').style.display = 'none';
    quizList.innerHTML = '';

    quizData.forEach((q, idx) => {
        const item = document.createElement('div');
        item.className = 'quiz-item';
        item.innerHTML = `
            <div class="quiz-emoji">${q.emoji}</div>
            <div class="quiz-content">
                <div class="quiz-title">量一量：<strong>${q.title}</strong></div>
                <div class="quiz-hint">💭 ${q.hint}</div>
            </div>
            <div class="quiz-options">
                <button class="quiz-btn cm" data-answer="cm">厘米 (cm)</button>
                <button class="quiz-btn m" data-answer="m">米 (m)</button>
            </div>
        `;
        quizList.appendChild(item);

        const buttons = item.querySelectorAll('.quiz-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => handleQuizAnswer(item, btn, q));
        });
    });
}

function handleQuizAnswer(item, btn, question) {
    if (item.classList.contains('correct') || item.classList.contains('wrong')) return;

    const userAnswer = btn.dataset.answer;
    const isCorrect = userAnswer === question.answer;

    item.querySelectorAll('.quiz-btn').forEach(b => b.disabled = true);

    item.querySelectorAll('.quiz-btn').forEach(b => {
        if (b.dataset.answer === question.answer) {
            b.classList.add('right-answer');
        }
    });

    const feedback = document.createElement('div');
    feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;
    feedback.innerHTML = isCorrect
        ? '🎉 答对啦！真聪明！'
        : `😅 再想想～${question.emoji}${question.title}应该用 <strong>${question.answer === 'cm' ? '厘米' : '米'}</strong> 量哦`;
    item.appendChild(feedback);

    if (isCorrect) {
        item.classList.add('correct');
        state.quizCorrect++;
        triggerConfetti(item);
    } else {
        item.classList.add('wrong');
    }

    state.quizAnswered++;

    if (state.quizAnswered >= state.quizTotal) {
        setTimeout(showQuizSummary, 1200);
    }
}

function showQuizSummary() {
    const summary = $('#quizSummary');
    const correctCount = $('#correctCount');
    const goSummary = $('#btnGoSummary');

    if (correctCount) correctCount.textContent = state.quizCorrect;
    if (summary) summary.style.display = 'block';
    if (goSummary) goSummary.style.display = 'block';

    if (state.quizCorrect === state.quizTotal) {
        triggerConfetti(null, true);
    }

    summary.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ============= 撒花动画 ============= */
function triggerConfetti(targetEl, heavy = false) {
    const layer = $('#confettiLayer');
    if (!layer) return;

    const colors = ['#FFD93D', '#6BCB77', '#4D96FF', '#FF6B9D', '#9B72FE', '#FF9F45'];
    const count = heavy ? 80 : 30;

    let originX, originY;
    if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        originX = rect.left + rect.width / 2;
        originY = rect.top + rect.height / 2;
    } else {
        originX = window.innerWidth / 2;
        originY = window.innerHeight / 2;
    }

    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = (originX + (Math.random() - 0.5) * 200) + 'px';
        confetti.style.top = originY + 'px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
        confetti.style.animationDelay = (Math.random() * 0.5) + 's';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        if (Math.random() > 0.5) confetti.style.borderRadius = '50%';
        layer.appendChild(confetti);

        setTimeout(() => confetti.remove(), 4000);
    }
}

function triggerMiniConfetti(el) {
    triggerConfetti(el, false);
}

/* ============= 绑定事件 ============= */
function bindEvents() {
    // 顶部导航：上一节 / 下一节
    $('#btnPrev').addEventListener('click', () => goToSection(state.currentSection - 1));
    $('#btnNext').addEventListener('click', () => goToSection(state.currentSection + 1));

    // 进度点点击
    $$('.dot').forEach((dot, idx) => {
        dot.addEventListener('click', () => goToSection(idx));
    });

    // 开始按钮
    $('#btnStart').addEventListener('click', () => goToSection(1));

    // 幻灯片导航：上一页 / 下一页
    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-action="prev-slide"]')) {
            prevSlide();
        } else if (e.target.closest('[data-action="next-slide"]')) {
            nextSlide();
        }
    });

    // 下一节按钮
    $$('.btn-next-section').forEach(btn => {
        btn.addEventListener('click', () => {
            const next = parseInt(btn.dataset.next);
            if (!isNaN(next)) goToSection(next);
        });
    });

    // 重播按钮
    $$('.btn-replay').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            if (target === 'intro-cm') runPencilCompare();
            if (target === 'cm-measure') runMeasurePencil();
            if (target === 'meter-fill') runMeterFill();
            if (target === 'line-draw') runDrawLine();
            if (target === 'line-measure') runMeasureLines();
        });
    });

    // 重置练习
    const restartBtn = $('#btnRestart');
    if (restartBtn) restartBtn.addEventListener('click', () => initQuiz());

    // 回到顶部
    const backTopBtn = $('#btnBackTop');
    if (backTopBtn) backTopBtn.addEventListener('click', () => goToSection(0));

    // 键盘导航：左右箭头
    document.addEventListener('keydown', (e) => {
        // 忽略输入框中的按键
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // 封面、练习、小结页只支持节切换
        if ([0, 4, 5].includes(state.currentSection)) {
            if (e.key === 'ArrowLeft') goToSection(state.currentSection - 1);
            else if (e.key === 'ArrowRight') goToSection(state.currentSection + 1);
            return;
        }

        // 章节内有幻灯片：左右箭头切换幻灯片
        if (e.key === 'ArrowLeft') {
            if (state.currentSlide > 0) prevSlide();
            else goToSection(state.currentSection - 1);
        } else if (e.key === 'ArrowRight') {
            const section = getCurrentSection();
            const total = section.querySelectorAll('.slide').length;
            if (state.currentSlide < total - 1) nextSlide();
            else goToSection(state.currentSection + 1);
        }
    });
}

/* ============= 初始化 ============= */
function init() {
    bindEvents();
    goToSection(0);

    // 移动端触摸优化
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) e.preventDefault();
        lastTouchEnd = now;
    }, { passive: false });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
