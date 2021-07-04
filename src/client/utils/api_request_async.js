export const getRequest = function(endpoint, callback, config) {
  fetch(`/api/${endpoint}`, { credentials: 'include', ...config }).then(response => response.json()
  ).then(callback);
};

export const postRequest = function (endpoint, body, callback, config) {
  fetch(`/api/${endpoint}`, { method: 'post', body, credentials: 'include', ...config }).then(callback);
}
