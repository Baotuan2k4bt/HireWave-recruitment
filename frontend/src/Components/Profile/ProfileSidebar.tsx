import { useState } from 'react';
import { Avatar } from '@mantine/core';
import { IconBrain, IconFileText, IconDownload, IconCheck, IconX, IconMapPin, IconBriefcase } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../../constants/route-paths';

interface ProfileSidebarProps {
    user: any;
    profile: any;
}

const ProfileSidebar = ({ user, profile }: ProfileSidebarProps) => {
    const navigate = useNavigate();
    const [hoveredSection, setHoveredSection] = useState<string | null>(null);

    const userName = user?.name || user?.email || 'User';
    const userAvatar = profile?.picture 
        ? `data:image/jpeg;base64,${profile.picture}` 
        : '/avatar.png';
    
    const jobTitle = profile?.jobTitle || 'Chưa cập nhật';
    const location = profile?.location || 'Chưa cập nhật';
    const totalExp = profile?.totalExp || 0;
    
    // Kiểm tra trạng thái hoàn thiện hồ sơ
    const isProfileComplete = profile?.about && profile?.skills?.length > 0 && profile?.experiences?.length > 0;

    const handleAnalyzeCV = () => {
        navigate(ROUTE_PATHS.CV_ANALYSIS);
    };

    const handleViewCV = () => {
        // Navigate to CV view page
        navigate(ROUTE_PATHS.MY_CV);
    };

    const handleDownloadPDF = () => {
        // Generate and download PDF
        // UI only - không xử lý backend thật
        alert('Tính năng tải CV PDF đang được phát triển');
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-20">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
                <Avatar
                    src={userAvatar}
                    alt={userName}
                    size={120}
                    radius="xl"
                    className="border-4 border-oceanTeal-500 mb-4"
                />
                <h2 className="text-xl font-bold text-deepSlate-900 text-center mb-1">
                    {userName}
                </h2>
                <p className="text-sm text-deepSlate-600 text-center mb-4">
                    {jobTitle}
                </p>
                
                {/* Status Badge */}
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                    isProfileComplete 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-yellow-50 text-yellow-700'
                }`}>
                    {isProfileComplete ? (
                        <>
                            <IconCheck size={14} />
                            Đã hoàn thiện
                        </>
                    ) : (
                        <>
                            <IconX size={14} />
                            Chưa hoàn thiện
                        </>
                    )}
                </span>
            </div>

            {/* Info Section */}
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-start gap-3">
                    <IconBriefcase size={18} className="text-deepSlate-400 mt-0.5" />
                    <div>
                        <p className="text-xs text-deepSlate-500">Vị trí mong muốn</p>
                        <p className="text-sm font-medium text-deepSlate-900">{jobTitle}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <IconBriefcase size={18} className="text-deepSlate-400 mt-0.5" />
                    <div>
                        <p className="text-xs text-deepSlate-500">Kinh nghiệm</p>
                        <p className="text-sm font-medium text-deepSlate-900">{totalExp} năm</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <IconMapPin size={18} className="text-deepSlate-400 mt-0.5" />
                    <div>
                        <p className="text-xs text-deepSlate-500">Địa điểm</p>
                        <p className="text-sm font-medium text-deepSlate-900">{location}</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                <button
                    onClick={handleAnalyzeCV}
                    onMouseEnter={() => setHoveredSection('analyze')}
                    onMouseLeave={() => setHoveredSection(null)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-oceanTeal-50 text-oceanTeal-700 rounded-lg hover:bg-oceanTeal-100 transition-colors font-medium"
                >
                    <IconBrain size={20} />
                    <span>Phân tích CV bằng AI</span>
                </button>

                <button
                    onClick={handleViewCV}
                    onMouseEnter={() => setHoveredSection('view')}
                    onMouseLeave={() => setHoveredSection(null)}
                    className="w-full flex items-center gap-3 px-4 py-3 border-2 border-oceanTeal-500 text-oceanTeal-600 rounded-lg hover:bg-oceanTeal-50 transition-colors font-medium"
                >
                    <IconFileText size={20} />
                    <span>Xem CV</span>
                </button>

                <button
                    onClick={handleDownloadPDF}
                    onMouseEnter={() => setHoveredSection('download')}
                    onMouseLeave={() => setHoveredSection(null)}
                    className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 text-deepSlate-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                    <IconDownload size={20} />
                    <span>Tải CV PDF</span>
                </button>
            </div>
        </div>
    );
};

export default ProfileSidebar;

