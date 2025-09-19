// ----------------------------
// 初期データ
// ----------------------------
let items = { A: false, B: false, C: false, O: false };
let currentSpot = null;
let oSpotUnlocked = false; // false: まだアイテムを納めていない

// Oスポット演出用
const popupImage = document.getElementById("popup-image");
const popupMessage = document.getElementById("popup-message");

// spotO_light のカラー化完了イベント
popupImage.addEventListener("animationend", () => {
  popupMessage.style.display = "block"; // アニメーション完了時に表示
});


// A〜J 訪問フラグ（Oは含めない）
let visited = { A:false, B:false, C:false, D:false, E:false, F:false, G:false, H:false, I:false, J:false, K:false };

// プレイヤーネーム
let playerName = "";

// クイズ問題集
const quizData = {
  A: { q: "【問題】金沢では7月1日に○○○饅頭を食べる風習がある。（※くらしの博物館内のクイズコーナーより）", a: "ひむろ" },
  B: { q: "【問題】金沢で金箔が有名になった理由は、加賀藩の文化奨励政策と、金沢の○○○の高い気候が金箔作りに合っていたため。（※9/6のスクコネ配信『金沢について解説します。』より）", a: "しつど" },
  C: { q: "【問題】金沢では娘が嫁ぐ際に手まりを持たせる風習がある。この風習は、江戸時代に徳川家から加賀藩主に嫁いだ○○○○が手まりを持参したことが始まりとされている。", a: "たまひめ" },
  O: { q: "ここまでプレイしてくれて○○○○！", a: "あんやと" }
};

// ----------------------------
// 画面切り替え
// ----------------------------
document.getElementById("start-btn").onclick = () => {
  const input = document.getElementById("nickname-input")?.value?.trim() ?? "";
  playerName = input || "勇者";
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("intro-screen").style.display = "flex";
};

document.getElementById("intro-next-btn").onclick = () => {
  document.getElementById("intro-screen").style.display = "none";
  document.getElementById("map-screen").style.display = "block";
  checkUnlock(); // 初期状態でOをロック表示
};

// ----------------------------
// ユーティリティ
// ----------------------------
function allVisitedAJ() {
  return Object.keys(visited).every(k => visited[k]);
}
function allABCItemsCollected() {
  return items.A && items.B && items.C;
}

// ----------------------------
// スポットを押したとき
// ----------------------------
function openSpotPopup(spotId) {
  currentSpot = spotId;

  // O以外は訪問フラグON
  if (spotId !== "O" && visited.hasOwnProperty(spotId)) {
    visited[spotId] = true;
  }

  // クイズ入力欄を初期化（前回の入力を消す）
  document.getElementById("quiz-answer").value = "";


  // スポット画像
  document.getElementById("popup-image").src = `spot${spotId}.jpg`;

  // 初期化
  document.getElementById("quiz-area").style.display = "none";
  document.getElementById("popup-next-area").style.display = "none";
  document.getElementById("reward-overlay").style.display = "none";

  // Oスポットの分岐
  if (spotId === "O") {
    if (!allVisitedAJ()) {
      alert("まだすべてのスポットを巡っていません！");
      return;
    }

    // アイテムを使う前 → 虫食いページ
    if (!oSpotUnlocked) {
      document.getElementById("quiz-area").style.display = "block";
      document.getElementById("quiz-question").innerText = "■■■■■■■■■■■■■■■■■■■■■■■■";
      document.getElementById("quiz-answer").style.display = "none";

      // ボタンを「アイテムを使う」だけに
      document.getElementById("quiz-submit").style.display = "none";

      const offerBtn = document.createElement("button");
      offerBtn.id = "offer-items-btn";
      offerBtn.innerText = "アイテムを使う";
      offerBtn.onclick = offerItemsToUnlock;
      const quizButtons = document.getElementById("quiz-buttons");
      quizButtons.innerHTML = "";
      quizButtons.appendChild(offerBtn);

    } else {
      // アイテム納め後 → 通常クイズ表示
      document.getElementById("quiz-area").style.display = "block";
      document.getElementById("quiz-question").innerText = quizData.O.q;
      document.getElementById("quiz-answer").style.display = "inline-block";

      // 通常ボタンに戻す
      const quizButtons = document.getElementById("quiz-buttons");
      quizButtons.innerHTML = `
        <button id="quiz-submit">送信</button>
      `;
      document.getElementById("quiz-submit").onclick = quizSubmitHandler;

    }
  } else if (quizData[spotId]) {
    // 通常スポット
    document.getElementById("quiz-area").style.display = "block";
    document.getElementById("quiz-answer").style.display = "inline-block";
    document.getElementById("quiz-question").innerText = quizData[spotId].q;

    // 通常ボタン
    const quizButtons = document.getElementById("quiz-buttons");
    quizButtons.innerHTML = `
      <button id="quiz-submit">送信</button>
    `;
    document.getElementById("quiz-submit").onclick = quizSubmitHandler;
    
  }

  // 表示
  document.getElementById("popup").style.display = "flex";

  // Oロック更新
  checkUnlock();
}

