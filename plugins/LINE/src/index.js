import AbstractPlugin from '../../../utils/AbstractPlugin'
import Vue from 'vue'

import LineButton from './components/LineButton/LineButton.vue'

const buttonId = 'line-icon-button'
const stickerSelectorId = 'line-LineSticker-selector'

export default class LinePlugin extends AbstractPlugin {
  getName() {
    return 'LINE'
  }
  getAuthor() {
    return 'DV8FromTheWorld'
  }
  getVersion() {
    return '1.0.0'
  }

  load() {
    this.buttonEl = document.createElement('line-button')
    this.buttonEl.id = buttonId
    this.buttonVue = new Vue({
      el: this.buttonEl,
      components: {
        LineButton
      }
    })

    this.stickerSelectorEl = document.createElement('div')
    this.stickerSelectorEl.id = stickerSelectorId

    this._ensureComponentsAreInTheDOM()
  }

  onDOMUpdate(mutations) {
    this._ensureComponentsAreInTheDOM()
  }

  unload() {

  }

  _ensureComponentsAreInTheDOM() {
    if (!document.getElementById(buttonId)) {
      console.log("Need to remount button")
      const messageButtons = document.querySelector('[class*="channelTextArea"] [class*="buttons"]')
      if (messageButtons) {
        messageButtons.insertAdjacentElement('afterbegin', this.buttonEl)
      }
    }
    if (!document.getElementById(stickerSelectorId)) {
      console.log("Need to remount LineSticker selector")
    }
  }
}