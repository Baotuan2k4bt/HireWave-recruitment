import { useSelector } from 'react-redux';
import { Avatar } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import PersonalInfoCard from '../Components/PersonalSecurity/PersonalInfoCard';
import SecurityCard from '../Components/PersonalSecurity/SecurityCard';
import SessionCard from '../Components/PersonalSecurity/SessionCard';

const PersonalSecurityPage = () => {
    const user = useSelector((state: any) => state.user);
    const profile = useSelector((state: any) => state.profile);

    const userName = user?.name || user?.email || 'User';
    const userEmail = user?.email || '';
    const userAvatar = profile?.picture 
        ? `data:image/jpeg;base64,${profile.picture}` 
        : '/avatar.png';
    
    // Giả sử trạng thái xác thực (có thể lấy từ backend)
    const isVerified = user?.emailVerified || false;

    return (
        <div className="min-h-screen bg-gray-50 py-8" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center gap-6">
                        <Avatar
                            src={userAvatar}
                            alt={userName}
                            size={80}
                            radius="xl"
                            className="border-2 border-oceanTeal-500"
                        />
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-deepSlate-900 mb-1">
                                {userName}
                            </h1>
                            <p className="text-sm text-deepSlate-600 mb-3">
                                {userEmail}
                            </p>
                            <div className="flex items-center gap-2">
                                {isVerified ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                                        <IconCheck size={14} />
                                        Tài khoản đã xác thực
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium">
                                        <IconX size={14} />
                                        Chưa xác thực
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cards Section */}
                <div className="space-y-6">
                    <PersonalInfoCard user={user} profile={profile} />
                    <SecurityCard user={user} />
                    <SessionCard />
                </div>
            </div>
        </div>
    );
};

export default PersonalSecurityPage;

