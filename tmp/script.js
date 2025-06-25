// 打字机效果实现
class Typewriter {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.speed = options.speed || 100;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.pauseTime = options.pauseTime || 2000;
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
    }

    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isPaused) {
            setTimeout(() => {
                this.isPaused = false;
                this.type();
            }, this.pauseTime);
            return;
        }

        if (this.isDeleting) {
            // 删除字符
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;

            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            }
        } else {
            // 添加字符
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;

            if (this.currentCharIndex === currentText.length) {
                this.isDeleting = true;
                this.isPaused = true;
            }
        }

        const speed = this.isDeleting ? this.deleteSpeed : this.speed;
        setTimeout(() => this.type(), speed);
    }

    start() {
        this.type();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化打字机效果
    const typewriterElement = document.getElementById('typewriter');
    const texts = [
        '创造无限可能的AI动漫世界',
        '让想象力成为现实',
        '开启你的创作之旅',
        '体验未来的艺术创作'
    ];
    
    const typewriter = new Typewriter(typewriterElement, texts, {
        speed: 120,
        deleteSpeed: 60,
        pauseTime: 2500
    });
    
    typewriter.start();

    // 平滑滚动效果
    function smoothScroll(target, duration = 1000) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;

        const targetPosition = targetElement.offsetTop - 80; // 考虑固定导航栏高度
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // 添加按钮点击事件
    const primaryBtn = document.querySelector('.btn-primary');
    const secondaryBtn = document.querySelector('.btn-secondary');

    if (primaryBtn) {
        primaryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // 这里可以添加跳转到创作页面的逻辑
            showNotification('开始创作功能即将上线！', 'info');
        });
    }

    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // 滚动到功能介绍区域
            smoothScroll('.features-section');
        });
    }

    // 用户登录区域点击事件
    const userSection = document.querySelector('.user-section');
    if (userSection) {
        userSection.addEventListener('click', function() {
            showNotification('登录功能即将上线！', 'info');
        });
    }

    // 作品展示区域点击事件
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('span').textContent;
            showNotification(`查看${title}详情功能即将上线！`, 'info');
        });
    });

    // 功能卡片悬停效果增强
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // 滚动时的视差效果
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-card');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        // 导航栏背景透明度
        const header = document.querySelector('.header');
        const opacity = Math.min(scrolled / 100, 0.95);
        header.style.background = `rgba(10, 10, 10, ${opacity})`;
    });

    // 页面元素进入视口时的动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 观察需要动画的元素
    const animateElements = document.querySelectorAll('.feature-card, .gallery-item, .section-title');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // 通知系统
    function showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;

        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid rgba(0, 212, 255, 0.3);
            border-radius: 12px;
            padding: 1rem 1.5rem;
            color: white;
            backdrop-filter: blur(20px);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
            box-shadow: 0 10px 30px rgba(0, 212, 255, 0.2);
        `;

        document.body.appendChild(notification);

        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    function getNotificationIcon(type) {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            default: return 'ℹ️';
        }
    }

    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K 快速搜索（示例）
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            showNotification('搜索功能即将上线！', 'info');
        }
    });

    // 鼠标跟随效果（可选）
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // 添加鼠标跟随光效（性能优化版本）
    let rafId;
    function updateMouseEffect() {
        const cursor = document.querySelector('.mouse-effect');
        if (cursor) {
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        }
        rafId = requestAnimationFrame(updateMouseEffect);
    }

    // 创建鼠标跟随效果元素
    const mouseEffect = document.createElement('div');
    mouseEffect.className = 'mouse-effect';
    mouseEffect.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        transform: translate(-50%, -50%);
    `;
    document.body.appendChild(mouseEffect);
    updateMouseEffect();

    console.log('🎨 灵境AI - 页面加载完成！');
    console.log('✨ 欢迎来到AI动漫创作的世界！');
});

// 页面卸载时清理
window.addEventListener('beforeunload', function() {
    if (rafId) {
        cancelAnimationFrame(rafId);
    }
});