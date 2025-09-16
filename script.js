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
  A: { q: "Q. 金沢駅前にある有名な門の名前は○○門（つづみ）", a: "つづみ" },
  B: { q: "Q. 金沢で金箔が有名なのは…○○○の高い気候（しつど）", a: "しつど" },
  C: { q: "Q. 兼六園ともう一つは岡山の○○○園（こうらく）", a: "こうらく" },
  O: { q: "Q. 最終問題：アイテムA,B,Cを集めて解放、答えはかなざわ", a: "かなざわ" }
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

  // OはABCが揃うまで解答不可
  if (currentSpot === "O" && !allABCItemsCollected()) {
    alert("まだ問題文が読めない… まずはアイテムA,B,Cを手に入れよう。");
    return;
  }

  const correct = quizData[currentSpot]?.a;
  if (!correct) return;

  if (ans === correct) {
    // 正解 → アイテム画像へ
    document.getElementById("popup-image").src = `item${currentSpot}.jpg`;
    document.getElementById("quiz-area").style.display = "none";
    getItem(currentSpot);

    // ★ Oの正解時だけ、同じポップアップ上にリワードテキストを重ねる
    if (currentSpot === "O") {
      const today = new Date();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      document.getElementById("reward-name").innerText = `【${playerName}】`;
      document.getElementById("reward-date").innerText = `蓮華暦105年　${month}月　${day}日`;
      document.getElementById("reward-overlay").style.display = "block";
    }

  } else {
    alert("不正解です。もう一度挑戦してください。");
  }
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
