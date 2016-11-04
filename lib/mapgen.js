const async = require('async')

class Mapgen {
  get map () {
    return sandbox.map
  }
  constructor (sandbox) {
    this.sandbox = sandbox
  }
  genCore (dirx = 'E' , sx = 0 , diry = 'N' , sy = 0) {
    sx *= 10
    sy *= 10
    return new Promise((resolve, reject) => {
      let map = this.sandbox.map
      let print = this.sandbox.print
      let room = (x, y) => `${dirx}${sx+x}${diry}${sy+y}`
      let rooms = []
      console.log(1)
      for (let x = 1;x < 10;x++) {
        for (let y = 1;y < 10;y++) {
          let sk = x >= 4 && x <= 6 && y >= 4 && y <= 6
          rooms.push({ x, y, name: room(x, y), opts: { sources: Math.ceil(Math.random() * (sk ? 3 : 2)) + (sk ? 1 : 0), controller: !sk, keeperLairs: sk } })
        }
      }
      console.log(2, rooms)
      let even = rooms.filter((r, i) => i % 2 == 0)
      let odd = rooms.filter((r, i) => i % 2 == 1)
      console.log(3, even, odd)
      async.series([
        (cb) => async.each(even, (r, cb) => {
          console.log(r.name, r.opts)
          map.removeRoom(r.name).then(() => cb()).catch(() => cb())
        }, cb),
        (cb) => async.each(even, (r, cb) => {
          console.log(r.name, r.opts)
          map.generateRoom(r.name, r.opts).then(() => cb()).catch(() => cb())
        }, cb),
        (cb) => async.each(odd, (r, cb) => {
          console.log(r.name, r.opts)
          map.generateRoom(r.name, r.opts).then(() => cb()).catch(() => cb())
        }, cb)
      ], (err) => err ? reject(err) : resolve())
    })
  }
  genBorders (dirx, sx, diry, sy) {
    let map = this.sandbox.map
    let room = (x, y) => `${dirx}${sx}${x}${diry}${sy}{$y}`
    let rooms = []
    for (let x = 0;x <= 10;x++)
      for (let y = 0;y <= 10;y++)
        rooms.push({ x, y, name: room(x, y), opts: { sources: false, controller: false, minerals: false, exits: { } } })
    rooms.forEach(r => this.getBorderExits(r))
    let even = rooms.filter((r, i) => i % 2 == 0)
    let odd = rooms.filter((r, i) => i % 2 == 1)
    async.parallel(even, (r, cb) => {
      map.generateRoom(r.name, r.opts)
    })
  }
  getorderExits (room) {
    room.opts.exits.top = this.getOpenExits()
    room.opts.exits.bottom = this.getOpenExits()
    room.opts.exits.left = this.getOpenExits()
    room.opts.exits.right = this.getOpenExits()
    // if((room.x == 0 || room.x == 10)
    if (room.x == 0 && room.y != 0 && room.y != 0)
      delete room.opts.exits.left

    if (room.y == 0) {
      room.opts.exits.bottom = this.getOpenExits()
      room.opts.exits.left = this.getOpenExits()
      room.opts.exits.right = this.getOpenExits()
    }
  }
  getOpenExits (chance = 0.80) {
    let exits = []
    for (let i = 1;i <= 49;i++) {
      if (Math.random() * 100 < chance) exits.push(i)
    }
  }
}
module.exports = Mapgen
