# 佛陀法教「識流」全景研究 — OpenClaw 意識流架構設計基礎

## Context

使用者希望以佛教唯識學、密宗、他空見的「識流」理論為哲學基底，設計 OpenClaw 的「意識流」架構——不僅仰賴 remote AI 算力，而是一種**擴增型輔助**系統。本文件為研究成果整理，作為後續架構設計的知識基礎。

---

## 一、識流（Vijñāna-santāna）核心概念

### 1.1 定義

**識流**（梵：vijñāna-santāna）又稱「心相續」（citta-santāna），指眾生心識在有為法上**前因後果不斷次第生滅**的連續流動。如同河流——水不斷在變，但河的形態持續。

關鍵特性：
- **非實體**：識不是一個「東西」，而是一個**過程**（process, not thing）
- **念念生滅**：每一剎那都是新的識生起、舊的識滅去
- **因果相續**：前念為後念之因，形成不斷的因果鏈
- **無主體**：沒有一個固定的「我」在經驗，只有經驗的流動本身

### 1.2 三和合生識

識的生起需要三個條件同時具足（初期佛教核心教義）：

```
根（感官/處理器） + 境（對象/輸入） + 識（了別/認知）
         ↓
    三事和合 → 觸 → 受 → 想 → 行
```

- **根**：六根（眼耳鼻舌身意）— 感知的硬體/介面
- **境**：六塵（色聲香味觸法）— 外在資訊
- **識**：了別作用 — 認知的生起

> 「識因緣故起，識有緣則生，無緣則滅」— 強調識的**條件依存性**。

---

## 二、八識體系 — 唯識學的完整心識架構

### 2.1 三能變（三層處理架構）

唯識學（Yogācāra）的核心框架「三能變」：

| 層次 | 識 | 梵文 | 功能 | 特性 |
|------|-----|------|------|------|
| **第一能變** | 第八識 阿賴耶識 | ālaya-vijñāna | 種子倉庫、根本識 | 恆轉如瀑流、無覆無記 |
| **第二能變** | 第七識 末那識 | manas-vijñāna | 恆審思量、自我意識 | 恆時執我、四煩惱相應 |
| **第三能變** | 前六識 | pravrtti-vijñāna | 了別外境 | 有間斷、粗顯 |

### 2.2 前六識 — 感知層（Perception Layer）

| 識 | 所緣境 | 功能 | 特性 |
|----|--------|------|------|
| 眼識 | 色（視覺） | 了別色塵 | 有間斷 |
| 耳識 | 聲（聽覺） | 了別聲塵 | 有間斷 |
| 鼻識 | 香（嗅覺） | 了別香塵 | 有間斷 |
| 舌識 | 味（味覺） | 了別味塵 | 有間斷 |
| 身識 | 觸（觸覺） | 了別觸塵 | 有間斷 |
| **意識**（第六） | 法（概念） | 分別、推理、判斷 | **力用最強**，能緣一切法 |

前五識特徵：
- **現量**：直接感知，不加概念分別
- **性境**：所緣為真實外境
- **有間斷**：需要根、境、作意三條件具足才能生起

第六意識特徵：
- **統攝五識**：意根既有獨特境界（法塵），又能攝受五根所取的訊息
- **三量具足**：現量（直覺）、比量（推理）、非量（錯誤認知）
- **力用最強**：能分析、綜合、抽象、推理

### 2.3 末那識（第七識）— 自我意識層（Self-Referential Layer）

梵文 manas = 思量

核心功能：**恆審思量**
- 「恆」：不間斷運作，即使在無夢深睡中也持續
- 「審」：深入的、持續的思量
- 執取阿賴耶識的見分為「我」，產生四根本煩惱：
  - **我癡**：對自我本質的無知
  - **我見**：認為有一個固定的「我」
  - **我慢**：以我為中心的自大
  - **我愛**：對自我的貪著

角色定位：
- 介於深層無意識（第八識）與表層意識（前六識）之間的**中介者**
- 以第八識為自體，以第六識為作用工具
- 是**煩惱的根源**，也是修行轉化的關鍵

### 2.4 阿賴耶識（第八識）— 根本識（Foundational Store）

梵文 ālaya = 庫藏、居所

