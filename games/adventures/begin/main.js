// 視圖切換
function switchView(viewId) {
  document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
  const target = document.getElementById(viewId);
  const container = document.getElementById('main-container');

  if (target) {
    target.classList.add('active');
    // 如果進入工作匯報區，展開容器寬度支援電腦網頁視窗
    if (viewId === 'view-report-container') {
      container.classList.add('report-mode');
    } else {
      container.classList.remove('report-mode');
    }
  }
}

// 彈窗
function showAlert(msg) {
  document.getElementById('alert-modal-msg').innerText = msg;
  document.getElementById('alert-modal').classList.add('active');
}

function closeModal() {
  document.getElementById('alert-modal').classList.remove('active');
}

// 假讀取
function showLoading(callback) {
  const loading = document.getElementById('loading-modal');
  loading.classList.add('active');
  setTimeout(() => {
    loading.classList.remove('active');
    if (callback) callback();
  }, 500);
}

function switchViewWithLoading(viewId, callback = null) {
  showLoading(() => {
    switchView(viewId);
    if (callback) callback();
  });
}

// 打字機
function runTypewriter(element, text, speed = 25, callback = null) {
  element.innerText = '';
  let index = 0;
  const timer = setInterval(() => {
    if (index < text.length) {
      element.innerText += text.charAt(index);
      index++;
    } else {
      clearInterval(timer);
      if (callback) callback();
    }
  }, speed);
}

// ================= 答題狀態管理 =================
let currentWeekKey = null;

// 點擊選擇日期後啟動答題流
function loadReportPage(dateKey) {
  currentWeekKey = dateKey;
  const quiz = QUIZ_DATA[dateKey];
  const container = document.getElementById('dynamic-report-content');
  container.innerHTML = '';

  if (!quiz) {
    showAlert("找不到該週次的題目資料！");
    return;
  }

  // 1. 驗證頁面卡片：標題為「驗證」，且題目不帶「驗證：」
  const verifyCard = document.createElement('div');
  verifyCard.className = 'quiz-card';
  verifyCard.id = 'verify-card';
  verifyCard.innerHTML = `
    <h2 style="color: var(--accent-brown); margin-bottom: 12px; font-size: 1.25rem;">驗證</h2>
    <p style="font-size: 0.98rem; color: var(--text-muted); margin-bottom: 14px; line-height: 1.6;">${quiz.verifyQuestion}</p>
    <div class="form-group" style="margin-bottom: 14px;">
      <input type="text" id="verify-input" placeholder="請輸入答案">
    </div>
    <div id="verify-error-box" class="president-error-box" style="display: none; margin-bottom: 14px;">驗證未通過，請重新確認後輸入。</div>
    <button class="btn" id="btn-submit-verify">確定</button>
  `;
  container.appendChild(verifyCard);

  // 2. 瀑布流對話與作答容器
  const timeline = document.createElement('div');
  timeline.id = 'stage-timeline';
  timeline.style.display = 'none';
  container.appendChild(timeline);

  switchView('view-report-container');

  document.getElementById('btn-submit-verify').addEventListener('click', handleVerifySubmit);
}

// 驗證碼檢查
function handleVerifySubmit() {
  const quiz = QUIZ_DATA[currentWeekKey];
  const input = document.getElementById('verify-input').value.trim();
  const errBox = document.getElementById('verify-error-box');
  const inpEl = document.getElementById('verify-input');

  const isCorrect = quiz.verifyAnswer.some(ans => {
    return input.toLowerCase() === ans.toLowerCase();
  });

  if (isCorrect) {
    inpEl.classList.remove('input-error');
    errBox.style.display = 'none';
    showLoading(() => {
      document.getElementById('verify-card').style.display = 'none';
      const timeline = document.getElementById('stage-timeline');
      timeline.style.display = 'flex';
      appendStage(0);
    });
  } else {
    inpEl.classList.add('input-error');
    errBox.style.display = 'block';
  }
}

