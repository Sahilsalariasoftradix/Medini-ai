import { EnBookings } from "../utils/enums"

export type TimeSlot = {
    time: string
    status: EnBookings
  }
  
  export type DaySchedule = {
    date: number
    day: string
    slots: TimeSlot[]
  }
  
  export type StatusCounts = {
    active: number
    cancelled: number
    unconfirmed: number
    available: number
  }
  
  