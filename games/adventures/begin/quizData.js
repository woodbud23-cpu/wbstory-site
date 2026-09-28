// quizData.js - 題庫與各週邏輯定義

const ADVENTURERS_POOL_1 = [
  "札卡・沃爾坎", "卡蓮・柯爾", "托馬斯・佩里", "莉莉安・席爾", "奈雅・霧痕",
  "艾登・霍恩", "青羽・洛恩", "艾薇・克勞", "克里斯・李", "伊格妮絲・蓋亞"
];

const ADVENTURERS_POOL_2 = [
  ...ADVENTURERS_POOL_1, "無名", "希爾溫・晨露", "雷蒙・巴拉德", "巴林・鐵石"
];

const ADVENTURERS_POOL_3 = [
  ...ADVENTURERS_POOL_2, "西萊爾・晨露", "露露・普羅特", "杜爾加・裂岩"
];

const ADVENTURERS_POOL_4 = [
  ...ADVENTURERS_POOL_3, "卡隆・泥爪", "阿雅・斑紋", "布倫希爾德・銅鬚"
];

const WAR_LOCATIONS = [
  "四利村", "黑水村遺址", "岩石道", "花池", "東瀛村", "古老樹屋",
  "小典碉堡", "山門村", "蛇泉港", "大橋碉堡", "中央城", "西塔村", "鐵盔港", "虛陽村"
];