// 瀑布式附加一個 Stage（公會會長說話 -> 玩家作答區）
function appendStage(stageIdx) {
  const quiz = QUIZ_DATA[currentWeekKey];
  const stage = quiz.stages[stageIdx];
  const timeline = document.getElementById('stage-timeline');

  const stepContainer = document.createElement('div');
  stepContainer.className = 'timeline-step';
  stepContainer.id = `step-stage-${stageIdx}`;

  // 1. 會長文字方塊
  const typewriterBox = document.createElement('div');
  typewriterBox.className = 'typewriter-box';
  stepContainer.appendChild(typewriterBox);
  timeline.appendChild(stepContainer);

  runTypewriter(typewriterBox, stage.presidentText, 25, () => {
    if (stage.isFinal) {
      if (stage.nextEnvelope) {
        const env = document.createElement('div');
        env.className = 'callout-box';
        env.innerText = stage.nextEnvelope;
        stepContainer.appendChild(env);
      }
      return;
    }

    // 2. 玩家填空作答區塊
    const formBox = document.createElement('div');
    formBox.className = 'quiz-form-box';
    formBox.id = `form-stage-${stageIdx}`;

    stage.blocks.forEach((block, bIdx) => {
      const p = document.createElement('div');
      p.className = 'report-paragraph';

      let renderedHtml = block.template;
      Object.keys(block.fields).forEach(fKey => {
        const field = block.fields[fKey];
        const uniqueId = `field_${stageIdx}_${bIdx}_${fKey}`;
        let elemHtml = '';

        if (field.type === 'select') {
          let optsHtml = '<option value="">請選擇</option>';
          field.options.forEach(opt => {
            optsHtml += `<option value="${opt}">${opt}</option>`;
          });
          const isChar = field.isCharacter ? 'true' : 'false';
          elemHtml = `<select id="${uniqueId}" class="quiz-field quiz-select" data-fkey="${fKey}" data-character="${isChar}" data-group="${field.group || ''}" data-stage="${stageIdx}" data-bidx="${bIdx}">${optsHtml}</select>`;
        } else {
          elemHtml = `<input type="text" id="${uniqueId}" class="quiz-field quiz-input" data-fkey="${fKey}" data-stage="${stageIdx}" data-bidx="${bIdx}">`;
        }
        renderedHtml = renderedHtml.replace(`{${fKey}}`, elemHtml);
      });

      p.innerHTML = renderedHtml;
      formBox.appendChild(p);
    });

    stepContainer.appendChild(formBox);

    // 3. 獨立的會長錯誤提示文字方塊（初始隱藏）
    const errorBox = document.createElement('div');
    errorBox.className = 'president-error-box';
    errorBox.id = `error-box-stage-${stageIdx}`;
    errorBox.style.display = 'none';
    errorBox.innerText = '嗯……你要不要再想看看？';
    stepContainer.appendChild(errorBox);

    // 4. 提交工作匯報按鈕（位於所有文字方塊更下方）
    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn';
    submitBtn.id = `btn-stage-submit-${stageIdx}`;
    submitBtn.style.marginTop = '6px';
    submitBtn.innerText = '提交工作匯報';
    submitBtn.addEventListener('click', () => validateStage(stageIdx));
    stepContainer.appendChild(submitBtn);

    // 綁定連動與全域角色防重複選取
    setupDynamicFieldListeners(stage, stageIdx);
  });
}

// 連動與全委託全週角色防重複互斥
function setupDynamicFieldListeners(stage, stageIdx) {
  // 1. 全週次全委託角色跨題互斥：同一角色在任一選單被選取，其他選單即不能選
  const updateGlobalCharacters = () => {
    const allCharSelects = document.querySelectorAll('select[data-character="true"]');
    const selectedVals = Array.from(allCharSelects).map(s => s.value).filter(Boolean);

    allCharSelects.forEach(sel => {
      const myVal = sel.value;
      Array.from(sel.options).forEach(opt => {
        if (!opt.value) return;
        if (selectedVals.includes(opt.value) && opt.value !== myVal) {
          opt.disabled = true;
        } else {
          opt.disabled = false;
        }
      });
    });
  };

  const currentSelects = document.querySelectorAll(`#form-stage-${stageIdx} select[data-character="true"]`);
  currentSelects.forEach(sel => sel.addEventListener('change', updateGlobalCharacters));
  updateGlobalCharacters();

  // 2. 下拉二階連動 (報紙/履歷/委託 -> 子選單)
  stage.blocks.forEach((block, bIdx) => {
    Object.keys(block.fields).forEach(fKey => {
      const f = block.fields[fKey];
      if (f.cascadeTarget) {
        const sourceEl = document.getElementById(`field_${stageIdx}_${bIdx}_${fKey}`);
        const targetEl = document.getElementById(`field_${stageIdx}_${bIdx}_${f.cascadeTarget}`);
        const targetFieldDef = block.fields[f.cascadeTarget];

        if (sourceEl && targetEl) {
          sourceEl.addEventListener('change', () => {
            const val = sourceEl.value;
            targetEl.innerHTML = '<option value="">請選擇</option>';
            if (val && targetFieldDef.cascadeMap && targetFieldDef.cascadeMap[val]) {
              targetFieldDef.cascadeMap[val].forEach(item => {
                const opt = document.createElement('option');
                opt.value = item;
                opt.innerText = item;
                targetEl.appendChild(opt);
              });
            }
          });
        }
      }
    });
  });
}

