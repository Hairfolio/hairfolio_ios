function _isPromise2(value) {
  if (value !== null && typeof value === 'object') {
    return value.promise && typeof value.promise.then === 'function';
  }
}

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var defaultTypes = ['PENDING', 'FULFILLED', 'REJECTED'];

export default function promiseMiddleware() {
  var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var promiseTypeSuffixes = config.promiseTypeSuffixes || defaultTypes;

  return function (_ref) {
    var dispatch = _ref.dispatch;

    return function (next) {
      return function (action) {
        if (!_isPromise2(action.payload)) {
          return next(action);
        }

        var type = action.type;
        var payload = action.payload;
        var meta = action.meta;
        var promise = payload.promise;
        var data = payload.data;

        var _ref2 = (meta || {}).promiseTypeSuffixes || promiseTypeSuffixes;

        var PENDING = _ref2[0];
        var FULFILLED = _ref2[1];
        var REJECTED = _ref2[2];

        /**
         * Dispatch the first async handler. This tells the
         * reducer that an async action has been dispatched.
         */
        next(_extends({
          type: type + '_' + PENDING
        }, data && { payload: data }, meta && { meta: meta }));

        var isAction = function isAction(resolved) {
          return resolved.meta || resolved.payload;
        };

        var isThunk = function isThunk(resolved) {
          return typeof resolved === 'function';
        };
        /**
         * Return either the fulfilled action object or the rejected
         * action object.
         */
        return promise.then(function () {
          var resolved = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
          return isThunk(resolved) ? dispatch(resolved) : dispatch(_extends({
            type: type + '_' + FULFILLED,
            asyncResult: true
          }, isAction(resolved) ? resolved : _extends({}, resolved && { payload: resolved }, meta && { meta: meta })));
        }, function () {
          var resolved = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
          return isThunk(resolved) ? dispatch(resolved) : dispatch(_extends({
            type: type + '_' + REJECTED,
            asyncResult: true
          }, isAction(resolved) ? resolved : _extends({
            error: true
          }, resolved && { payload: resolved }, meta && { meta: meta })));
        });
      };
    };
  };
}

export var throwOnFail = (action) => {
  if (action.type.toString().match(/_ERROR$/))
    throw action.payload;
  return action.payload;
};
