export const getRequest = function(endpoint, callback, config = { credentials: 'include' }) {
  fetch(`/api/${endpoint}`, { ...config }).then(response => response.json()
  ).then(callback);
}

export const postRequest = function (endpoint, body, callback,
  config = { credentials: 'include' }) {
  fetch(`/api/${endpoint}`, { method: 'post', body, ...config }).then(callback);
}
