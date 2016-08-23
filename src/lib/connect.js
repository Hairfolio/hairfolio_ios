import {createSelector} from 'reselect';
import _ from 'lodash';
import autoproxy from './autoproxy';
import {connect} from 'react-redux';

export default function(...selectors) {
  return autoproxy(function(target) {
    const mapStateToProps = createSelector(selectors, (...output) => {
      return _.assign({}, ...output);
    });
    return connect(mapStateToProps, null, null, {withRef: true})(target);
  });
};
