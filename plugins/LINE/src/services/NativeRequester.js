export default class NativeRequester {
  constructor(nodeGlobals) {
    this.require = nodeGlobals.require
    this.Buffer = nodeGlobals.Buffer

    this.http = this.require('http')
    this.https = this.require('https')
  }

  makeRequest(url, body, options = {}) {
    const requester = url.startsWith('https') ? this.https : this.http

    return new Promise((resolve, reject) => {
      const req = requester.request(url, options)

      req.on('response', res => {
        const buffer = []
        res.on('data', chunk => buffer.push(chunk))
        res.on('error', reject)
        res.on('end', () => resolve(buffer))
      })
      req.on('error', reject)

      if (body) {
        req.write(body)
      }

      req.end()
    })
    .then(raw => {
      return {
        string: () => String(raw),
        json: () => JSON.parse(String(raw)),
        buffer: () => this.Buffer.concat(raw)
      }
    })
  }
}
