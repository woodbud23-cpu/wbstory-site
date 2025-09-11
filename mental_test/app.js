// 哈卡克心理測驗 - app.js
const $ = (sel) => document.querySelector(sel);

const QUESTIONS = [
  {
    text: "一睜開眼，你突然來到了異世界。眼前是一座高聳的城門，兩側矗立著石像，守門的士兵望著你，散發出壓迫感。你會怎麼做？",
    options: [
      "A. 繞過主門，從雜草叢生的小徑偷偷潛入",
      "B. 向士兵表示自己是旅人，想要從正門進入城內",
      "C. 溜到警備比較鬆懈的側門，偷偷潛入",
      "D. 等待夜晚再偷偷從正門潛入",
    ],
  },
  {
    text: "進入城中，你來到城內的冒險者公會事務室，堆滿了任務卷軸和地圖。正當你研究時，一位陌生的精靈坐到你旁邊，看起來迷路了。他開口詢問你路怎麼走，你會怎麼做？",
    options: [
      "A. 不理會他，專心看自己的卷軸",
      "B. 表示自己也不熟悉，要他去問別人",
      "C. 邀請他一起查閱地圖，順便結伴同行",
      "D. 隨手指一個方向，讓他自己去試",
    ],
  },
  {
    text: "夜晚，你與那位精靈一同回到旅人客棧。屋內點著昏黃的油燈，你會怎麼面對這位臨時的室友？",
    options: [
      "A. 沉默不語，早早上床休息",
      "B. 與他閒聊，詢問關於這個世界的情報",
      "C. 心存懷疑，一邊隨意應答，一邊暗自防備",
      "D. 開著輕浮的玩笑，試探他的反應",
    ],
  },
  {
    text: "隔天清晨，你跟著精靈來到客棧附近的雜貨店。架上擺滿了各式各樣的物資，你打算先做什麼？",
    options: [
      "A. 買點乾糧和水壺，準備上路",
      "B. 先找些熟食飽餐一頓",
      "C. 詢問店主有沒有能接的任務",
      "D. 看精靈想買什麼，就跟著買",
    ],
  },
  {
    text: "買完東西後經過王城演講台，國王正舉行盛大的演講，並向冒險者們宣布任務。你打算接下什麼樣的挑戰？",
    options: [
      "A. 打倒遠方的魔王，拯救世界",
      "B. 尋找傳說中的寶藏",
      "C. 護送商隊穿越險地",
      "D. 陪一位老奶奶到市集",
    ],
  },
  {
    text: "在星光點綴的夜晚，你走到一座涼亭，石柱上刻滿古老的符文。為了挑戰更困難的任務，你決定學習一種技能。你會選擇？",
    options: [
      "A. 精通劍術，與敵人近距離搏鬥",
      "B. 練就弓術，能從遠方狙擊",
      "C. 修習元素魔法，施展毀滅性力量",
      "D. 學習治癒術，能在危難時幫助同伴",
    ],
  },
  {
    text: "你完成一次任務後，再度來到城門。這次守門士兵恭敬地向你行禮，並邀請你參加城門口舉辦的慶典。慶典中充滿了各種佳餚，你會選擇？",
    options: [
      "A. 烤製神秘獸肉的厚實肉排",
      "B. 用稀有草藥調製的精緻沙拉",
      "C. 原本世界中熟悉的料理",
      "D. 大口品嘗所有料理，不作取捨",
    ],
  },
  {
    text: "參加完慶典後後，你被國王召見。國王親自宣布要給你一份獎勵。你會選擇？",
    options: [
      "A. 無盡的財富",
      "B. 和美麗的公主結婚",
      "C. 成為領地廣闊的貴族",
      "D. 得到能回到原本世界的神器",
    ],
  },
  {
    text: "忽然，皇家士兵衝進皇宮，報告敵國入侵。你會怎麼做？",
    options: [
      "A. 主動請纓，前往前線戰鬥",
      "B. 躲入書庫深處，暫避風頭",
      "C. 暗中投靠敵方，背叛自己的國家",
      "D. 嘗試以知識為橋樑，擔任和平使者",
    ],
  },
  {
    text: "就在你準備展開行動時，耳邊傳來鬧鐘聲——原來這只是一場夢。你會怎麼形容剛剛的夢境？",
    options: [
      "A. 一場史詩般的冒險",
      "B. 令人筋疲力盡的旅途",
      "C. 充滿想像和創意的靈感來源",
      "D. 作夢一下就忘記了，不會在意",
    ],
  },
];

const intro = document.querySelector(".screen--intro");
const quiz = document.querySelector(".screen--quiz");
const result = document.querySelector(".screen--result");
const qText = document.querySelector("#questionText");
const options = document.querySelector("#options");
const progress = document.querySelector("#progress");
const startBtn = document.querySelector("#startBtn");
const restartBtn = document.querySelector("#restartBtn");

let idx = 0;

function renderQuestion(i){
  const q = QUESTIONS[i];
  qText.textContent = `Q${i+1}. ${q.text}`;
  progress.textContent = `第 ${i+1} / ${QUESTIONS.length} 題`;
  options.innerHTML = "";
  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.type = "button";
    btn.textContent = opt;
    btn.addEventListener("click", () => next());
    options.appendChild(btn);
  });
  // 將焦點放到第一個選項以利鍵盤導覽
  setTimeout(() => {
    const first = options.querySelector("button");
    first && first.focus();
  }, 0);
}

function next(){
  idx += 1;
  if(idx >= QUESTIONS.length){
    quiz.classList.add("hidden");
    result.classList.remove("hidden");
    return;
  }
  renderQuestion(idx);
}

startBtn.addEventListener("click", () => {
  intro.classList.add("hidden");
  quiz.classList.remove("hidden");
  idx = 0;
  renderQuestion(idx);
});

restartBtn.addEventListener("click", () => {
  result.classList.add("hidden");
  intro.classList.remove("hidden");
  startBtn.focus();
});

// 允許使用 Enter 鍵快速選擇第一個選項（輔助）
document.addEventListener("keydown", (e) => {
  if(e.key === "Enter" && !intro.classList.contains("hidden") ){
    startBtn.click();
  }
});
