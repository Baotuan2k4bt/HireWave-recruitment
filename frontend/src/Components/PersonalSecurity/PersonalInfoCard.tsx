import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@mantine/core';
import { IconUser, IconMail, IconEdit, IconShield } from '@tabler/icons-react';
import { ROUTE_PATHS } from '../../constants/route-paths';

interface PersonalInfoCardProps {
    user: any;
    profile: any;
}

const PersonalInfoCard = ({ user, profile }: PersonalInfoCardProps) => {
    const accountStatus = user?.accountStatus || 'ACTIVE';
    const accountType = user?.accountType || 'APPLICANT';
    const userName = user?.name || user?.email || 'User';
    const [avatarErrored, setAvatarErrored] = useState(false);

    const avatarSource = useMemo(() => {
        const candidate =
            profile?.picture ??
            profile?.avatar ??
            user?.picture ??
            user?.avatar ??
            '';

        const rawPicture = typeof candidate === 'string' ? candidate.trim() : '';

        if (!rawPicture || avatarErrored) {
            return '/avatar.png';
        }

        if (
            rawPicture.startsWith('data:') ||
            rawPicture.startsWith('http://') ||
            rawPicture.startsWith('https://') ||
            rawPicture.startsWith('/')
        ) {
            return rawPicture;
        }

        return `data:image/jpeg;base64,${rawPicture}`;
    }, [profile?.picture, profile?.avatar, user?.picture, user?.avatar, avatarErrored]);

    const getAccountTypeLabel = (type: string) => {
        switch (type) {
            case 'APPLICANT': return 'Ứng viên';
            case 'EMPLOYER': return 'Nhà tuyển dụng';
            case 'ADMIN': return 'Quản trị viên';
            default: return type;
        }
    };

    const getAccountStatusLabel = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'Hoạt động';
            case 'INACTIVE': return 'Tạm khóa';
            case 'PENDING': return 'Đang chờ';
            default: return status;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-deepSlate-900 flex items-center gap-2">
                    <IconUser size={20} className="text-oceanTeal-500" />
                    Thông tin cá nhân
                </h2>
            </div>

            <div className="space-y-4">
                {/* Avatar + hồ sơ cá nhân */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                    <Avatar
  src={avatarSource}
  alt={userName}
  size={52}
  radius="xl"
  className="border border-oceanTeal-200"
  imageProps={{
    referrerPolicy: 'no-referrer',
    crossOrigin: 'anonymous',
    onError: () => setAvatarErrored(true),
  }}
>
  {userName?.charAt(0)?.toUpperCase()}
</Avatar>
                        <div>
                            <p className="text-sm font-medium text-deepSlate-900">Hồ sơ cá nhân</p>
                            <p className="text-xs text-deepSlate-500">Xem và chỉnh sửa thông tin hồ sơ</p>
                        </div>
                    </div>
                    <Link
                        to={ROUTE_PATHS.PROFILE}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-oceanTeal-600 hover:text-oceanTeal-700 hover:bg-oceanTeal-50 rounded-md transition-colors"
                    >
                        <IconEdit size={16} />
                        <span>Xem / Chỉnh sửa</span>
                    </Link>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg">
                            <IconMail size={18} className="text-deepSlate-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-deepSlate-900">Email</p>
                            <p className="text-xs text-deepSlate-500">{user?.email || 'N/A'}</p>
                        </div>
                    </div>
                    <span className="text-xs text-deepSlate-400 px-3 py-1 bg-gray-50 rounded-md">
                        Chỉ đọc
                    </span>
                </div>

                {/* Trạng thái tài khoản */}
                <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <IconShield size={18} className="text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-deepSlate-900">Trạng thái tài khoản</p>
                            <p className="text-xs text-deepSlate-500">
                                {getAccountTypeLabel(accountType)} • {getAccountStatusLabel(accountStatus)}
                            </p>
                        </div>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-md ${
                        accountStatus === 'ACTIVE' 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-yellow-50 text-yellow-700'
                    }`}>
                        {getAccountStatusLabel(accountStatus)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoCard;

