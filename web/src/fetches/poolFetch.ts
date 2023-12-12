// const POOL_API_BASE_URL = 'http://65.130.181.10:4200' // Pool API URL
const POOL_API_BASE_URL = 'http://localhost:4200' // Pool API URL

export async function fetchVisibleFeatures () {
  try {
    const endpoint = `${POOL_API_BASE_URL}/state/all`
    const res = await fetch(endpoint)

    // console.log('response', response)
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`)
    }

    const resData = await res.json()
    return parseVisibleFeatures(resData)
  } catch (error) {
    console.error('Error updating state:', error || 'Unknown error')
    throw error
  }
}

function parseVisibleFeatures (obj: object, results: object[] = []): object[] {
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      for (const item of obj) {
        if (Object.prototype.hasOwnProperty.call(item, 'showInFeatures') && item.showInFeatures === true) {
          results.push(item)
        }
        parseVisibleFeatures(item, results)
      }
    } else {
      Object.values(obj).forEach(value => parseVisibleFeatures(value, results))
    }
  }
  return results
}
