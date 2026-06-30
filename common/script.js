// 通用脚本 - 所有单元共享

let currentSection = 0;
let currentSlide = 0;
const sections = document.querySelectorAll('.section');

/**
 * 更新导航按钮状态
 */
function updateNavButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicator = document.getElementById('slideIndicator');
    
    if (prevBtn) {
        prevBtn.disabled = currentSection === 0 && currentSlide === 0;
    }
    
    if (nextBtn) {
        const activeSection = sections[currentSection];
        const slides = activeSection.querySelectorAll('.slide');
        const isLastSlide = currentSlide === slides.length - 1;
        const isLastSection = currentSection === sections.length - 1;
        nextBtn.disabled = isLastSection && isLastSlide;
    }
    
    if (indicator) {
        let totalSlide = 0;
        for (let i = 0; i < currentSection; i++) {
            totalSlide += sections[i].querySelectorAll('.slide').length;
        }
        totalSlide += currentSlide + 1;
        indicator.textContent = `第 ${totalSlide} 页`;
    }
}

/**
 * 显示指定章节和幻灯片
 */
function showSlide(sectionIndex, slideIndex) {
    // 隐藏所有章节
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // 隐藏所有幻灯片
    document.querySelectorAll('.slide').forEach(slide => {
        slide.classList.remove('active');
    });
    
    // 显示目标章节和幻灯片
    if (sections[sectionIndex]) {
        sections[sectionIndex].classList.add('active');
        const slides = sections[sectionIndex].querySelectorAll('.slide');
        if (slides[slideIndex]) {
            slides[slideIndex].classList.add('active');
        }
    }
    
    currentSection = sectionIndex;
    currentSlide = slideIndex;
    updateNavButtons();
    
    // 触发自定义事件
    const event = new CustomEvent('slideChanged', {
        detail: { section: sectionIndex, slide: slideIndex }
    });
    document.dispatchEvent(event);
}

/**
 * 导航到上一页/下一页
 */
function goToSlide(direction) {
    const activeSection = sections[currentSection];
    const slides = activeSection.querySelectorAll('.slide');
    const totalSlides = slides.length;
    
    if (direction === 'next') {
        if (currentSlide < totalSlides - 1) {
            // 同一章节内的下一页
            currentSlide++;
        } else if (currentSection < sections.length - 1) {
            // 下一章节的第一页
            currentSection++;
            currentSlide = 0;
        }
    } else if (direction === 'prev') {
        if (currentSlide > 0) {
            // 同一章节内的上一页
            currentSlide--;
        } else if (currentSection > 0) {
            // 上一章节的最后一页
            currentSection--;
            const prevSlides = sections[currentSection].querySelectorAll('.slide');
            currentSlide = prevSlides.length - 1;
        }
    }
    
    showSlide(currentSection, currentSlide);
}

/**
 * 初始化导航
 */
function initNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => goToSlide('prev'));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => goToSlide('next'));
    }
    
    // 键盘导航
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            goToSlide('next');
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goToSlide('prev');
        }
    });
    
    // 初始状态
    updateNavButtons();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    
    // 显示第一张幻灯片
    showSlide(0, 0);
    
    // 添加返回首页按钮
    addHomeButton();
});

/**
 * 添加返回首页按钮
 */
function addHomeButton() {
    // 检查是否已存在
    if (document.querySelector('.home-btn')) return;
    
    const homeBtn = document.createElement('a');
    homeBtn.href = '../index.html';
    homeBtn.className = 'home-btn';
    homeBtn.innerHTML = '<span class="home-icon">🏠</span> 返回首页';
    homeBtn.title = '返回首页';
    document.body.appendChild(homeBtn);
}

// 导出函数供单元脚本使用
window.goToSlide = goToSlide;
window.showSlide = showSlide;
