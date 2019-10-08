const SETTINGS_FILE = 'settings.json'

const defaultSettings = {
  "enableRecentlyUsedStickersTab": true,
  "enableFavoriteStickersTab": true,
  "enableStickerSearch": true,
  "stickerPackOrder": [],
  "hiddenPacks": [],
  "favoriteStickers": []
}

export default class SettingsManager {
  constructor(services) {
    this.services = services
    this.settings = null
  }

  async getSettings() {
    try {
      const rawSettings = await this.services.storageController.getFile(SETTINGS_FILE)
      return JSON.parse(rawSettings)
    }
    catch (err) {
      return this._createDefaultSettings()
    }
  }

  async _createDefaultSettings() {
    await this.services.storageController.saveFile(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2))
    return defaultSettings
  }
}