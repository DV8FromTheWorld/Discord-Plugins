module.exports = class AbstractPlugin {
  constructor(nodeGlobals, storageController) {

  }

  static getIdentifier() {
    throw new Error("No identifier provided.")
  }

  getName() {
    return 'Unknown'
  }

  getAuthor() {
    return 'Unknown'
  }

  getVersion() {
    return 'No Version Provided'
  }

  getDescription() {
    return 'No Description Provided'
  }

  load() {
  }

  onDOMUpdate(mutations) {
  }

  unload() {
  }
}