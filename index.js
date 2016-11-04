let Mapgen = require('./lib/mapgen.js')
module.exports = function (config) {
  if (config.cli) {
    var oldCreateSandbox = config.cli.createSandbox
    config.cli.createSandbox = function () {
      var sandbox = oldCreateSandbox.apply(this, Array.prototype.slice.call(arguments))
      sandbox.mapgen = new Mapgen(sandbox)
      return sandbox
    }
  }
}
