import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ResendTimerService {
  public timer = signal(0);
  private intervalId: any;

  private readonly TIMER_KEY = 'lastResendTimestamp';
  private readonly TIMER_DURATION = 60;

  constructor() {
    this.restoreTimer();
  }

  startTimer(seconds: number = this.TIMER_DURATION) {
    this.timer.set(seconds);
    this.saveTimestamp();

    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      if (this.timer() > 0) {
        this.timer.set(this.timer() - 1);
      } else {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  get isCoolingDown(): boolean {
    return this.timer() > 0;
  }

  private saveTimestamp() {
    localStorage.setItem(this.TIMER_KEY, Date.now().toString());
  }

  private restoreTimer() {
    const lastSent = Number(localStorage.getItem(this.TIMER_KEY) || '0');
    const now = Date.now();
    const secondsSinceLast = Math.floor((now - lastSent) / 1000);
    const remaining = Math.max(this.TIMER_DURATION - secondsSinceLast, 0);

    if (remaining > 0) {
      this.startTimer(remaining);
    }
  }

  clearTimer() {
    clearInterval(this.intervalId);
    this.timer.set(0);
  }
}
