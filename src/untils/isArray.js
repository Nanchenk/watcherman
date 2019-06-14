import toStr from './toStr';

const isArray = data => toStr(data) === '[object Array]';
export default isArray;
