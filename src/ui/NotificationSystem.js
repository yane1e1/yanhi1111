// Toast notification system
export class NotificationSystem {
  constructor() {
    this._container = document.getElementById('notifications');
  }

  show(message, type = 'info', duration = 3000) {
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = message;
    this._container.appendChild(el);

    // Trigger animation
    requestAnimationFrame(() => {
      el.classList.add('visible');
    });

    setTimeout(() => {
      el.classList.remove('visible');
      el.classList.add('hiding');
      setTimeout(() => el.remove(), 400);
    }, duration);
  }

  success(message) { this.show(message, 'success'); }
  error(message) { this.show(message, 'error'); }
  achievement(message) { this.show(message, 'achievement', 5000); }
  info(message) { this.show(message, 'info'); }
}
