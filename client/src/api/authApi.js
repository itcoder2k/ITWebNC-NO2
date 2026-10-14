import axiosClient from './axiosClient';

export const authApi = {
  // Đăng nhập (hỗ trợ cả username hoặc email)
  login: (credentials) => {
    return axiosClient.post('/auth/login', credentials);
  },

  // Đăng ký tài khoản mới
  register: (userData) => {
    return axiosClient.post('/auth/register', userData);
  },

  // Lấy thông tin cá nhân & số dư ví
  getProfile: () => {
    return axiosClient.get('/auth/profile');
  },

  // Cập nhật thông tin profile
  updateProfile: (userData) => {
    return axiosClient.put('/users/profile', userData);
  },

  // Nạp tiền vào ví điện tử
  depositWallet: (amount) => {
    return axiosClient.post('/users/wallet/deposit', { amount });
  },

  // Lấy chi tiết user theo ID (Admin)
  getUserById: (id) => {
    return axiosClient.get(`/users/${id}`);
  },
};
