module.exports = (...messages) => messages.forEach((message) => {
  let now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  console.log(`[${now}] ${message}`);
});
