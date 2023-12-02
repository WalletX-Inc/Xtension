/* eslint-disable no-prototype-builtins */
export default class EventEmitter {
  listeners = {};

  on(event, callback) {
    if (!this.listeners.hasOwnProperty(event)) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);

    return this;
  }

  emit(event, ...data) {
    if (!this.listeners.hasOwnProperty(event)) {
      return null;
    }

    for (let i = 0; i < this.listeners[event].length; i += 1) {
      const callback = this.listeners[event][i];

      callback.call(this, ...data);
    }
    return null;
  }
}
