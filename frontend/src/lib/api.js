const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';

export async function api(path, options = {}) {
  const token = localStorage.getItem('aula-token');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers }
  });
  const body = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    if (response.status === 401) window.dispatchEvent(new Event('aula-session-expired'));
    const error = new Error(body?.error || 'Não foi possível concluir a operação.');
    error.status = response.status;
    error.code = body?.code;
    error.details = body?.details;
    throw error;
  }
  return body;
}
