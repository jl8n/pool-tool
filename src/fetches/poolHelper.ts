import type { SchedulesResponse } from 'src/types/SchedulesResponse.types'
import type { Feature, ParsedSchedule } from './poolHelper.types'
import type { AllResponse } from 'src/types/AllResponse.types'

export function parseVisibleFeatures (obj: AllResponse, results: Feature[] = []): Feature[] {
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      for (const item of obj) {
        if (item && item.showInFeatures === true) {
          results.push(item)
        }
        parseVisibleFeatures(item, results) // Now item potentially has inferred type
      }
    } else {
      Object.values(obj).forEach(value => {
        if (value && value.showInFeatures === true) {
          results.push(value)
        }
        parseVisibleFeatures(value, results) // Now value potentially has inferred type
      })
    }
  }
  return results
}

export function parseSchedules (schedules: SchedulesResponse): ParsedSchedule[] {
  return schedules.map(schedule => {
    // Initialize a 7-element array with zeros
    const days = Array.from({ length: 7 }, () => 0)

    // Iterate over the days array and place a 1 at the index of the dow value
    schedule.scheduleDays.days.forEach(day => {
      days[day.dow] = 1
    })

    const parsed: ParsedSchedule = {
      id: schedule.id,
      name: schedule.circuit.name,
      startTime: convertTo12HourFormat(schedule.startTime),
      endTime: convertTo12HourFormat(schedule.endTime),
      days,
      isOn: schedule.isOn,
      isLight: schedule.circuit.type.isLight,
      equipmentType: schedule.equipmentType
    }

    return parsed
  })
}

function convertTo12HourFormat (minutesPastMidnight: number): string {
  // Calculate hours and minutes
  let hours = Math.floor(minutesPastMidnight / 60)
  const minutes = minutesPastMidnight % 60

  // Determine AM or PM
  const period = hours >= 12 ? 'PM' : 'AM'

  // Convert to 12-hour format
  if (hours > 12) {
    hours = hours - 12
  } else if (hours === 0) {
    hours = 12 // for midnight
  }

  // Pad minutes with leading zero if necessary
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`

  return `${hours}:${minutesStr} ${period}`
}

// Usage:
