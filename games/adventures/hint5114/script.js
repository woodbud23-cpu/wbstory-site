// 打字機特效
function runTypewriter(element, text, speed = 20, callback = null) {
  element.innerText = '';
  let index = 0;
  const timer = setInterval(() => {
    if (index < text.length) {
      element.innerText += text.charAt(index);
      index++;
      // 自動捲動至最底部
      const chatContainer = document.getElementById('chat-messages');
      chatContainer.scrollTop = chatContainer.scrollHeight;
    } else {
      clearInterval(timer);
      if (callback) callback();
    }
  }, speed);
}

// 新增訊息方塊
function addMessage(sender, text, isTypewriter = false, callback = null) {
  const container = document.getElementById('chat-messages');
  const row = document.createElement('div');
  row.className = `message-row ${sender}`;

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  row.appendChild(bubble);
  container.appendChild(row);

  container.scrollTop = container.scrollHeight;

  if (isTypewriter) {
    runTypewriter(bubble, text, 18, callback);
  } else {
    bubble.innerText = text;
    container.scrollTop = container.scrollHeight;
    if (callback) callback();
  }
}

// 渲染玩家可選按鈕
function renderChoices(choices) {
  const footer = document.getElementById('choice-buttons');
  footer.innerHTML = '';

  choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    if (c.text === '我想問其他問題') {
      btn.classList.add('alt-btn');
    }
    btn.innerText = c.text;
    btn.addEventListener('click', () => {
      footer.innerHTML = ''; // 點選後立即清空按鈕
      // 玩家說話 (靠右直接出現)
      addMessage('player', c.text, false, () => {
        setTimeout(() => {
          c.action();
        }, 300);
      });
    });
    footer.appendChild(btn);
  });
}

// 刷新並重新開始諮詢
function restartConsultation() {
  document.getElementById('chat-messages').innerHTML = '';
  startStep2();
}

// 流程步驟 1：初始開場白
function startStep1() {
  const intro = "很好，你果然有看懂我說的話。\n作為一位冒險者，我對公會的運作還是略知一二的。\n你有什麼解不開的問題，就來問我吧。\n但先警告你，我的提示可能會剝奪你思考的權利，\n如果你想自己解開謎團，不妨先想想看，\n真的想不到再來問我吧。";
  addMessage('guide', intro, true, () => {
    renderChoices([
      { text: "我需要提示", action: startStep2 }
    ]);
  });
}

// 流程步驟 2：選擇週次（選擇「我想問其他問題」時回到此步）
function startStep2() {
  const text = "沒問題。\n但首先請你提醒我一下，現在是什麼時間呢？";
  addMessage('guide', text, true, () => {
    renderChoices([
      { text: "現在是孟秋之月，第四週", action: () => selectWeek("w1") },
      { text: "現在是孟秋之月，第五週", action: () => selectWeek("w2") },
      { text: "現在是仲秋之月，第一週", action: () => selectWeek("w3") },
      { text: "現在是仲秋之月，第二週", action: () => selectWeek("w4") },
      { text: "現在是仲秋之月，第三週", action: () => selectWeek("w5") },
      { text: "現在是仲秋之月，第四週", action: () => selectWeek("w6") }
    ]);
  });
}

