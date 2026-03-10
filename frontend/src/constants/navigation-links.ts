import { ROUTE_PATHS } from './route-paths';
import { NavigationLink } from '../types/navigation.types';

/**
 * Public navigation links - visible to all users (including non-authenticated)
 */
export const PUBLIC_NAVIGATION_LINKS: NavigationLink[] = [
    {
        name: 'Trang chủ',
        url: ROUTE_PATHS.HOME,
        roles: [],
        isPublic: true,
    },
    {
        name: 'Tìm việc',
        url: ROUTE_PATHS.FIND_JOBS,
        roles: [],
        isPublic: true,
    },
    {
        name: 'Tạo CV',
        url: ROUTE_PATHS.CREATE_CV,
        roles: [],
        isPublic: true,
    },
    {
        name: 'Cẩm nang nghề nghiệp',
        url: ROUTE_PATHS.CAREER_GUIDE,
        roles: [],
        isPublic: true,
    },
];

/**
 * Protected navigation links - visible only to authenticated users with specific roles
 */
export const PROTECTED_NAVIGATION_LINKS: NavigationLink[] = [
    {
        name: 'Việc làm đã lưu',
        url: ROUTE_PATHS.SAVED_JOBS,
        roles: ['APPLICANT', 'ADMIN'],
        isPublic: false,
    },
    {
        name: 'Post Job',
        url: ROUTE_PATHS.POST_JOB.replace(':id', '0'),
        roles: ['EMPLOYER'],
        isPublic: false,
    },
    {
        name: 'Posted Jobs',
        url: ROUTE_PATHS.POSTED_JOBS.replace(':id', '0'),
        roles: ['EMPLOYER'],
        isPublic: false,
    },
    {
        name: 'Job History',
        url: ROUTE_PATHS.JOB_HISTORY,
        roles: ['APPLICANT'],
        isPublic: false,
    },
    {
        name: 'Admin Dashboard',
        url: ROUTE_PATHS.ADMIN_DASHBOARD,
        roles: ['ADMIN'],
        isPublic: false,
    },
];