const QUIZ_DATA = {
  // ================= 孟秋之月，第四週 =================
  w1: {
    title: "孟秋之月，第四週",
    verifyQuestion: "本週「王國先鋒報」第一篇報導中第二段的第四個字是什麼？",
    verifyAnswer: ["國"],
    stages: [
      {
        presidentText: "這麼快就完成第一週的工作了啊！不愧是我看中的新人。\n那請你告訴我，你會怎麼分配這兩個任務的人力呢？",
        blocks: [
          {
            type: "paragraph",
            template: "<strong>委託1-1</strong>。根據委託的內容，執行這項任務的冒險者需要有對{f1}的抗性，並且具有能應對大白蚊的攻擊模式。符合這幾項標準的冒險者有{f2}、{f3}和{f4}。",
            fields: {
              f1: { type: "select", options: ["火焰", "水流", "寒冷", "毒液", "黑暗", "詛咒"], answer: "毒液" },
              f2: { type: "select", options: ADVENTURERS_POOL_1, isCharacter: true, group: "w1_1_members" },
              f3: { type: "select", options: ADVENTURERS_POOL_1, isCharacter: true, group: "w1_1_members" },
              f4: { type: "select", options: ADVENTURERS_POOL_1, isCharacter: true, group: "w1_1_members" }
            },
            setValidations: [
              { group: "w1_1_members", set: ["奈雅・霧痕", "伊格妮絲・蓋亞", "青羽・洛恩"] }
            ]
          },
          {
            type: "paragraph",
            template: "<strong>委託1-2</strong>。可以和亡者對話的神器是{f1}，這個神器在{f2}的{f3}。要完成任務，冒險者中要有人具備{f4}能力，並能抵抗{f5}，最後由一位{f6}進入目的地取出神器。符合上述需求的冒險者組合是{f7}和{f8}。",
            fields: {
              f1: { type: "input", answer: "亡者八音盒" },
              f2: { type: "input", answer: "狡兔島" },
              f3: { type: "input", answer: "海之神殿" },
              f4: { type: "select", options: ["航海", "登山", "談判", "游泳", "戰鬥"], answer: "航海" },
              f5: { type: "select", options: ["北國士兵", "沿海蚊蟲", "山間強盜", "人魚歌聲", "亡者詛咒"], answer: "人魚歌聲" },
              f6: { type: "input", answer: ["男"], matchMode: "includes" },
              f7: { type: "select", options: ADVENTURERS_POOL_1, isCharacter: true, group: "w1_2_members" },
              f8: { type: "select", options: ADVENTURERS_POOL_1, isCharacter: true, group: "w1_2_members" }
            },
            setValidations: [
              { group: "w1_2_members", set: ["莉莉安・席爾", "艾登・霍恩"] }
            ]
          }
        ],
        successText: "非常好！第一天上班表現就這麼好，我就說你不需要什麼培訓吧。\n尤其是那個關於和亡者對話的委託，換成是我，說不定根本不知道有這種神器呢。\n那這就先到這裡，下週也繼續加油吧！",
        nextEnvelope: "請打開信封B"
      }
    ]
  },

  // ================= 孟秋之月，第五週 =================
  w2: {
    title: "孟秋之月，第五週",
    verifyQuestion: "上週新註冊的四位冒險者，最晚註冊那位的名字是什麼？",
    verifyAnswer: ["巴林", "鐵石", "巴林 鐵石", "巴林・鐵石", "巴林.鐵石"],
    stages: [
      {
        presidentText: "雖然這週還有秘密委託，但還是先來看看一般委託的部分吧。\n說說看，這週你打算怎麼安排人力呢？",
        blocks: [
          {
            type: "paragraph",
            template: "<strong>委託2-1</strong>。根據委託內容，死靈術士最麻煩的技能就是{f1}，所以需要由{f2}快速解決他。面對大量的骷髏士兵，需要由{f3}控制局面，並且由{f4}提供協助，避免他受到{f5}攻擊。最後，再由{f6}以大範圍攻擊消滅敵人。",
            fields: {
              f1: { type: "select", options: ["召喚", "操控", "維持", "射線"], answer: "召喚" },
              f2: { type: "select", options: ADVENTURERS_POOL_2, answer: "希爾溫・晨露", isCharacter: true },
              f3: { type: "select", options: ADVENTURERS_POOL_2, answer: "雷蒙・巴拉德", isCharacter: true },
              f4: { type: "select", options: ADVENTURERS_POOL_2, answer: "托馬斯・佩里", isCharacter: true },
              f5: { type: "select", options: ["火焰", "詛咒", "風系", "穿刺"], answer: "詛咒" },
              f6: { type: "select", options: ADVENTURERS_POOL_2, answer: "卡蓮・柯爾", isCharacter: true }
            }
          },
          {
            type: "paragraph",
            template: "<strong>委託2-2</strong>。除去第一項任務中的四位冒險者，以及其他無法執行任務的冒險者之後，最適合這項任務的兩個人分別是{f7}和{f8}。",
            fields: {
              f7: { type: "select", options: ADVENTURERS_POOL_2, isCharacter: true, group: "w2_2_members" },
              f8: { type: "select", options: ADVENTURERS_POOL_2, isCharacter: true, group: "w2_2_members" }
            },
            setValidations: [
              { group: "w2_2_members", set: ["札卡・沃爾坎", "巴林・鐵石"] }
            ]
          }
        ]
      },
      {
        presidentText: "基本的工作處理完了，接下來就是秘密委託的部分了。\n告訴我，你覺得誰是偷走博物館神器的小偷？",
        blocks: [
          {
            type: "paragraph",
            template: "犯人除了能在不破壞鎖頭的情況下調包物品外，還需要有{f1}能力。具有上述能力，且沒有{f2}的冒險者，就只有{f3}。他應該是{f4}進入博物館，偷走神器後再原路離開的。",
            fields: {
              f1: { type: "select", options: ["戰鬥", "防禦", "催眠", "治療", "夜視"], answer: "夜視" },
              f2: { type: "select", options: ["下手動機", "犯案能力", "不在場證明", "委託經歷"], answer: "不在場證明" },
              f3: { type: "select", options: ADVENTURERS_POOL_2, answer: "艾薇・克勞", isCharacter: true },
              f4: { type: "select", options: ["從一樓大門", "從二樓走廊小窗", "從二樓研究室", "從二樓大窗戶", "穿牆"], answer: "從二樓大窗戶" }
            }
          }
        ],
        successText: "原來如此，很有邏輯的推理。我會將你的想法回報給王國治安隊，希望能趕快找回失蹤的神器。這週的工作也辛苦了，下週記下加油吧！",
        nextEnvelope: "請打開信封C"
      }
    ]
  },

  // ================= 仲秋之月，第一週 =================
  w3: {
    title: "仲秋之月，第一週",
    verifyQuestion: "這週報紙第一頁的最後兩個字是什麼？",
    verifyAnswer: ["漩渦"],
    stages: [
      {
        presidentText: "很高興看到你沒有被上週的失利擊倒，仍然很有效率地完成了工作。\n來吧，告訴我，這週的委託，你打算派哪幾位冒險者去呢？",
        blocks: [
          {
            type: "paragraph",
            template: "<strong>委託3-1</strong>。疏散民眾的部分，應該派{f1}和{f2}前往。和巨龍戰鬥的部分，只能派{f3}前往，因為其他人無法承受巨龍的傷害。另外，{f4}和巨龍有一段淵源，且他的{f5}很適合阻擋巨龍的破壞，因此也將他加入討伐隊伍中。",
            fields: {
              f1: { type: "select", options: ADVENTURERS_POOL_3, isCharacter: true, group: "w3_evac" },
              f2: { type: "select", options: ADVENTURERS_POOL_3, isCharacter: true, group: "w3_evac" },
              f3: { type: "select", options: ADVENTURERS_POOL_3, answer: "無名", isCharacter: true },
              f4: { type: "select", options: ADVENTURERS_POOL_3, answer: "伊格妮絲・蓋亞", isCharacter: true },
              f5: { type: "select", options: ["性別", "技能", "喜好", "種族", "經歷"], answer: "技能" }
            },
            setValidations: [
              { group: "w3_evac", set: ["西萊爾・晨露", "莉莉安・席爾"] }
            ]
          },
          {
            type: "paragraph",
            template: "<strong>委託3-2</strong>。在這四項任務中，應該派{f6}、{f7}和{f8}去進行{f9}的任務。",
            fields: {
              f6: { type: "select", options: ADVENTURERS_POOL_3, isCharacter: true, group: "w3_bfort" },
              f7: { type: "select", options: ADVENTURERS_POOL_3, isCharacter: true, group: "w3_bfort" },
              f8: { type: "select", options: ADVENTURERS_POOL_3, isCharacter: true, group: "w3_bfort" },
              f9: { type: "select", options: ["偷取聖物", "修復碉堡", "採集資源", "討伐強盜"], answer: "修復碉堡" }
            },
            setValidations: [
              { group: "w3_bfort", set: ["露露・普羅特", "杜爾加・裂岩", "艾登・霍恩"] }
            ]
          }
        ]
      },
      {
        presidentText: "我知道了，你這次的安排也無懈可擊。\n至於秘密委託的部分，你查出生靈會的成員到底是誰了嗎？",
        blocks: [
          {
            type: "paragraph",
            template: "根據委託上的指引，可以得知生靈會的象徵符號是{f1}。因此，生靈會的成員就是{f2}。",
            fields: {
              f1: { type: "select", options: ["一顆星星", "一隻蜻蜓", "一片葉子", "一副鎧甲", "一個洞穴"], answer: "一片葉子" },
              f2: { type: "select", options: ADVENTURERS_POOL_3, answer: "青羽・洛恩", isCharacter: true }
            }
          }
        ],
        successText: "原來門票中還藏著這種東西啊！\n不愧是你。換成是我，可能看半天也看不出來。\n我會去和他聯絡看看的，希望這樣真的能治好生命靈樹。\n這週就先這樣了，下週再加油吧。",
        nextEnvelope: "請打開信封D"
      }
    ]
  },

  // ================= 仲秋之月，第二週 =================
  w4: {
    title: "仲秋之月，第二週",
    verifyQuestion: "仲秋之月，第八日接受訪談的冒險者，慣用武器是什麼？",
    verifyAnswer: ["千年鹿角法杖"],
    stages: [
      {
        presidentText: "難得的中秋佳節，我也不希望你加班太久。\n這次就不用分一般委託和秘密委託了，一口氣解決吧。",
        blocks: [
          {
            type: "paragraph",
            template: "<strong>委託4-1</strong>。根據「生命靈樹治癒法則」，最適合執行任務的冒險者是{f1}、{f2}和{f3}。",
            fields: {
              f1: { type: "select", options: ADVENTURERS_POOL_4, isCharacter: true, group: "w4_tree" },
              f2: { type: "select", options: ADVENTURERS_POOL_4, isCharacter: true, group: "w4_tree" },
              f3: { type: "select", options: ADVENTURERS_POOL_4, isCharacter: true, group: "w4_tree" }
            },
            setValidations: [
              { group: "w4_tree", set: ["青羽・洛恩", "阿雅・斑紋", "無名"] }
            ]
          },
          {
            type: "paragraph",
            template: "秘密委託的部分，因為「黃金寶珠」的功用是{f4}，在失去神器後，問題變的嚴重許多，只有來自{f5}的{f6}不受影響，所以神器現在一定在那裡。考量到當地環境和任務性質，最適合這個任務的人選就是{f7}、{f8}和{f9}。",
            fields: {
              f4: { type: "select", options: ["促進作物生長", "生成防禦結界", "杜絕糧食蟲害", "治癒病危患者", "增加食物美味"], answer: "杜絕糧食蟲害" },
              f5: { type: "input", answer: "北國" },
              f6: { type: "input", answer: ["月餅", "可翔月餅"] },
              f7: { type: "select", options: ADVENTURERS_POOL_4, isCharacter: true, group: "w4_north" },
              f8: { type: "select", options: ADVENTURERS_POOL_4, isCharacter: true, group: "w4_north" },
              f9: { type: "select", options: ADVENTURERS_POOL_4, isCharacter: true, group: "w4_north" }
            },
            setValidations: [
              { group: "w4_north", set: ["青羽・洛恩", "阿雅・斑紋", "無名"] }
            ]
          }
        ],
        successText: "原來是這樣啊。難怪我總覺得可翔月餅比較好吃。\n你看，我還特地留了一塊給你，好好品嘗吧。\n這下問題全都解決，可以開開心心過中秋了！",
        nextEnvelope: "請打開信封E"
      }
    ]
  },

  // ================= 仲秋之月，第三週 =================
  w5: {
    title: "仲秋之月，第三週",
    verifyQuestion: "請問本週報紙介紹的地點是哪裡？",
    verifyAnswer: ["花池"],
    stages: [
      {
        presidentText: "這麼快就查明所有真相了嗎？\n好吧，那就請你告訴我，\n在黑水村的案件中，我們搞錯了什麼？又應該如何補救？",
        blocks: [
          {
            type: "paragraph",
            template: "<strong>委託5-1</strong>。在黑水村的案件，正確的{f1}應該是{f2}。因此，這次應該派出的冒險者是{f3}、{f4}、{f5}、{f6}和{f7}。",
            fields: {
              f1: { type: "select", options: ["任務地點", "敵人技能", "討伐對象", "出擊時間"], answer: "討伐對象" },
              f2: { type: "input", answer: "地牛" },
              f3: { type: "select", options: ADVENTURERS_POOL_4, isCharacter: true, group: "w5_bull" },
              f4: { type: "select", options: ADVENTURERS_POOL_4, isCharacter: true, group: "w5_bull" },
              f5: { type: "select", options: ADVENTURERS_POOL_4, isCharacter: true, group: "w5_bull" },
              f6: { type: "select", options: ADVENTURERS_POOL_4, isCharacter: true, group: "w5_bull" },
              f7: { type: "select", options: ADVENTURERS_POOL_4, isCharacter: true, group: "w5_bull" }
            },
            setValidations: [
              { group: "w5_bull", set: ["雷蒙・巴拉德", "阿雅・斑紋", "西萊爾・晨露", "托馬斯・佩里", "布倫希爾德・銅鬚"] }
            ]
          }
        ]
      },
      {
        presidentText: "原來是這樣啊。\n一開始就把目標搞錯了，所以才發生了那樣的憾事……\n那另一個委託呢？你已經有人選了嗎？",
        blocks: [
          {
            type: "paragraph",
            template: "<strong>委託5-2</strong>。由於委託需要兩位成年人，且體重加起來不可以超過一百公斤，符合的人選就只有{f1}和{f2}。",
            fields: {
              f1: { type: "select", options: ADVENTURERS_POOL_4, isCharacter: true, group: "w5_weight" },
              f2: { type: "select", options: ADVENTURERS_POOL_4, isCharacter: true, group: "w5_weight" }
            },
            setValidations: [
              { group: "w5_weight", set: ["無名", "莉莉安・席爾"] }
            ]
          }
        ]
      },
      {
        presidentText: "等等，這兩個人……好像哪裡怪怪的。\n這樣有符合任務需求嗎？",
        blocks: [
          {
            type: "paragraph",
            template: "有。因為無名其實是{f1}；而莉莉安其實是{f2}。",
            fields: {
              f1: { type: "input", answer: ["女"], matchMode: "includes" },
              f2: { type: "input", answer: ["男"], matchMode: "includes" }
            }
          }
        ]
      },
      {
        presidentText: "確實，這樣一切都說得通了。\n那關於秘密委託的部分，你有頭緒了嗎？",
        blocks: [
          {
            type: "paragraph",
            template: "艾薇之所以不可能是犯人，因為「黃金寶珠」太{f1}了。從上面的線索，可以發現{f2}其實沒有不在場證明，如果他和{f3}共同犯案，也能在不打開鎖的情況下，直接把整件神器調包。",
            fields: {
              f1: { type: "select", options: ["大", "重", "熱", "硬", "亮"], answer: "重" },
              f2: { type: "select", options: ADVENTURERS_POOL_4, answer: "艾登・霍恩", isCharacter: true },
              f3: { type: "select", options: ADVENTURERS_POOL_4, answer: "札卡・沃爾坎", isCharacter: true }
            }
          }
        ],
        successText: "原來他們才是真凶嗎？\n這麼說起來，難道巴林遇到搶匪的事情並非意外？\n我會立刻通知王國治安隊，希望一切都還來得及……",
        nextEnvelope: "請打開信封F"
      }
    ]
  },

  // ================= 仲秋之月，第四週 =================
  w6: {
    title: "仲秋之月，第四週",
    verifyQuestion: "請問本週委託6-2的標題是什麼？",
    verifyAnswer: ["尋找女兒"],
    stages: [
      {
        presidentText: "戰爭已經開始，敵人步步進逼。\n廢話就不多說了，對於人員部署，你有什麼計畫？",
        blocks: [
          {
            type: "paragraph",
            template: "{f1}、{f2}、{f3}、{f4}和{f5}因為可能直接和敵軍衝突，所以不需要派駐人力。其餘人力：",
            fields: {
              f1: { type: "select", options: WAR_LOCATIONS, group: "w6_danger" },
              f2: { type: "select", options: WAR_LOCATIONS, group: "w6_danger" },
              f3: { type: "select", options: WAR_LOCATIONS, group: "w6_danger" },
              f4: { type: "select", options: WAR_LOCATIONS, group: "w6_danger" },
              f5: { type: "select", options: WAR_LOCATIONS, group: "w6_danger" }
            },
            setValidations: [
              { group: "w6_danger", set: ["四利村", "岩石道", "蛇泉港", "鐵盔港", "山門村"] }
            ]
          },
          {
            type: "paragraph",
            template: "托馬斯・佩里應前往{f6}<br>" +
                      "莉莉安・席爾應前往{f7}<br>" +
                      "奈雅・霧痕應前往{f8}<br>" +
                      "青羽・洛恩應前往{f9}<br>" +
                      "艾薇・克勞應前往{f10}<br>" +
                      "克里斯・李應前往{f11}<br>" +
                      "伊格妮絲・蓋亞應前往{f12}<br>" +
                      "無名應前往{f13}<br>" +
                      "希爾溫・晨露應前往{f14}<br>" +
                      "雷蒙・巴拉德應前往{f15}<br>" +
                      "西萊爾・晨露應前往{f16}<br>" +
                      "露露・普羅特應前往{f17}<br>" +
                      "杜爾加・裂岩應前往{f18}<br>" +
                      "卡隆・泥爪應前往{f19}<br>" +
                      "阿雅・斑紋應前往{f20}<br>" +
                      "布倫希爾德・銅鬚應前往{f21}",
            fields: {
              f6: { type: "select", options: WAR_LOCATIONS, answer: "小典碉堡" },
              f7: { type: "select", options: WAR_LOCATIONS, answer: "中央城" },
              f8: { type: "select", options: WAR_LOCATIONS, answer: "西塔村" },
              f9: { type: "select", options: WAR_LOCATIONS, answer: "黑水村遺址" },
              f10: { type: "select", options: WAR_LOCATIONS, answer: "花池" },
              f11: { type: "select", options: WAR_LOCATIONS, answer: ["中央城", ""], optionalAllowBlank: true },
              f12: { type: "select", options: WAR_LOCATIONS, answer: "虛陽村" },
              f13: { type: "select", options: WAR_LOCATIONS, answer: "東瀛村" },
              f14: { type: "select", options: WAR_LOCATIONS, answer: "古老樹屋" },
              f15: { type: "select", options: WAR_LOCATIONS, answer: "虛陽村" },
              f16: { type: "select", options: WAR_LOCATIONS, answer: "虛陽村" },
              f17: { type: "select", options: WAR_LOCATIONS, answer: "中央城" },
              f18: { type: "select", options: WAR_LOCATIONS, answer: "大橋碉堡" },
              f19: { type: "select", options: WAR_LOCATIONS, answer: "花池" },
              f20: { type: "select", options: WAR_LOCATIONS, answer: "大橋碉堡" },
              f21: { type: "select", options: WAR_LOCATIONS, answer: "小典碉堡" }
            }
          }
        ]
      },
      {
        presidentText: "非常傑出的安排。\n那麼，你也找到富商的女兒了嗎？",
        blocks: [
          {
            type: "paragraph",
            template: "根據「亡者八音盒」、「光之烏」的儀式經過，再加上富商賈馬爾的話，可以推論出他的女兒就是{f1}。",
            fields: {
              f1: { type: "input", answer: "無名" }
            }
          }
        ]
      },
      {
        presidentText: "沒錯……\n他確實已經死了，但現在卻活著。\n舉辦儀式時，他人也剛好就在橋上。\n不愧是你，真的完美地解開了所有的委託。\n既然如此，最後這個問題應該也難不倒你吧。\n來這裡工作了這麼久，你知道我是誰嗎？\n當然，我說的不是「公會會長」這個職位，而是我的另一個身分。",
        blocks: [
          {
            type: "paragraph",
            template: "你就是{f1}。",
            fields: {
              f1: { type: "input", answer: ["史密斯", "議員史密斯", "史密斯議員", "國會議員史密斯"] }
            }
          }
        ]
      },
      {
        isFinal: true,
        presidentText: "很好。我果然沒有看錯你。\n是時候讓你知道一切了。",
        nextEnvelope: "請打開信封G"
      }
    ]
  }
};