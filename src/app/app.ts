import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type Answer = 'none' | 'yes' | 'no';

type QuizStep = 'vibe' | 'location' | 'dessert' | 'promise' | 'final';

type VibeOption = 'Movie' | 'Spa' | 'Painting' | 'Dinner';
type DessertOption = 'Chocolate' | 'Ice cream' | 'Crepe' | 'I will surprise you';
type LocationOption = 'My place (Art)' | 'Your place (Giannis)';
type PromiseOption =
  | 'Candlelit the whole night'
  | "We'll dance together"
  | 'Make you laugh all night';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  // Customize these 👇
  girlfriendName = signal('My Princess');
  time = signal('8:00 PM');

  // Quiz state
  activeStep = signal<QuizStep>('vibe');
  selectedVibes = signal<VibeOption[]>([]);
  selectedLocation = signal<LocationOption | null>(null);
  selectedDessert = signal<DessertOption | null>(null);
  selectedPromise = signal<PromiseOption[]>([]);

  // Result state
  answer = signal<Answer>('none');

  // floating hearts count
  heartItems = signal(Array.from({ length: 16 }));

  // Quiz options with emojis
  vibeOptions = [
    { label: 'Movie', emoji: '🎬' },
    { label: 'Spa', emoji: '💆' },
    { label: 'Painting', emoji: '🎨' },
    { label: 'Dinner', emoji: '🍔' },
  ] as const;

  dessertOptions = [
    { label: 'Chocolate', emoji: '🍫' },
    { label: 'Ice cream', emoji: '🍦' },
    { label: 'Crepe', emoji: '🥞' },
    { label: 'I will surprise you', emoji: '🎁' },
  ] as const;

  locationOptions = [
    { label: 'My place (Art)', emoji: '🏠' },
    { label: 'Your place (Giannis)', emoji: '📍' },
  ] as const;

  promiseOptions = [
    { label: 'Candlelit the whole night', emoji: '🕯️' },
    { label: "We'll dance together", emoji: '💃' },
    { label: 'Make you laugh all night', emoji: '🌟' },
  ] as const;

  selectVibe(option: VibeOption): void {
    const current = this.selectedVibes();
    if (current.includes(option)) {
      this.selectedVibes.set(current.filter((v) => v !== option));
    } else {
      this.selectedVibes.set([...current, option]);
    }
  }

  selectDessert(option: DessertOption): void {
    this.selectedDessert.set(option);
  }

  selectLocation(option: LocationOption): void {
    this.selectedLocation.set(option);
  }

  selectPromise(option: PromiseOption): void {
    const current = this.selectedPromise();
    if (current.includes(option)) {
      this.selectedPromise.set(current.filter((p) => p !== option));
    } else {
      this.selectedPromise.set([...current, option]);
    }
  }

  hasQuizSelections(): boolean {
    return Boolean(
      this.selectedVibes().length > 0 &&
      this.selectedLocation() &&
      this.selectedDessert() &&
      this.selectedPromise().length > 0,
    );
  }

  goNext(): void {
    const currentStep = this.activeStep();

    if (currentStep === 'vibe' && this.selectedVibes().length > 0) {
      this.activeStep.set('location');
      return;
    }

    if (currentStep === 'location' && this.selectedLocation()) {
      this.activeStep.set('dessert');
      return;
    }

    if (currentStep === 'dessert' && this.selectedDessert()) {
      this.activeStep.set('promise');
      return;
    }

    if (currentStep === 'promise' && this.selectedPromise().length > 0) {
      this.activeStep.set('final');
      return;
    }
  }

  goBack(): void {
    const currentStep = this.activeStep();

    if (currentStep === 'dessert') {
      this.activeStep.set('location');
      return;
    }

    if (currentStep === 'location') {
      this.activeStep.set('vibe');
      return;
    }

    if (currentStep === 'promise') {
      this.activeStep.set('dessert');
      return;
    }

    if (currentStep === 'final') {
      this.activeStep.set('promise');
      return;
    }
  }

  restartQuiz(): void {
    this.answer.set('none');
    this.activeStep.set('vibe');
    this.selectedVibes.set([]);
    this.selectedLocation.set(null);
    this.selectedDessert.set(null);
    this.selectedPromise.set([]);
  }

  onYesClick(): void {
    this.answer.set('yes');
    this.heartItems.set(Array.from({ length: 18 + Math.floor(Math.random() * 10) }));
  }

  onNoClick(): void {
    this.answer.set('no');
  }

  addToCalendar(): void {
    const date = new Date();
    // Assuming Valentine's Day theme, setting it to Feb 14th
    date.setMonth(1); // February
    date.setDate(14);
    const [hours] = this.time().split(':').map(Number);
    date.setHours(hours, 0, 0, 0);

    const title = `Valentine's Day Date with my Love`;
    const description = `📍 ${this.selectedLocation()}\n✨ ${this.selectedVibes().join(', ')}\n🍰 ${this.selectedDessert()}\n💝 ${this.selectedPromise().join('\n')}`;

    // Create Google Calendar link
    const startTime = date.toISOString().replace(/-|:|\.\d{3}/g, '');
    const endDate = new Date(date);
    endDate.setHours(date.getHours() + 3);
    const endTime = endDate.toISOString().replace(/-|:|\.\d{3}/g, '');

    const calendarUrl = new URL('https://calendar.google.com/calendar/render');
    calendarUrl.searchParams.set('action', 'TEMPLATE');
    calendarUrl.searchParams.set('text', title);
    calendarUrl.searchParams.set('dates', `${startTime}/${endTime}`);
    calendarUrl.searchParams.set('details', description);
    calendarUrl.searchParams.set('location', this.selectedLocation() || 'Your favorite spot');
    calendarUrl.searchParams.set('add', 'isalakid@hotmail.com');

    window.open(calendarUrl.toString(), '_blank');
  }

  @HostListener('window:resize')
  onResize(): void {
    // nothing required now; kept for future tweaks
  }

  heartLeft(itemIndex: number): number {
    const leftValue = (itemIndex * 97) % 100;
    return Math.min(98, Math.max(2, leftValue));
  }

  heartDelay(itemIndex: number): number {
    return (itemIndex * 120) % 1200;
  }
}
