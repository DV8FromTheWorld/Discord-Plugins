const STICKER_PACK_FOLDER = 'sticker-packs'
const KNOWN_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'tiff', 'apng']

const getExtension = (filePath) => {
  const parts = filePath.split('.')
  const extension = parts[parts.length - 1].toLowerCase()

  return KNOWN_EXTENSIONS.includes(extension) ? extension : 'png'
}

export default class StickerManager {
  constructor(services) {
    this.services = services
    this.services.storageController.createPath(STICKER_PACK_FOLDER)
  }

  async getAllPacks() {
    const settings = await this.services.settingsManager.getSettings()
    return Promise.all(settings.stickerPackOrder.map(packId => this.getStickerPack(packId)))
  }

  async getStickerPack(packId) {
    const packRootFolder = `${STICKER_PACK_FOLDER}/${packId}`
    const packInfo = await this.services.storageController.getFileAsJson(`${packRootFolder}/pack.json`)

    return {
      name: packInfo.name,
      tabImage: await this.getImageAsDataUrl(`${packRootFolder}/${packInfo.tabImage}`),
      stickers: await Promise.all(packInfo.defaultStickerOrder.map(stickerFileName => {
        return this.getImageAsDataUrl(`${packRootFolder}/${stickerFileName}`)
      }))
    }
  }

  updateStickerPackSettings(settings) {

  }

  async getImageAsDataUrl(stickerPath) {
    try {
      const stickerContent = await this.services.storageController.getFileAsBase64(stickerPath)
      const extension = getExtension(stickerPath)
      return `data:image/${extension};base64,${stickerContent}`
    }
    catch (err) {
      const errorMessage = `Failed to load '${stickerPath}': ${err}`
      console.error(errorMessage)
      return errorMessage
    }
  }
}

