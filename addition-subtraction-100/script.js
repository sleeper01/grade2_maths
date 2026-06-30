/* ============================================================
   100以内的加法和减法 - 互动脚本
   继承 Unit 1 PPT 翻页 + 新增加减法动画 + 互动答题
   ============================================================ */

/* ============= 全局状态 ============= */
const state = {
    currentSection: 0,
    maxSection: 6,
    currentSlide: 0,
    quizIndex: 0,
    quizStars: 0,
    quizLocked: false
};

/* ============= 测验题库 ============= */
const QUIZ_DATA = [
    {
        question: '23 + 5 = ?',
        options: ['26', '28', '27', '25'],
        answer: '28',
        explain: '23 + 5，先算 3 + 5 = 8，个位 8 没满 10 不进位！再算 20 + 8 = 28 ✅'
    },
    {
        question: '46 − 9 = ?',
        options: ['37', '38', '27', '36'],
        answer: '37',
        explain: '46 − 9，个位 6 减 9 不够，从十位借 1：16 − 9 = 7，十位 4 变 3，所以 37 ✅'
    },
    {
        question: '35 + 28 = ?',
        options: ['53', '63', '62', '73'],
        answer: '63',
        explain: '竖式：个位 5+8=13（写 3 进 1），十位 3+2+1=6，结果 63 ✅'
    },
    {
        question: '72 − 36 = ?',
        options: ['36', '46', '34', '26'],
        answer: '36',
        explain: '72 − 36，个位 2 减 6 不够，借 1：12 − 6 = 6，十位 6 − 3 = 3，结果 36 ✅'
    }
];

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

    $$('.section').forEach(s => s.classList.remove('active'));
    const targetSection = $(`.section[data-section="${idx}"]`);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    $$('.dot').forEach((d, i) => {
        d.classList.remove('active', 'completed');
        if (i === idx) d.classList.add('active');
        else if (i < idx) d.classList.add('completed');
    });

    state.currentSection = idx;
    state.currentSlide = 0;
    resetSlides(idx);

    triggerSectionAnimations(idx);
}

