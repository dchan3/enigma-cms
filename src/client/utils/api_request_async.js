function getRequest(endpoint, callback, config = { credentials: 'include' }) {
  fetch(`/api/${endpoint}`, { ...config }).then(response => response.json()
  ).then(callback);
}

function postRequest(endpoint, body, callback,
  config = { credentials: 'include' }) {
  fetch(`/api/${endpoint}`, { method: 'post', body, ...config }).then(callback);
}

function deleteRequest(endpoint, callback,
  config = { credentials: 'include' }) {
  fetch(`/api/${endpoint}`, { method: 'delete', ...config }).then(callback);
}

export default { getRequest, postRequest, deleteRequest };
