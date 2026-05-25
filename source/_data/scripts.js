// 自定义脚本 - 文章标题渐变色逻辑 + 交互增强

(function() {
  'use strict';
  
  // 等待 DOM 加载完成
  document.addEventListener('DOMContentLoaded', function() {
    // 1. 文章标题渐变色处理
    applyTitleGradients();
    
    // 2. 平滑滚动
    enableSmoothScroll();
    
    // 3. 图片懒加载
    enableLazyLoading();
    
    // 4. 主题切换监听
    watchThemeChange();
    
    // 5. 代码块复制增强
    enhanceCodeBlocks();
  });
  
  /**
   * 根据文章发布时间应用渐变色类
   */
  function applyTitleGradients() {
    const postTitles = document.querySelectorAll('.post-title, .article-title');
    
    postTitles.forEach(title => {
      const postElement = title.closest('article, .post-item');
      if (!postElement) return;
      
      // 获取发布时间
      const timeElement = postElement.querySelector('time');
      if (!timeElement || !timeElement.dateTime) return;
      
      const publishDate = new Date(timeElement.dateTime);
      const now = new Date();
      const diffDays = Math.floor((now - publishDate) / (1000 * 60 * 60 * 24));
      
      // 根据时间差添加不同类名
      if (diffDays <= 7) {
        title.classList.add('new-7d');
      } else if (diffDays <= 30) {
        title.classList.add('new-30d');
      } else {
        title.classList.add('old-30d');
      }
    });
  }
  
  /**
   * 启用平滑滚动
   */
  function enableSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  /**
   * 启用图片懒加载
   */
  function enableLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
            }
            
            observer.unobserve(img);
          }
        });
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
  
  /**
   * 监听主题切换
   */
  function watchThemeChange() {
    // 监听主题切换按钮
    const themeButtons = document.querySelectorAll('.theme-switch, [data-theme-toggle]');
    
    themeButtons.forEach(button => {
      button.addEventListener('click', function() {
        // 主题切换后重新应用渐变色
        setTimeout(applyTitleGradients, 300);
      });
    });
    
    // 监听系统主题变化
    if (window.matchMedia) {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      darkModeMediaQuery.addEventListener('change', applyTitleGradients);
    }
  }
  
  /**
   * 增强代码块功能
   */
  function enhanceCodeBlocks() {
    // 为所有代码块添加行号
    document.querySelectorAll('pre code').forEach(block => {
      // 如果已经有行号则跳过
      if (block.querySelector('.line-numbers-rows')) return;
      
      const lines = block.textContent.split('\n').length - 1;
      if (lines > 1) {
        const lineNumbers = document.createElement('div');
        lineNumbers.className = 'line-numbers';
        lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => 
          `<span class="line-number">${i + 1}</span>`
        ).join('\n');
        
        block.parentNode.insertBefore(lineNumbers, block);
      }
    });
    
    // 复制按钮功能
    document.querySelectorAll('pre').forEach(preBlock => {
      // 如果已经有复制按钮则跳过
      if (preBlock.querySelector('.copy-button')) return;
      
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button';
      copyButton.innerHTML = '<i class="fas fa-copy"></i>';
      copyButton.title = '复制代码';
      
      copyButton.addEventListener('click', function() {
        const code = preBlock.querySelector('code').textContent;
        navigator.clipboard.writeText(code).then(() => {
          const originalHTML = this.innerHTML;
          this.innerHTML = '<i class="fas fa-check"></i>';
          this.classList.add('copied');
          
          setTimeout(() => {
            this.innerHTML = originalHTML;
            this.classList.remove('copied');
          }, 2000);
        });
      });
      
      preBlock.style.position = 'relative';
      preBlock.appendChild(copyButton);
    });
  }
  
  /**
   * 工具函数：防抖
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  /**
   * 工具函数：节流
   */
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  // 监听滚动，添加头部阴影
  window.addEventListener('scroll', throttle(function() {
    const header = document.querySelector('.header');
    if (header) {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }, 100));
  
  // 监听窗口大小变化
  window.addEventListener('resize', debounce(applyTitleGradients, 250));
  
  // 导出到全局（如果需要）
  window.blogEnhancements = {
    applyTitleGradients,
    enableSmoothScroll,
    enableLazyLoading
  };
  
})();