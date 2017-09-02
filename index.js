const merge = require('lodash/merge')
const Response = require('node-fetch').Response

class Mockfetch {
  constructor (urls) {
    this.urls = {}

    this.entry = this.fetch.bind(this)
    this.entry.add = this.add.bind(this)
    this.entry.urls = this.urls

    if (urls) {
      Object.keys(urls).forEach((url) => {
        this.add(url, urls[url])
      })
    }
  }

  add (url, config) {
    config.method = (config.method || 'get').toLocaleLowerCase()

    this.urls[url] = this.urls[url] || {}
    this.urls[url][config.method] = config

    return this.entry
  }

  fetch (url, options) {
    options = options || {}
    options.method = (options.method || 'get').toLocaleLowerCase()

    let config = this.urls[url] && this.urls[url][options.method]

    if (!config) {
      return Promise.resolve(new Response(null, {status: 404}))
    }

    return Promise.resolve().then(() => {
      if (config.callback) {
        return Promise.resolve().then(() => {
          return config.callback(url, options)
        }).then((result) => {
          config = merge(result, config)
        })
      }
    }).then(() => {
      return new Response(config.body, config)
    })
  }

  static create (urls) {
    return (new Mockfetch(urls)).entry
  }
}

Mockfetch.create.Mockfetch = Mockfetch

module.exports = Mockfetch.create