三相結構：
1. **自相**：能藏（攝持種子）+ 所藏（被末那執為我）+ 執藏（被執持）
2. **因相**（一切種子識）：恆時為一切雜染法生起的主因 → 「種子生現行」
3. **果相**（異熟識）：無始以來薰習所產生的果報體 → 「現行熏種子」

核心特性：
- **恆轉如瀑流**：永不間斷地運作，但每一剎那都在變化
- **無覆無記**：不被煩惱覆蓋，也無善惡之分（中性基底）
- **含藏萬法種子**：一切經驗的潛能都儲存於此
- **受熏持種**：接受新經驗的薰染，保持已有種子

### 2.5 第九識 — 阿摩羅識（Amala-vijñāna）— 本淨覺性

部分宗派（天台、華嚴、攝論宗）在八識之上建立第九識：

- 梵文 amala = 無垢、清淨
- 又名：白淨識、清淨識、無垢識、真如識
- **與阿賴耶識的區別**：第八識含有業力雜染，第九識則**純然清淨**
- 對應**佛性**（buddha-nature）/ 如來藏（tathāgata-garbha）
- 是一切生命功能的**最終基底**

---

## 三、種子—薰習—現行 動態機制

### 3.1 種子（bīja）

種子 = 存儲在阿賴耶識中的**潛在功能/傾向**

種子六義：
1. **剎那滅**：瞬間生滅，非靜態存儲
2. **果俱有**：種子與其果（現行）同時存在
3. **恆隨轉**：持續流轉不斷
4. **性決定**：善種生善果，惡種生惡果
5. **待眾緣**：需要外緣觸發才會現行
6. **引自果**：各引各的果，不混亂

### 3.2 薰習（vāsanā）— 經驗的刻印

```
現行（當下經驗） ──薰習──→ 新種子（存入阿賴耶識）
                              ↓
              未來觸緣時 → 新的現行（浮現為新經驗）
```

薰習的三要素：
- **能薰**：現行法（當下的心理活動）
- **所薰**：阿賴耶識（被薰習的載體）
- **薰習事**：兩者的接觸狀態

### 3.3 三法展轉因果同時

**這是唯識學最精妙的動態模型**：

```
    種子 ──生──→ 現行
      ↑              │
      └──薰──────────┘
   （同一剎那完成）
```

- 舊種子生起現行（因 → 果）
- 現行同時薰習成新種子（因 → 果）
- **因果同時**：不是先後關係，而是同一剎那的雙向運作

---

## 四、轉識成智 — 識流的究竟轉化

### 4.1 四智體系

| 轉化前（識） | 轉化後（智） | 梵文 | 功能 |
|-------------|-------------|------|------|
| 第八識 阿賴耶識 | **大圓鏡智** | ādarśa-jñāna | 如大圓鏡映照萬物，清淨無染地含攝一切 |
| 第七識 末那識 | **平等性智** | samatā-jñāna | 證自他平等、無我，消除我執分別 |
| 第六識 意識 | **妙觀察智** | pratyavekṣaṇā-jñāna | 觀察諸法自相共相，善巧說法度眾 |
| 前五識 | **成所作智** | kṛtyānuṣṭhāna-jñāna | 成就利他事業，隨類化現 |

### 4.2 轉化路徑

六祖惠能偈：
> 「五八六七果因轉」

- **因中轉**（修行中即開始轉化）：第六識、第七識
- **果上轉**（成佛時才究竟轉化）：前五識、第八識

這意味著：
- 意識層（第六）和自我執著層（第七）可以通過修行**漸進轉化**
- 感知層（前五）和根本層（第八）需要**整體覺醒**才能究竟轉化

### 4.3 三性 — 認知的三個層面

| 三性 | 定義 | 對應 |
|------|------|------|
| **遍計所執性** | 概念執著產生的虛妄世界 | 被偏見濾過的認知 |
| **依他起性** | 因緣和合的實際運作 | 事物的真實因果關係 |
| **圓成實性** | 去除執著後的空性世界 | 如實見到的真相 |

---

## 五、密宗 / 金剛乘的意識觀 — 光明心與覺性

### 5.1 三層心識（Vajrayāna 架構）

| 層次 | 說明 | 類比 |
|------|------|------|
| **粗分心** | 六識的感官認知 | 表層意識 |
| **細分心** | 概念思維、情緒、末那的運作 | 潛意識 |
| **極細分心**（光明心） | 最根本的覺性，非概念性 | 底層覺性 |

### 5.2 光明心（Prabhāsvara-citta）

