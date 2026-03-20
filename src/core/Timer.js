// Game timer — tracks elapsed real time and fires tick events
export class Timer {
  constructor(eventBus, tickInterval = 1000) {
    this._eventBus = eventBus;
    this._tickInterval = tickInterval;
    this._lastTick = null;
    this._running = false;
    this._rafId = null;
  }

  start() {
    if (this._running) return;
    this._running = true;
    this._lastTick = performance.now();
    this._loop();
  }

  stop() {
    this._running = false;
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  _loop() {
    if (!this._running) return;
    this._rafId = requestAnimationFrame((now) => {
      const elapsed = now - this._lastTick;
      if (elapsed >= this._tickInterval) {
        this._lastTick = now - (elapsed % this._tickInterval);
        this._eventBus.emit('tick', { elapsed });
      }
      this._loop();
    });
  }
}
