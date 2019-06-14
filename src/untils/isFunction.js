import toStr from './toStr';

const isFunction = data => toStr(data) === '[object Function]';
export default isFunction;