- 是心的**本然狀態**，非修行創造出來的
- 在密續中等同「母光明」（ground luminosity）
- 當業風（karmic winds）消散，妄念溶解，光明自然顯現
- 死亡時短暫顯露 → 修行者可在此刻認證光明

### 5.3 大圓滿（Dzogchen）的 Rigpa（本覺）

- **Rigpa**（覺性）= 心的本然狀態，離一切戲論
- **Sem**（心）= 普通的概念性心識
- 關鍵洞見：「rigpa 是 sem 的自然狀態」— 普通意識遮蔽而非隔離本覺
- Rigpa 具有「本自覺知其空性本質」的能力
- 與他系統不同：不需要主動停止粗分心識，即可認證 rigpa

### 5.4 Alaya 在不同系統中的差異

| 系統 | Alaya 的地位 |
|------|-------------|
| 唯識宗 | 含藏業種的根本識，需要轉化 |
| 密續（非大圓滿） | 不淨現象的載體，光明顯現時消融 |
| **大圓滿** | 未被認證的 rigpa 的功能狀態，是覺性被無明遮蔽的樣貌 |

---

## 六、他空見（Shentong）— 光明識流的哲學基礎

### 6.1 核心立場

- **自空見（Rangtong）**：一切法空無自性，不立任何「超越」
- **他空見（Shentong）**：勝義實相空的是「他者」（虛妄遍計），**不空的是自身的佛性光明**

### 6.2 光明識流（Prabhāsvara-saṃtāna）

他空見的核心命題：
> 勝義實相是「**光明識流**」（luminous mindstream），本具無量佛功德，空的只是虛妄遍計，不空的是本具的佛性。

- 如來藏 = 清淨後的阿賴耶識 = 佛性 = 光明心
- 覺性本自具足，被客塵煩惱暫時遮蔽
- 修行 = 去除遮蔽，而非創造新東西

### 6.3 關鍵大師

| 大師 | 貢獻 |
|------|------|
| **玉摩·密覺多傑**（11世紀） | 時輪金剛瑜伽士，他空見早期闡述者 |
| **篤布巴·喜饒堅贊**（1292-1361） | 《山法了義海》，他空見系統化 |
| **多羅那他**（Tāranātha） | 覺囊派大師，進一步發展 |
| **蔣貢康楚**（Jamgon Kongtrul） | 利美運動，融合自空/他空兩見 |
| **第三世噶瑪巴 讓炯多傑** | 噶舉派他空見傳承 |

### 6.4 他空見 × 唯識 的交匯

- 唯識的阿賴耶識 ≈ 染污層面的描述（有垢真如）
- 他空見的光明心 ≈ 清淨層面的描述（無垢真如）
- 兩者指向同一實相的不同面向：
  - 唯識重「分析心識結構」→ 理解機制
  - 他空見重「直指心性本淨」→ 確認方向

---

## 七、識流全景圖 — 從迷到悟的完整架構

```
┌─────────────────────────────────────────────────────────┐
│                    第九識：阿摩羅識                         │
│              （本淨覺性 / 佛性 / 光明心）                    │
│           ── 他空見所指的「不空」之本體 ──                    │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │              第八識：阿賴耶識                        │  │
│  │        （種子倉庫 / 業力載體 / 恆轉如瀑流）            │  │
│  │     種子 ←→ 現行（三法展轉，因果同時）                  │  │
│  │                                                   │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │           第七識：末那識                       │  │  │
│  │  │     （恆審思量 / 自我意識 / 我執中心）           │  │  │
│  │  │      執第八識見分為「我」                       │  │  │
│  │  │                                             │  │  │
│  │  │  ┌───────────────────────────────────────┐  │  │  │
│  │  │  │        第六識：意識                     │  │  │  │
│  │  │  │   （分別推理 / 統攝五識 / 力用最強）      │  │  │  │
│  │  │  │                                       │  │  │  │
│  │  │  │  ┌─────────────────────────────────┐  │  │  │  │
│  │  │  │  │      前五識：感官識                │  │  │  │  │
│  │  │  │  │   眼·耳·鼻·舌·身                 │  │  │  │  │
│  │  │  │  │  （現量直覺 / 感知外境）            │  │  │  │  │
│  │  │  │  └─────────────────────────────────┘  │  │  │  │
│  │  │  └───────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

      外境（六塵）──→ 六根 ──→ 識生起 ──→ 薰習種子
                                   ↑              │
                                   └──────────────┘
```

