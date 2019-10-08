import AbstractPlugin from '../../../utils/AbstractPlugin'
import Vue from 'vue'
import ProviderPlugin from "./mixins/ProviderPlugin";

import LineButton from './components/LineButton/LineButton.vue'
import StickerSelector from './components/StickerSelector/StickerSelector.vue'
import NativeRequester from "./services/NativeRequester";

import SettingsManager from "./services/SettingsManager";
import StickerManager  from "./services/StickerManager";
import ImportManager from "./services/ImportManager";

const buttonId = 'line-icon-button'
const stickerSelectorId = 'line-sticker-selector'

const SETTINGS_FILE = "settings.json"
const STICKER_PACK_DIR = "sticker-packs"

export default class LinePlugin extends AbstractPlugin {
  constructor(nodeGlobals, storageController) {
    super(nodeGlobals, storageController)

    this.services = {}

    this.services.storageController = storageController
    this.services.requester = new NativeRequester(nodeGlobals)
    this.services.settingsManager = new SettingsManager(this.services)
    this.services.stickerManager = new StickerManager(this.services)
    this.services.importManager = new ImportManager(this.services)

    Vue.use(ProviderPlugin, {
      $storageController: this.services.storageController,
      $requester: this.services.requester,
      $services: this.services,
      $localStorage: nodeGlobals.localStorage
    })

    // storageController.createPath(STICKER_PACK_DIR)
    this.services.settingsManager.getSettings()
  }

  static getIdentifier() {
    return 'LINE'
  }

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