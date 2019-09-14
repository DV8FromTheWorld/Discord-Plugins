const listenForInsertion = require('../../utils/NodeInsertionDetection')
const insertCSS          = require('../../utils/InsertCSS')

//Import our static CSS overrides
const styleOverrideCSS = require('./style-overrides.css')
insertCSS(styleOverrideCSS)

const elementSelectors = [
  '[class*="titleBar"]',
  '[class*="wrapper"][class*="guilds"]',
  '[class*="sidebar"]',
]

const forceToDarkTheme = el => {
  el.classList.toggle('theme-light', false)
  el.classList.toggle('theme-dark', true)
}

const observerConfig = { attributes: true }
const observer = new MutationObserver(mutations => {
  console.log(mutations)
  mutations.forEach(mutation => forceToDarkTheme(mutation.target))
})

listenForInsertion(elementSelectors, el => {
  forceToDarkTheme(el)
  observer.observe(el, observerConfig)
})