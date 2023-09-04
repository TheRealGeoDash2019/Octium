// @ts-ignore
const _internalExtends = (Object.assign ? Object.assign.bind() : function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
});

export default function _extends(...args: any[]) {
  return Object.assign.apply(this, args);
};