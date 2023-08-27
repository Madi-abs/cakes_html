// lazyload.min.js
;(function() {
  var lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy"
  })
})();

// ОТКРЫТИЕ И ЗАКРЫТИЕ popup
;(function () {
  // функция показа попапа
  const showPopup = function (target) {
    target.classList.add("is-active")
  }

  // функция скрытия попапа
  const closePopup = function (target) {
    target.classList.remove("is-active")
  }

  // открытие попапа по нажатию на кнопку
  window.addEventListener("click", function (e) {
    let target = e.target
    let popupClass = myLib.closestAttr(target, "data-popup")

    if (popupClass === null) {
      return
    }

    e.preventDefault()
    let popup = document.querySelector("." + popupClass)

    if (popup) {
      showPopup(popup)
      myLib.toggleScroll()
    }
  })

  // закрытие по нажатию на кнопку Close или вне попапа
  myLib.body.addEventListener("click", function (e) {
    let target = e.target

    if (
      target.classList.contains("popup-close") ||
      target.classList.contains("popup")
    ) {
      let popup = myLib.closestItemByClass(target, "popup")

      closePopup(popup)
      myLib.toggleScroll()
    }
  })

  // закрытие по нажатию на Esc
  myLib.body.addEventListener("keydown", function (e) {
    if (e.keyCode !== 27) {
      return
    }

    let popup = document.querySelector(".popup.is-active")

    if (popup) {
      closePopup(popup)
      myLib.toggleScroll()
    }
  })
})();

// СКРОЛЛ К НУЖНОМУ БЛОКУ
;(function () {
  // функция скролла
  let scroll = function (target) {
    let targetTop = target.getBoundingClientRect().top
    let scrollTop = window.pageYOffset
    let targetOffsetTop = targetTop + scrollTop
    let headerOffset = document.querySelector(".header").clientHeight

    window.scrollTo(0, targetOffsetTop - headerOffset)
  }

  // скролл по клику
  myLib.body.addEventListener("click", function (e) {
    let target = e.target
    let scrollToItemClass = myLib.closestAttr(target, "data-scroll-to")

    if (scrollToItemClass === null) {
      return
    }

    e.preventDefault()

    let scrollToItem = document.querySelector("." + scrollToItemClass)

    if (scrollToItem) {
      scroll(scrollToItem)
    }

    console.log(scrollToItemClass)
  })
})();

// ФИЛЬТР В КАТАЛОГЕ ПО КАТЕГОРИЯМ
;(function () {
  let catalogSection = document.querySelector(".section-catalog")

  if (catalogSection === null) {
    return
  }

  // очищение каталога перед тем, как показать новые данные
  const removeChildren = function(item) {
    while(item.firstChild)
    item.removeChild(item.firstChild)
  }

  // показ отфильтрованных данных
  const updateChildren = function(item, children) {
    removeChildren(item)

    for (let i = 0; i < children.length; i++) {
      item.appendChild(children[i])
    }
  }

  const catalog = catalogSection.querySelector(".catalog__list")
  const catalogNav = catalogSection.querySelector(".catalog__nav")
  const catalogItems = catalogSection.querySelectorAll(".catalog__item")

  catalogNav.addEventListener("click", function (e) {
    let target = e.target
    let item = myLib.closestItemByClass(target, "catalog__nav-btn")

    if(item === null || item.classList.contains('is-active')) {
      return
    }

    e.preventDefault()

    let filterValue = item.getAttribute('data-filter')
    let previousBtnActive = catalogNav.querySelector(".catalog__nav-btn.is-active")

    // удаляем у предыдущей активной кнопки класс is-active
    previousBtnActive.classList.remove('is-active')

    // делаем активной нужную кнопку
    item.classList.add('is-active')

    // фильтр по кнопке "Все"
    if (filterValue === 'all') {
      updateChildren(catalog, catalogItems)
      return
    }

    // фильтр по дата-атрибуту
    let filteredItems = []
    for (let i = 0; i < catalogItems.length; i++) {
      let currentItem = catalogItems[i]

      if(currentItem.getAttribute('data-category') === filterValue) {
        filteredItems.push(currentItem)
      }
    }

    updateChildren(catalog, filteredItems)

  })
})();

// оформление заказа
;(function () {
  const catalog = document.querySelector(".catalog__list")

  if(catalog === null) {
    return
  }

  // изменение цены в зависимости от размера торта
  const updateProductprice = function(product, price) {
    const productPrice = product.querySelector(".product__price-value")

    productPrice.textContent = price

  }

  // изменение размера торта по клику на соответствующую кнопку
  const changeProductSize = function (target) {
    const product = myLib.closestItemByClass(target, "catalog__item")
    const previousBtnActive = product.querySelector(".product__size.is-active")
    const newPrice = target.getAttribute("data-product-size-price")

    previousBtnActive.classList.remove('is-active')
    target.classList.add('is-active')
    updateProductprice(product, newPrice)
  }

  // добавление информации в заказ
  const changeProductOrderInfo = function(target) {
    const product = myLib.closestItemByClass(target, "catalog__product")
    const order = document.querySelector(".popup-order")

    const productTitle = product.querySelector(".product__title").textContent
    const productSize = product.querySelector(".product__size.is-active").textContent
    const productPrice = product.querySelector(".product__price-value").textContent
    const productImgSrc = product.querySelector(".product__img").getAttribute("src")
    
    order.querySelector(".order-info-title").setAttribute('value', productTitle)
    order.querySelector(".order-info-size").setAttribute("value", productSize)
    order.querySelector(".order-info-price").setAttribute("value", productPrice)

    order.querySelector(".order-product-title").textContent = productTitle
    order.querySelector(".order-product-price").textContent = productPrice
    order.querySelector(".order__size").textContent = productSize
    order.querySelector(".order__img").setAttribute("src", productImgSrc)
  }

  catalog.addEventListener('click', function(e){
    let target = e.target

    if (
      target.classList.contains("product__size") && !target.classList.contains("is-active")
    ) {
      e.preventDefault()
      changeProductSize(target)
    } 

    if (target.classList.contains("product__btn")) {
      e.preventDefault()
      changeProductOrderInfo(target)
    } 
  })

})();

// отправка формы
;(function () {
  const forms = document.querySelectorAll(".form-send")

  if (forms.length === 0) {
    return
  }

  const serialize = function(form) {
    const items = document.querySelectorAll('input, select, textarea')
    let str = ''

    for(let i = 0; i < items.length; i++) {
      let item = items[i]

      let name = item.name
      let value = item.value
      let separator = i === 0 ? '' : '&'

      if(name) {
        str += separator + name + "=" + value 
      }
    }
    return str
  }

  const formSend = function (form) {
    let data = serialize(form)
    let xhr = new XMLHttpRequest()

    let url = "mail/mail.php"
    xhr.open("POST", url)
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8")

    xhr.onload = function () {
      console.log(xhr.response)
      let activePopup = document.querySelector('.popup.is-active')

      if (activePopup) {
        activePopup.classList.remove('is-active')
      } else {
        myLib.toggleScroll()
      }

      if (xhr.response === "success") {
        document.querySelector(".popup-thanks").classList.add("is-active")
      } else {
        document.querySelector(".popup-error").classList.add("is-active")
      }

      form.reset()
    }

    xhr.send(data)
  }

  for (let i = 0; i < forms.length; i++) {
    forms[i].addEventListener("submit", function (e) {
      e.preventDefault()

      let form = e.currentTarget
      formSend(form)
    })
  }
})();


