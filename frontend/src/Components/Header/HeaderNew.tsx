import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IconAnchor, IconMenu2, IconX } from '@tabler/icons-react';
import { Badge } from '@mantine/core';
import DropdownMenu from './DropdownMenu';
import { HEADER_MENU_CONFIG } from '../../constants/header-menu.config';
import { MenuItem, DropdownMenu as DropdownMenuType } from '../../constants/header-menu.config';
import { setupResponseInterceptor } from '../../Interceptor/AxiosInterceptor';
import { getProfile } from '../../Services/ProfileService';
import { getEmployerPendingJobs } from '../../Services/JobService';
import { setProfile } from '../../Slices/ProfileSlice';
import { setUser } from '../../Slices/UserSlice';
import { removeUser } from '../../Slices/UserSlice';
import { removeJwt } from '../../Slices/JwtSlice';
import { jwtDecode } from 'jwt-decode';
import ProfileMenuNew from './ProfileMenuNew';
import NotiMenu from './NotiMenu';

const HeaderNew = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [pendingJobsCount, setPendingJobsCount] = useState(0);
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state: any) => state.user);
	const token = useSelector((state: any) => state.jwt);
	const profile = useSelector((state: any) => state.profile);

	// Helper: Kiểm tra menu item có hiển thị cho user hiện tại không
	const shouldShowMenuItem = (item: MenuItem): boolean => {
		// Nếu không yêu cầu đăng nhập → luôn hiển thị
		if (!item.requiresAuth) return true;

		// Nếu yêu cầu đăng nhập nhưng chưa đăng nhập → ẩn
		if (!user) return false;

		// Nếu có roles → kiểm tra role
		if (item.roles && !item.roles.includes(user.accountType)) {
			return false;
		}

		return true;
	};

	// Helper: Kiểm tra dropdown có item nào hiển thị không
	const shouldShowDropdown = (dropdown: DropdownMenuType): boolean => {
		return dropdown.items.some(item => shouldShowMenuItem(item));
	};

	// Helper: Lọc các item hiển thị trong dropdown
	const getVisibleItems = (dropdown: DropdownMenuType): MenuItem[] => {
		return dropdown.items.filter(item => shouldShowMenuItem(item));
	};

	useEffect(() => {
		setupResponseInterceptor(navigate, dispatch);
	}, [navigate, dispatch]);

	// Handle scroll shadow
	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 5);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	useEffect(() => {
		if (token) {
			if (localStorage.getItem("token")) {
				const decoded = jwtDecode(localStorage.getItem("token") || "");
				dispatch(setUser({ ...decoded, email: decoded.sub }));
			}
		}
		if (user?.profileId) {
			getProfile(user?.profileId)
				.then((res) => {
					dispatch(setProfile(res));
				})
				.catch((err) => console.log(err));
		}
	}, [token, user?.profileId, dispatch]);

	// Fetch pending jobs count for employer
	useEffect(() => {
		const fetchPendingJobsCount = async () => {
			if (user?.id && (user.accountType === 'EMPLOYER' || user.accountType === 'ADMIN')) {
				try {
					const pendingJobs = await getEmployerPendingJobs();
					setPendingJobsCount(pendingJobs.length);
				} catch (error) {
					console.error('Failed to fetch pending jobs count:', error);
				}
			}
		};
		fetchPendingJobsCount();
	}, [user?.id, user?.accountType]);

	const handleLogout = () => {
		dispatch(removeUser());
		dispatch(removeJwt());
		localStorage.removeItem('token');
		navigate('/');
	};

	const isActive = (path: string): boolean => {
		if (path === '/') {
			return location.pathname === '/';
		}
		return location.pathname === path || location.pathname.startsWith(path + '/');
	};

	const handleMenuItemClick = (e: React.MouseEvent, item: MenuItem) => {
		if (item.requiresAuth && !user) {
			e.preventDefault();
			localStorage.setItem('redirectUrl', item.path);
			navigate('/login');
			setMobileMenuOpen(false);
			return;
		}
		if (item.roles && user && !item.roles.includes(user.accountType)) {
			e.preventDefault();
			navigate('/unauthorized');
			setMobileMenuOpen(false);
			return;
		}
		setMobileMenuOpen(false);
	};

	// Hide header on login/signup pages
	if (location.pathname === '/login' || location.pathname === '/signup') {
		return null;
	}

	return (
		<header className={`fixed top-0 left-0 right-0 z-50 bg-white border-b transition-all duration-300 ${
			scrolled ? 'shadow-md border-gray-200' : 'shadow-sm border-gray-100'
		}`}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-20">
					{/* Logo */}
					<Link to="/" className="flex items-center gap-3 group cursor-pointer whitespace-nowrap">
						<div className="relative">
							<div className="absolute inset-0 bg-gradient-to-br from-oceanTeal-400 to-oceanTeal-600 rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
							<div className="relative bg-gradient-to-br from-oceanTeal-500 to-oceanTeal-700 p-2 rounded-lg group-hover:scale-105 transition-transform duration-300">
								<IconAnchor className="h-6 w-6 text-white" stroke={2.5} />
							</div>
						</div>
						<span className="text-2xl font-semibold bg-gradient-to-r from-oceanTeal-600 via-oceanTeal-500 to-oceanTeal-600 bg-clip-text text-transparent tracking-tight group-hover:from-oceanTeal-700 group-hover:via-oceanTeal-600 group-hover:to-oceanTeal-700 transition-all duration-300 whitespace-nowrap">
							HireWave
						</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden lg:flex items-center gap-2 text-[13px] font-medium text-gray-900">
						{HEADER_MENU_CONFIG.map((menuItem, index) => {
							if ('items' in menuItem) {
								// Dropdown menu - chỉ hiển thị nếu có item hợp lệ
								if (!shouldShowDropdown(menuItem)) {
									return null;
								}
								const visibleItems = getVisibleItems(menuItem);
								const hasActiveItem = visibleItems.some(item => isActive(item.path));
								return (
									<DropdownMenu
										key={index}
										menu={{ ...menuItem, items: visibleItems } as DropdownMenuType}
										isActive={hasActiveItem}
									/>
								);
							} else {
								// Regular menu item
								if (!shouldShowMenuItem(menuItem)) {
									return null;
								}
								const Icon = menuItem.icon;
								const showPendingBadge = menuItem.path.includes('/posted-jobs') && pendingJobsCount > 0;
								return (
									<Link
										key={index}
										to={menuItem.path}
										className={`flex items-center gap-2 px-3 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 ${
											isActive(menuItem.path) ? 'bg-oceanTeal-50 shadow-sm' : 'hover:bg-gray-50'
										}`}
									>
										{Icon && (
											<Icon size={16} stroke={2} className={isActive(menuItem.path) ? 'text-oceanTeal-600' : 'text-gray-700'} />
										)}
										<span className="max-w-[160px] truncate whitespace-nowrap">
											{menuItem.label}
										</span>
										{showPendingBadge && (
											<Badge size="xs" color="orange" variant="filled" radius="xl">
												{pendingJobsCount}
											</Badge>
										)}
									</Link>
								);
							}
						})}
					</nav>

					{/* Right Side - Auth Buttons / Profile */}
					<div className="flex items-center gap-3">
						{user ? (
							<div className="flex items-center gap-2 rounded-full bg-slate-50 border border-slate-200 px-2 py-1.5">
								<NotiMenu />
								<div className="w-px h-5 bg-slate-200" />
								<ProfileMenuNew />
							</div>
						) : (
							<>
								<Link
									to="/login"
									className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-[13px] font-medium text-gray-900 border border-gray-300 rounded-lg hover:border-oceanTeal-500 hover:text-oceanTeal-600 hover:bg-oceanTeal-50 transition-all duration-200 whitespace-nowrap"
								>
									Đăng nhập
								</Link>
								<Link
									to="/signup"
									className="inline-flex items-center justify-center px-5 py-2 text-[13px] font-medium text-white bg-gradient-to-r from-oceanTeal-500 to-oceanTeal-600 rounded-lg hover:from-oceanTeal-600 hover:to-oceanTeal-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 whitespace-nowrap"
								>
									Đăng ký
								</Link>
							</>
						)}

						{/* Mobile Menu Button */}
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="lg:hidden p-2.5 rounded-lg text-gray-900 hover:text-oceanTeal-600 hover:bg-gray-100 transition-all duration-200"
							aria-label="Toggle menu"
						>
							{mobileMenuOpen ? (
								<IconX size={24} stroke={2} />
							) : (
								<IconMenu2 size={24} stroke={2} />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<div className="lg:hidden border-t border-gray-200 bg-white shadow-lg">
					<div className="px-4 py-5 space-y-2 text-[13px] text-gray-900">
						{HEADER_MENU_CONFIG.map((menuItem, index) => {
							if ('items' in menuItem) {
								// Dropdown menu - chỉ hiển thị nếu có item hợp lệ
								if (!shouldShowDropdown(menuItem)) {
									return null;
								}
								const visibleItems = getVisibleItems(menuItem);
								return (
									<div key={index} className="space-y-1">
										<div className="px-4 py-2.5 text-xs font-semibold text-gray-900 border-b-2 border-gray-200 bg-gray-50 rounded-t-lg uppercase tracking-wide">
											{menuItem.label}
										</div>
										{visibleItems.map((item, itemIndex) => {
											const Icon = item.icon;
											return (
												<Link
													key={itemIndex}
													to={item.path}
													onClick={(e) => handleMenuItemClick(e, item)}
													className={`flex items-center gap-3 px-4 py-3 font-medium rounded-lg transition-all duration-200 ${
														isActive(item.path) ? 'bg-oceanTeal-50 border-l-4 border-oceanTeal-500' : 'hover:bg-gray-50'
													}`}
												>
													{Icon && <Icon size={18} stroke={2} className={isActive(item.path) ? 'text-oceanTeal-600' : 'text-gray-600'} />}
													<span className="flex-1 truncate whitespace-nowrap">
														{item.label}
													</span>
												</Link>
											);
										})}
									</div>
								);
							} else {
								// Regular menu item
								if (!shouldShowMenuItem(menuItem)) {
									return null;
								}
								const Icon = menuItem.icon;
								const showPendingBadge = menuItem.path.includes('/posted-jobs') && pendingJobsCount > 0;
								return (
									<Link
										key={index}
										to={menuItem.path}
										onClick={() => setMobileMenuOpen(false)}
										className={`flex items-center gap-3 px-4 py-3 font-semibold rounded-lg transition-all duration-200 ${
											isActive(menuItem.path) ? 'bg-oceanTeal-50 border-l-4 border-oceanTeal-500' : 'hover:bg-gray-50'
										}`}
									>
										{Icon && <Icon size={18} stroke={2} className={isActive(menuItem.path) ? 'text-oceanTeal-600' : 'text-gray-600'} />}
										<span className="flex-1 truncate whitespace-nowrap">
											{menuItem.label}
										</span>
										{showPendingBadge && (
											<Badge size="xs" color="orange" variant="filled">
												{pendingJobsCount}
											</Badge>
										)}
									</Link>
								);
							}
						})}
					</div>
				</div>
			)}
		</header>
	);
};

export default HeaderNew;
