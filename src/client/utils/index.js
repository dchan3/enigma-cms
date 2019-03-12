export default {
  serverInfo: {
    url: (process.env.SERVER_URL ||
      'http://localhost:' + (process.env.SERVER_PORT || 8080)),
    path: function(path) {
      return this.url + path;
    }
  }
}
