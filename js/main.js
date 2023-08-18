// popup
;(function() {
  const body = document.querySelector('body')

  const closestAttr = function(item, attr) {
   let node = item
   while(node) {
      let attrValue = node.getAttribute(attr)
      if(attrValue) {
         return attrValue
      }
      node = node.parentElement
   }
    return null
  }

  window.addEventListener('click', function(e) {
   let target = e.target
   let popupClass = closestAttr(target, "data-popup")

   if(popupClass === null) {
      return
   }

   e.preventDefault()
   let popup = this.document.querySelector('.' + popupClass)

   console.log(popup)
  })

})();