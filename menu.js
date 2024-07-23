// 모듈: 메인 앱 메뉴 생성

const { Menu } = require("electron");

module.exports = () => {
  let template = [];

  let menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);
};
