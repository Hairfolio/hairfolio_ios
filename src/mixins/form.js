import _ from 'lodash';

export default {
  addFormItem(ref, name) {
    this.fields = this.fields || {};
    this.fields[name] = ref;
  },

  checkErrors() {
    var errs = 0;

    _.each(this.fields, ref => {
      if (!ref.isValide()) {
        errs += 1;

        ref.setInError();
      }
    });

    return !!errs;
  },

  getFormValue() {
    return _.mapValues(this.fields, ref => ref.getValue());
  },

  clearValues() {
    _.each(this.fields, ref => ref.clear());
  },

  setFormValue(value) {
    _.each(value, (value, key) => {
      if (!this.fields[key])
        return;

      this.fields[key].setValue(value);
    });

    _.each(this.fields, (ref, key) => {
      if (value[key])
        return;

      ref.setValue(null);
    });
  }
};
