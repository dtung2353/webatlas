/**
 * @file LoginModalView.tsx
 * @directory src/views/auth
 * @description Component hiển thị nút Đăng nhập và Modal xác thực người dùng / Cán bộ quản lý.
 */

import React, { useState } from 'react';
import { ShieldCheck, X, CheckCircle, Sliders } from 'lucide-react';

export const LoginModalView: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState<'admin' | 'operator'>('admin');
  const [userInfo, setUserInfo] = useState<{ name: string; roleName: string } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('Vui lòng nhập tên tài khoản');
      return;
    }
    setIsLoggedIn(true);
    setUserInfo({
      name: username,
      roleName: userRole === 'admin' ? 'Cán bộ Quản lý Nguồn nước' : 'Kỹ sư Vận hành Hồ chứa'
    });
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
    setUsername('');
    setPassword('');
  };

  return (
    <div className="login-btn-container">
      {/* Nút Đăng nhập / Thông tin Tài khoản */}
      <button 
        className={`login-toggle-btn glass-panel ${isLoggedIn ? 'logged-in' : ''}`}
        onClick={() => setIsOpen(true)}
        title={isLoggedIn ? `Tài khoản: ${userInfo?.name}` : 'Đăng nhập hệ thống'}
      >
        {isLoggedIn ? (
          <>
            <ShieldCheck size={18} className="text-emerald-500" />
            <span className="user-name">{userInfo?.name}</span>
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="32" strokeLinecap="round" strokeMiterlimit="10" className="flex-shrink-0">
              <path d="M344 144a64 64 0 11-128 0 64 64 0 01128 0z" />
              <path d="M256 272c-56 0-104 28-128 72 26 40 70 64 128 64s102-24 128-64c-24-44-72-72-128-72z" />
              <circle cx="256" cy="256" r="208" />
            </svg>
            <span>Đăng nhập</span>
          </>
        )}
      </button>

      {/* Modal Popup Đăng Nhập */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="login-modal glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <svg width="22" height="22" viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="32" strokeLinecap="round" strokeMiterlimit="10" className="text-blue-500 flex-shrink-0">
                  <path d="M344 144a64 64 0 11-128 0 64 64 0 01128 0z" />
                  <path d="M256 272c-56 0-104 28-128 72 26 40 70 64 128 64s102-24 128-64c-24-44-72-72-128-72z" />
                  <circle cx="256" cy="256" r="208" />
                </svg>
                <h3 className="text-base font-semibold text-gray-800">
                  {isLoggedIn ? 'Thông tin Cán bộ' : 'Đăng nhập Hệ thống WebAtlas'}
                </h3>
              </div>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {isLoggedIn ? (
              <div className="logged-in-profile p-4">
                <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50/50 rounded-lg border border-blue-200/50">
                  <CheckCircle size={32} className="text-emerald-500" />
                  <div>
                    <div className="font-semibold text-base text-gray-800">{userInfo?.name}</div>
                    <div className="text-xs text-blue-600 font-medium">{userInfo?.roleName}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-4">
                  Đã đăng nhập thành công. Bạn có quyền tiếp cận toàn bộ dữ liệu thủy văn và vận hành hồ chứa.
                </div>
                <button 
                  className="btn-danger w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-sm text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
                  onClick={handleLogout}
                >
                  <X size={16} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="login-form p-4">
                <div className="form-group mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tên tài khoản</label>
                  <div className="input-with-icon">
                    <svg className="input-icon text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <input 
                      type="text" 
                      placeholder="Nhập tên đăng nhập..."
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Mật khẩu</label>
                  <div className="input-with-icon">
                    <Sliders size={16} className="input-icon text-gray-400" />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Vai trò</label>
                  <select 
                    value={userRole} 
                    onChange={(e) => setUserRole(e.target.value as any)}
                    className="form-select"
                  >
                    <option value="admin">Cán bộ Quản lý Nguồn nước</option>
                    <option value="operator">Kỹ sư Vận hành Hồ chứa</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="btn-primary w-full py-2.5 rounded-lg text-white font-medium text-sm bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                >
                  <ShieldCheck size={16} />
                  <span>Đăng nhập</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginModalView;