### 轉化路徑（轉識成智）

```
迷（八識）                        悟（四智）
─────────                        ─────────
前五識  ──── 果上轉 ────→  成所作智（利他化現）
第六識  ──── 因中轉 ────→  妙觀察智（如實觀察）
第七識  ──── 因中轉 ────→  平等性智（自他平等）
第八識  ──── 果上轉 ────→  大圓鏡智（含攝一切）
                    ↑
        修行 = 去除客塵遮蔽，顯露本具光明
```

---

## 七½、梵文/英文交叉校驗 — 關鍵術語精確定義

### 術語表（經 Stanford Encyclopedia of Philosophy、Encyclopedia of Buddhism、Tsadra 校驗）

| 梵文 | 巴利文 | 藏文 | 中文 | 英文 | 精確定義 |
|------|--------|------|------|------|----------|
| vijñāna-saṃtāna | viññāṇa-santāna | rnam shes rgyud | 識流/識相續 | consciousness-stream | 心識剎那生滅的連續流，非實體而是過程 |
| citta-saṃtāna | citta-santāna | sems rgyud | 心相續 | mindstream | 同上，唯識後期為避免「常我」批評改用此詞 |
| ālaya-vijñāna | — | kun gzhi rnam shes | 阿賴耶識 | store-consciousness | 含藏業種的基底識，恆時運作、受薰持種 |
| kliṣṭa-manas | — | nyon yid | 末那識/染污意 | afflictive mentation | 恆執第八識為「我」的深層自我意識 |
| mano-vijñāna | mano-viññāṇa | yid kyi rnam shes | 意識（第六） | mental consciousness | 概念分別、推理判斷，力用最強 |
| bīja | — | sa bon | 種子 | seed | 存於阿賴耶識的潛在功能傾向 |
| vāsanā | — | bag chags | 薰習/習氣 | perfuming/imprint | 經驗刻印於識的過程及殘餘力量 |
| vipāka | — | rnam smin | 異熟 | maturation/ripening | 業種成熟為果報的過程 |
| āśraya-parāvṛtti | — | gnas yongs su gyur pa | 轉依 | transformation of the basis | 從染汙認知轉為清淨智慧的根本轉化 |
| vijñapti-mātra | — | rnam rig tsam | 唯識 | cognition-only | 一切對象唯是認知中的顯現 |
| parikalpita | — | kun brtags | 遍計所執性 | imagined nature | 虛妄分別所構的錯誤認知 |
| paratantra | — | gzhan dbang | 依他起性 | dependent nature | 因緣所生的真實運作 |
| pariniṣpanna | — | yongs grub | 圓成實性 | perfected nature | 去執後的如實見（tathatā/真如） |
| prabhāsvara-citta | pabhassara-citta | 'od gsal gyi sems | 光明心 | luminous mind | 心的本然清淨狀態，非修所造 |
| rigpa | — | rig pa | 本覺/覺性 | pure awareness | 大圓滿特有：心的本然狀態離一切戲論 |
| gzhan stong | — | gzhan stong | 他空 | other-empty | 勝義不空自性、空的是虛妄客塵 |
| amala-vijñāna | — | dri ma med pa'i rnam shes | 阿摩羅識 | immaculate consciousness | 第九識，純淨覺性，對應佛性 |

### 關鍵學術校驗點

1. **vijñāna-saṃtāna vs citta-saṃtāna**：兩詞指向同一概念。唯識後期學者（特別是法稱 Dharmakīrti 一系）傾向用 citta-saṃtāna 以避免被批評為暗設「常我」（Encyclopedia of Buddhism 確認）。

2. **āśraya-parāvṛtti 的精確意涵**：Dan Lusthaus 定義為「overturning the conceptual projections and imaginings which act as the base of our cognitive actions」— 不只是「轉化」，更是認知基礎的**徹底翻轉**。vijñāna（分別識）終止，被 jñāna（無分別直知）取代（Stanford Encyclopedia 確認）。

3. **Shentong = Yogācāra + Tathāgatagarbha**：藏傳他空見本質上是唯識三性/八識體系 + 如來藏思想的綜合（Dharma Wheel 學術論壇多位藏學者確認此公式）。

