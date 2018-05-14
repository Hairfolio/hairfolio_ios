// from https://github.com/rauschma/enums

function copyOwnFrom(target, source) {
  Object.getOwnPropertyNames(source).forEach(function(propName) {
    Object.defineProperty(target, propName,
      Object.getOwnPropertyDescriptor(source, propName));
  });
  return target;
}

class Symbol {
  constructor(name, props) {
    this.name = name;
    if (props)
      copyOwnFrom(this, props);
    Object.freeze(this);
  }

  toString() {
    return `${this.name}`;
  }
}

class Enum {
  constructor(...obj) {
    obj.forEach((name) => this[name] = new Symbol(name, obj[name]));
    Object.freeze(this);
  }
}

export default Enum;
