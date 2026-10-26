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

  // 註：聯絡表單的送出邏輯統一由 index.html 內的 Web3Forms 腳本處理，
  // 此處不再重複綁定 submit 事件，避免跳出 alert 或在送出失敗時誤報成功。
}