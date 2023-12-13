export function parseVisibleFeatures (obj: object, results: object[] = []): object[] {
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

interface Day {
  name: string;
  dow: number;
}

interface ScheduleDays {
  days: Day[];
}

interface Circuit {
  name: string;
}

interface Schedule {
  id: number;
  startTime: number;
  endTime: number;
  scheduleDays: ScheduleDays;
  circuit: Circuit;
  isOn: boolean;
  isLight: boolean;
  equipmentType: string;
}

interface SimplifiedSchedule {
  id: number;
  name: string;
  startTime: number;
  endTime: number;
  days: number[];
  isOn: boolean;
  isLight: boolean;
  equipmentType: string;
}

export function parseSchedules (schedules: Schedule[]): SimplifiedSchedule[] {
  return schedules.map(schedule => {
    // Initialize a 7-element array with zeros
    const days = new Array(7).fill(0)

    // Iterate over the days array and place a 1 at the index of the dow value
    schedule.scheduleDays.days.forEach(day => {
      days[day.dow] = 1
    })

    return {
      id: schedule.id,
      name: schedule.circuit.name,
      startTime: convertTo12HourFormat(schedule.startTime),
      endTime: convertTo12HourFormat(schedule.endTime),
      days: days,
      isOn: schedule.isOn,
      isLight: schedule.circuit.type.isLight,
      equipmentType: schedule.equipmentType
    }
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