// 選擇週次後的委託選擇
function selectWeek(weekKey) {
  const text = "我知道了。\n那麼，你是對哪個任務有問題呢？";
  addMessage('guide', text, true, () => {
    if (weekKey === "w1") {
      renderChoices([
        { text: "委託1-1", action: flow_w1_1 },
        { text: "委託1-2", action: flow_w1_2 },
        { text: "我想問其他問題", action: restartConsultation }
      ]);
    } else if (weekKey === "w2") {
      renderChoices([
        { text: "委託2-1", action: flow_w2_1 },
        { text: "委託2-2", action: flow_w2_2 },
        { text: "秘密委託：博物館竊案", action: flow_w2_secret },
        { text: "我想問其他問題", action: restartConsultation }
      ]);
    } else if (weekKey === "w3") {
      renderChoices([
        { text: "委託3-1", action: flow_w3_1 },
        { text: "委託3-2", action: flow_w3_2 },
        { text: "秘密委託：生靈會", action: flow_w3_secret },
        { text: "我想問其他問題", action: restartConsultation }
      ]);
    } else if (weekKey === "w4") {
      renderChoices([
        { text: "委託4-1", action: flow_w4_1 },
        { text: "秘密委託：找回神器", action: flow_w4_secret },
        { text: "我想問其他問題", action: restartConsultation }
      ]);
    } else if (weekKey === "w5") {
      renderChoices([
        { text: "委託5-1", action: flow_w5_1 },
        { text: "委託5-2", action: flow_w5_2 },
        { text: "秘密委託：找出真凶", action: flow_w5_secret },
        { text: "我想問其他問題", action: restartConsultation }
      ]);
    } else if (weekKey === "w6") {
      renderChoices([
        { text: "委託6-1", action: flow_w6_1 },
        { text: "委託6-2", action: flow_w6_2 },
        { text: "最後委託", action: flow_w6_final },
        { text: "我想問其他問題", action: restartConsultation }
      ]);
    }
  });
}

// ==================== 孟秋之月，第四週 ====================
function flow_w1_1() {
  addMessage('guide', "要派遣正確的冒險者，得先搞清楚任務需求。先仔細看看委託，搞清楚完成任務需要哪些能力吧。", true, () => {
    renderChoices([
      { text: "我需要進一步提示", action: () => {
        addMessage('guide', "在第一次討伐行動中，大範圍攻擊對蚊子造成了可觀傷害，但卻受到了嚴重的損傷。我沒記錯的話，好像有個種族特別不怕酸性毒液的攻擊吧？", true, () => {
          renderChoices([
            { text: "我需要進一步提示", action: () => {
              addMessage('guide', "要順利完成任務，要找到「不怕酸蝕毒液」和「能對空中的敵人產生大量傷害」的冒險者。目前公會的冒險者中，這樣的冒險者剛好有三位呢。", true, () => {
                renderChoices([
                  { text: "我想直接知道答案", action: () => {
                    addMessage('guide', "根據報紙特別報導，所有人種中，只有獸人天生不怕酸蝕毒液。而龍人魔法師伊格妮絲的履歷中，也提到了能抵抗酸蝕液體的技能。另外，獸人弓箭手奈雅和獸人戰士青羽都有應付空中敵人的能力，伊格妮絲也有大範圍攻擊技能，因此他們三人正是這個任務的最佳選擇。", true, () => {
                      renderChoices([{ text: "我想問其他問題", action: restartConsultation }]);
                    });
                  }},
                  { text: "我想問其他問題", action: restartConsultation }
                ]);
              });
            }},
            { text: "我想問其他問題", action: restartConsultation }
          ]);
        });
      }},
      { text: "我想問其他問題", action: restartConsultation }
    ]);
  });
}

function flow_w1_2() {
  addMessage('guide', "我記得這週的報紙專欄，好像有提到能和亡者對話的神器，要不要再仔細看一下呢？", true, () => {
    renderChoices([
      { text: "我需要進一步提示", action: () => {
        addMessage('guide', "說到亡者的聲音，之前人類魔法師卡蓮好像有講過類似的經驗，跟一個叫「狡兔島」的地方有關。這週的報紙好像也有出現相關內容，你要檢查一下嗎？", true, () => {
          renderChoices([
            { text: "我需要進一步提示", action: () => {
              addMessage('guide', "由於山路崎嶇，陸路又被北國封鎖，如果要在一週內往返狡兔島，就只能從海上往返了。因此，這次的任務一定要有會航海的冒險者。也別忘了海上可能遇到的危險喔！", true, () => {
                renderChoices([
                  { text: "我想直接知道答案", action: () => {
                    addMessage('guide', "在這次的任務中，兩位冒險者必須同時具備航海技能、對抗人魚歌聲的能力，並且至少要有一位男性才能進入海之神殿。冒險者當中，唯一符合這幾項條件的，就只有莉莉安・席爾和艾登・霍恩這兩個人了。", true, () => {
                      renderChoices([{ text: "我想問其他問題", action: restartConsultation }]);
                    });
                  }},
                  { text: "我想問其他問題", action: restartConsultation }
                ]);
              });
            }},
            { text: "我想問其他問題", action: restartConsultation }
          ]);
        });
      }},
      { text: "我想問其他問題", action: restartConsultation }
    ]);
  });
}

