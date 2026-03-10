import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DropdownMenu as DropdownMenuType } from '../../constants/header-menu.config';
import { IconChevronDown } from '@tabler/icons-react';

interface DropdownMenuProps {
    menu: DropdownMenuType;
    isActive?: boolean;
}

const DropdownMenu = ({ menu, isActive }: DropdownMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const user = useSelector((state: any) => state.user);
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

    const handleItemClick = (e: React.MouseEvent, path: string, requiresAuth?: boolean, roles?: string[]) => {
        // Kiểm tra authentication
        if (requiresAuth && !user) {
            e.preventDefault();
            // Lưu redirect URL để sau khi login có thể quay lại
            localStorage.setItem('redirectUrl', path);
            navigate('/login');
            setIsOpen(false);
            return;
        }
        
        // Kiểm tra roles nếu đã đăng nhập
        if (roles && user && !roles.includes(user.accountType)) {
            e.preventDefault();
            navigate('/unauthorized');
            setIsOpen(false);
            return;
        }
        
        setIsOpen(false);
    };

    // Chỉ hiển thị những item phù hợp với role hiện tại
    const displayItems = menu.items.filter((item) => {
        if (item.roles && !user) {
            // yêu cầu đăng nhập mà chưa đăng nhập -> ẩn
            return false;
        }
        if (item.roles && user) {
            return item.roles.includes(user.accountType);
        }
        return true; // item public
    });

    if (displayItems.length === 0) {
        // Không có item nào phù hợp role hiện tại -> ẩn luôn dropdown
        return null;
    }

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-md
                    transition-all duration-200
                    ${isActive 
                        ? 'text-oceanTeal-500 bg-oceanTeal-50' 
                        : 'text-deepSlate-700 hover:text-oceanTeal-500 hover:bg-gray-50'
                    }
                `}
            >
                <span>{menu.label}</span>
                <IconChevronDown 
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    size={16}
                    stroke={1.5}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 transform transition-all duration-200 ease-out origin-top-left">
                    {displayItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={index}
                                to={item.path}
                                onClick={(e) => handleItemClick(e, item.path, item.requiresAuth, item.roles)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-deepSlate-700 hover:bg-oceanTeal-50 hover:text-oceanTeal-600 cursor-pointer transition-all duration-150"
                            >
                                {Icon && (
                                    <Icon 
                                        size={18} 
                                        className="text-deepSlate-400" 
                                    />
                                )}
                                <span className="flex-1">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;

