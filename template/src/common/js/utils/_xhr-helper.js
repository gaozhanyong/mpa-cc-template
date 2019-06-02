import axios from 'axios'
import proxyTable from '@/../proxy-table.json'

export function get(...args) {
  return axios.get.apply(axios, args)
}

export function post(...args) {
  return axios.post.apply(axios, args)
}

export function throws(e) {
  throw e
}

export function makeGet(url, opts = {}) {
  return function (params) {
    var ts = ''
    if (opts.ts) {
      ts = `?_=${new Date().getTime()}`
    }
    return get(`${url}${ts}`, {
      params
    }).then((e) => {
      if (e.data.success && e.data.code == 200) {
        return e.data.data
      } else throws(e)
    })
  }
}

export function makePost(url, opts = {}) {
  return function (params) {
    var ts = ''
    if (opts.ts) {
      ts = `?_=${new Date().getTime()}`
    }
    return post(`${url}${ts}`, params).then((e) => {
      if (e.data.success && e.data.code == 200) {
        return e.data.data
      } else throws(e)
    })
  }
}

export function apiurl(url) {
  return ccdevProxyRewrite('/api/') + `${url}`
}

function ccdevProxyRewrite (path) {
  if (process.env.CC_DEV) return proxyTable.dev[path]
  else return path.slice(0, -1)
}
