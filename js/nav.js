/**
 * 導覽列互動模組
 */
export function initNavigation() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // 手機選單開關
  mobileBtn?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('hidden');
  });

  // 點擊手機選單項目後自動收起
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu?.classList.add('hidden');
    });
  });

  // 聯絡表單送出防呆
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('【木芽故事館】已收到您的合作訊息，我們將儘速與您聯繫！');
    contactForm.reset();
  });
}