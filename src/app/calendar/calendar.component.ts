import { Component, computed, InputSignal, signal, Signal, WritableSignal } from '@angular/core';
import { DateTime, Info, Interval } from 'luxon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
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
}
