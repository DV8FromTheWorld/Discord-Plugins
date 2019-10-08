const AbstractPlugin     = require('../../utils/AbstractPlugin')
const listenForInsertion = require('../../utils/NodeInsertionDetection')
const insertCSS          = require('../../utils/InsertCSS')

const styleOverrideCSS = require('./style-overrides.css')

const elementSelectors = [
  '[class*="titleBar"]',
  '[class*="wrapper"][class*="guilds"]',
  '[class*="sidebar"]',
]

module.exports = class OldLightThemePlugin extends AbstractPlugin {
  static getIdentifier() {
    return 'old-light-theme'
  }

  getName() {
    return 'Old Light Theme'
  }
  getAuthor() {
    return 'DV8FromTheWorld'
  }
  getVersion() {
    return '1.0.0'
  }
  getDescription() {
    return 'Reverts certain aspects of the Light Theme back to the original look and feel.'
  }

  load() {
    //Import our static CSS overrides
    this.overrideCSSElement = insertCSS(styleOverrideCSS)

    const forceToDarkTheme = el => {
      el.classList.toggle('theme-light', false)
      el.classList.toggle('theme-dark', true)
    }

    const observerConfig = { attributes: true }
    this.themeMutationObserver = new MutationObserver(mutations => {
      console.log(mutations)
      mutations.forEach(mutation => forceToDarkTheme(mutation.target))
    })

    this.stopListeningForInsertion = listenForInsertion(elementSelectors, el => {
      forceToDarkTheme(el)
      this.themeMutationObserver.observe(el, observerConfig)
    })
  }

  unload() {
    this.overrideCSSElement.remove()
    this.themeMutationObserver.disconnect()
    this.stopListeningForInsertion()
  }
}