const buildQueryParams = (params) => {
  const keys = Object.keys(params);

  if (keys.length) {
    const paramString = keys
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join('&');

    return `?${paramString}`;
  }

  return '';
};

const buildQuery = (url, params) => `${url}${buildQueryParams(params)}`;

async function request({ url, method, params = {}, body, headers = {} }) {
  const response = await fetch(buildQuery(url, params), {
    method,
    headers: {
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let responseBody;
  try {
    responseBody = await response.json();
  } catch (e) {
    throw new Error('Failed to parse response body');
  }

  if (!response.ok) {
    throw new Error('Response error');
  }

  return responseBody;
}

export default request;
