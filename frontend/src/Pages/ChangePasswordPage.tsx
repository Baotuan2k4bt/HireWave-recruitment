import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconLock, IconEye, IconEyeOff } from '@tabler/icons-react';
import { resetPassword } from '../Services/UserService';
import { successNotification, errorNotification } from '../Services/NotificationService';
import { useSelector } from 'react-redux';

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.user);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev: any) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: any = {};
        
        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
        }
        
        if (!formData.newPassword) {
            newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự';
        }
        
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validate()) return;
        
        setLoading(true);
        try {
            await resetPassword(user?.email || '', formData.newPassword);
            successNotification('Thành công', 'Đổi mật khẩu thành công!');
            navigate('/personal-security');
        } catch (err: any) {
            errorNotification('Lỗi', err.response?.data?.errorMessage || 'Đổi mật khẩu thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-oceanTeal-50 rounded-lg">
                            <IconLock size={24} className="text-oceanTeal-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-deepSlate-900">Đổi mật khẩu</h1>
                            <p className="text-sm text-deepSlate-500">Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Current Password */}
                        <div>
                            <label className="block text-sm font-medium text-deepSlate-700 mb-2">
                                Mật khẩu hiện tại
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.current ? 'text' : 'password'}
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-oceanTeal-500 focus:border-transparent ${
                                        errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Nhập mật khẩu hiện tại"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-deepSlate-400 hover:text-deepSlate-600"
                                >
                                    {showPasswords.current ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                                </button>
                            </div>
                            {errors.currentPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-deepSlate-700 mb-2">
                                Mật khẩu mới
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-oceanTeal-500 focus:border-transparent ${
                                        errors.newPassword ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-deepSlate-400 hover:text-deepSlate-600"
                                >
                                    {showPasswords.new ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-deepSlate-700 mb-2">
                                Xác nhận mật khẩu mới
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-oceanTeal-500 focus:border-transparent ${
                                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-deepSlate-400 hover:text-deepSlate-600"
                                >
                                    {showPasswords.confirm ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2.5 bg-oceanTeal-500 text-white rounded-md hover:bg-oceanTeal-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/personal-security')}
                                className="px-6 py-2.5 border border-gray-300 text-deepSlate-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage;

