// Overreacted.io inspired JavaScript enhancements
(function() {
  'use strict';
  
  // Wait for DOM to load
  document.addEventListener('DOMContentLoaded', function() {
    
    // Add hover effect to article titles
    const articleTitles = document.querySelectorAll('.recent-post-item .post-title a');
    articleTitles.forEach(title => {
      title.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(2px)';
      });
      title.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
      });
    });
    
    // Add subtle fade-in effect to articles
    const articles = document.querySelectorAll('.recent-post-item');
    articles.forEach((article, index) => {
      article.style.opacity = '0';
      article.style.transform = 'translateY(10px)';
      article.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      setTimeout(() => {
        article.style.opacity = '1';
        article.style.transform = 'translateY(0)';
      }, 50 + index * 50);
    });
    
    // Add smooth scrolling for anchor links
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
    
    // Add reading time indicator (optional enhancement)
    const articleContent = document.querySelector('#post .post-content');
    if (articleContent) {
      const text = articleContent.textContent;
      const wordCount = text.trim().split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
      
      const metaContainer = document.querySelector('#post .post-meta');
      if (metaContainer) {
        const readingTimeElement = document.createElement('span');
        readingTimeElement.className = 'post-meta-reading-time';
        readingTimeElement.textContent = ` · ${readingTime} min read`;
        readingTimeElement.style.fontSize = '13px';
        readingTimeElement.style.color = '#374151';
        metaContainer.appendChild(readingTimeElement);
      }
    }
    
    // Add keyboard navigation for articles
    document.addEventListener('keydown', function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      const articles = document.querySelectorAll('.recent-post-item');
      if (articles.length === 0) return;
      
      let currentIndex = -1;
      articles.forEach((article, index) => {
        if (article === document.activeElement.closest('.recent-post-item')) {
          currentIndex = index;
        }
      });
      
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        const nextIndex = currentIndex === -1 ? 0 : Math.min(currentIndex + 1, articles.length - 1);
        articles[nextIndex].focus();
        articles[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        const prevIndex = currentIndex === -1 ? 0 : Math.max(currentIndex - 1, 0);
        articles[prevIndex].focus();
        articles[prevIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else if (e.key === 'Enter' && currentIndex !== -1) {
        const link = articles[currentIndex].querySelector('.post-title a');
        if (link) {
          window.location.href = link.href;
        }
      }
    });
    
    // Make articles focusable for keyboard navigation
    articles.forEach(article => {
      article.setAttribute('tabindex', '0');
    });
    
    // Add subtle gradient to site title on hover
    const siteTitle = document.querySelector('#site-title a');
    if (siteTitle) {
      siteTitle.addEventListener('mouseenter', function() {
        this.style.backgroundImage = 'linear-gradient(45deg, #222222, #555555)';
      });
      siteTitle.addEventListener('mouseleave', function() {
        this.style.backgroundImage = 'linear-gradient(45deg, #222222, #222222)';
      });
    }
    
    // Add copy button to code blocks
    document.querySelectorAll('pre code').forEach(codeBlock => {
      const pre = codeBlock.parentElement;
      if (!pre.classList.contains('code-block-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.textContent = 'Copy';
        copyButton.style.cssText = `
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 12px;
          cursor: pointer;
          color: #374151;
          transition: background 0.2s ease;
        `;
        
        copyButton.addEventListener('mouseenter', function() {
          this.style.background = 'rgba(0, 0, 0, 0.15)';
        });
        copyButton.addEventListener('mouseleave', function() {
          this.style.background = 'rgba(0, 0, 0, 0.1)';
        });
        
        copyButton.addEventListener('click', function() {
          const text = codeBlock.textContent;
          navigator.clipboard.writeText(text).then(() => {
            const originalText = this.textContent;
            this.textContent = 'Copied!';
            setTimeout(() => {
              this.textContent = originalText;
            }, 2000);
          });
        });
        
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        wrapper.style.position = 'relative';
        wrapper.appendChild(copyButton);
      }
    });
    
    // Add visual feedback for external links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      if (!link.href.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        
        const externalIcon = document.createElement('span');
        externalIcon.textContent = ' ↗';
        externalIcon.style.fontSize = '0.9em';
        externalIcon.style.opacity = '0.6';
        link.appendChild(externalIcon);
      }
    });
    
    // Add scroll progress indicator (optional)
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 2px;
      background: #222222;
      z-index: 1000;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
    
    // Add back to top button
    const backToTop = document.createElement('button');
    backToTop.textContent = '↑';
    backToTop.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #222222;
      color: white;
      border: none;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s ease;
      font-size: 18px;
      z-index: 100;
    `;
    
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', function() {
      if (window.scrollY > 500) {
        backToTop.style.opacity = '1';
      } else {
        backToTop.style.opacity = '0';
      }
    });
    
    console.log('Overreacted.io inspired enhancements loaded.');
  });
})();