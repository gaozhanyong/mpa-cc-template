function history2Hash (historyRoutes, basePath) {
  if (!Array.isArray(historyRoutes)) {
    throw new Error('[Error]: routes must be type Array')
  }

  const routes = historyRoutes.map(route => {
    route.path = route.path.replace(basePath, '')
    return route
  })

  return {
    mode: 'hash',
    routes
  }
}

export default function adjustRoutes (routes, basePath = '', useHash = process.env.CC_DEV) {
  console.log(useHash)
  console.log(process.env.CC_DEV)
  if (!useHash)
    return { routes, mode: 'history' }
  else
    return history2Hash(routes, basePath)
}
