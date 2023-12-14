export async function apiRequest<T> (endpoint: string, urlParams: string): Promise<T> {
  try {
    const url = `http://localhost:4200/${endpoint}?${urlParams}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data: T = await response.json()
    return data
  } catch (error) {
    // Handle or rethrow the error as per your application's requirements
    console.log('error')
    throw error
  }
}
