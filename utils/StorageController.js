const path = require('path')
const fs = require('fs')
const fsPromises = fs.promises
const AdmZip = require('adm-zip')

class StorageController {
  constructor(rootPath) {
    this.rootPath = rootPath
  }

  createPath(folderPath) {
    const sep = path.sep;
    const targetPath = path.normalize(folderPath)

    return targetPath.split(sep).reduce((parentDir, childDir) => {
      const curDir = path.resolve(this.rootPath, parentDir, childDir);
      try {
        fs.mkdirSync(curDir);
      } catch (err) {
        if (err.code === 'EEXIST') { // curDir already exists!
          return curDir;
        }

        // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
        if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
          throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
        }

        const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
        if (!caughtErr || caughtErr && curDir === path.resolve(targetPath)) {
          throw err; // Throw if it's just the last created dir.
        }
      }

      return curDir;
    }, '');
  }

  getFile(filePath) {
    const targetFile = this._getRelativeTarget(filePath)
    return fsPromises.readFile(targetFile)
  }

  async getFileAsJson(path) {
    const fileContent = await this.getFile(path)
    return JSON.parse(fileContent)
  }

  async getFileAsBase64(path) {
    const fileContent = await this.getFile(path)
    return Buffer.from(fileContent).toString('base64')
  }

  async saveFile(filePath, data, options) {
    const targetFile = this._getRelativeTarget(filePath)
    await fsPromises.writeFile(targetFile, data, options)
  }

  async deleteFile(filePath) {
    const targetFile = this._getRelativeTarget(filePath)
    await fsPromises.unlink(targetFile)
  }

  async deleteDirectory(folderPath, options) {
    const targetFolder = this._getRelativeTarget(folderPath)
    await fsPromises.rmdir(targetFolder, options)
  }

  async moveFile(srcPath, destPath) {
    const srcTarget = this._getRelativeTarget(srcPath)
    const destTarget = this._getRelativeTarget(destPath)

    await fsPromises.rename(srcTarget, destTarget)
  }

  async moveDirectory(srcPath, destPath) {
    const srcTarget = this._getRelativeTarget(srcPath)
    const destTarget = this._getRelativeTarget(destPath)

    await this.createPath(destPath)

    const files = await fsPromises.readdir(srcTarget)
    await Promise.all(files.map(async fileName => {
      const currentPath = `${srcTarget}/${fileName}`
      const newPath = `${destTarget}/${fileName}`

      if ((await fsPromises.lstat(currentPath)).isDirectory()) {
        await this.moveDirectory(`${srcPath}/${fileName}`, `${destPath}/${fileName}`)
      }
      else {
        await fsPromises.rename(currentPath, newPath)
      }
    }))
  }

  async listFilesInDirectory(folderPath) {
    const targetFolder = this._getRelativeTarget(folderPath)
    try {
      return await fsPromises.readdir(targetFolder)
    }
    catch (err) {
      console.log(err)
      return []
    }
  }


  async extractZipFile(zipFile, destination) {
    await this.createPath(destination)

    const targetFile = path.resolve(this.rootPath, zipFile)
    const targetDestination = path.resolve(this.rootPath, destination)

    const zip = new AdmZip(targetFile)
    await new Promise((resolve, reject) => {
      zip.extractAllToAsync(targetDestination, false, err => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  _getRelativeTarget(relativePath) {
    return path.resolve(this.rootPath, relativePath)
  }
}

module.exports = StorageController