// 驗證 Stage
function validateStage(stageIdx) {
  const quiz = QUIZ_DATA[currentWeekKey];
  const stage = quiz.stages[stageIdx];
  const currentStep = document.getElementById(`step-stage-${stageIdx}`);
  const errorBox = document.getElementById(`error-box-stage-${stageIdx}`);
  const submitBtn = document.getElementById(`btn-stage-submit-${stageIdx}`);
  let stagePassed = true;

  // 清除當前 stage 所有紅底
  currentStep.querySelectorAll('.quiz-field').forEach(el => el.classList.remove('input-error'));

  stage.blocks.forEach((block, bIdx) => {
    const fieldValues = {};
    const fieldElements = {};

    Object.keys(block.fields).forEach(fKey => {
      const el = document.getElementById(`field_${stageIdx}_${bIdx}_${fKey}`);
      fieldElements[fKey] = el;
      fieldValues[fKey] = el ? el.value.trim() : '';
    });

    // 1. 基本比對
    Object.keys(block.fields).forEach(fKey => {
      const fDef = block.fields[fKey];
      const val = fieldValues[fKey];
      const el = fieldElements[fKey];

      if (fDef.group && block.setValidations && block.setValidations.some(v => v.group === fDef.group)) {
        return;
      }
      if (fDef.cascadeSource && block.setValidations && block.setValidations.some(v => v.pairSwap)) {
        return;
      }
      if (fDef.cascadeTarget && block.setValidations && block.setValidations.some(v => v.pairSwap)) {
        return;
      }

      let isFieldCorrect = false;
      if (fDef.optionalAllowBlank && val === '') {
        isFieldCorrect = true;
      } else if (fDef.matchMode === 'includes') {
        const targets = Array.isArray(fDef.answer) ? fDef.answer : [fDef.answer];
        isFieldCorrect = targets.some(t => val.includes(t));
      } else if (Array.isArray(fDef.answer)) {
        isFieldCorrect = fDef.answer.includes(val);
      } else if (fDef.answer !== undefined) {
        isFieldCorrect = (fDef.answer === val);
      }

      if (!isFieldCorrect) {
        stagePassed = false;
        el.classList.add('input-error');
      }
    });

    // 2. 集合式無順序驗證
    if (block.setValidations) {
      block.setValidations.forEach(vRule => {
        if (vRule.group) {
          const gKeys = Object.keys(block.fields).filter(k => block.fields[k].group === vRule.group);
          const expectedSet = [...vRule.set];

          gKeys.forEach(k => {
            const val = fieldValues[k];
            const el = fieldElements[k];
            const foundIdx = expectedSet.indexOf(val);
            if (val && foundIdx !== -1) {
              expectedSet.splice(foundIdx, 1);
            } else {
              stagePassed = false;
              el.classList.add('input-error');
            }
          });
        }

        // 3. 雙組對調比對
        if (vRule.pairSwap) {
          const t1 = fieldValues[vRule.p1.typeField];
          const d1 = fieldValues[vRule.p1.detailField];
          const t2 = fieldValues[vRule.p2.typeField];
          const d2 = fieldValues[vRule.p2.detailField];

          const p1MatchA = (t1 === vRule.validA.t && d1 === vRule.validA.d);
          const p2MatchB = (t2 === vRule.validB.t && d2 === vRule.validB.d);

          const p1MatchB = (t1 === vRule.validB.t && d1 === vRule.validB.d);
          const p2MatchA = (t2 === vRule.validA.t && d2 === vRule.validA.d);

          const ok = (p1MatchA && p2MatchB) || (p1MatchB && p2MatchA);

          if (!ok) {
            stagePassed = false;
            fieldElements[vRule.p1.typeField].classList.add('input-error');
            fieldElements[vRule.p1.detailField].classList.add('input-error');
            fieldElements[vRule.p2.typeField].classList.add('input-error');
            fieldElements[vRule.p2.detailField].classList.add('input-error');
          }
        }
      });
    }
  });

  if (!stagePassed) {
    errorBox.style.display = 'block';
    return;
  }

  // 答對處理
  errorBox.style.display = 'none';

  // 鎖定當前 stage 的輸入元件並隱藏其提交按鈕
  currentStep.querySelectorAll('.quiz-field').forEach(el => el.disabled = true);
  if (submitBtn) submitBtn.style.display = 'none';

  showLoading(() => {
    if (stageIdx + 1 < quiz.stages.length) {
      appendStage(stageIdx + 1);
    } else {
      appendFinalStage(stage);
    }
  });
}