// ==================== 孟秋之月，第五週 ====================
function flow_w2_1() {
  addMessage('guide', "死靈術士和骷髏士兵攻擊都附帶詛咒屬性，因此要選擇有詛咒抗性的冒險者前往。當然，如果有人能替別人提供對抗詛咒的祝福，也是很好的人選。", true, () => {
    renderChoices([
      { text: "我需要進一步提示", action: () => {
        addMessage('guide', "死靈術士的技能可能會讓骷髏變多，所以應該派一位可以快速狙殺他的冒險者解決他。至於剩下的骷髏兵，則應該用大範圍攻擊一次掃蕩。但別忘了，有些冒險者可能還沒回來喔。", true, () => {
          renderChoices([
            { text: "我需要進一步提示", action: () => {
              addMessage('guide', "隊伍中也要包含有領導經驗者，以及近戰冒險者。考量到上述所有條件，應該派遣哪四位冒險者應該很明顯了吧？", true, () => {
                renderChoices([
                  { text: "我想直接知道答案", action: () => {
                    addMessage('guide', "為了對抗死靈術士的召喚技能，應該派精靈弓箭手希爾溫・晨露快速狙殺；而村莊裡其他的骷髏士兵和骷髏巨人，則可請人類魔法師卡蓮・柯爾用火焰魔法大範圍消滅。人類守護者雷蒙・巴拉德具有領導經驗，適合指揮作戰，但他沒有對詛咒的抗性，所以需要由人類僧侶托馬斯・佩里為他提供祝福。", true, () => {
                      renderChoices([{ text: "我想問其他問題", action: restartConsultation }]);
                    });
                  }},
                  { text: "我想問其他問題", action: restartConsultation }
                ]);
              });
            }},
            { text: "我想問其他問題", action: restartConsultation }
          ]);
        });
      }},
      { text: "我想問其他問題", action: restartConsultation }
    ]);
  });
}

function flow_w2_2() {
  addMessage('guide', "根據第一份報紙的專欄，似乎有個種族來自古松地區。可以想想看具體是哪位冒險者，他很適合參與這次的任務。", true, () => {
    renderChoices([
      { text: "我需要進一步提示", action: () => {
        addMessage('guide', "龍人在晚上視力會變差，所以需要另一位能在夜晚行動，又有能力搬運貨物的冒險者。", true, () => {
          renderChoices([
            { text: "我想直接知道答案", action: () => {
              addMessage('guide', "根據報紙內容，龍人可能來自古松地區或虛谷地區，但來自虛谷地區的伊格妮絲並不認識他，所以龍人戰士札卡・沃爾坎一定是古松地區的龍人，也是這個任務的第一人選。但他夜晚視力不佳，又不喜歡和人類一起出任務，所以能和他組隊的冒險者就只剩下矮人魔法師巴林・鐵石。", true, () => {
                renderChoices([{ text: "我想問其他問題", action: restartConsultation }]);
              });
            }},
            { text: "我想問其他問題", action: restartConsultation }
          ]);
        });
      }},
      { text: "我想問其他問題", action: restartConsultation }
    ]);
  });
}

