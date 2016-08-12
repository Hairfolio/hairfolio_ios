import EventEmitter from 'EventEmitter';

class FocusEmitter {
  ee = new EventEmitter();

  focus(refNode) {
    this.ee.emit('focus', {refNode});
  }

  onFocus(handle) {
    return this.ee.addListener('focus', handle);
  }
};

export default new FocusEmitter();
