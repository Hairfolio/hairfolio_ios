import EventEmitter from 'EventEmitter';

// simple event emitter

export default class NavigationChannel {
  constructor() {
    this.eventEmitter = new EventEmitter();
    this.commandEmitter = new EventEmitter();

    this.data = {};
  }

  set(property, value) {
    this.data[property] = value;
    this.eventEmitter.emit(property, value);
  }

  get(property) {
    return this.data[property];
  }

  reset() {
    this.data = {};
  }

  addListener(event, handler) {
    return this.eventEmitter.addListener(event, handler);
  }

  sendCommand(command, args) {
    this.commandEmitter.emit(command, args);
  }

  onCommand(command, handler) {
    return this.commandEmitter.addListener(command, handler);
  }
}