function flow_w2_secret() {
  addMessage('guide', "根據線索，博物館的所有鎖頭都沒有被破壞。所以，犯人一定有辦法可以處理鎖頭。有哪位冒險者具有這樣的技能呢？", true, () => {
    renderChoices([
      { text: "我需要進一步提示", action: () => {
        addMessage('guide', "博物館當晚一片漆黑，沒有燈光，代表犯人一定有在黑暗中看清物體的能力。另外，大門的魔法監視器也沒有紀錄，很可能犯人不是從大門進出的。", true, () => {
          renderChoices([
            { text: "我想直接知道答案", action: () => {
              addMessage('guide', "根據線索，大門的魔法監視器沒有紀錄，鎖頭未被破壞，且博物館也沒有異常亮光。由此可知，犯人可能同時具有夜視能力、開鎖能力和從二樓大窗戶潛入的能力。唯一同時具有這三項能力，又沒有不在場證明的人，就只有人類斥侯艾薇・克勞。", true, () => {
                renderChoices([{ text: "我想問其他問題", action: restartConsultation }]);
              });
            }},
            { text: "我想問其他問題", action: restartConsultation }
          ]);
        });
      }},
      { text: "我想問其他問題", action: restartConsultation }
    ]);
  });
}

// ==================== 仲秋之月，第一週 ====================
function flow_w3_1() {
  addMessage('guide', "有幾位冒險者還在休養當中，恐怕不適合繼續執行任務，請審慎評估適合的冒險者吧。", true, () => {
    renderChoices([
      { text: "我需要進一步提示", action: () => {
        addMessage('guide', "這個任務主要可以分成「疏散民眾」和「阻止巨龍」兩個部分。其中，疏散民眾前需要先治療傷者，並且想辦法說服他們，請找有相關技能的冒險者前往吧。", true, () => {
          renderChoices([
            { text: "我需要進一步提示", action: () => {
              addMessage('guide', "有位冒險者似乎和巨龍有不愉快的過往，說不定他也能在這次的任務中有所表現。另外，巨龍的攻擊會使身首分離，有沒有冒險者可以抵擋這樣的攻擊呢？", true, () => {
                renderChoices([
                  { text: "我想直接知道答案", action: () => {
                    addMessage('guide', "由於有民眾受傷不願撤離，所以應該先請精靈僧侶西萊爾・晨露治療傷者，再以舞孃莉莉安・席爾的技能說服民眾撤離。至於暴風巨龍，可以先請不怕風切的骷髏騎士無名前往對抗。而龍人魔法師伊格妮絲雖然是龍人，但他的家鄉虛谷地區曾經受到巨龍的破壞，加上他的技能可以減少破壞，因此也是適合出任務的人選。", true, () => {
                      renderChoices([{ text: "我想問其他問題", action: restartConsultation }]);
                    });
                  }},
                  { text: "我想問其他問題", action: restartConsultation }
                ]);
              });
            }},
            { text: "我想問其他問題", action: restartConsultation }
          ]);
        });
      }},
      { text: "我想問其他問題", action: restartConsultation }
    ]);
  });
}

function flow_w3_2() {
  addMessage('guide', "在四項任務中，只有一項任務有三位冒險者可以執行，其他三項都沒有足夠的人力。", true, () => {
    renderChoices([
      { text: "我需要進一步提示", action: () => {
        addMessage('guide', "要安排人力前，可以先盤點一下現在可以使用的人力有哪些。", true, () => {
          renderChoices([
            { text: "我需要進一步提示", action: () => {
              addMessage('guide', "「偷取聖杯」的任務需要偷竊技能，但可執行委託的冒險者中，沒有人有相關技能。", true, () => {
                renderChoices([
                  { text: "我需要進一步提示", action: () => {
                    addMessage('guide', "人類魔法師露露和獸人冒險者都不喜歡和獸人戰鬥，具有抗酸蝕能力的冒險者又只有兩位，所以剩下那個任務就是唯一能執行的任務了。", true, () => {
                      renderChoices([
                        { text: "我想直接知道答案", action: () => {
                          addMessage('guide', "唯一有三人可以執行的任務就只有「修復碉堡」。其中，矮人守護者杜爾加・裂岩和人類戰士艾登・霍恩具有強健的體魄，人類魔法師露露・普羅特則是能使用重力魔法，三人都能搬運石頭修復碉堡。", true, () => {
                            renderChoices([{ text: "我想問其他問題", action: restartConsultation }]);
                          });
                        }},
                        { text: "我想問其他問題", action: restartConsultation }
                      ]);
                    });
                  }},
                  { text: "我想問其他問題", action: restartConsultation }
                ]);
              });
            }},
            { text: "我想問其他問題", action: restartConsultation }
          ]);
        });
      }},
      { text: "我想問其他問題", action: restartConsultation }
    ]);
  });
}

