import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { Reminder, ReminderService } from '../../../core/services/reminder.service';

type StatusFilter = 'all' | 'new' | 'done';

@Component({
  standalone: true,
  selector: 'app-admin-reminders',
  imports: [DatePipe],
  templateUrl: './reminders.component.html',
  styleUrl: './reminders.component.scss',
})
export class RemindersComponent {
  private readonly reminderService = inject(ReminderService);

  readonly reminders = toSignal(this.reminderService.getReminders(), { initialValue: [] as Reminder[] });
  readonly filter = signal<StatusFilter>('all');

  readonly filters: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: 'Всі' },
    { id: 'new', label: 'Нові' },
    { id: 'done', label: 'Оброблено' },
  ];

  readonly filteredReminders = computed(() => {
    const list = [...this.reminders()].sort((a, b) => this.toDate(b.createdAt).getTime() - this.toDate(a.createdAt).getTime());
    const f = this.filter();
    return f === 'all' ? list : list.filter((r) => r.status === f);
  });

  setFilter(f: StatusFilter): void {
    this.filter.set(f);
  }

  toDate(value: unknown): Date {
    if (!value) return new Date(0);
    if (value instanceof Date) return value;
    const ts = value as { toDate?: () => Date };
    return typeof ts.toDate === 'function' ? ts.toDate() : new Date(value as string);
  }

  async markDone(reminder: Reminder): Promise<void> {
    if (!reminder.id) return;
    await this.reminderService.markDone(reminder.id);
  }
}
