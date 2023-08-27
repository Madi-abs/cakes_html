;(function () {
  window.myLib = {}
  window.myLib.body = document.querySelector("body")

  // проверка наличия дата-атрибута
  window.myLib.closestAttr = function (item, attr) {
    let node = item
    while (node) {
      let attrValue = node.getAttribute(attr)
      if (attrValue) {
        return attrValue
      }
      node = node.parentElement
    }
    return null
  }

  // проверка наличия нужного класса
  window.myLib.closestItemByClass = function (item, classname) {
    let node = item
    while (node) {
      if (node.classList.contains(classname)) {
        return node
      }
      node = node.parentElement
    }
    return null
  }

  // функция блокировки/разблокировки скролла при открытом попапе
  window.myLib.toggleScroll = function () {
    myLib.body.classList.toggle("no-scroll")
  }
})()