function flow_w3_secret() {
  addMessage('guide', "委託中提到，生靈會的秘密和博物館門票有關，可以觀察看看門票上有什麼指示。", true, () => {
    renderChoices([
      { text: "我需要進一步提示", action: () => {
        addMessage('guide', "門票上寫著「向光而生」，不妨把門票對著光看一看吧，說不定能看到什麼圖案。", true, () => {
          renderChoices([
            { text: "我需要進一步提示", action: () => {
              addMessage('guide', "門票上隱藏的圖案是一片葉子，這片葉子好像在某個地方也出現過。", true, () => {
                renderChoices([
                  { text: "我想直接知道答案", action: () => {
                    addMessage('guide', "門票上隱藏的圖案是一片葉子，這片葉子在獸人戰士青羽・洛恩的履歷照片上也可以看到，所以他就是生靈會的成員。", true, () => {
                      renderChoices([{ text: "我想問其他問題", action: restartConsultation }]);
                    });
                  }},
                  { text: "我想問其他問題", action: restartConsultation }
                ]);
              });
            }},
            { text: "我想問其他問題", action: restartConsultation }
          ]);
        });
      }},
      { text: "我想問其他問題", action: restartConsultation }
    ]);
  });
}

// ==================== 仲秋之月，第二週 ====================
function flow_w4_1() {
  addMessage('guide', "根據第三份報紙上的報導，可以得知生命靈樹目前的狀況。先判斷治癒規則中哪些敘述為真，就能知道適合出任務的冒險者是誰了。", true, () => {
    renderChoices([
      { text: "我需要進一步提示", action: () => {
        addMessage('guide', "經過整理之後，治癒者的條件是「要是生靈會成員」，且「女性視為生靈會成員」；要治癒的病灶「只有一處，在樹頂」；治療方式是「用巨型利刃切掉樹瘤」，且「不可以使用元素之力」，同時要「以水系魔法滋潤樹幹」。", true, () => {
          renderChoices([
            { text: "我需要進一步提示", action: () => {
              addMessage('guide', "委託人同時可以是執行任務的冒險者。而新的冒險者當中，似乎也有生靈會的成員。", true, () => {
                renderChoices([
                  { text: "我想直接知道答案", action: () => {
                    addMessage('guide', "有巨型利刃，且不具有元素之力的冒險者只有骷髏騎士無名。要將他帶到樹頂，需要借助獸人戰士青羽・洛恩的飛行能力，並且請獸人魔法師阿雅・斑紋以水系魔法滋潤樹幹，就能順利治癒生命靈樹。", true, () => {
                      renderChoices([{ text: "我想問其他問題", action: restartConsultation }]);
                    });
                  }},
                  { text: "我想問其他問題", action: restartConsultation }
                ]);
              });
            }},
            { text: "我想問其他問題", action: restartConsultation }
          ]);
        });
      }},
      { text: "我想問其他問題", action: restartConsultation }
    ]);
  });
}

