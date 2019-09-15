//If this node process is not the Discord electron app, exit immediately.
if (typeof window === 'undefined' || !window.location.href.includes('discordapp')) {
  return
}

require('./utils/RequireExtensions')
const { onDOMExists } = require('./utils/GeneralUtils')

function tryRequire(module) {
  try {
    return require(module)
  }
  catch (err) {
    if (!err.message.includes('Cannot find module') && !err.message.includes('Unexpected identifier')) {
      console.log(`Error loading '${module}'`, err)
    }
    return null
  }
}

function importPlugin(pluginName) {
  let plugin
  plugin = tryRequire(`./plugins/${pluginName}`)
  if (!plugin) plugin = tryRequire(`./plugins/${pluginName}/${pluginName}.js`)
  if (!plugin) plugin = tryRequire(`./plugins/${pluginName}/dist/index.js`)
  if (!plugin) plugin = tryRequire(`./plugins/${pluginName}/dist/${pluginName}.js`)

  if (!plugin) {
    console.error(`Failed to load the '${pluginName}'`)
    alert(`Failed to load the '${pluginName}' plugin. Did you build it first?`)
    return
  }

  // Handle plugins that use the 'export default' system of exports.
  return plugin.default || plugin
}

const plugins = [
  importPlugin('OldLightTheme'),
  importPlugin('LINE')
]
.filter(plugin => plugin) //Ensure that the imported plugin returned _something_
.map(Plugin => new Plugin())

plugins.forEach(plugin => plugin.beforeLoad())

onDOMExists(() => {
  plugins.forEach(plugin => plugin.load())

  const domChangeListener = new MutationObserver((mutations) => {
    plugins.forEach(plugin => plugin.onDOMUpdate(mutations))
  })
  domChangeListener.observe(document.documentElement, { subtree: true, childList: true })
})
