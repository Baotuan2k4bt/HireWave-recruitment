import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from '@mantine/core';
import { IconUser, IconLock, IconLogout, IconChevronDown } from '@tabler/icons-react';
import { removeUser } from '../../Slices/UserSlice';
import { removeJwt } from '../../Slices/JwtSlice';
import { ROUTE_PATHS } from '../../constants/route-paths';

const ProfileMenuNew = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const user = useSelector((state: any) => state.user);
    const profile = useSelector((state: any) => state.profile);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch(removeUser());
        dispatch(removeJwt());
        localStorage.removeItem('token');
        setIsOpen(false);
        navigate('/');
    };

    const userName = user?.name || user?.email || 'User';
    const userAvatar = profile?.picture 
        ? `data:image/jpeg;base64,${profile.picture}` 
        : '/avatar.png';

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
                <Avatar
                    src={userAvatar}
                    alt={userName}
                    size={32}
                    radius="xl"
                />
                <span className="hidden md:block text-sm font-medium text-deepSlate-700">
                    {userName}
                </span>
                <IconChevronDown 
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    size={16}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 transform transition-all duration-200 ease-out">
                    <Link
                        to={ROUTE_PATHS.PROFILE}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-deepSlate-700 hover:bg-oceanTeal-50 hover:text-oceanTeal-600 transition-colors duration-150"
                    >
                        <IconUser size={18} className="text-deepSlate-400" />
                        <span>Hồ sơ</span>
                    </Link>
                    <Link
                        to={ROUTE_PATHS.PERSONAL_SECURITY}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-deepSlate-700 hover:bg-oceanTeal-50 hover:text-oceanTeal-600 transition-colors duration-150"
                    >
                        <IconLock size={18} className="text-deepSlate-400" />
                        <span>Cá nhân & Bảo mật</span>
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                    >
                        <IconLogout size={18} />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileMenuNew;

