//If this node process is not the Discord electron app, exit immediately.
if (typeof window === 'undefined' || !window.location.href.includes('discordapp')) {
  return
}

require('./utils/RequireExtensions')

require('./plugins/OldLightTheme')