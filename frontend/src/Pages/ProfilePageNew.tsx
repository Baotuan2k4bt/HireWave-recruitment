import { useSelector } from 'react-redux';
import ProfileSidebar from '../Components/Profile/ProfileSidebar';
import ProfileContent from '../Components/Profile/ProfileContent';

const ProfilePageNew = () => {
    const user = useSelector((state: any) => state.user);
    const profile = useSelector((state: any) => state.profile);

    return (
        <div className="min-h-screen bg-gray-50 py-8" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                    {/* Sidebar - 30% */}
                    <div className="lg:col-span-3">
                        <ProfileSidebar user={user} profile={profile} />
                    </div>

                    {/* Content - 70% */}
                    <div className="lg:col-span-7">
                        <ProfileContent profile={profile} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePageNew;