function flow_w4_secret() {
  addMessage('guide', "根據人類魔法師露露・普羅特的履歷，他剛來到公會，也就是「黃金寶珠」失竊不久後，中央城就出現了食物長螞蟻的問題，從這裡就可以知道黃金寶珠的功效。", true, () => {
    renderChoices([
      { text: "我需要進一步提示", action: () => {
        addMessage('guide', "整個中央城，只有一種食物沒有受到螞蟻的侵擾。這種食物的產地在什麼地方呢？", true, () => {
          renderChoices([
            { text: "我需要進一步提示", action: () => {
              addMessage('guide', "可翔月餅的產地在北國，根據報導，北國的環境特殊，一般冒險者無法輕易接近北國藏寶庫。既然是個偷竊任務，那必然少不了某些技能，但別忘了，許多冒險者無法在本週執行任務。", true, () => {
                renderChoices([
                  { text: "我想直接知道答案", action: () => {
                    addMessage('guide', "「黃金寶珠」的功效是杜絕糧食的蟲害，所以當神器失竊後，中央王國就開始出現了螞蟻侵擾的問題。但與此同時，產地在北國的可翔月餅卻完全不受影響，代表黃金寶珠已經被帶到北國。而要從火山地形的北國偷回神器，一定要有抵抗火焰的能力，所以適合執行任務的冒險者就是善於觀察的獸人弓箭手奈雅・霧痕，善於偷竊的獸人斥侯卡隆・泥爪，和充滿力量的矮人守護者杜爾加・裂岩。", true, () => {
                      renderChoices([{ text: "我想問其他問題", action: restartConsultation }]);
                    });
                  }},
                  { text: "我想問其他問題", action: restartConsultation }
                ]);
              });
            }},
            { text: "我想問其他問題", action: restartConsultation }
          ]);
        });
      }},
      { text: "我想問其他問題", action: restartConsultation }
    ]);
  });
}

// ==================== 仲秋之月，第三週 ====================
function flow_w5_1() {
  addMessage('guide', "從本週的報紙可以得知，骷髏應該是很輕的，但黑水村卻出現了沉重的腳步聲，代表怪物根本不是骷髏。至於是哪種怪物，可以找找看之前的報紙。", true, () => {
    renderChoices([
      { text: "我需要進一步提示", action: () => {
        addMessage('guide', "在第三份報紙中，有提到另一個重大災害「地牛翻身」，並且提到了「巨大野獸」。由此可知，「地牛」是一隻巨大的野獸，也只有這樣的野獸會造成盾牌上的凹痕。", true, () => {
          renderChoices([
            { text: "我需要進一步提示", action: () => {
              addMessage('guide', "如何擊退野獸，在某位冒險者的履歷中有提到。此外，在選擇出任務的冒險者時，也要考慮到他們之間是否有矛盾存在。", true, () => {
                renderChoices([
                  { text: "我想直接知道答案", action: () => {
                    addMessage('guide', "根據獸人魔法師阿雅・斑紋的履歷，擊退野獸需要兩位僧侶為守護者提供祝福，並且以水系魔法分散怪物注意力，而唯一的水系魔法師就是阿雅・斑紋。僧侶只有兩人，分別是人類僧侶托馬斯・佩里和精靈僧侶西萊爾・晨露。守護者雖然也有兩人，但矮人守護者杜爾加・裂岩和精靈合不來，無法一起出任務，所以唯一適合的人選就只有人類守護者雷蒙・巴拉德。至於給怪物的最後一擊需要傾注元素之力，唯一有這項能力的，就是矮人戰士布倫希爾德・銅鬚。", true, () => {
                      renderChoices([{ text: "我想問其他問題", action: restartConsultation }]);
                    });
                  }},
                  { text: "我想問其他問題", action: restartConsultation }
                ]);
              });
            }},
            { text: "我想問其他問題", action: restartConsultation }
          ]);
        });
      }},
      { text: "我想問其他問題", action: restartConsultation }
    ]);
  });
}

function flow_w5_2() {
  addMessage('guide', "「光之橋」最大承重一百公斤，且只有成年人可參加儀式。仔細看看，符合的只有哪兩個人呢？", true, () => {
    renderChoices([
      { text: "我需要進一步提示", action: () => {
        addMessage('guide', "在上週治療生命靈樹的任務中，有提到只有生靈會成員和女性可以參加任務。既然骷髏騎士無名成功參加了這次任務，他的身分應該很明顯了吧。", true, () => {
          renderChoices([
            { text: "我想直接知道答案", action: () => {
              addMessage('guide', "在所有成年的冒險者中，體重相加不到一百公斤的只有骷髏騎士無名和舞孃莉莉安・席爾，因此他們就是執行儀式的不二人選。在上週的委託中，我們可以知道無名其實是女性。換句話說，可以一起執行儀式的莉莉安，真實性別是男性。", true, () => {
                renderChoices([{ text: "我想問其他問題", action: restartConsultation }]);
              });
            }},
            { text: "我想問其他問題", action: restartConsultation }
          ]);
        });
      }},
      { text: "我想問其他問題", action: restartConsultation }
    ]);
  });
}

