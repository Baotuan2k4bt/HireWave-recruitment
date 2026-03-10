import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconPencil, IconPlus, IconCheck, IconX, IconCertificate, IconCalendar } from '@tabler/icons-react';
import { changeProfile } from '../../Slices/ProfileSlice';
import { successNotification } from '../../Services/NotificationService';
import { formatDate } from '../../Services/Utilities';
import CertiInput from './CertiInput';

interface CertificationsSectionProps {
    profile: any;
}

const CertificationsSection = ({ profile }: CertificationsSectionProps) => {
    const dispatch = useDispatch();
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const handleDelete = (index: number) => {
        const updatedProfile = { ...profile };
        updatedProfile.certifications = updatedProfile.certifications.filter((_: any, i: number) => i !== index);
        dispatch(changeProfile(updatedProfile));
        successNotification('Thành công', 'Xóa chứng chỉ thành công');
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setShowAddForm(false);
    };

    const certifications = profile?.certifications || [];
    const hasCertifications = certifications.length > 0;

    return (
        <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-deepSlate-900">Chứng chỉ</h3>
                <div className={`flex items-center gap-2 transition-opacity ${isHovered || isEditing || showAddForm ? 'opacity-100' : 'opacity-0'}`}>
                    {!showAddForm && !editingIndex && (
                        <>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="p-1.5 text-oceanTeal-600 hover:bg-oceanTeal-50 rounded transition-colors"
                                title="Thêm chứng chỉ"
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
                        <h4 className="text-sm font-semibold text-deepSlate-900">Thêm chứng chỉ</h4>
                        <button
                            onClick={handleCancelEdit}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                            <IconX size={16} />
                        </button>
                    </div>
                    <CertiInput add setEdit={setShowAddForm} />
                </div>
            )}

            {editingIndex !== null && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-deepSlate-900">Chỉnh sửa chứng chỉ</h4>
                        <button
                            onClick={handleCancelEdit}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                            <IconX size={16} />
                        </button>
                    </div>
                    <CertiInput {...certifications[editingIndex]} index={editingIndex} setEdit={setEditingIndex} />
                </div>
            )}

            {hasCertifications ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certifications.map((cert: any, index: number) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-oceanTeal-300 hover:shadow-sm transition-all">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="p-2 bg-oceanTeal-50 rounded-lg">
                                        <IconCertificate size={20} className="text-oceanTeal-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-deepSlate-900 mb-1">
                                            {cert.name}
                                        </h4>
                                        <p className="text-xs text-deepSlate-600 mb-1">
                                            {cert.issuer || cert.issuingOrganization}
                                        </p>
                                        {cert.issueDate && (
                                            <div className="flex items-center gap-1 text-xs text-deepSlate-500">
                                                <IconCalendar size={12} />
                                                {formatDate(cert.issueDate)}
                                            </div>
                                        )}
                                        {cert.certificateId && (
                                            <p className="text-xs text-deepSlate-500 mt-1">
                                                ID: {cert.certificateId}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {isEditing && (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleEdit(index)}
                                            className="p-1 text-oceanTeal-600 hover:bg-oceanTeal-50 rounded"
                                        >
                                            <IconPencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(index)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <IconX size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : !showAddForm && (
                <div className="text-center py-8">
                    <p className="text-sm text-deepSlate-400 mb-3">Chưa có chứng chỉ nào</p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-oceanTeal-600 hover:text-oceanTeal-700 hover:bg-oceanTeal-50 rounded-md transition-colors"
                    >
                        <IconPlus size={16} />
                        Thêm chứng chỉ
                    </button>
                </div>
            )}
        </div>
    );
};

export default CertificationsSection;

