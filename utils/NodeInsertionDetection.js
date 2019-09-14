const insertCSS = require('./InsertCSS')

insertCSS(`
  @keyframes nodeInserted {
    from { opacity: 0.99; }
    to { opacity: 1; }
  }
`)

document.addEventListener('animationstart', event => {
  if (event.animationName === 'nodeInserted') {
    event.target.dispatchEvent(new CustomEvent('node_inserted', { detail: {}, bubbles: true }))
  }
})

/**
 * Listens for any elements added to the DOM that match any of the provided selectors.
 *
 * @param { String | [string] } selectors
 * @param { function(Element) } handleInsertion
 * @param { Boolean? } handleAlreadyInsertedElements
 *
 * @returns {Function} - Used to unregister the insertion listener.
 */
module.exports = function listenForInsertion(selectors, handleInsertion, handleAlreadyInsertedElements = true) {
  const selectorsString = (Array.isArray(selectors) ? selectors : [selectors]).join(', ')
  const cssElement = insertCSS(`
    ${selectorsString} {
      animation-duration: 0.001s;
      animation-name: nodeInserted;
    }
  `)

  const insertionListener = event => handleInsertion(event.target)
  document.addEventListener('node_inserted', insertionListener)

  if (handleAlreadyInsertedElements) {
    document.querySelectorAll(selectorsString).forEach(insertionListener)
  }

  return () => {
    cssElement.remove()
    document.removeEventListener('node_inserted', insertionListener)
  }
}