const { onDOMExists } = require('../utils/GeneralUtils')

module.exports = function insertCSS(cssString) {
  const styleSheet = document.createElement("style")

  styleSheet.type = "text/css"
  styleSheet.innerText = cssString

  onDOMExists(() => document.head.appendChild(styleSheet))

  return styleSheet
}