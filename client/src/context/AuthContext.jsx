import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Hàm reload thông tin profile từ server (ví dụ sau khi nạp tiền)
  const refreshProfile = useCallback(async () => {
    if (!localStorage.getItem('token')) {
      setLoading(false);
      return null;
    }
    try {
      const data = await authApi.getProfile();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (err) {
      console.error('Failed to refresh profile:', err);
      // Nếu token không hợp lệ, logout
      if (err.response && err.response.status === 401) {
        logout();
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy profile ban đầu khi khởi động ứng dụng nếu có token
  useEffect(() => {
    if (token) {
      refreshProfile();
    } else {
      setLoading(false);
    }
  }, [token, refreshProfile]);

  // Đăng nhập
  const login = async (username, password) => {
    const res = await authApi.login({ username, password });
    // Backend trả về: { accessToken, user: { user_id, username, email, role, balance, ... } }
    const accessToken = res.accessToken || res.access_token;
    const userData = res.user;

    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
    return userData;
  };

  // Đăng ký
  const register = async (userData) => {
    const res = await authApi.register(userData);
    return res;
  };

  // Nạp tiền ví
  const deposit = async (amount) => {
    const res = await authApi.depositWallet(amount);
    // Cập nhật lại user state với số dư mới
    if (res && res.user) {
      setUser(res.user);
      localStorage.setItem('user', JSON.stringify(res.user));
    } else {
      await refreshProfile();
    }
    return res;
  };

  // Đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        deposit,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
