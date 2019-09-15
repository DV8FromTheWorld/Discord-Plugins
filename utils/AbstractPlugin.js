module.exports = class AbstractPlugin {
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


  beforeLoad() {
  }

  load() {
  }

  onDOMUpdate(mutations) {
  }

  beforeUnload() {
  }

  unload() {
  }
}