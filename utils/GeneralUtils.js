module.exports = {
  onDOMExists(cb) {
    const checkIfExists = () => {
      if (document.body) {
        return cb()
      }

      window.requestAnimationFrame(checkIfExists)
    }

    checkIfExists()
  }
}