// const POOL_API_BASE_URL = 'http://65.130.181.10:4200' // Pool API URL
// const POOL_API_BASE_URL = 'http://localhost:4200' // Pool API URL
const POOL_API_BASE_URL = 'http://127.0.0.1:4200' // Pool API URL

import { parseSchedules } from './poolHelper.js'
import type { AllResponse } from 'src/types/AllResponse.types'
import type { TempsResponse } from 'src/types/TempsResponse.types'
import type { SchedulesResponse } from 'src/types/SchedulesResponse.types'

export async function fetchAll () : Promise<AllResponse> {
  try {
    const endpoint = `${POOL_API_BASE_URL}/state/all`
    const res = await fetch(endpoint)

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`)
    }

    return await res.json() as AllResponse
  } catch (error) {
    console.error('Error updating state:', error || 'Unknown error')
    throw error
  }
}

export async function fetchSchedules () {
  try {
    const endpoint = `${POOL_API_BASE_URL}/state/schedules`
    const res = await fetch(endpoint)

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`)
    }

    const resData = await res.json() as SchedulesResponse

    return parseSchedules(resData)
  } catch (error) {
    console.error('Error updating state:', error || 'Unknown error')
    throw error
  }
}

export async function fetchDashboard () : Promise<TempsResponse> {
  try {
    const endpoint = `${POOL_API_BASE_URL}/state/temps`
    const res = await fetch(endpoint)

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`)
    }

    const resData = await res.json() as TempsResponse
    console.warn('fetching Dashboard: ', resData)
    return resData
  } catch (error) {
    console.error('Error updating state:', error || 'Unknown error')
    throw error
  }
}

export async function poolSetState (id: number, state: boolean, equipmentType: string) {
  try {
    console.log('Updating state for', { id, state, equipmentType })

    if (typeof id === 'undefined' || typeof state === 'undefined' || typeof equipmentType === 'undefined') {
      throw new Error('Missing required parameters: id, state, or equipmentType')
    }

    let endpoint
    switch (equipmentType) {
      case 'circuit':
        endpoint = 'state/circuit/setState'
        break

        // Add more cases for other equipment types if necessary

      default:
        throw new Error('Invalid equipment type')
    }

    const url = `${POOL_API_BASE_URL}/${endpoint}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, state })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const responseData = await response.json()
    console.log(responseData)
    return responseData
  } catch (error) {
    console.error('Error in poolSetState:', error)
    throw error
  }
}
