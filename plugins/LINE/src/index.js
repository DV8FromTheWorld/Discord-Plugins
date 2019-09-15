import AbstractPlugin from '../../../utils/AbstractPlugin'
import Vue from 'vue'

import LineButton from './components/LineButton/LineButton.vue'
import StickerSelector from './components/StickerSelector/StickerSelector.vue'

const buttonId = 'line-icon-button'
const stickerSelectorId = 'line-sticker-selector'

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
    Vue.prototype.$eventBus = new Vue()

    const LineButtonConstructor = Vue.extend(LineButton)
    this.buttonVue = new LineButtonConstructor()
    this.buttonVue.$mount()
    this.buttonVue.$el.id = buttonId

    const StickerSelectorConstructor = Vue.extend(StickerSelector)
    this.stickerSelectorVue = new StickerSelectorConstructor()
    this.stickerSelectorVue.$mount()
    this.stickerSelectorVue.$el.id = stickerSelectorId

    this._ensureComponentsAreInTheDOM()
  }

  onDOMUpdate(mutations) {
    this._ensureComponentsAreInTheDOM()
  }

  unload() {
    this.buttonVue.$el.remove()
    this.buttonVue.$destroy()
    this.buttonVue = null

    this.stickerSelectorVue.$el.remove()
    this.stickerSelectorVue.$destroy()
    this.stickerSelectorVue = null
  }

  _ensureComponentsAreInTheDOM() {
    if (!document.getElementById(buttonId)) {
      //If the channel's message input box is on the screen, insert the button into it.
      const messageButtons = document.querySelector('[class*="channelTextArea"] [class*="buttons"]')
      if (messageButtons) {
        messageButtons.insertAdjacentElement('afterbegin', this.buttonVue.$el)
      }
    }

    if (!document.getElementById(stickerSelectorId)) {
      const messagesWrapper = document.querySelector('[class*="messagesWrapper"]')
      if (messagesWrapper) {
        messagesWrapper.insertAdjacentElement('afterend', this.stickerSelectorVue.$el)
      }
    }
  }
}