// 結尾會長打字機方塊與信封提示
function appendFinalStage(stage) {
  const timeline = document.getElementById('stage-timeline');
  const stepContainer = document.createElement('div');
  stepContainer.className = 'timeline-step';

  const typewriterBox = document.createElement('div');
  typewriterBox.className = 'typewriter-box';
  stepContainer.appendChild(typewriterBox);
  timeline.appendChild(stepContainer);

  runTypewriter(typewriterBox, stage.successText || "工作順利完成！", 25, () => {
    if (stage.nextEnvelope) {
      const env = document.createElement('div');
      env.className = 'callout-box';
      env.innerText = stage.nextEnvelope;
      stepContainer.appendChild(env);
    }
  });
}

// ================= 入職與常規流程 =================
function handleRegisterSubmit() {
  const name = document.getElementById('reg-name').value.trim();
  if (!name) {
    showAlert('請填寫名稱');
    return;
  }

  const checks = document.querySelectorAll('.skill-check');
  let allChecked = true;
  checks.forEach(chk => {
    if (!chk.checked) allChecked = false;
  });

  if (!allChecked) {
    showAlert('請勾選所有選項');
    return;
  }

  showLoading(() => {
    switchView('view-register-success');
    document.getElementById('callout-envelope').style.display = 'none';
    const welcomeText = `${name}你好，歡迎來到寶島冒險公會！\n\n你的履歷已通過審核，資料也進入員工系統。從今天起，你就是我們的一員了！\n\n下週一，請直接到寶島冒險公會櫃台報到，你將會收到員工培訓資訊，和進一步的工作訊息。\n\n期待你在工作中的精采表現！`;
    runTypewriter(document.getElementById('reg-typewriter'), welcomeText, 30, () => {
      document.getElementById('callout-envelope').style.display = 'block';
    });
  });
}

function handleReportLoginSubmit() {
  const name = document.getElementById('report-name').value.trim();
  if (!name) {
    showAlert('請填寫姓名');
    return;
  }

  if (name.includes('克里斯')) {
    switchViewWithLoading('view-chris-confirm', () => {
      runTypewriter(document.getElementById('chris-typewriter'), '……請問，「克里斯」是你的真名嗎？', 45);
    });
  } else {
    switchViewWithLoading('view-report-select');
  }
}

function handleChrisChoice(isRealName) {
  if (isRealName) {
    switchViewWithLoading('view-report-select');
  } else {
    showLoading(() => {
      window.location.href = "https://wbstory.site/games/adventures/hint5114/";
    });
  }
}

function handleDateSubmit() {
  const sel = document.getElementById('report-date-select').value;
  if (!sel) {
    showAlert('請選擇日期');
    return;
  }
  showLoading(() => {
    loadReportPage(sel);
  });
}

// DOM 事件監聽
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-to-register').addEventListener('click', () => switchViewWithLoading('view-register'));
  document.getElementById('btn-to-report-login').addEventListener('click', () => switchViewWithLoading('view-report-login'));
  
  ['btn-back-home-1', 'btn-back-home-2', 'btn-back-home-3', 'btn-back-home-4'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => switchViewWithLoading('view-home'));
  });

  document.getElementById('btn-submit-register').addEventListener('click', handleRegisterSubmit);
  document.getElementById('btn-submit-report-login').addEventListener('click', handleReportLoginSubmit);
  document.getElementById('btn-chris-yes').addEventListener('click', () => handleChrisChoice(true));
  document.getElementById('btn-chris-no').addEventListener('click', () => handleChrisChoice(false));
  document.getElementById('btn-submit-date').addEventListener('click', handleDateSubmit);
  document.getElementById('btn-reselect-date').addEventListener('click', () => switchViewWithLoading('view-report-select'));
  document.getElementById('btn-close-modal').addEventListener('click', closeModal);
});