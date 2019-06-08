export default (str) =>
  str.replace(/[A-Z]/g, ' $&').replace(/^[a-z]/, (m) => m.toUpperCase());