function flow_w5_secret() {
  addMessage('guide', "矮人守護者杜爾加・裂岩費了九牛二虎之力才把「黃金寶珠」帶回來，再對比我們之前對於這起竊案的假設，應該就能發現不合理之處了吧。", true, () => {
    renderChoices([
      { text: "我需要進一步提示", action: () => {
        addMessage('guide', "得知舞孃莉莉安・席爾其實是男性後，可以再根據本週的報紙，得知他手上的刺青其實是「優良航海者」的刺青。換句話說，當時出海尋找「亡者八音盒」的任務，只靠他一人就能完成。", true, () => {
          renderChoices([
            { text: "我需要進一步提示", action: () => {
              addMessage('guide', "根據龍人魔法師伊格妮絲・蓋亞的說法，龍人晚上視力雖然會變差，但依然可以用其他感官感知四週，在黑暗中一樣可以正常活動。", true, () => {
                renderChoices([
                  { text: "我需要進一步提示", action: () => {
                    addMessage('guide', "矮人守護者杜爾加・裂岩是博物館建館時的工匠之一，而他在進入冒險者公會之前，賣掉了一個櫃子，很可能就是之前的展示櫃。", true, () => {
                      renderChoices([
                        { text: "我想直接知道答案", action: () => {
                          addMessage('guide', "人類戰士艾登・霍恩其實第一週沒有出任務，而是和龍人戰士札卡・沃爾坎一同執行竊盜任務。首先，札卡先發動讓魔法無效的技能，通過博物館大門，到二樓開啟窗戶；艾登再抱著已經放好贗品的展示櫃，直接跳進二樓，然後將整個櫃子調包。第二週的運送任務，恐怕就是札卡將神器偷渡出城的方法。", true, () => {
                            renderChoices([{ text: "我想問其他問題", action: restartConsultation }]);
                          });
                        }},
                        { text: "我想問其他問題", action: restartConsultation }
                      ]);
                    });
                  }},
                  { text: "我想問其他問題", action: restartConsultation }
                ]);
              });
            }},
            { text: "我想問其他問題", action: restartConsultation }
          ]);
        });
      }},
      { text: "我想問其他問題", action: restartConsultation }
    ]);
  });
}