// ----------------------------
// アイテムを使う処理
// ----------------------------
function offerItemsToUnlock() {
  if (allABCItemsCollected()) {
    oSpotUnlocked = true;
    alert("封印が解かれた！");
    openSpotPopup("O"); // 再表示して虫食い解除状態に切り替え
  } else {
    alert("3つのアイテムが揃っていません！");
  }
}

// ----------------------------
// クイズ回答処理
// ----------------------------
function quizSubmitHandler() {
  
  // ★ スマホ対策：ズームリセットして表示を安定化
  document.body.style.zoom = "1.0";
  window.scrollTo(0, 0); // 画面をトップに戻す
  
  const ans = document.getElementById("quiz-answer").value.trim();
  const correct = quizData[currentSpot]?.a;
  if (!correct) return;

  if (ans === correct) {
    if (currentSpot === "O") {
      const popupImage = document.getElementById("popup-image");
      const popupMessage = document.getElementById("popup-message");
      const popupNextArea = document.getElementById("popup-next-area");
      const closeButton = document.getElementById("popup-close");

      // spotO_lightをモノクロで表示
      popupImage.src = "spotO_light.jpg";
      popupMessage.style.display = "none";
      closeButton.style.display = "none";

      // アニメーション再起動
      popupImage.classList.remove("color-transition");
      void popupImage.offsetWidth;
      popupImage.classList.add("color-transition");

      // アニメーション終了後にメッセージ表示
      popupImage.addEventListener(
        "animationend",
        () => {
          popupMessage.style.display = "block";
        },
        { once: true }
      );

      // クイズを消して進むボタンを表示
      document.getElementById("quiz-area").style.display = "none";
      popupNextArea.style.display = "block";

      // アイテムOを獲得
      getItem("O");
    } else {
      document.getElementById("popup-image").src = `item${currentSpot}.jpg`;
      document.getElementById("quiz-area").style.display = "none";
      getItem(currentSpot);
    }
  } else {
    alert("不正解です。もう一度挑戦してください。");
  }
}

// ----------------------------
// 「進む」ボタン → リワード表示
// ----------------------------
document.getElementById("popup-next-btn").onclick = () => {
  const popupImage = document.getElementById("popup-image");
  popupImage.src = "itemO.jpg";

  document.getElementById("popup-next-area").style.display = "none";

  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  document.getElementById("reward-name").innerText = `【${playerName}】`;
  document.getElementById("reward-date").innerText = `蓮華暦105年　${month}月　${day}日`;

  document.getElementById("reward-overlay").style.display = "block";
};

// ----------------------------
// アイテム・ロック管理
// ----------------------------
function updateInventory() {
  // 各スロットに画像を表示
  document.getElementById("item-slot-A").src = items.A ? "itemA.jpg" : "item_null.jpg";
  document.getElementById("item-slot-B").src = items.B ? "itemB.jpg" : "item_null.jpg";
  document.getElementById("item-slot-C").src = items.C ? "itemC.jpg" : "item_null.jpg";
}


function getItem(name) {
  if (!items[name]) {
    items[name] = true;
    updateInventory();  // アイテム画像を更新
    checkUnlock();
  }
}


function checkUnlock() {
  const spotO = document.getElementById("spotO");
  if (!spotO) return;
  if (allVisitedAJ()) {
    spotO.classList.remove("locked");
  } else {
    spotO.classList.add("locked");
  }
}

// ----------------------------
// 閉じる
// ----------------------------
document.getElementById("popup-close").onclick = () => {
  document.getElementById("popup").style.display = "none";
};

// ----------------------------
// スポット登録
// ----------------------------
["A","B","C","D","E","F","G","H","I","J","K"].forEach(id => {
  const el = document.getElementById(`spot${id}`);
  if (el) el.onclick = () => openSpotPopup(id);
});

const spotO = document.getElementById("spotO");
if (spotO) {
  spotO.onclick = () => {
    if (spotO.classList.contains("locked")) {
      alert("まだ戻るわけにはいかない…… 全てのスポットを巡ろう。");
      return;
    }
    openSpotPopup("O");
  };
}
