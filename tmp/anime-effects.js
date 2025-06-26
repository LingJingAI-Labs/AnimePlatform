// 使用Anime.js重构的光雾和粒子效果系统
class AnimeEffectsSystem {
    constructor() {
        this.fogParticles = [];
        this.floatingParticles = [];
        this.isInitialized = false;
        this.animationInstances = [];
        
        // 和谐低调的液体流动配色方案 - 与页面主题协调
        this.colorScheme = {
            primary: {
                primaryBlue: '#00d4ff',   // 主题青蓝色
                primaryPurple: '#9c27b0', // 主题紫色
                softOrange: '#ff6b35',    // 柔和橙色
                mutedCyan: '#4dd0e1',     // 柔和青色
                deepBlue: '#1565c0',      // 深蓝色
                lightPurple: '#ba68c8'    // 浅紫色
            },
            gradients: [
                'radial-gradient(ellipse, rgba(0, 212, 255, 0.15) 0%, rgba(156, 39, 176, 0.12) 40%, rgba(255, 107, 53, 0.08) 70%, transparent 90%)',
                'radial-gradient(ellipse, rgba(156, 39, 176, 0.18) 0%, rgba(0, 212, 255, 0.10) 35%, rgba(77, 208, 225, 0.06) 65%, transparent 85%)',
                'radial-gradient(ellipse, rgba(77, 208, 225, 0.16) 0%, rgba(255, 107, 53, 0.12) 45%, rgba(21, 101, 192, 0.08) 75%, transparent 92%)',
                'radial-gradient(ellipse, rgba(21, 101, 192, 0.14) 0%, rgba(186, 104, 200, 0.10) 30%, rgba(0, 212, 255, 0.06) 60%, transparent 88%)',
                'radial-gradient(ellipse, rgba(186, 104, 200, 0.17) 0%, rgba(77, 208, 225, 0.11) 50%, rgba(156, 39, 176, 0.07) 80%, transparent 95%)'
            ],
            particles: [
                'rgba(0, 212, 255, 0.25)',   // 主题青蓝色粒子
                'rgba(156, 39, 176, 0.20)',  // 主题紫色粒子
                'rgba(255, 107, 53, 0.18)',  // 柔和橙色粒子
                'rgba(77, 208, 225, 0.22)',  // 柔和青色粒子
                'rgba(21, 101, 192, 0.15)',  // 深蓝色粒子
                'rgba(186, 104, 200, 0.20)'  // 浅紫色粒子
            ]
        };
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        this.createFogSystem();
        this.createParticleSystem();
        this.setupResponsiveHandling();
        
        this.isInitialized = true;
        console.log('🌟 Anime.js 光雾粒子系统已启动');
    }
    
    // 创建主要的光雾系统
    createFogSystem() {
        const container = document.querySelector('.light-fog-container');
        if (!container) return;
        
        // 清除现有的光雾元素
        container.innerHTML = '';
        
        // 根据屏幕尺寸决定光雾数量
        const fogCount = this.getOptimalFogCount();
        
        for (let i = 0; i < fogCount; i++) {
            this.createAnimatedFog(container, i);
        }
    }
    
    // 创建单个动画光雾
    createAnimatedFog(container, index) {
        const fog = document.createElement('div');
        fog.className = `anime-fog fog-${index + 1}`;
        
        // 随机初始位置和大小
        const initialData = this.generateFogData(index);
        
        fog.style.cssText = `
            position: absolute;
            width: ${initialData.size.width}vw;
            height: ${initialData.size.height}vh;
            background: ${this.colorScheme.gradients[index % this.colorScheme.gradients.length]};
            border-radius: ${initialData.borderRadius};
            filter: blur(${initialData.blur}px);
            opacity: 0;
            pointer-events: none;
            will-change: transform, opacity, border-radius;
            backface-visibility: hidden;
        `;
        
        container.appendChild(fog);
        this.fogParticles.push(fog);
        
        // 使用Anime.js创建复杂的动画序列
        this.animateFog(fog, initialData, index);
    }
    
