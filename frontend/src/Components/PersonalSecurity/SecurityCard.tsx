import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconLock, IconShield, IconToggleLeft, IconToggleRight } from '@tabler/icons-react';
import { ROUTE_PATHS } from '../../constants/route-paths';

interface SecurityCardProps {
    user: any;
}

const SecurityCard = ({ user }: SecurityCardProps) => {
    const navigate = useNavigate();
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    const handleChangePassword = () => {
        navigate(ROUTE_PATHS.CHANGE_PASSWORD);
    };

    const handleToggleTwoFactor = () => {
        // UI only - không xử lý backend thật
        setTwoFactorEnabled(!twoFactorEnabled);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-deepSlate-900 flex items-center gap-2">
                    <IconShield size={20} className="text-oceanTeal-500" />
                    Bảo mật
                </h2>
            </div>

            <div className="space-y-4">
                {/* Đổi mật khẩu */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-oceanTeal-50 rounded-lg">
                            <IconLock size={18} className="text-oceanTeal-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-deepSlate-900">Đổi mật khẩu</p>
                            <p className="text-xs text-deepSlate-500">Cập nhật mật khẩu để bảo vệ tài khoản</p>
                        </div>
                    </div>
                    <button
                        onClick={handleChangePassword}
                        className="px-4 py-2 text-sm font-medium text-oceanTeal-600 hover:text-oceanTeal-700 hover:bg-oceanTeal-50 rounded-md transition-colors"
                    >
                        Đổi mật khẩu
                    </button>
                </div>

                {/* Xác thực 2 bước (OTP Email) */}
                <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <IconShield size={18} className="text-purple-500" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-medium text-deepSlate-900">Xác thực 2 bước (OTP Email)</p>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                    twoFactorEnabled 
                                        ? 'bg-green-50 text-green-700' 
                                        : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {twoFactorEnabled ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                                </span>
                            </div>
                            <p className="text-xs text-deepSlate-500">
                                Bảo vệ tài khoản bằng mã OTP gửi qua email khi đăng nhập
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleToggleTwoFactor}
                        className={`ml-4 p-1 rounded-full transition-colors ${
                            twoFactorEnabled 
                                ? 'bg-oceanTeal-500' 
                                : 'bg-gray-300'
                        }`}
                    >
                        {twoFactorEnabled ? (
                            <IconToggleRight size={32} className="text-white" />
                        ) : (
                            <IconToggleLeft size={32} className="text-white" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SecurityCard;

