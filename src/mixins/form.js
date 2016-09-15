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
        console.log(ref);

        errs += 1;

        ref.setInError();
      }
    });

    return !!errs;
  },

  getFormValue() {
    var value = {};

    _.each(this.fields, (ref, key) => {
      var newValue = ref.getValue();
      var oldValue = _.get(value, key);
      if (_.isPlainObject(newValue) && _.isPlainObject(oldValue))
        newValue = _.merge({}, oldValue, newValue);
      if (!newValue)
        return;
      value = _.set(value, key, newValue);
    });

    return value;
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
