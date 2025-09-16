// ----------------------------
// 初期データ
// ----------------------------
let items = { A: false, B: false, C: false, O: false };
let currentSpot = null;

// A〜J 訪問フラグ（Oは含めない）
let visited = { A:false, B:false, C:false, D:false, E:false, F:false, G:false, H:false, I:false, J:false };

// プレイヤーネーム
let playerName = "";

// クイズ問題集
const quizData = {
  A: { q: "【問題】金沢では7月1日に○○○饅頭を食べる風習がある。（※くらしの博物館内のクイズコーナーより）", a: "ひむろ" },
  B: { q: "【問題】金沢で金箔が有名になった理由は、加賀藩の文化奨励政策と、金沢の○○○の高い気候が金箔作りに合っていたため。（※9/6のスクコネ配信『金沢について解説します。』より）", a: "しつど" },
  C: { q: "【問題】金沢では娘が嫁ぐ際に手まりを持たせる風習がある。この風習は、江戸時代に徳川家から加賀藩主に嫁いだ○○○○が手まりを持参したことが始まりとされている。", a: "たまひめ" },
  O: { q: "【最終問題】ここまでプレイしてくれて○○○○！", a: "あんやと" }
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

  // スポット画像
  document.getElementById("popup-image").src = `spot${spotId}.jpg`;

  // リワードオーバーレイは毎回隠す（Oを開いた時点では絶対に出さない）
  const rewardOverlay = document.getElementById("reward-overlay");
  rewardOverlay.style.display = "none";

  // クイズ表示制御
  if (quizData[spotId]) {
    document.getElementById("quiz-area").style.display = "block";
    document.getElementById("quiz-answer").value = "";

    if (spotId === "O" && !allABCItemsCollected()) {
      // OはABCが揃うまで黒塗り
      document.getElementById("quiz-question").innerText = "■■■■■■■■■■■■■■■■■■■■■■■■";
    } else {
      document.getElementById("quiz-question").innerText = quizData[spotId].q;
    }
  } else {
    document.getElementById("quiz-area").style.display = "none";
  }

  // 表示
  document.getElementById("popup").style.display = "flex";

  // Oのロック更新
  checkUnlock();
}

// ----------------------------
// クイズ回答処理
// ----------------------------
document.getElementById("quiz-submit").onclick = () => {
  const ans = document.getElementById("quiz-answer").value.trim();

  // OはABCが揃っていない場合は解答不可
  if (currentSpot === "O" && !allABCItemsCollected()) {
    alert("まだ問題文が読めない… まずはアイテムA,B,Cを手に入れよう。");
    return;
  }

  const correct = quizData[currentSpot]?.a;
  if (!correct) return;

  if (ans === correct) {
    // 正解時の処理
    if (currentSpot === "O") {
      const popupImage = document.getElementById("popup-image");

      // spotO_light.jpgを表示
      popupImage.src = "spotO_light.jpg";

      // 一度クラスをリセットしてから再付与
      popupImage.classList.remove("color-transition");
      void popupImage.offsetWidth; // 再描画してアニメーションを確実にリセット
      popupImage.classList.add("color-transition");

      document.getElementById("quiz-area").style.display = "none";
      document.getElementById("popup-next-area").style.display = "block";
    } else {
      // ABCや他スポットの通常処理
      document.getElementById("popup-image").src = `item${currentSpot}.jpg`;
      document.getElementById("quiz-area").style.display = "none";
      getItem(currentSpot);
    }
  } else {
    alert("不正解です。もう一度挑戦してください。");
  }
};

document.getElementById("popup-next-btn").onclick = () => {
  const popupImage = document.getElementById("popup-image");

  // spotO_light.jpg → itemO.jpg に切り替え
  popupImage.src = "itemO.jpg";

  // 「進む」ボタンを隠す
  document.getElementById("popup-next-area").style.display = "none";

  // reward表示の準備
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  document.getElementById("reward-name").innerText = `【${playerName}】`;
  document.getElementById("reward-date").innerText = `蓮華暦105年　${month}月　${day}日`;

  // rewardを表示
  document.getElementById("reward-overlay").style.display = "block";
};


document.getElementById("quiz-cancel").onclick = () => {
  document.getElementById("popup").style.display = "none";
};

// ----------------------------
// アイテム・ロック
// ----------------------------
function getItem(name) {
  if (!items[name]) {
    items[name] = true;
    updateInventory();
    checkUnlock();
  }
}

function updateInventory() {
  const owned = Object.keys(items).filter(k => items[k]);
  document.getElementById("items").innerText = owned.length ? owned.join(", ") : "なし";
}

function checkUnlock() {
  const spotO = document.getElementById("spotO");
  if (!spotO) return;
  if (allVisitedAJ()) {
    spotO.classList.remove("locked"); // A〜J訪問済みで解放
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
["A","B","C","D","E","F","G","H","I","J"].forEach(id => {
  const el = document.getElementById(`spot${id}`);
  if (el) el.onclick = () => openSpotPopup(id);
});

const spotO = document.getElementById("spotO");
if (spotO) {
  spotO.onclick = () => {
    if (spotO.classList.contains("locked")) {
      alert("まだ封印されている… A〜Jすべてを巡ろう。");
      return;
    }
    openSpotPopup("O"); // この時点ではリワードを出さない
  };
}
