import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IconLogout, IconDeviceDesktop } from '@tabler/icons-react';
import { removeUser } from '../../Slices/UserSlice';
import { removeJwt } from '../../Slices/JwtSlice';

const SessionCard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(removeUser());
        dispatch(removeJwt());
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleLogoutAll = () => {
        // UI only - không xử lý backend thật
        handleLogout();
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-deepSlate-900 flex items-center gap-2">
                    <IconDeviceDesktop size={20} className="text-oceanTeal-500" />
                    Phiên đăng nhập
                </h2>
            </div>

            <div className="space-y-4">
                {/* Đăng xuất */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <IconLogout size={18} className="text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-deepSlate-900">Đăng xuất</p>
                            <p className="text-xs text-deepSlate-500">Đăng xuất khỏi tài khoản hiện tại</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                    >
                        Đăng xuất
                    </button>
                </div>

                {/* Đăng xuất tất cả thiết bị */}
                <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <IconDeviceDesktop size={18} className="text-orange-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-deepSlate-900">Đăng xuất tất cả thiết bị</p>
                            <p className="text-xs text-deepSlate-500">Đăng xuất khỏi tất cả các thiết bị đã đăng nhập</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogoutAll}
                        className="px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-md transition-colors"
                    >
                        Đăng xuất tất cả
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionCard;

