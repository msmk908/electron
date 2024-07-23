const { ipcRenderer } = require("electron");
const items = require("./items");

// 돔 노드
let showModal = document.getElementById("show-modal"),
  closeModal = document.getElementById("close-modal"),
  modal = document.getElementById("modal"),
  addItem = document.getElementById("add-item"),
  itemUrl = document.getElementById("url"),
  search = document.getElementById("search");

search.addEventListener("keyup", (e) => {
  Array.from(document.getElementsByClassName("read-item")).forEach((item) => {
    let hasMatch = item.innerText.toLowerCase().includes(search.value);
    item.style.display = hasMatch ? "flex" : "none";
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    items.changeSelection(e.key);
  }
});

const toggleModalButton = () => {
  if (addItem.disabled === true) {
    addItem.disabled = false;
    addItem.style.opacity = 1;
    addItem.innerText = "Add Item";
    closeModal.style.display = "inline";
  } else {
    addItem.disabled = true;
    addItem.style.opacity = 0.5;
    addItem.innerText = "Adding...";
    closeModal.style.display = "none";
  }
};

// 모달 생성
showModal.addEventListener("click", (e) => {
  modal.style.display = "flex";
  itemUrl.focus();
});

// 모달 제거
closeModal.addEventListener("click", (e) => {
  modal.style.display = "none";
});

// 새로운 item 추가하는 함수
addItem.addEventListener("click", (e) => {
  // 입력값 체크
  if (itemUrl.value) {
    // 새로운 item을 추가
    ipcRenderer.send("new-item", itemUrl.value);

    // 모달 버튼을 Adding...으로 바꾸고 취소 버튼을 없앰
    toggleModalButton();
  }
});

// main 프로세스에서 보낸 메시지
ipcRenderer.on("new-item-success", (e, newItem) => {
  items.addItem(newItem, true);

  // 모달 버튼을 다시 Add Item 으로 바꾸고 취소 버튼도 다시 추가
  toggleModalButton();

  // 모달 창 닫고 입력창 초기화
  modal.style.display = "none";
  itemUrl.value = "";
});

// 키보드 엔터로 입력
itemUrl.addEventListener("keyup", (e) => {
  if (e.key === "Enter") addItem.click();
});
