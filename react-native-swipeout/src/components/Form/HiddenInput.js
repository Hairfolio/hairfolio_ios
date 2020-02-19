import PureComponent from '../PureComponent';

// no animation here !

export default class HiddenInput extends PureComponent {

  static propTypes = {};

  state = {};

  setInError() {
    this.setState({error: true});
  }

  getValue() {
    return this.state.value || null;
  }

  isValide() {
    return true;
  }

  setValue(value) {
    this.setState({value});
  }

  clear() {
    this.setState({value: null});
  }

  render() {
    return null;
  }
};