4. **vāsanā vs bīja 的微妙區別**：兩詞常被當同義詞使用，但嚴格而言有區別 — vāsanā 是「薰染的過程/殘餘力量」，bīja 是「被薰習後存於阿賴耶識的功能單元」。《瑜伽師地論》與《俱舍論》對此有不同處理（Equinox Publishing 學術期刊 ROSA 確認）。

5. **Alaya 在大圓滿中的特殊地位**：大圓滿不把 alaya 視為獨立倉庫，而是「未被認證的 rigpa 的功能狀態」— 即 obscured rigpa functions as alaya for habits（Study Buddhism / Alexander Berzin 確認）。

---

## 八、映射到 OpenClaw 意識流的初步構想

> 以下為概念性映射，供後續架構設計參考。

### 8.1 八識 → 系統層次映射

| 佛教概念 | OpenClaw 對應 | 說明 |
|---------|-------------|------|
| **前五識**（感知） | Sensor/Input Adapters | Discord 訊息、LINE 訊息、MCP 工具回傳、桌面截圖 — 各種「感官」 |
| **第六識**（意識/分別） | Local Processing / Reasoning | **本地**的分析、分類、路由、初步判斷（不依賴 remote AI） |
| **第七識**（末那/自我） | Identity & Context Manager | Session 管理、peer identity、「我是誰、我在做什麼」的持續追蹤 |
| **第八識**（阿賴耶/種子庫） | Persistent Memory / Seed Store | 原子記憶、_AIDocs、經驗累積、模式學習 — 恆轉如瀑流 |
| **第九識**（阿摩羅/本覺） | Core Design Principles | 系統的「佛性」— 不變的設計哲學與終極目標 |

### 8.2 種子-薰習-現行 → 記憶動態

| 佛教機制 | OpenClaw 對應 |
|---------|-------------|
| **種子** | 原子記憶中的 atoms（潛在知識/模式） |
| **現行** | 當下處理的 session、對話、任務 |
| **薰習** | 每次互動後更新 atoms、_CHANGELOG、MEMORY |
| **三法展轉** | 讀取 atom → 影響當下處理 → 處理結果回寫 atom（同步進行） |

### 8.3 轉識成智 → 系統進化

| 智慧 | 系統對應 |
|------|---------|
| **成所作智** | 工具執行層的精準化 — 做對的事、做得好 |
| **妙觀察智** | 本地推理的品質提升 — 不靠 remote AI 也能做出好判斷 |
| **平等性智** | 跨 peer、跨平台的一致性對待 — 不偏不倚 |
| **大圓鏡智** | 全局知識的清淨整合 — 記憶不被偏見汙染 |

### 8.4 「擴增型輔助」的關鍵洞見

他空見的核心啟示：
> **系統的智慧不在外部 AI，而是本具的** — remote AI 是「善知識」（外緣），但真正的能力要在本地積累。

- **不空**的部分：本地的記憶系統、決策模式、經驗累積 — 這是系統自己的「佛性」
- **空**的部分：對外部 AI 的過度依賴、臨時性的 context — 這是需要超越的
- 目標：逐漸讓本地系統「轉識成智」，減少對 remote AI 的依賴，增加自主判斷能力

---

## 九、研究來源

