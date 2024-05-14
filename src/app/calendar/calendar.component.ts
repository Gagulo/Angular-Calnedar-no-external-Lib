import { Component, computed, input, InputSignal, signal, Signal, WritableSignal } from '@angular/core';
import { DateTime, Info, Interval } from 'luxon';
import { CommonModule } from '@angular/common';
import { Meetings } from './meetings.interface';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  meetings: InputSignal<Meetings> = input.required();

  activeDay: WritableSignal<DateTime | null> = signal(null);
  today: Signal<DateTime> = signal(DateTime.local());
  firstDayOfTheMonth: WritableSignal<DateTime> = signal(this.today().startOf('month'));
  weekDays: Signal<string[]> = signal(Info.weekdays('short'));
  daysOfMonth: Signal<DateTime[]> = computed(() => {
    return Interval.fromDateTimes(
      this.firstDayOfTheMonth().startOf('week'),
      this.firstDayOfTheMonth().endOf('month').endOf('week')
    )
      .splitBy({ day: 1 })
      .map((day) => {
        if (day.start === null) {
          throw new Error('Wrong date');
        }
        return day.start;
      });
  });
  DATE_MEDIUM = DateTime.DATE_MED;
  activeDayMeetings: Signal<string[]> = computed(() => {
    const activeDay = this.activeDay();
    if (activeDay === null) return [];
    const activeDayISO = activeDay.toISODate();
    if (!activeDayISO) return [];
    return this.meetings()[activeDayISO] ?? [];
  });

  gotToPreviousMonth(): void {
    this.firstDayOfTheMonth.set(this.firstDayOfTheMonth().minus({ month: 1 }));
  }

  gotToNextMonth(): void {
    this.firstDayOfTheMonth.set(this.firstDayOfTheMonth().plus({ month: 1 }));
  }

  gotToToday(): void {
    this.firstDayOfTheMonth.set(this.today().startOf('month'));
  }
}
