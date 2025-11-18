import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const recuperarSenha = (email) => api.post('/auth/recuperar-senha', { email });
export const cancelarPlano = () => api.post('/auth/cancelar-plano');

// Categorias
export const getCategorias = () => api.get('/categorias');

// Receitas
export const getReceitas = (params) => api.get('/receitas', { params });
export const getReceita = (id) => api.get(`/receitas/${id}`);

// Favoritos
export const getFavoritos = () => api.get('/favoritos');
export const addFavorito = (receitaId) => api.post(`/favoritos/${receitaId}`);
export const removeFavorito = (receitaId) => api.delete(`/favoritos/${receitaId}`);

// Pagamento
export const getPublicKey = () => api.get('/pagamento/public-key');
export const processarPagamento = (data) => api.post('/pagamento/processar', data);
export const criarPix = (plano) => api.post('/pagamento/pix', { plano });
export const verificarPagamento = (paymentId) => api.get(`/pagamento/status/${paymentId}`);

// Consulta Virtual
export const criarConsulta = (data) => api.post('/consulta', data);
export const getConsultas = () => api.get('/consultas');

export default api;
