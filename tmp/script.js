// 双打字机效果实现
class DualTypewriter {
    constructor() {
        this.typewriters = {
            main: {
                element: document.getElementById('mainTypewriter'),
                texts: [
                    '重构创作链路，助力量产',
                    '驱动内容创新，赋能创作',
                    '智能化制作，专业级输出',
                    '革新动漫产业，引领未来'
                ],
                currentIndex: 0,
                isDeleting: false,
                speed: 100
            }
        };
        this.isRunning = false;
    }

    typeText(typewriterKey) {
        const typewriter = this.typewriters[typewriterKey];
        if (!typewriter.element) return;

        const currentText = typewriter.texts[typewriter.currentIndex];
        const currentLength = typewriter.element.textContent.length;

        if (!typewriter.isDeleting) {
            // 添加字符
            if (currentLength < currentText.length) {
                typewriter.element.textContent = currentText.substring(0, currentLength + 1);
                setTimeout(() => this.typeText(typewriterKey), typewriter.speed);
            } else {
                // 完成输入，等待后开始删除
                setTimeout(() => {
                    typewriter.isDeleting = true;
                    this.typeText(typewriterKey);
                }, 2000);
            }
        } else {
            // 删除字符
            if (currentLength > 0) {
                typewriter.element.textContent = currentText.substring(0, currentLength - 1);
                setTimeout(() => this.typeText(typewriterKey), typewriter.speed / 2);
            } else {
                // 完成删除，切换到下一个文本
                typewriter.isDeleting = false;
                typewriter.currentIndex = (typewriter.currentIndex + 1) % typewriter.texts.length;
                setTimeout(() => this.typeText(typewriterKey), 500);
            }
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        // 启动主打字机
        this.typeText('main');
    }

    stop() {
        this.isRunning = false;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化双打字机效果
    const dualTypewriter = new DualTypewriter();
    dualTypewriter.start();
    
    // 滚动交互控制 - 简化版本，只保留轻微缩放效果
    let hasTriggeredLogin = false;
    const loginModal = document.getElementById('loginModal');
    const floatingCards = document.querySelectorAll('.floating-card');
    const heroContent = document.querySelector('.hero-content');
    
    function handleScroll() {
        const scrollY = window.scrollY;
        const scatterStartPoint = 100; // 滚动100px后开始散开动画
        const scatterEndPoint = 500; // 滚动500px时完全散开
        const loginTriggerPoint = 600; // 滚动600px后触发登录窗口
        
        // 卡片散开动画逻辑
        floatingCards.forEach((card, index) => {
            if (scrollY >= scatterStartPoint) {
                card.classList.add('scroll-scatter');
                
                // 计算散开进度 (0到1之间)
                const scatterProgress = Math.min((scrollY - scatterStartPoint) / (scatterEndPoint - scatterStartPoint), 1);
                
                // 根据滚动进度调整透明度和位移
                const opacity = Math.max(1 - scatterProgress, 0);
                const scale = Math.max(1 - scatterProgress * 0.7, 0.3);
                
                // 为每个卡片设置不同的散开方向
                let translateX, translateY, rotation;
                switch(index) {
                    case 0: // card-1 AI绘画 向左上散开
                        translateX = -scatterProgress * 600;
                        translateY = -scatterProgress * 400;
                        rotation = -scatterProgress * 45;
                        break;
                    case 1: // card-2 智能生成 向右上散开
                        translateX = scatterProgress * 700;
                        translateY = -scatterProgress * 350;
                        rotation = scatterProgress * 50;
                        break;
                    case 2: // card-3 快速创作 向左下散开
                        translateX = -scatterProgress * 500;
                        translateY = scatterProgress * 600;
                        rotation = -scatterProgress * 35;
                        break;
                }
                
                card.style.transform = `translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) rotate(${rotation}deg)`;
                card.style.opacity = opacity;
            } else {
                card.classList.remove('scroll-scatter');
                card.style.transform = '';
                card.style.opacity = '';
            }
        });
        
        // 登录窗口显示逻辑
        if (scrollY > loginTriggerPoint && !hasTriggeredLogin) {
            hasTriggeredLogin = true;
            
            // 延迟显示登录窗口
            setTimeout(() => {
                if (loginModal) {
                    loginModal.classList.add('show');
                }
            }, 300);
        } else if (scrollY <= loginTriggerPoint && hasTriggeredLogin) {
            hasTriggeredLogin = false;
            
            // 隐藏登录窗口
            if (loginModal) {
                loginModal.classList.remove('show');
            }
        }
        
        // 左侧内容位置和缩放效果
        if (heroContent) {
            const maxScroll = 500; // 增加过渡距离，让动画更平滑
            const progress = Math.min(scrollY / maxScroll, 1); // 0到1的进度
            
            // 缩放效果：从1缩小到0.8
            const scaleValue = 1 - (progress * 0.2);
            
            // 水平位置：从50%（居中）移动到左侧
            const leftValue = 50 - (progress * 35); // 50% -> 15%
            const finalLeft = `${Math.max(leftValue, 15)}%`; // 最小15%，避免移出屏幕
            
            // 垂直位置：从50%移动到40%
            const topValue = 50 - (progress * 10); // 50% -> 40%
            
            // 文本对齐：使用更平滑的过渡点
            const alignmentProgress = Math.max(0, (progress - 0.3) / 0.4); // 从30%开始，到70%完成
            const smoothAlignment = alignmentProgress > 0 ? 'left' : 'center';
            heroContent.style.textAlign = smoothAlignment;
            
            // 根据滚动进度调整transform：使用更平滑的过渡
            const transformProgress = Math.max(0, (progress - 0.3) / 0.4); // 从30%开始过渡
            if (transformProgress <= 0) {
                // 滚动前30%：保持居中对齐
                heroContent.style.transform = `translate(-50%, -50%) scale(${scaleValue})`;
            } else if (transformProgress < 1) {
                // 滚动30%-70%：平滑过渡
                const translateX = -50 + (transformProgress * 50); // 从-50%过渡到0%
                heroContent.style.transform = `translate(${translateX}%, -50%) scale(${scaleValue})`;
            } else {
                // 滚动70%后：完全左对齐
                heroContent.style.transform = `translate(0, -50%) scale(${scaleValue})`;
            }
            
            heroContent.style.left = finalLeft;
            heroContent.style.top = `${topValue}%`;
            
            // 按钮显示/隐藏动画
            const heroButtons = heroContent.querySelector('.hero-buttons');
            if (heroButtons) {
                const buttonHidePoint = 200; // 滚动200px后开始隐藏按钮
                const buttonProgress = Math.min(scrollY / buttonHidePoint, 1);
                
                // 按钮透明度和位移动画
                const buttonOpacity = 1 - buttonProgress;
                const buttonTranslateY = buttonProgress * 30; // 向下移动30px
                
                heroButtons.style.opacity = buttonOpacity;
                heroButtons.style.transform = `translateY(${buttonTranslateY}px)`;
                heroButtons.style.pointerEvents = buttonOpacity > 0.1 ? 'auto' : 'none';
            }
        }
    }
    
    window.addEventListener('scroll', handleScroll);

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





    // 登录窗口交互事件
    const loginInputs = document.querySelectorAll('.login-input');
    const loginBtn = document.querySelector('.login-btn');
    const socialBtns = document.querySelectorAll('.social-btn');
    const registerLink = document.querySelector('.register-link');
    
    // 登录按钮点击事件
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const email = document.querySelector('input[type="email"]').value;
            const password = document.querySelector('input[type="password"]').value;
            
            if (!email || !password) {
                showNotification('请填写完整的登录信息', 'warning');
                return;
            }
            
            // 模拟登录过程
            this.textContent = '登录中...';
            this.disabled = true;
            
            setTimeout(() => {
                showNotification('登录功能即将上线！', 'info');
                this.textContent = '立即登录';
                this.disabled = false;
            }, 2000);
        });
    }
    
    // 社交登录按钮事件
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.classList.contains('google-btn') ? 'Google' : '微信';
            showNotification(`${platform}登录功能即将上线！`, 'info');
        });
    });
    
    // 注册链接事件
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('注册功能即将上线！', 'info');
        });
    }
    
    // 输入框焦点效果增强
    loginInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // 导航栏背景透明度控制
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
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

    // 旧的鼠标跟随效果已被Anime.js版本替代

    // 初始化Anime.js效果系统
    initAnimeEffects();
    
    console.log('🎨 灵境AI - 页面加载完成！');
    console.log('✨ 欢迎来到AI动漫创作的世界！');
    console.log('🌟 使用Anime.js重构的光雾粒子系统已启动！');
    

});

// 旧的粒子系统已被Anime.js重构版本替代
// 新的效果系统在 anime-effects.js 中实现



// 页面卸载时清理
window.addEventListener('beforeunload', function() {
    if (rafId) {
        cancelAnimationFrame(rafId);
    }
});