    // 生成液体数据
    generateFogData(index) {
        const screenWidth = window.innerWidth;
        const isMobile = screenWidth <= 768;
        
        return {
            position: {
                x: Math.random() * 100,
                y: Math.random() * 100
            },
            size: {
                width: isMobile ? 50 + Math.random() * 30 : 35 + Math.random() * 40, // 更大的液体团
                height: isMobile ? 35 + Math.random() * 25 : 25 + Math.random() * 30
            },
            blur: isMobile ? 25 + Math.random() * 15 : 30 + Math.random() * 20, // 减少模糊，更清晰的液体边缘
            borderRadius: this.generateBorderRadius(),
            duration: 20000 + Math.random() * 15000, // 20-35秒，更慢的液体流动
            delay: index * 1500 // 错开启动时间
        };
    }
    
    // 生成随机边框半径
    generateBorderRadius() {
        const values = [];
        for (let i = 0; i < 8; i++) {
            values.push(30 + Math.random() * 40); // 30-70%
        }
        return `${values[0]}% ${values[1]}% ${values[2]}% ${values[3]}% / ${values[4]}% ${values[5]}% ${values[6]}% ${values[7]}%`;
    }
    
    // 使用Anime.js动画光雾
    animateFog(fog, data, index) {
        // 低调淡入动画
        const fadeIn = anime({
            targets: fog,
            opacity: [0, 0.25 + Math.random() * 0.15], // 降低初始透明度
            duration: 3000, // 延长淡入时间，更柔和
            easing: 'easeOutQuart',
            delay: data.delay
        });
        
        this.animationInstances.push(fadeIn);
        
        // 主要的流动动画
        setTimeout(() => {
            this.createFogFlowAnimation(fog, data, index);
        }, data.delay + 2000);
    }
    
    // 创建液体流动动画
    createFogFlowAnimation(fog, data, index) {
        const flowAnimation = anime({
            targets: fog,
            // 液体波动式的X轴移动
            translateX: [
                { value: () => Math.sin(index * 0.5) * 300 + (Math.random() - 0.5) * 100, duration: 12000 },
                { value: () => Math.cos(index * 0.7) * 250 + (Math.random() - 0.5) * 80, duration: 10000 },
                { value: () => Math.sin(index * 0.3) * 200 + (Math.random() - 0.5) * 120, duration: 14000 },
                { value: 0, duration: 8000 }
            ],
            // 液体起伏式的Y轴移动
            translateY: [
                { value: () => Math.cos(index * 0.4) * 180 + (Math.random() - 0.5) * 60, duration: 11000 },
                { value: () => Math.sin(index * 0.6) * 150 + (Math.random() - 0.5) * 80, duration: 13000 },
                { value: () => Math.cos(index * 0.8) * 220 + (Math.random() - 0.5) * 100, duration: 9000 },
                { value: 0, duration: 10000 }
            ],
            // 液体旋转效果 - 更缓慢和流畅
            rotate: [
                { value: 90 + Math.sin(index) * 45, duration: 20000 },
                { value: 180 + Math.cos(index) * 60, duration: 25000 },
                { value: 360, duration: 18000 }
            ],
            // 液体膨胀收缩效果
            scale: [
                { value: 1.4 + Math.sin(index * 0.2) * 0.3, duration: 15000 },
                { value: 0.7 + Math.cos(index * 0.3) * 0.2, duration: 12000 },
                { value: 1.1, duration: 9000 },
                { value: 1, duration: 6000 }
            ],
            // 低调的液体透明度波动
            opacity: [
                { value: 0.4 + Math.sin(index * 0.1) * 0.15, duration: 8000 },
                { value: 0.15 + Math.cos(index * 0.15) * 0.2, duration: 12000 },
                { value: 0.35 + Math.sin(index * 0.2) * 0.12, duration: 10000 },
                { value: 0.25 + Math.cos(index * 0.25) * 0.15, duration: 14000 }
            ],
            easing: 'easeInOutSine',
            duration: data.duration,
            loop: true,
            direction: 'alternate'
        });
        
        this.animationInstances.push(flowAnimation);
        
        // 液体形变动画
        this.createLiquidDeformAnimation(fog, data.duration, index);
    }
    
