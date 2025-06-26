document.addEventListener('DOMContentLoaded', function() {
    // 初始化动态光雾背景
    initLightFogBackground();
    
    // 路线选择和模式选择的交互
    initSelectionInteractions();
    
    // 加载预览
    loadPreviews();
});

// 将重置选择函数暴露到全局作用域
window.resetSelection = resetSelection;
window.createProject = createProject;
window.goBack = goBack;

/**
 * 初始化动态光雾背景
 */
function initLightFogBackground() {
    const container = document.querySelector('.light-fog-container');
    if (!container) return;
    
    // 创建多个光雾元素
    const fogColors = [
        'rgba(0, 212, 255, 0.15)',
        'rgba(156, 39, 176, 0.15)',
        'rgba(255, 107, 53, 0.15)',
        'rgba(76, 175, 80, 0.15)',
        'rgba(33, 150, 243, 0.15)'
    ];
    
    // 为每种颜色创建2-3个光雾
    fogColors.forEach(color => {
        const count = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < count; i++) {
            createFogElement(container, color);
        }
    });
}

/**
 * 创建单个光雾元素
 */
function createFogElement(container, color) {
    const fog = document.createElement('div');
    fog.className = 'light-fog';
    fog.style.backgroundColor = color;
    
    // 随机大小 (vw单位)
    const size = 20 + Math.random() * 30;
    fog.style.width = `${size}vw`;
    fog.style.height = `${size}vw`;
    
    // 随机位置
    fog.style.left = `${Math.random() * 100}vw`;
    fog.style.top = `${Math.random() * 100}vh`;
    
    // 随机动画
    const duration = 60 + Math.random() * 60;
    const delay = Math.random() * -duration;
    fog.style.animation = `float ${duration}s ${delay}s infinite`;
    
    container.appendChild(fog);
    
    // 添加浮动动画
    const keyframes = `
    @keyframes float {
        0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            border-radius: 50%;
        }
        25% {
            transform: translate(${Math.random() * 10 - 5}vw, ${Math.random() * 10 - 5}vh) rotate(${Math.random() * 20}deg) scale(${0.8 + Math.random() * 0.4});
            border-radius: ${30 + Math.random() * 40}%;
        }
        50% {
            transform: translate(${Math.random() * 10 - 5}vw, ${Math.random() * 10 - 5}vh) rotate(${Math.random() * 40}deg) scale(${0.8 + Math.random() * 0.4});
            border-radius: ${30 + Math.random() * 40}%;
        }
        75% {
            transform: translate(${Math.random() * 10 - 5}vw, ${Math.random() * 10 - 5}vh) rotate(${Math.random() * 20}deg) scale(${0.8 + Math.random() * 0.4});
            border-radius: ${30 + Math.random() * 40}%;
        }
        100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            border-radius: 50%;
        }
    }`;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
}

/**
 * 初始化选择交互
 */
function initSelectionInteractions() {
    // 初始化3D卡片效果
    init3DCardEffects();
    
    // 路线和模式选择逻辑
    let selectedRoute = null;
    let selectedMode = null;
    let currentStep = 'route'; // 'route' 或 'mode'

    // 路线选择事件
    const routeCards = document.querySelectorAll('.route-card');
    routeCards.forEach(card => {
        card.addEventListener('click', () => {
            // 移除其他选中状态
            routeCards.forEach(c => c.classList.remove('selected'));
            // 添加选中状态
            card.classList.add('selected');
            selectedRoute = card.dataset.route;
            
            // 保存选择到会话存储
            sessionStorage.setItem('selectedRoute', selectedRoute);
            
            // 显示通知
            showNotification(`已选择：${card.querySelector('h3').textContent}`, 'success');
            
            // 延迟后切换到模式选择页面
            setTimeout(() => {
                slideToModePage();
            }, 350);
        });
    });

    // 滑动到模式选择页面
    function slideToModePage() {
        const routePage = document.querySelector('.route-page');
        const modePage = document.querySelector('.mode-page');
        
        // 路线页面左滑出去
        routePage.classList.add('slide-out-left');
        routePage.classList.remove('active');
        
        // 模式页面从右侧滑入
        setTimeout(() => {
            modePage.classList.add('active');
            currentStep = 'mode';
        }, 300);
    }

    // 返回路线选择页面
    function goBackToRoute() {
        const routePage = document.querySelector('.route-page');
        const modePage = document.querySelector('.mode-page');
        const projectConfigBtn = document.getElementById('projectConfigBtn');
        
        // 隐藏项目配置按钮
        projectConfigBtn.classList.remove('show');
        
        // 模式页面右滑出去
        modePage.classList.remove('active');
        modePage.style.transform = 'translateX(100%)';
        
        // 路线页面从左侧滑入
        setTimeout(() => {
            routePage.classList.remove('slide-out-left');
            routePage.classList.add('active');
            modePage.style.transform = '';
            currentStep = 'route';
            selectedMode = null;
            
            // 清除模式选择状态
            document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
        }, 300);
    }
    
    // 模式选择
    const modeCards = document.querySelectorAll('.mode-card');
    modeCards.forEach(card => {
        card.addEventListener('click', function() {
            // 移除其他卡片的选中状态
            modeCards.forEach(c => c.classList.remove('selected'));
            // 添加当前卡片的选中状态
            this.classList.add('selected');
            selectedMode = card.dataset.mode;
            
            // 保存选择到会话存储
            sessionStorage.setItem('selectedMode', selectedMode);
            
            // 显示通知
            showNotification(`已选择：${card.querySelector('h3').textContent}`, 'success');
            
            // 显示项目配置按钮
            setTimeout(() => {
                const projectConfigBtn = document.getElementById('projectConfigBtn');
                if (projectConfigBtn) {
                    projectConfigBtn.classList.add('show');
                }
            }, 500);
        });
    });
    
    // 将函数暴露到全局作用域
    window.goBackToRoute = goBackToRoute;
}