// ==================== 仲秋之月，第四週 ====================
function flow_w6_1() {
  addMessage('guide', "根據情報，敵軍會從北面南下，也可能透過海岸、山路偷襲，只有南部大平原相對安全。可能直接和敵軍接觸的地方，不需要派遣冒險者。", true, () => {
    renderChoices([
      { text: "我需要進一步提示", action: () => {
        addMessage('guide', "敵軍眾多，需要以圍攻法殲滅。有個地點正處交通中心，並且是由間諜修建而成，牆體一定不可靠，在那裡派遣最適合誘敵的兩位冒險者，把敵軍引過去吧。", true, () => {
          renderChoices([
            { text: "我需要進一步提示", action: () => {
              addMessage('guide', "受傷的冒險者應該駐紮在相對安全的地方，且要有僧侶陪同；沒有作戰能力的人，包含我，都應該留在中央城內。", true, () => {
                renderChoices([
                  { text: "我需要進一步提示", action: () => {
                    addMessage('guide', "斥侯適合待在前線隱蔽處，兩人一組，等待敵軍深入後，再在他們後方架設陷阱。剩下的地點，只有一個地方會有兩位冒險者駐紮，其他都只需各派一位最適合的人防守。", true, () => {
                      renderChoices([
                        { text: "我想直接知道答案", action: () => {
                          addMessage('guide', "可能直接和敵軍正面衝突的地點分別是四利村、岩石道、蛇泉港、鐵盔港和山門村，這些地方不需要派駐冒險者。受傷的人類守護者雷蒙・巴拉德、龍人魔法師伊格妮絲・蓋亞適合待在相對安全的虛陽村防守，並由精靈僧侶西萊爾・晨露就近照顧；沒有戰鬥力的舞孃莉莉安・席爾、人類弓箭手我本人，以及未成年的人類魔法師露露・普羅特，應該待在中央城待命；容易吸引注意，但善於逃跑的人類僧侶托馬斯・佩里和矮人戰士布倫希爾德・銅鬚，要引誘敵人進入危險的小典碉堡；善於布置陷阱的人類斥侯艾薇・克勞和獸人斥侯卡隆・泥爪，要在花池準備斷敵人後路；獸人弓箭手奈雅・霧痕不怕酸蝕，適合待在曾經被大白蚊侵襲的西塔村，而精靈弓箭手希爾溫・晨露則適合待在古老樹屋。和中央城相鄰的大橋碉堡得有一位守護者，所以由矮人守護者杜爾加・裂岩駐守，同時為了隨時沖斷大橋，獸人魔法師阿雅・斑紋也要在此待命；上週才去光之橋的骷髏戰士無名適合待在東瀛村；會飛行、不受地形限制的獸人戰士青羽・洛恩則負責前往黑水村遺址。", true, () => {
                            renderChoices([{ text: "我想問其他問題", action: restartConsultation }]);
                          });
                        }},
                        { text: "我想問其他問題", action: restartConsultation }
                      ]);
                    });
                  }},
                  { text: "我想問其他問題", action: restartConsultation }
                ]);
              });
            }},
            { text: "我想問其他問題", action: restartConsultation }
          ]);
        });
      }},
      { text: "我想問其他問題", action: restartConsultation }
    ]);
  });
}

function flow_w6_2() {
  addMessage('guide', "富商透過很多方法試圖尋找女兒，包含使用亡者八音盒、舉行光之烏儀式等，也在報導中談到女兒離開前的細節。從這些資訊，應該不難推斷出他女兒的真實身分。", true, () => {
    renderChoices([
      { text: "我需要進一步提示", action: () => {
        addMessage('guide', "使用亡者八音盒沒有反應，是因為他女兒現在還活著(以某種方式)；進行儀式時，光之烏沒有移動，是因為他女兒就在現場。再仔細看他女兒的照片，以及富商提到他送女兒的馬，唯一可能的人選就只有一個人。", true, () => {
          renderChoices([
            { text: "我想直接知道答案", action: () => {
              addMessage('guide', "富商賈馬爾的女兒，就是死而復生，並且親自參與了光之烏儀式的骷髏騎士無名。", true, () => {
                renderChoices([{ text: "我想問其他問題", action: restartConsultation }]);
              });
            }},
            { text: "我想問其他問題", action: restartConsultation }
          ]);
        });
      }},
      { text: "我想問其他問題", action: restartConsultation }
    ]);
  });
}

function flow_w6_final() {
  addMessage('guide', "你是不是還有一些東西從來沒有使用過呢？", true, () => {
    renderChoices([
      { text: "我需要進一步提示", action: () => {
        addMessage('guide', "試著把四個公會印章排成一個「田」字蓋蓋看吧。中間應該會出現一個圖案。找找看，這個圖案曾經在什麼地方出現過呢？", true, () => {
          renderChoices([
            { text: "我想直接知道答案", action: () => {
              addMessage('guide', "在第一份報紙中，議員史密斯的帽子上就有這個圖案。事實上，這就是寶島冒險公會的官方標誌。我能給你的幫助就差不多到這裡了，其他的，就由我的老朋友來告訴你吧。", true, () => {
                renderChoices([{ text: "我想問其他問題", action: restartConsultation }]);
              });
            }},
            { text: "我想問其他問題", action: restartConsultation }
          ]);
        });
      }},
      { text: "我想問其他問題", action: restartConsultation }
    ]);
  });
}

// 頁面載入後啟動第一步開場白
document.addEventListener('DOMContentLoaded', () => {
  startStep1();
});