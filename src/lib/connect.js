import {createSelector} from 'reselect';
import _ from 'lodash';
import {connect} from 'react-redux';

export default function mergeSelectors(...selectors) {
  const mapStateToProps = createSelector(selectors, (...output) => {
    return _.assign({}, ...output);
  });
  return connect(mapStateToProps, null, null, {withRef: true});
}
