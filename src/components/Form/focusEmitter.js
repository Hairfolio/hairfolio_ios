import EventEmitter from 'EventEmitter';

class FocusEmitter {
  ee = new EventEmitter();

  focus() {
    this.ee.emit('focus');
  }

  onFocus(handle) {
    return this.ee.addListener('focus', handle);
  }
};

export default new FocusEmitter();
