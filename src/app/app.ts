import { Component, ElementRef, HostListener, signal, ViewChild } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  // Customize these 👇
  girlfriendName = signal('My Love');
  datePlanTitle = signal('Valentine’s Date Night');
  place = signal('Your favorite spot');
  time = signal('8:00 PM');
  food = signal('Anything you crave');

  answer = signal<string>('none');

  // "No" button dodge
  noTransform = signal('translate(0px, 0px)');
  // track last generated translate X/Y so we can avoid tiny hops
  lastNoX = signal(0);
  lastNoY = signal(0);
  // @ViewChild('noButton', { static: false }) noButton?: ElementRef<HTMLButtonElement>;

  // floating hearts count
  heartItems = signal(Array.from({ length: 16 }));

  onYesClick(): void {
    this.answer.set('yes');
    this.noTransform.set('translate(0px, 0px)');
    // refresh hearts so animation feels "new" each click
    this.heartItems.set(Array.from({ length: 40 + Math.floor(Math.random() * 40) }));
  }

  onNoClick(): void {
    this.answer.set('no');
  }

  onNoHover(): void {
    const MIN_DISTANCE = 60; // pixels — tweak to make jumps larger/smaller
    const MAX_ATTEMPTS = 8; // avoid infinite loops on tight constraints

    let attempts = 0;
    let shiftX = this.randomBetween(-140, 140);
    let shiftY = this.randomBetween(-80, 80);

    const prevX = this.lastNoX();
    const prevY = this.lastNoY();

    // Retry until the new point is sufficiently far from the previous point
    while (attempts < MAX_ATTEMPTS && Math.hypot(shiftX - prevX, shiftY - prevY) < MIN_DISTANCE) {
      shiftX = this.randomBetween(-140, 140);
      shiftY = this.randomBetween(-80, 80);
      attempts++;
    }

    this.lastNoX.set(shiftX);
    this.lastNoY.set(shiftY);
    this.noTransform.set(`translate(${shiftX}px, ${shiftY}px)`);
  }

  @HostListener('window:resize')
  onResize(): void {
    // reset transform on resize so it doesn't drift off screen
    this.noTransform.set('translate(0px, 0px)');
  }

  heartLeft(itemIndex: number): number {
    // use a deterministic hash-based PRNG per index so positions appear random
    // but remain stable across renders. map to [2, 98] percent.
    const rnd = this.pseudoRandomFromIndex(itemIndex);
    const pos = Math.floor(rnd * 97) + 2; // 0..96 -> 2..98
    return pos;
  }

  heartDelay(itemIndex: number): number {
    return (itemIndex * 120) % 1200;
  }

  private randomBetween(min: number, max: number): number {
    const random = Math.random() * (max - min) + min;
    return Math.round(random);
  }

  // Deterministic, fast hash -> [0, 1) for a given integer index.
  // This avoids the clear modulo-based repeating pattern while keeping
  // positions stable across renders.
  private pseudoRandomFromIndex(index: number): number {
    // mix the index into a 32-bit value and scramble
    let x = (index | 0) + 0x9e3779b9; // golden ratio
    x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
    x ^= x >>> 13;
    x = Math.imul(x, 0xc2b2ae35);
    x ^= x >>> 16;
    // convert to unsigned and normalize to [0,1)
    return (x >>> 0) / 4294967296;
  }
}
