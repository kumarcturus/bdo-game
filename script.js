// ----------------------------
// 初期データ
// ----------------------------
let items = { A: false, B: false, C: false, O: false };
let currentSpot = null;

// クイズ問題集
const quizData = {
  A: { q: "Q. 金沢駅前にある有名な門の名前は○○○門", a: "つづみ" },
  B: { q: "Q. 金沢で金箔が有名なのは…○○○の高い気候", a: "しつど" },
  C: { q: "Q. 兼六園ともう一つは岡山の○○○○園", a: "こうらく" }
};

// ----------------------------
// 画面切り替え
// ----------------------------
document.getElementById("start-btn").onclick = () => {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("map-screen").style.display = "block";
};

// ----------------------------
// ポップアップ表示系
// ----------------------------

// 通常ポップアップ表示
function showNormalPopup(message) {
  document.getElementById("popup-text").innerText = message;
  document.getElementById("popup-text").style.display = "block";
  document.getElementById("quiz-area").style.display = "none";
  document.getElementById("popup").style.display = "flex";
}

// クイズポップアップ表示
function showQuizPopup(spotId) {
  currentSpot = spotId;
  document.getElementById("quiz-question").innerText = quizData[spotId].q;
  document.getElementById("quiz-answer").value = "";

  document.getElementById("popup-text").style.display = "none";
  document.getElementById("quiz-area").style.display = "block";
  document.getElementById("popup").style.display = "flex";
}

// ポップアップを閉じる
document.getElementById("popup-close").onclick = () => {
  document.getElementById("popup").style.display = "none";
};

// ----------------------------
// クイズ判定
// ----------------------------
document.getElementById("quiz-submit").onclick = () => {
  const answer = document.getElementById("quiz-answer").value.trim();
  const correct = quizData[currentSpot].a;

  if (answer === correct) {
    // 正解 → アイテム獲得
    getItem(currentSpot);
    showNormalPopup("正解！アイテムを獲得しました。");
  } else {
    alert("不正解です。もう一度挑戦しましょう。");
  }
};

document.getElementById("quiz-cancel").onclick = () => {
  document.getElementById("popup").style.display = "none";
};

// ----------------------------
// アイテム関連処理
// ----------------------------
function getItem(name) {
  if (!items[name]) {
    items[name] = true;
    updateInventory();
    checkUnlock();
  }
}

function updateInventory() {
  const owned = Object.keys(items).filter(key => items[key]);
  document.getElementById("items").innerText = owned.length ? owned.join(", ") : "なし";
}

// O解放チェック
function checkUnlock() {
  if (items.A && items.B && items.C) {
    const spotO = document.getElementById("spotO");
    spotO.classList.remove("locked");
    spotO.onclick = () => {
      getItem("O");
      showNormalPopup("アイテムOを獲得！ゲームクリア！");
    };
  }
}

// ----------------------------
// スポットクリック設定
// ----------------------------
// A, B, C → クイズ
document.getElementById("spotA").onclick = () => showQuizPopup("A");
document.getElementById("spotB").onclick = () => showQuizPopup("B");
document.getElementById("spotC").onclick = () => showQuizPopup("C");

// D〜N → 通常ポップアップ（説明のみ）
["D", "E", "F", "G", "H", "I", "J"].forEach(id => {
  const spot = document.getElementById(`spot${id}`);
  if (spot) {
    spot.onclick = () => {
      showNormalPopup(`スポット${id}の説明です。`);
    };
  }
});
