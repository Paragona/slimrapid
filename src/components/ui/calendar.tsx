"use client"

import * as React from "react"
import Calendar from "react-calendar"
import '@/styles/calendar.css'

export type CalendarProps = React.ComponentProps<typeof Calendar>

function CalendarComponent({
  className,
  ...props
}: CalendarProps) {
  return (
    <Calendar
      className={className}
      next2Label={null}
      prev2Label={null}
      minDetail="month"
      locale="en-US"
      formatShortWeekday={(locale, date) => 
        date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2)
      }
      formatMonth={(locale, date) => 
        date.toLocaleDateString('en-US', { month: 'long' })
      }
      {...props}
    />
  )
}
CalendarComponent.displayName = "Calendar"

export { CalendarComponent as Calendar }