/* ============= 幻灯片导航 ============= */
function resetSlides(sectionIdx) {
    const section = $(`.section[data-section="${sectionIdx}"]`);
    if (!section) return;

    const slides = section.querySelectorAll('.slide');
    slides.forEach((s, i) => {
        s.classList.remove('active', 'slide-out-left', 'slide-out-right');
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

    currentEl.classList.remove('active');
    currentEl.classList.add(direction === 'forward' ? 'slide-out-left' : 'slide-out-right');

    setTimeout(() => {
        currentEl.classList.remove('slide-out-left', 'slide-out-right');

        nextEl.style.opacity = '0';
        nextEl.style.transform = direction === 'forward' ? 'translateX(60px)' : 'translateX(-60px)';
        nextEl.classList.add('active');

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
    triggerSlideAnimation(state.currentSection, slideIdx);
}

function nextSlide() {
    const section = getCurrentSection();
    if (!section) return;
    const total = section.querySelectorAll('.slide').length;
    if (state.currentSlide < total - 1) {
        goToSlide(state.currentSlide + 1);
    } else {
        // 已到末页，跳到下一节
        if (state.currentSection < state.maxSection) {
            goToSection(state.currentSection + 1);
        }
    }
}

function prevSlide() {
    if (state.currentSlide > 0) {
        goToSlide(state.currentSlide - 1);
    } else {
        // 已到首页，跳到上一节
        if (state.currentSection > 0) {
            const targetSection = state.currentSection - 1;
            goToSection(targetSection);
            // 进入上一节的最后一页
            setTimeout(() => {
                const sec = getCurrentSection();
                const total = sec.querySelectorAll('.slide').length;
                if (total > 0) goToSlide(total - 1);
            }, 100);
        }
    }
}

function updateSlideUI(section) {
    const slides = section.querySelectorAll('.slide');
    const total = slides.length;
    const prevBtn = section.querySelector('.btn-slide-prev');
    const nextBtn = section.querySelector('.btn-slide-next');
    const counter = section.querySelector('.slide-counter');

    if (prevBtn) prevBtn.disabled = state.currentSlide === 0;
    if (nextBtn) nextBtn.disabled = state.currentSlide === total - 1;
    if (counter) {
        counter.querySelector('.cur-slide').textContent = state.currentSlide + 1;
        counter.querySelector('.total-slides').textContent = total;
    }
}

/* ============= 触发章节动画 ============= */
function triggerSectionAnimations(sectionIdx) {
    if (sectionIdx === 6) {
        // 闯关练习
        setTimeout(() => initQuiz(), 300);
    }
    // 触发第一张 slide 的动画
    triggerSlideAnimation(sectionIdx, 0);
}

function triggerSlideAnimation(sectionIdx, slideIdx) {
    // 重置上一节动画状态
    resetAnimations(sectionIdx);

    // 根据 section 和 slide 触发对应动画
    setTimeout(() => {
        if (sectionIdx === 1 && slideIdx === 0) buildTensIntro();
        if (sectionIdx === 1 && slideIdx === 1) runTensAdd();
        if (sectionIdx === 1 && slideIdx === 2) runTensSub();
        if (sectionIdx === 3 && slideIdx === 0) runCarryAdd();
        if (sectionIdx === 3 && slideIdx === 2) runBorrowSub();
        if (sectionIdx === 6 && slideIdx === 1) triggerConfetti();
    }, 200);
}

function resetAnimations(sectionIdx) {
    // 重置 result-pop
    $$(`.section[data-section="${sectionIdx}"] .result-pop`).forEach(el => el.classList.remove('show'));
    // 重置 carry-digit / borrow-digit
    $$(`.section[data-section="${sectionIdx}"] .carry-digit, .section[data-section="${sectionIdx}"] .borrow-digit`).forEach(el => el.classList.remove('show'));
    // 重置 bundle 弹出动画
    $$(`.section[data-section="${sectionIdx}"] .bundle`).forEach(el => {
        el.classList.remove('bundle-pop');
        el.style.opacity = '';
    });
}

/* ============= Unit 2 特色动画 ============= */

/* 动态生成树苗圆点 */
function renderTreeDots(containerId, count, colorClass, labelText) {
    const box = document.getElementById(containerId);
    if (!box) return;
    box.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.className = 'tree-dot ' + colorClass;
        dot.style.animationDelay = (i * 0.025) + 's';
        box.appendChild(dot);
    }
    if (labelText) {
        const lbl = document.createElement('div');
        lbl.className = 'trees-label';
        lbl.textContent = labelText;
        box.appendChild(lbl);
    }
}

function buildTensIntro() {
    renderTreeDots('trees30', 30, 'dot-green',  '🌳 30 棵');
    renderTreeDots('trees20', 20, 'dot-orange', '🌳 20 棵');
    renderTreeDots('treesQ',  50, 'dot-purple', '🌳 ? 棵（30+20）');
}

/* 第1节 slide 1: 30+20=50，小捆弹出 */
async function runTensAdd() {
    const bundles30 = $$('#bundles30 .bundle');
    const bundles20 = $$('#bundles20 .bundle');
    const result = $$('#bundlesResult .bundle');

    // 30 的 3 捆依次弹出
    for (let i = 0; i < bundles30.length; i++) {
        bundles30[i].classList.add('bundle-pop');
        await sleep(280);
    }
    // 20 的 2 捆弹出
    for (let i = 0; i < bundles20.length; i++) {
        bundles20[i].classList.add('bundle-pop');
        await sleep(280);
    }
    // 等式出现
    await sleep(400);
    // 5 捆结果弹出
    for (let i = 0; i < result.length; i++) {
        result[i].classList.add('bundle-pop');
        await sleep(180);
    }
    await sleep(300);
    $('#resultTensAdd').classList.add('show');
}

/* 第1节 slide 2: 50-20=30，结果捆淡入 */
async function runTensSub() {
    const sub50 = $$('#subBundles50 .bundle');
    const sub20 = $$('#subBundles20 .bundle');

    for (let i = 0; i < sub50.length; i++) {
        sub50[i].classList.add('bundle-pop');
        await sleep(180);
    }
    await sleep(200);
    for (let i = 0; i < sub20.length; i++) {
        sub20[i].classList.add('bundle-pop');
        await sleep(180);
    }
    await sleep(500);
    $('#resultTensSub').classList.add('show');
}

/* 第3节 slide 0: 进位动画 */
async function runCarryAdd() {
    await sleep(500);
    // 8+5=13，进位 1 出现
    const carryDigit = $('.carry-ones');
    if (carryDigit) {
        carryDigit.classList.add('show');
        carryDigit.textContent = '1';
    }
    await sleep(800);
    $('#stageCarryAdd .result-pop').classList.add('show');
}

/* 第3节 slide 2: 退位动画 */
async function runBorrowSub() {
    await sleep(500);
    // 借 1 当 10
    const borrowDigit = $('.borrow-tens');
    if (borrowDigit) {
        borrowDigit.classList.add('show');
        borrowDigit.textContent = '';
    }
    await sleep(800);
    $('#stageBorrowSub .result-pop').classList.add('show');
}

/* ============= 互动答题 ============= */
function initQuiz() {
    state.quizIndex = 0;
    state.quizStars = 0;
    state.quizLocked = false;
    $('#quizStars').textContent = '⭐ 0';
    loadQuizQuestion();
}

function loadQuizQuestion() {
    const q = QUIZ_DATA[state.quizIndex];
    if (!q) return;
    $('#quizQuestion').textContent = q.question;
    $('#quizCur') && ($('#quizCur').textContent = state.quizIndex + 1);
    // 实际渲染：progress 中的数字
    $('.quiz-progress .quiz-cur').textContent = state.quizIndex + 1;
    $('.quiz-progress .quiz-total').textContent = QUIZ_DATA.length;

    const optionsBox = $('#quizOptions');
    optionsBox.innerHTML = '';
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opt';
        btn.textContent = opt;
        btn.dataset.answer = opt;
        btn.onclick = () => handleQuizAnswer(btn, opt, q);
        optionsBox.appendChild(btn);
    });

    $('#quizFeedback').textContent = '';
    $('#quizFeedback').className = 'quiz-feedback';
    state.quizLocked = false;
}

function handleQuizAnswer(btn, opt, q) {
    if (state.quizLocked) return;
    state.quizLocked = true;

    const allBtns = $$('#quizOptions .quiz-opt');
    allBtns.forEach(b => b.disabled = true);

    const feedback = $('#quizFeedback');

    if (opt === q.answer) {
        btn.classList.add('correct');
        feedback.textContent = '🎉 答对啦！';
        feedback.className = 'quiz-feedback good';
        state.quizStars++;
        $('#quizStars').textContent = '⭐ ' + state.quizStars;

        // 答对彩纸
        triggerConfettiLight($('#quizCard'));

        setTimeout(() => {
            state.quizIndex++;
            if (state.quizIndex < QUIZ_DATA.length) {
                loadQuizQuestion();
            } else {
                showQuizComplete();
            }
        }, 1600);
    } else {
        btn.classList.add('wrong');
        feedback.textContent = '😅 没关系，再想想！正确答案是 ' + q.answer;
        feedback.className = 'quiz-feedback bad';

        setTimeout(() => {
            allBtns.forEach(b => {
                b.disabled = false;
                b.classList.remove('wrong');
            });
            state.quizLocked = false;
            feedback.textContent = '';
            feedback.className = 'quiz-feedback';
        }, 2200);
    }
}

function showQuizComplete() {
    $('#quizQuestion').textContent = '🎊 你完成啦！';
    $('#quizOptions').innerHTML = '<div class="quiz-complete">得 ' + state.quizStars + ' / ' + QUIZ_DATA.length + ' 颗星，太棒了！</div>';
    $('#quizFeedback').textContent = '';
    triggerConfetti($('#quizCard'), true);
}

/* ============= 五彩纸屑 ============= */
function triggerConfetti(targetEl, heavy = false) {
    if (!targetEl) return;
    const rect = targetEl.getBoundingClientRect();
    const count = heavy ? 60 : 30;
    const colors = ['#FFD93D', '#6BCB77', '#4D96FF', '#FF6B9D', '#9B72FE', '#FFA94D'];

    for (let i = 0; i < count; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti';
        conf.style.left = (rect.left + Math.random() * rect.width) + 'px';
        conf.style.top = (rect.top + 20) + 'px';
        conf.style.background = colors[Math.floor(Math.random() * colors.length)];
        conf.style.animationDuration = (1.8 + Math.random() * 1.4) + 's';
        conf.style.animationDelay = (Math.random() * 0.4) + 's';
        conf.style.transform = `rotate(${Math.random() * 360}deg)`;
        if (Math.random() > 0.5) conf.style.borderRadius = '50%';
        document.body.appendChild(conf);
        setTimeout(() => conf.remove(), 3500);
    }
}

function triggerConfettiLight(targetEl) {
    triggerConfetti(targetEl, false);
}

/* ============= 事件绑定 ============= */
function bindEvents() {
    // 进度点点击
    $$('.dot').forEach(dot => {
        dot.onclick = () => {
            const idx = parseInt(dot.dataset.section);
            goToSection(idx);
        };
    });

    // 幻灯片导航按钮（事件委托）
    document.addEventListener('click', e => {
        const btn = e.target.closest('.btn-slide');
        if (!btn) return;
        const action = btn.dataset.action;
        if (action === 'next') nextSlide();
        else if (action === 'prev') prevSlide();
    });

    // 重播按钮
    document.addEventListener('click', e => {
        if (!e.target.classList.contains('btn-replay')) return;
        const target = e.target.dataset.target;
        triggerReplay(target);
    });

    // 开始按钮
    $('#btnStart').onclick = () => goToSection(1);

    // 键盘快捷键
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') {
            if (state.currentSection < state.maxSection) {
                const sec = getCurrentSection();
                const total = sec.querySelectorAll('.slide').length;
                if (state.currentSlide < total - 1) nextSlide();
                else goToSection(state.currentSection + 1);
            }
        } else if (e.key === 'ArrowLeft') {
            if (state.currentSection > 0) {
                if (state.currentSlide > 0) prevSlide();
                else goToSection(state.currentSection - 1);
            }
        }
    });
}

function triggerReplay(target) {
    if (target === 'tens-add') runTensAdd();
}

/* ============= 初始化 ============= */
document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    goToSection(0);
});
