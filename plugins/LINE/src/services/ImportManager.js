const LINE_DOWNLOAD_DIR = 'sticker-downloads/line'
const TAB_ICON_FILENAME = 'tab-icon.png'

const isNotTheTabIcon = fileName => fileName !== TAB_ICON_FILENAME

export default class ImportManager {
  constructor(services) {
    this.services = services
    window.j = this
  }

  async importFromLINE(packId) {
    //Based on: https://isamunoheya.blogspot.com/2016/10/how-to-download-line-stickers-on-pc.html
    //TODO: URL for animated packs: dl.stickershop.line.naver.jp/products/0/0/1/[ID]/iphone/stickerpack@2x.zip
    const url = `http://dl.stickershop.line.naver.jp/products/0/0/1/${packId}/iphone/stickers@2x.zip`
    const zipContent = await this.services.requester.makeRequest(url).then(req => req.buffer())

    const workingDir = `${LINE_DOWNLOAD_DIR}/${packId}`
    const extractedDir = `${workingDir}/contents`
    const zipFile = `${workingDir}/stickerpack.zip`

    await this.services.storageController.createPath(extractedDir)

    await this.services.storageController.saveFile(zipFile, zipContent)
    await this.services.storageController.extractZipFile(zipFile, extractedDir)

    let linePackInfo = null
    const allPackFiles = await this.services.storageController.listFilesInDirectory(extractedDir)
    const cleanedFiles = (await Promise.all(allPackFiles.map(async fileName => {
      const filePath = `${extractedDir}/${fileName}`

      //A key image or the gray-scaled tab icon. Delete these unnecessary files.
      if (fileName.includes("_key") || fileName.includes("tab_off")) {
        await this.services.storageController.deleteFile(filePath)
        return null
      }

      //Tab Icon. Normalize naming.
      if (fileName.includes("tab_on")) {
        const newFilePath = `${extractedDir}/${TAB_ICON_FILENAME}`
        await this.services.storageController.moveFile(filePath, newFilePath)
        return TAB_ICON_FILENAME
      }

      //Sticker file. Rename it to remove unnecessary @2x info
      if (fileName.includes("@2x")) {
        const newFileName = fileName.replace("@2x", "")
        const newFilePath = `${extractedDir}/${newFileName}`
        await this.services.storageController.moveFile(filePath, newFilePath)
        return newFileName
      }

      if (fileName === 'productInfo.meta') {
        linePackInfo = await this.services.storageController.getFileAsJson(filePath)
        await this.services.storageController.deleteFile(filePath)
        return null
      }

      return null
    })))
    .filter(fileName => fileName) //Remove all null entries

    //Move all files (except for the tab-icon) into a 'stickers' subfolder.
    const stickerFolder = `${extractedDir}/stickers`
    await this.services.storageController.createPath(stickerFolder)
    await Promise.all(cleanedFiles
      .filter(isNotTheTabIcon)
      .map(async fileName => {
        await this.services.storageController.moveFile(`${extractedDir}/${fileName}`, `${stickerFolder}/${fileName}`)
    }))

    const packInfo = {
      name: `Unknown [LineId: ${packId}]`,
      tabImage: TAB_ICON_FILENAME,
      defaultStickerOrder: [],
      defaultStickerTags: {}
    }

    if (linePackInfo) {
      //Best effort to get a name from the English and Japanese versions of the sticker title.
      const title = linePackInfo.title || {}
      if (title.en) {
        packInfo.name = title.en
      }
      else if (title.jp) {
        packInfo.name = `${title.jp} [LineId: ${packId}]`
      }

      if (linePackInfo.stickers) {
        //Look for the sticker in our cleaned files
        linePackInfo.stickers.forEach(stickerInfo => {
          const fileNameIdx = cleanedFiles.findIndex(fileName => fileName.includes(stickerInfo.id))
          if (fileNameIdx === -1) {
            return
          }

          //If we find it, remove it from the cleaned files and add it to our pack info.
          const fileName = cleanedFiles[fileNameIdx]
          cleanedFiles.splice(fileNameIdx, 1)

          packInfo.defaultStickerOrder.push(`stickers/${fileName}`)
        })
      }
    }

    //For any remaining files that haven't been added, add them to the sticker order array.
    packInfo.defaultStickerOrder = [
      ...packInfo.defaultStickerOrder,
      ...cleanedFiles
        .filter(isNotTheTabIcon)
        .map(fileName => `stickers/${fileName}`)
    ]

    //If we didn't actually find the tab icon file when processing the pack, use the first sticker in the pack as the icon.
    if (!cleanedFiles.includes(TAB_ICON_FILENAME)) {
      packInfo.tabImage = packInfo.defaultStickerOrder[0]
    }

    await this.services.storageController.saveFile(`${extractedDir}/pack.json`, JSON.stringify(packInfo, null, 2))

    const finalizedStickerPackPath = `sticker-packs/line-${packId}`
    await this.services.storageController.moveDirectory(extractedDir, finalizedStickerPackPath)

    //TODO: do this. Node v10 doesn't support this right now though.
    // await this.services.storageController.deleteDirectory(workingDir, { recursive: true })
  }
}