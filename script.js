// ----------------------------
// 初期データ
// ----------------------------
let items = { A: false, B: false, C: false, O: false };
let currentSpot = null;

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

// スタートボタンを押したら → 説明画面へ
document.getElementById("start-btn").onclick = () => {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("intro-screen").style.display = "flex"; // ここで説明画面を表示
};

// 進むボタンを押したら → マップ画面へ
document.getElementById("intro-next-btn").onclick = () => {
  document.getElementById("intro-screen").style.display = "none";
  document.getElementById("map-screen").style.display = "block"; // ここでマップを表示
};


// ----------------------------
// スポットを押したとき
// ----------------------------
function openSpotPopup(spotId) {
  currentSpot = spotId;

  // スポット画像表示
  const imagePath = `spot${spotId}.jpg`;
  document.getElementById("popup-image").src = imagePath;

  // ABCOならクイズを表示、それ以外は非表示
  if (quizData[spotId]) {
    document.getElementById("quiz-area").style.display = "block";
    document.getElementById("quiz-question").innerText = quizData[spotId].q;
  } else {
    document.getElementById("quiz-area").style.display = "none";
  }

  // ポップアップ表示
  document.getElementById("popup").style.display = "flex";
}

// ----------------------------
// クイズ回答処理
// ----------------------------
document.getElementById("quiz-submit").onclick = () => {
  const userAnswer = document.getElementById("quiz-answer").value.trim();
  const correctAnswer = quizData[currentSpot].a;

  if (userAnswer === correctAnswer) {
    // 正解時：同じポップアップでアイテム画像に切り替える
    const itemImage = `item${currentSpot}.jpg`;
    document.getElementById("popup-image").src = itemImage;

    // クイズを非表示にする
    document.getElementById("quiz-area").style.display = "none";

    // アイテム獲得処理
    getItem(currentSpot);

  } else {
    alert("不正解です。もう一度挑戦してください。");
  }
};

// キャンセル
document.getElementById("quiz-cancel").onclick = () => {
  document.getElementById("popup").style.display = "none";
};

// ----------------------------
// アイテム管理
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
  if (items.A && items.B && items.C) {
    const spotO = document.getElementById("spotO");
    spotO.classList.remove("locked");
  }
}

// ----------------------------
// 閉じる処理
// ----------------------------
document.getElementById("popup-close").onclick = () => {
  document.getElementById("popup").style.display = "none";
};

// ----------------------------
// スポットイベント登録
// ----------------------------
const spotIds = ["A","B","C","D","E","F","G","H","I","J","O"];
spotIds.forEach(id => {
  const spot = document.getElementById(`spot${id}`);
  if (spot) {
    spot.onclick = () => openSpotPopup(id);
  }
});