module.exports = function(arr, n) {
  return Array(Math.ceil(arr.length/n))
    .fill()
    .map((_,i) => arr.slice(i*n,i*n+n));
};
