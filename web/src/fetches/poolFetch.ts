const POOL_API_BASE_URL = 'http://65.130.181.10:4200' // Pool API URL

export async function fetchVisibleFeatures () {
  try {
    const response = await fetch(POOL_API_BASE_URL + '/state/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.warn(response)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('Error updating state:', error.message)
    throw error
  }
}
