# mockfetch

`mockfetch` is a super simple mock object for `fetch` requests.

## Usage

The `mockfetch` factory returns the `fetch` mock object.
Responses for specific URLs and methods can be defined in the constructor or with the `.add` method.
If the `callback` property is defined in the response, the function will be called and the result will be merged with the configured response.
Requests to an unknown URL or method will get a 404 response.

## Examples

### Using the Constructor

Defines responses for two URLs.
The first URL response is static, the second generates the response body in the callback.

```
const fetch = mockFetch({
  'http://example.org/config': {
     headers: {
       'content-type': 'text/plain'
     }
     body: 'example body'
  },
  'http://example.org/callback': {
    headers: {
      'content-type': 'text/plain'
    },
    callback: (url, options) => {
      return {
        body: 'example body from callback'
      }
    }
  }
})
```

### Using .add

Defines the same responses like in the constructor examples.

```
const fetch = mockFetch()

fetch.add('http://example.org/config', {
  headers: {
    'content-type': 'text/plain'
  }
  body: 'example body'
})

fetch.add('http://example.org/callback', {
  headers: {
    'content-type': 'text/plain'
  },
  callback: (url, options) => {
    return {
      body: 'example body from callback'
    }
  }
}
```
