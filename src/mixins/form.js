import _ from 'lodash';

export default {
  addFormItem(ref, name) {
    this.fields = this.fields || {};
    if (ref)
      this.fields[name] = ref;
    else
      delete this.fields[name];
  },

  onFormReady(callback) {
    return Promise.all(
      _.map(
        _.filter(this.fields, field => !!field.onReady)
      , field => field.onReady())
    ).then(callback);
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
      if (newValue === null || newValue === undefined)
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
