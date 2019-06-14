const toStr = Function.prototype.call.bind(Object.prototype.toString);

const isArray = data => toStr(data) === '[object Array]';

const isFunction = data => toStr(data) === '[object Function]';

const noop = function() {};

export { isArray, isFunction, noop };