    // 创建液体形变动画
    createLiquidDeformAnimation(fog, duration, index) {
        const deformAnimation = anime({
            targets: fog,
            duration: duration / 3,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine',
            update: () => {
                fog.style.borderRadius = this.generateLiquidBorderRadius(index);
            }
        });
        
        this.animationInstances.push(deformAnimation);
    }
    
    // 生成液体形变的边框半径
    generateLiquidBorderRadius(index) {
        const time = Date.now() * 0.001; // 转换为秒
        const values = [];
        
        // 使用正弦波创建液体波动效果
        for (let i = 0; i < 8; i++) {
            const wave1 = Math.sin(time * 0.5 + index * 0.3 + i * 0.8) * 25;
            const wave2 = Math.cos(time * 0.3 + index * 0.5 + i * 0.6) * 20;
            const wave3 = Math.sin(time * 0.7 + index * 0.2 + i * 1.2) * 15;
            
            const value = 40 + wave1 + wave2 + wave3;
            values.push(Math.max(10, Math.min(80, value))); // 限制在10-80%之间
        }
        
        return `${values[0]}% ${values[1]}% ${values[2]}% ${values[3]}% / ${values[4]}% ${values[5]}% ${values[6]}% ${values[7]}%`;
    }
    
    // 创建浮动粒子系统
    createParticleSystem() {
        const container = document.querySelector('.light-fog-container');
        if (!container) return;
        
        const particleCount = this.getOptimalParticleCount();
        
        for (let i = 0; i < particleCount; i++) {
            this.createFloatingParticle(container, i);
        }
    }
    
