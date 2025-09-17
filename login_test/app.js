const QUESTIONS = [
  { q: "大學社團名稱？", answer: "心理測驗創作社", placeholder: "" },
  { q: "媽媽的生日？", answer: "19620525", placeholder: "20010101" },
  { q: "國中升學考試考了幾分？", answer: "410", placeholder: "" },
];
const $ = (s) => document.querySelector(s);
const screenLogin = $("#screen-login");
const screenSQ = $("#screen-sq");
const loginBtn = $("#loginBtn");
const loginError = $("#loginError");
const forgotLink = document.querySelector(".link-forgot");
const sqTitle = $("#sqTitle");
const sqQuestion = $("#sqQuestion");
const sqAnswer = $("#sqAnswer");
const sqSubmit = $("#sqSubmit");
const sqError = $("#sqError");
let step = 0;
function showLogin(){
  screenLogin.classList.add("active");
  screenSQ.classList.remove("active");
  window.location.hash = "#/login";
}
function showSQ(){
  screenSQ.classList.add("active");
  screenLogin.classList.remove("active");
  window.location.hash = `#/forgot/${step+1}`;
  renderSQ();
}
function renderSQ(){
  const item = QUESTIONS[step];
  sqTitle.textContent = `安全提問 ${step+1}：`;
  sqQuestion.textContent = item.q;
  sqAnswer.value = "";
  sqAnswer.placeholder = item.placeholder || "";
  sqAnswer.focus();
  sqError.hidden = true;
}
loginBtn.addEventListener("click", () => {
  loginError.hidden = false; // 永遠顯示錯誤，不跳轉
});
forgotLink.addEventListener("click", (e) => {
  e.preventDefault();
  step = 0;
  showSQ();
});
sqSubmit.addEventListener("click", () => {
  const a = (sqAnswer.value || "").trim();
  if(a === QUESTIONS[step].answer){
    step += 1;
    if(step >= QUESTIONS.length){
      window.location.href = "/chat_record/";
      return;
    }
    renderSQ();
  }else{
    sqError.hidden = false;
  }
});
window.addEventListener("load", () => {
  if(location.hash.startsWith("#/forgot")){
    step = 0;
    showSQ();
  }else{
    showLogin();
  }
});