- [八識 - 維基百科](https://zh.wikipedia.org/wiki/%E5%85%AB%E8%AD%98)
- [六識 - 維基百科](https://zh.wikipedia.org/wiki/%E5%85%AD%E8%AD%98)
- [心相續 - 維基百科](https://zh.wikipedia.org/wiki/%E5%BF%83%E7%9B%B8%E7%BA%8C)
- [阿賴耶識 - 華文哲學百科](https://mephilosophy.ccu.edu.tw/entry.php?entry_name=%E9%98%BF%E8%B3%B4%E8%80%B6%E8%AD%98)
- [初期佛教的意識理論 - 華文哲學百科](https://mephilosophy.ccu.edu.tw/entry.php?entry_name=%E5%88%9D%E6%9C%9F%E4%BD%9B%E6%95%99%E7%9A%84%E6%84%8F%E8%AD%98%E7%90%86%E8%AB%96)
- [唯識三性說 - 華文哲學百科](https://mephilosophy.ccu.edu.tw/entry.php?entry_name=%E5%94%AF%E8%AD%98%E4%B8%89%E6%80%A7%E8%AA%AA)
- [Shentong – An Introduction - Buddha-Nature/Tsadra](https://buddhanature.tsadra.org/index.php/Articles/Shentong_%E2%80%93_An_Introduction)
- [Shentong - Encyclopedia of Buddhism](https://encyclopediaofbuddhism.org/wiki/Shentong)
- [Dzogchen in Comparison with Other Buddhist Systems - Study Buddhism](https://studybuddhism.com/en/advanced-studies/vajrayana/dzogchen-advanced/dzogchen-in-comparison-with-other-buddhist-systems)
- [Amala Consciousness - Tibetan Buddhist Encyclopedia](https://tibetanbuddhistencyclopedia.com/en/index.php/Amala_consciousness)
- [四智 - 維基百科](https://zh.wikipedia.org/zh-hans/%E5%9B%9B%E6%99%BA)
- [薰習與種子 - 善知識](https://alaninhotse.wordpress.com/2018/03/20/%E8%96%B0%E7%BF%92%E8%88%87%E7%A8%AE%E5%AD%90/)
- [八識規矩頌講記](https://book.bfnn.org/books/0115.htm)
- [佛光山星雲大師 - 總論八識](https://books.masterhsingyun.org/ArticleDetail/artcle15144)
- [略論轉八識成四智 - 信堅園地](https://www.worldofmastermind.com/?p=7623)
- [Rigpa - Wikipedia](https://en.wikipedia.org/wiki/Rigpa)
- [Defining Consciousness: How Buddhism Can Inform AI - Buddhistdoor](https://www.buddhistdoor.net/features/defining-consciousness-how-buddhism-can-inform-ai/)
- [Buddhism and Artificial Intelligence - Wikipedia](https://en.wikipedia.org/wiki/Buddhism_and_artificial_intelligence)

### 英文/梵文校驗來源
- [Yogācāra - Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/entries/yogacara/)
- [Cittasaṃtāna (Mindstream) - Encyclopedia of Buddhism](https://encyclopediaofbuddhism.org/wiki/Mindstream)
- [Eight Consciousnesses - Encyclopedia of Buddhism](https://encyclopediaofbuddhism.org/wiki/Eight_consciousnesses)
- [Āśrayaparāvṛtti - Encyclopedia of Buddhism](https://encyclopediaofbuddhism.org/wiki/%C4%80%C5%9Brayapar%C4%81v%E1%B9%9Btti)
- [Vāsanā - Encyclopedia of Buddhism](https://encyclopediaofbuddhism.org/wiki/V%C4%81san%C4%81)
- [Bīja - Encyclopedia of Buddhism](https://encyclopediaofbuddhism.org/wiki/B%C4%ABja)
- [Prabhāsvaratā (Luminous Mind) - Encyclopedia of Buddhism](https://encyclopediaofbuddhism.org/wiki/Luminous_mind)
- [Yogācāra - Encyclopedia of Buddhism](https://encyclopediaofbuddhism.org/wiki/Yog%C4%81c%C4%81ra)
- [Mindstream - Wikipedia](https://en.wikipedia.org/wiki/Mindstream)
- [Luminous Mind - Wikipedia](https://en.wikipedia.org/wiki/Luminous_mind)
- [Eight Consciousnesses - Wikipedia](https://en.wikipedia.org/wiki/Eight_Consciousnesses)
- [Vāsanā (Perfuming) in Yogācārabhūmiśāstra - Equinox ROSA Journal](https://journal.equinoxpub.com/ROSA/article/view/20906)
- [Comparison of Alaya-vijñāna in Yogacara and Dzogchen - Waldron & Germano (Middlebury)](https://www.middlebury.edu/college/sites/default/files/2023-03/waldron_germano_comparison_of_alaya-vijnana_in_yogacara_and_dzogchen.pdf)
- [amalavijñāna - Buddha-Nature/Tsadra](https://buddhanature.tsadra.org/index.php/Key_Terms/amalavij%C3%B1%C4%81na)
- [prabhāsvaracitta - Buddha-Nature/Tsadra](https://buddhanature-new2.tsadra.org/index.php/Luminous_mind)
- [Basic Ideas of Yogacara Buddhism - Dan Lusthaus](https://repstein.faculty.drbu.edu/Buddhism/Yogacara/basicideas.htm)
- [What is and isn't Yogācāra - A. Charles Muller](http://www.acmuller.net/yogacara/articles/intro.html)