    // 创建单个浮动粒子
    createFloatingParticle(container, index) {
        const particle = document.createElement('div');
        particle.className = `anime-particle particle-${index}`;
        
        const size = 3 + Math.random() * 8; // 3-11px
        const color = this.colorScheme.particles[Math.floor(Math.random() * this.colorScheme.particles.length)];
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
            box-shadow: 0 0 ${size}px ${color.replace(/[\d\.]+\)$/, '0.1)')}; /* 降低光晕强度 */
            will-change: transform, opacity;
        `;
        
        container.appendChild(particle);
        this.floatingParticles.push(particle);
        
        // 随机初始位置
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        // 创建粒子动画
        this.animateParticle(particle, index);
    }
    
    // 动画单个粒子
    animateParticle(particle, index) {
        const duration = 8000 + Math.random() * 12000; // 8-20秒
        const delay = index * 100; // 错开启动
        
        // 低调淡入
        anime({
            targets: particle,
            opacity: [0, 0.2 + Math.random() * 0.15], // 大幅降低粒子透明度
            duration: 1500, // 延长淡入时间
            delay: delay,
            easing: 'easeOutQuart'
        });
        
        // 主要运动动画
        setTimeout(() => {
            const moveAnimation = anime({
                targets: particle,
                translateX: () => (Math.random() - 0.5) * window.innerWidth * 0.6, // 减少移动范围
                translateY: () => (Math.random() - 0.5) * window.innerHeight * 0.6,
                scale: [
                    { value: 1.3, duration: duration * 0.3 },
                    { value: 0.7, duration: duration * 0.4 },
                    { value: 1, duration: duration * 0.3 }
                ],
                opacity: [
                    { value: 0.3, duration: duration * 0.2 }, // 降低所有透明度值
                    { value: 0.1, duration: duration * 0.6 },
                    { value: 0.25, duration: duration * 0.2 }
                ],
                rotate: 360,
                duration: duration,
                easing: 'easeInOutSine',
                loop: true,
                direction: 'alternate'
            });
            
            this.animationInstances.push(moveAnimation);
        }, delay + 1000);
    }
    
    // 获取最佳光雾数量
    getOptimalFogCount() {
        const width = window.innerWidth;
        if (width <= 360) return 0;
        if (width <= 480) return 2;
        if (width <= 768) return 3;
        if (width <= 1024) return 4;
        return 5;
    }
    
    // 获取最佳粒子数量
    getOptimalParticleCount() {
        const width = window.innerWidth;
        if (width <= 360) return 0;
        if (width <= 480) return 8;
        if (width <= 768) return 15;
        if (width <= 1024) return 25;
        return 40;
    }
    
    // 响应式处理
    setupResponsiveHandling() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 300);
        });
    }
    
    // 处理窗口大小变化
    handleResize() {
        // 停止所有动画
        this.stopAllAnimations();
        
        // 清除现有元素
        this.clearAllElements();
        
        // 重新初始化
        this.createFogSystem();
        this.createParticleSystem();
    }
    
    // 停止所有动画
    stopAllAnimations() {
        this.animationInstances.forEach(animation => {
            if (animation && typeof animation.pause === 'function') {
                animation.pause();
            }
        });
        this.animationInstances = [];
    }
    
    // 清除所有元素
    clearAllElements() {
        this.fogParticles.forEach(fog => {
            if (fog.parentNode) {
                fog.parentNode.removeChild(fog);
            }
        });
        
        this.floatingParticles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        
        this.fogParticles = [];
        this.floatingParticles = [];
    }
    
    // 销毁系统
    destroy() {
        this.stopAllAnimations();
        this.clearAllElements();
        this.isInitialized = false;
    }
}

// 增强的鼠标跟随效果
class AnimeMouseEffect {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.trail = [];
        this.maxTrailLength = 8;
        this.init();
    }
    
    init() {
        this.createTrailElements();
        this.setupMouseTracking();
        this.animate();
    }
    
    createTrailElements() {
        for (let i = 0; i < this.maxTrailLength; i++) {
            const trail = document.createElement('div');
            trail.className = `mouse-trail trail-${i}`;
            
            const size = 20 - (i * 2); // 递减大小
            const opacity = (this.maxTrailLength - i) / this.maxTrailLength; // 递减透明度
            
            trail.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, rgba(255, 165, 0, ${opacity * 0.6}) 0%, rgba(50, 205, 50, ${opacity * 0.4}) 50%, transparent 100%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
                filter: blur(${i}px);
                opacity: 0;
            `;
            
            document.body.appendChild(trail);
            this.trail.push({ element: trail, x: 0, y: 0 });
        }
    }
    
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }
    
    animate() {
        // 更新拖尾位置
        for (let i = this.trail.length - 1; i > 0; i--) {
            this.trail[i].x = this.trail[i - 1].x;
            this.trail[i].y = this.trail[i - 1].y;
        }
        
        this.trail[0].x = this.mouseX;
        this.trail[0].y = this.mouseY;
        
        // 应用位置和动画
        this.trail.forEach((trailPoint, index) => {
            anime({
                targets: trailPoint.element,
                left: trailPoint.x,
                top: trailPoint.y,
                opacity: this.mouseX > 0 ? 1 : 0, // 只在鼠标移动时显示
                duration: 100 + (index * 50),
                easing: 'easeOutQuart'
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// 全局初始化
let animeEffectsSystem;
let animeMouseEffect;

// 页面加载完成后初始化
function initAnimeEffects() {
    // 等待Anime.js加载完成
    if (typeof anime === 'undefined') {
        setTimeout(initAnimeEffects, 100);
        return;
    }
    
    animeEffectsSystem = new AnimeEffectsSystem();
    animeMouseEffect = new AnimeMouseEffect();
    
    console.log('🎨 Anime.js 效果系统初始化完成');
}

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    if (animeEffectsSystem) {
        animeEffectsSystem.destroy();
    }
});

// 导出供外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimeEffectsSystem, AnimeMouseEffect };
}