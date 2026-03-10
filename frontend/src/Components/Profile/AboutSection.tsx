import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconPencil, IconPlus, IconCheck, IconX } from '@tabler/icons-react';
import { changeProfile } from '../../Slices/ProfileSlice';
import { successNotification } from '../../Services/NotificationService';
import { Textarea } from '@mantine/core';

interface AboutSectionProps {
    profile: any;
}

const AboutSection = ({ profile }: AboutSectionProps) => {
    const dispatch = useDispatch();
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [about, setAbout] = useState(profile?.about || '');

    const handleEdit = () => {
        setAbout(profile?.about || '');
        setIsEditing(true);
    };

    const handleSave = () => {
        const updatedProfile = { ...profile, about };
        dispatch(changeProfile(updatedProfile));
        successNotification('Thành công', 'Cập nhật giới thiệu thành công');
        setIsEditing(false);
    };

    const handleCancel = () => {
        setAbout(profile?.about || '');
        setIsEditing(false);
    };

    const hasContent = profile?.about && profile.about.trim().length > 0;

    return (
        <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-deepSlate-900">Giới thiệu</h3>
                <div className={`flex items-center gap-2 transition-opacity ${isHovered || isEditing ? 'opacity-100' : 'opacity-0'}`}>
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            >
                                <IconCheck size={18} />
                            </button>
                            <button
                                onClick={handleCancel}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                                <IconX size={18} />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleEdit}
                            className="p-1.5 text-oceanTeal-600 hover:bg-oceanTeal-50 rounded transition-colors"
                        >
                            <IconPencil size={18} />
                        </button>
                    )}
                </div>
            </div>

            {isEditing ? (
                <Textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Giới thiệu về bản thân, kinh nghiệm và mục tiêu nghề nghiệp..."
                    minRows={4}
                    className="w-full"
                />
            ) : hasContent ? (
                <p className="text-sm text-deepSlate-700 leading-relaxed whitespace-pre-wrap">
                    {profile.about}
                </p>
            ) : (
                <div className="text-center py-8">
                    <p className="text-sm text-deepSlate-400 mb-3">Chưa có thông tin giới thiệu</p>
                    <button
                        onClick={handleEdit}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-oceanTeal-600 hover:text-oceanTeal-700 hover:bg-oceanTeal-50 rounded-md transition-colors"
                    >
                        <IconPlus size={16} />
                        Thêm giới thiệu
                    </button>
                </div>
            )}
        </div>
    );
};

export default AboutSection;

