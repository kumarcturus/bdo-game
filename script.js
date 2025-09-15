// ゲーム状態
let items = {A:false, B:false, C:false, O:false};

document.getElementById("start-btn").onclick = () => {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("map-screen").style.display = "block";
};

// ポップアップ処理
function showPopup(text) {
  document.getElementById("popup-text").innerText = text;
  document.getElementById("popup").style.display = "flex";
}

document.getElementById("popup-close").onclick = () => {
  document.getElementById("popup").style.display = "none";
};

// アイテム獲得
function getItem(name) {
  if (!items[name]) {
    items[name] = true;
    updateInventory();
    showPopup(`アイテム${name}を手に入れた！`);
    checkUnlock();
  } else {
    showPopup(`アイテム${name}はすでに入手済み`);
  }
}

// 所持アイテム更新
function updateInventory() {
  let owned = Object.keys(items).filter(k => items[k]);
  document.getElementById("items").innerText = owned.length ? owned.join(", ") : "なし";
}

// O解放チェック
function checkUnlock() {
  if (items.A && items.B && items.C) {
    let spotO = document.getElementById("spotO");
    spotO.classList.remove("locked");
    spotO.onclick = () => getItem("O");
  }
}

// スポット設定
document.getElementById("spotA").onclick = () => getItem("A");
document.getElementById("spotB").onclick = () => getItem("B");
document.getElementById("spotC").onclick = () => getItem("C");

// 最初はOはロック
document.getElementById("spotO").onclick = () => showPopup("まだ解放されていません");
