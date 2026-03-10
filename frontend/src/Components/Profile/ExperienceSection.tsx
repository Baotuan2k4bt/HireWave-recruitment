import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconPencil, IconPlus, IconCheck, IconX, IconBriefcase, IconMapPin, IconCalendar } from '@tabler/icons-react';
import { changeProfile } from '../../Slices/ProfileSlice';
import { successNotification } from '../../Services/NotificationService';
import { formatDate } from '../../Services/Utilities';
import ExpInput from './ExpInput';

interface ExperienceSectionProps {
    profile: any;
}

const ExperienceSection = ({ profile }: ExperienceSectionProps) => {
    const dispatch = useDispatch();
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const handleDelete = (index: number) => {
        const updatedProfile = { ...profile };
        updatedProfile.experiences = updatedProfile.experiences.filter((_: any, i: number) => i !== index);
        dispatch(changeProfile(updatedProfile));
        successNotification('Thành công', 'Xóa kinh nghiệm thành công');
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setShowAddForm(false);
    };

    const experiences = profile?.experiences || [];
    const hasExperiences = experiences.length > 0;

    return (
        <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-deepSlate-900">Kinh nghiệm làm việc</h3>
                <div className={`flex items-center gap-2 transition-opacity ${isHovered || isEditing || showAddForm ? 'opacity-100' : 'opacity-0'}`}>
                    {!showAddForm && !editingIndex && (
                        <>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="p-1.5 text-oceanTeal-600 hover:bg-oceanTeal-50 rounded transition-colors"
                                title="Thêm kinh nghiệm"
                            >
                                <IconPlus size={18} />
                            </button>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="p-1.5 text-oceanTeal-600 hover:bg-oceanTeal-50 rounded transition-colors"
                            >
                                <IconPencil size={18} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {showAddForm && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-deepSlate-900">Thêm kinh nghiệm</h4>
                        <button
                            onClick={handleCancelEdit}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                            <IconX size={16} />
                        </button>
                    </div>
                    <ExpInput add setEdit={setShowAddForm} />
                </div>
            )}

            {editingIndex !== null && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-deepSlate-900">Chỉnh sửa kinh nghiệm</h4>
                        <button
                            onClick={handleCancelEdit}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                            <IconX size={16} />
                        </button>
                    </div>
                    <ExpInput {...experiences[editingIndex]} index={editingIndex} setEdit={setEditingIndex} />
                </div>
            )}

            {hasExperiences ? (
                <div className="space-y-6">
                    {experiences.map((exp: any, index: number) => (
                        <div key={index} className="relative pl-8 border-l-2 border-oceanTeal-200">
                            {/* Timeline dot */}
                            <div className="absolute -left-2 top-0 w-4 h-4 bg-oceanTeal-500 rounded-full border-2 border-white"></div>
                            
                            <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="text-base font-semibold text-deepSlate-900 mb-1">
                                            {exp.title}
                                        </h4>
                                        <div className="flex items-center gap-4 text-sm text-deepSlate-600 mb-2">
                                            <span className="flex items-center gap-1">
                                                <IconBriefcase size={14} />
                                                {exp.company}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <IconMapPin size={14} />
                                                {exp.location}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-deepSlate-500">
                                            <IconCalendar size={12} />
                                            {formatDate(exp.startDate)} - {exp.working ? 'Hiện tại' : formatDate(exp.endDate)}
                                        </div>
                                    </div>
                                    {isEditing && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(index)}
                                                className="p-1.5 text-oceanTeal-600 hover:bg-oceanTeal-50 rounded"
                                            >
                                                <IconPencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(index)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <IconX size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {exp.description && (
                                    <p className="text-sm text-deepSlate-700 leading-relaxed">
                                        {exp.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : !showAddForm && (
                <div className="text-center py-8">
                    <p className="text-sm text-deepSlate-400 mb-3">Chưa có kinh nghiệm làm việc</p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-oceanTeal-600 hover:text-oceanTeal-700 hover:bg-oceanTeal-50 rounded-md transition-colors"
                    >
                        <IconPlus size={16} />
                        Thêm kinh nghiệm
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExperienceSection;

