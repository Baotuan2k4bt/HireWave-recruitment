import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconPencil, IconPlus, IconCheck, IconX } from '@tabler/icons-react';
import { changeProfile } from '../../Slices/ProfileSlice';
import { successNotification } from '../../Services/NotificationService';
import { TagsInput } from '@mantine/core';

interface SkillsSectionProps {
    profile: any;
}

const SkillsSection = ({ profile }: SkillsSectionProps) => {
    const dispatch = useDispatch();
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [skills, setSkills] = useState<string[]>(profile?.skills || []);

    const handleEdit = () => {
        setSkills(profile?.skills || []);
        setIsEditing(true);
    };

    const handleSave = () => {
        const updatedProfile = { ...profile, skills };
        dispatch(changeProfile(updatedProfile));
        successNotification('Thành công', 'Cập nhật kỹ năng thành công');
        setIsEditing(false);
    };

    const handleCancel = () => {
        setSkills(profile?.skills || []);
        setIsEditing(false);
    };

    const hasSkills = profile?.skills && profile.skills.length > 0;

    return (
        <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-deepSlate-900">Kỹ năng</h3>
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
                <TagsInput
                    value={skills}
                    onChange={setSkills}
                    placeholder="Nhập kỹ năng và nhấn Enter"
                    splitChars={[',', ' ', '|']}
                />
            ) : hasSkills ? (
                <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string, index: number) => (
                        <span
                            key={index}
                            className="px-3 py-1.5 bg-oceanTeal-50 text-oceanTeal-700 rounded-full text-sm font-medium"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-sm text-deepSlate-400 mb-3">Chưa có kỹ năng nào</p>
                    <button
                        onClick={handleEdit}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-oceanTeal-600 hover:text-oceanTeal-700 hover:bg-oceanTeal-50 rounded-md transition-colors"
                    >
                        <IconPlus size={16} />
                        Thêm kỹ năng
                    </button>
                </div>
            )}
        </div>
    );
};

export default SkillsSection;

