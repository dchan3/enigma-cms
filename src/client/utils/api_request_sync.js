async function getRequestSync(endpoint) {
  return await fetch(`/api/${endpoint}`).then((response) => response.json());
}

async function postRequestSync(endpoint) {
  return await fetch(`/api/${endpoint}`, { method: 'post' });
}

async function deleteRequestSync(endpoint) {
  return await fetch(`/api/${endpoint}`, { method: 'delete' });
}

export default { getRequestSync, postRequestSync, deleteRequestSync };