/**
 * 更新下一步按钮状态
 */
function updateNextButtonState() {
    const nextButton = document.getElementById('next-button');
    if (!nextButton) return;
    
    const hasSelectedRoute = document.querySelector('.route-card.selected');
    const hasSelectedMode = document.querySelector('.mode-card.selected');
    
    // 只有当路线和模式都已选择时，才启用下一步按钮
    nextButton.disabled = !(hasSelectedRoute && hasSelectedMode);
}

/**
 * 跳转到项目配置页面
 */
function goToProjectConfig() {
    // 确保已选择路线和模式
    const selectedRoute = sessionStorage.getItem('selectedRoute');
    const selectedMode = sessionStorage.getItem('selectedMode');
    
    if (!selectedRoute || !selectedMode) {
        showNotification('请先完成路线和模式选择', 'error');
        return;
    }
    
    // 显示加载通知
    showNotification('正在跳转到项目配置页面...', 'info');
    
    // 延迟跳转以显示通知
    setTimeout(() => {
        window.location.href = '/Users/snychng/Work/code/AnimePlatform/ProjectConfig.html';
    }, 1000);
}

// 将函数暴露到全局作用域
window.goToProjectConfig = goToProjectConfig;



/**
 * 重置选择
 */
function resetSelection() {
    // 清除所有选中状态
    document.querySelectorAll('.route-card, .mode-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // 清除会话存储
    sessionStorage.removeItem('selectedRoute');
    sessionStorage.removeItem('selectedMode');
    
    // 隐藏项目配置按钮
    const projectConfigBtn = document.getElementById('projectConfigBtn');
    if (projectConfigBtn) {
        projectConfigBtn.classList.remove('show');
    }
    
    // 返回到路线选择页面
    const routePage = document.querySelector('.route-page');
    const modePage = document.querySelector('.mode-page');
    
    if (modePage.classList.contains('active')) {
        goBackToRoute();
    }
    
    showNotification('已重置选择', 'info');
}

/**
 * 创建项目
 */
function createProject() {
    const selectedRoute = sessionStorage.getItem('selectedRoute');
    const selectedMode = sessionStorage.getItem('selectedMode');
    
    if (selectedRoute && selectedMode) {
        showNotification('正在创建项目...', 'info');
        setTimeout(() => {
            window.location.href = 'ProjectConfig.html';
        }, 1500);
    } else {
        showNotification('请先完成路线和模式选择', 'error');
    }
}

/**
 * 返回首页
 */
function goBack() {
    window.location.href = '../home/index.html';
}

/**
 * 显示通知
 */
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自动关闭通知
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * 初始化3D卡片效果
 */
function init3DCardEffects() {
    // 获取所有卡片元素
    const cards = document.querySelectorAll('.route-card, .mode-card');
    
    cards.forEach(card => {
        // 鼠标进入卡片
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease-out';
        });
        
        // 鼠标在卡片上移动
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // 计算鼠标相对于卡片中心的位置
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            // 计算倾斜角度（限制在-15到15度之间）
            const rotateX = -(mouseY / rect.height) * 30; // 垂直倾斜
            const rotateY = (mouseX / rect.width) * 30;   // 水平倾斜
            
            // 应用3D变换
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        // 鼠标离开卡片
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s ease-out';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
}

/**
 * 加载样片预览
 */
function loadPreviews() {
    // 这里可以实现样片预览的加载逻辑
    // 例如，从服务器获取样片图片并显示在预览区域
    // 由于这是一个演示，我们暂时使用占位符
    
    // 示例：替换占位符为实际预览图
    const previewPlaceholders = document.querySelectorAll('.preview-placeholder');
    
    // 模拟样片加载
    // 在实际应用中，这里应该是从服务器加载实际的样片图片
    previewPlaceholders.forEach((placeholder, index) => {
        // 这里仅作为示例，实际应用中应该替换为真实的样片加载逻辑
        placeholder.innerHTML = `<div style="font-size: 1.2rem; color: rgba(255,255,255,0.7);">样片 ${index + 1}</div>`;
    });
}

/**
 * 初始化配置按钮
 */
function initConfigButtons() {
    // 风格预设选择
    const presetCards = document.querySelectorAll('.preset-card');
    presetCards.forEach(card => {
        card.addEventListener('click', function() {
            // 移除其他卡片的选中状态
            presetCards.forEach(c => c.classList.remove('selected'));
            // 添加当前卡片的选中状态
            this.classList.add('selected');
        });
    });
    
    // 返回选择页面
    document.getElementById('back-to-selection').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // 保存草稿
    document.getElementById('save-draft').addEventListener('click', function() {
        showNotification('草稿保存功能即将上线！', 'info');
    });
    
    // 开始创作
    document.getElementById('start-creation').addEventListener('click', function() {
        if (validateForm()) {
            showNotification('项目创建成功！正在准备创作环境...', 'success');
            // 这里可以添加实际的项目创建逻辑
            setTimeout(() => {
                showNotification('创作功能即将上线，敬请期待！', 'info');
            }, 2000);
        }
    });
}