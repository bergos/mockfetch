/* global describe, it */

const assert = require('assert')
const mockFetch = require('..')

describe('mockfetch', () => {
  describe('factory', () => {
    it('should be a function', () => {
      assert.equal(typeof mockFetch, 'function')
    })

    it('should return a mockFetch entry function', () => {
      const fetch = mockFetch()

      assert.equal(typeof fetch, 'function')
      assert.equal(typeof fetch.add, 'function')
      assert.equal(typeof fetch.urls, 'object')
    })

    it('should add the given URL configs', () => {
      const urls = {
        'http://example.org/1': {
          body: 'test1'
        },
        'http://example.org/2': {
          callback: () => {
            return {body: 'test2'}
          }
        }
      }

      const expected = {
        'http://example.org/1': {
          get: {
            method: 'get',
            body: 'test1'
          }
        },
        'http://example.org/2': {
          get: {
            method: 'get',
            callback: urls['http://example.org/2'].callback
          }
        }
      }

      const fetch = mockFetch(urls)

      assert.deepEqual(fetch.urls, expected)
    })
  })

  describe('.add', () => {
    it('should add a URL config', () => {
      const fetch = mockFetch()

      fetch.add('http://example.org/', {
        body: 'test'
      })

      assert.deepEqual(fetch.urls, {
        'http://example.org/': {
          get: {
            method: 'get',
            body: 'test'
          }
        }
      })
    })
  })

  describe('fetch', () => {
    it('should return 404 for a unknown URL', () => {
      const fetch = mockFetch()

      return fetch('http://example.org/').then((res) => {
        assert.equal(res.status, 404)
      })
    })

    it('should return 404 for a unknown method', () => {
      const fetch = mockFetch()

      fetch.add('http://example.org/', {
        method: 'put',
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: '{}'
      })

      return fetch('http://example.org/').then((res) => {
        assert.equal(res.status, 404)
      })
    })

    it('should return the response defined in the config', () => {
      const fetch = mockFetch()

      fetch.add('http://example.org/', {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: '{}'
      })

      return fetch('http://example.org/').then((res) => {
        assert.equal(res.status, 200)
        assert.equal(res.headers.get('content-type'), 'application/json')

        return res.text().then((body) => {
          assert.equal(body, '{}')
        })
      })
    })

    it('should merge the response from the config and callback', () => {
      const fetch = mockFetch()

      fetch.add('http://example.org/', {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        callback: () => {
          return {
            body: '{}'
          }
        }
      })

      return fetch('http://example.org/').then((res) => {
        assert.equal(res.status, 200)
        assert.equal(res.headers.get('content-type'), 'application/json')

        return res.text().then((body) => {
          assert.equal(body, '{}')
        })
      })
    })
  })
})
