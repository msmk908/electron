const { log } = require("console");
const fs = require("fs");

let items = document.getElementById("items");

let readerJS;
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
  readerJS = data.toString();
});

exports.storage = JSON.parse(localStorage.getItem("readit-items")) || [];

window.addEventListener("message", (e) => {
  if (e.data.action === "delete-reader-item") {
    this.delete(e.data.itemIndex);

    e.source.close();
  }
});

exports.delete = (itemIndex) => {
  items.removeChild(items.childNodes[itemIndex]);

  this.storage.splice(itemIndex, 1);

  this.save();

  if (this.storage.length) {
    let = newSelectedItemIndex = itemIndex === 0 ? 0 : itemIndex - 1;

    document
      .getElementsByClassName("read-item")
      [newSelectedItemIndex].classList.add("selected");
  }
};

exports.getSelectedItem = () => {
  let currentItem = document.getElementsByClassName("read-item selected")[0];

  let itemIndex = 0;
  let child = currentItem;
  while ((child = child.previousElementSibling) != null) itemIndex++;

  return { node: currentItem, index: itemIndex };
};

exports.save = () => {
  localStorage.setItem("readit-items", JSON.stringify(this.storage));
};

exports.select = (e) => {
  this.getSelectedItem().node.classList.remove("selected");

  e.currentTarget.classList.add("selected");
};

exports.changeSelection = (direction) => {
  let currentItem = this.getSelectedItem();

  if (direction === "ArrowUp" && currentItem.node.previousElementSibling) {
    currentItem.node.classList.remove("selected");
    currentItem.node.previousElementSibling.classList.add("selected");
  } else if (direction === "ArrowDown" && currentItem.node.nextElementSibling) {
    currentItem.node.classList.remove("selected");
    currentItem.node.nextElementSibling.classList.add("selected");
  }
};

exports.open = () => {
  if (!this.storage.length) return;

  let selectedItem = this.getSelectedItem();

  let contentURL = selectedItem.node.dataset.url;

  let readerWin = window.open(
    contentURL,
    "",
    `
    maxWidth=2000,
    maxHeight=2000,
    width=1200,
    height=800,
    backgroundColor=#DEDEDE,
    nodeIntegration=0,
    contextIsolation=1,
    `
  );

  readerWin.eval(readerJS.replace("{{index}}", selectedItem.index));
};

exports.addItem = (item, isNew = false) => {
  let itemNode = document.createElement("div");

  itemNode.setAttribute("class", "read-item");

  itemNode.setAttribute("data-url", item.url);

  itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`;

  items.appendChild(itemNode);

  itemNode.addEventListener("click", this.select);

  itemNode.addEventListener("dblclick", this.open);

  if (document.getElementsByClassName("read-item").length === 1) {
    itemNode.classList.add("selected");
  }

  if (isNew) {
    this.storage.push(item);
    this.save();
  }
};

this.storage.forEach((item) => {
  this.addItem(item, false);
});
