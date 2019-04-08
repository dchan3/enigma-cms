export default {
  info: {
    url: (process.env.SERVER_URL ||
      `http://localhost:${  process.env.PORT || 8080}`),
    path: function(path) {
      return this.url + path;
    }
  },
  serverInfo: {
    url: (process.env.SERVER_URL ||
      `http://localhost:${  process.env.PORT || 8080}`),
    path: function(path) {
      return this.url + path;
    }
  },
  clientInfo: {
    url: (process.env.CLIENT_URL ||
      `http://localhost:${  process.env.PORT || 8080}`),
    path: function(path) {
      return this.url + path;
    }
  }
}
