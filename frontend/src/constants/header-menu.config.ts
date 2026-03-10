import { ROUTE_PATHS } from './route-paths';
import {
    IconHome,
    IconBriefcase,
    IconFileText,
    IconInfoCircle,
    IconPhone,
    IconSearch,
    IconBookmark,
    IconClipboardCheck,
    IconSparkles,
    IconUpload,
    IconFolder,
    IconBrain,
    IconBuilding
} from '@tabler/icons-react';

export interface MenuItem {
    label: string;
    path: string;
    icon?: React.ComponentType<any>;
    requiresAuth?: boolean;
    roles?: string[];
}

export interface DropdownMenu {
    label: string;
    items: MenuItem[];
}

export const HEADER_MENU_CONFIG: (MenuItem | DropdownMenu)[] = [
    {
        label: 'Trang chủ',
        path: ROUTE_PATHS.HOME,
        icon: IconHome,
    },
    {
        label: 'Việc làm',
        items: [
            {
                label: 'Tìm việc làm',
                path: ROUTE_PATHS.FIND_JOBS,
                icon: IconSearch,
                requiresAuth: true,
                roles: ['APPLICANT', 'ADMIN'],
            },
            {
                label: 'Việc đã lưu',
                path: ROUTE_PATHS.SAVED_JOBS,
                icon: IconBookmark,
                requiresAuth: true,
                roles: ['APPLICANT', 'ADMIN'],
            },
            {
                label: 'Việc đã ứng tuyển',
                path: ROUTE_PATHS.JOB_HISTORY,
                icon: IconClipboardCheck,
                requiresAuth: true,
                roles: ['APPLICANT', 'ADMIN'],
            },
        ],
    },
    // Các chức năng riêng cho Nhà tuyển dụng (top-level, không gộp dropdown)
    {
        label: 'Đăng tin tuyển dụng',
        path: ROUTE_PATHS.POST_JOB.replace(':id', '0'),
        icon: IconUpload,
        requiresAuth: true,
        roles: ['EMPLOYER', 'ADMIN'],
    },
    {
        label: 'Việc đã đăng',
        path: ROUTE_PATHS.POSTED_JOBS.replace(':id', '0'),
        icon: IconBriefcase,
        requiresAuth: true,
        roles: ['EMPLOYER', 'ADMIN'],
    },
    {
        label: 'Quản lý công ty',
        path: ROUTE_PATHS.EMPLOYER_COMPANY,
        icon: IconBuilding,
        requiresAuth: true,
        roles: ['EMPLOYER', 'ADMIN'],
    },

    {
        label: 'AI tuyển dụng',
        items: [
            {
                label: 'Việc phù hợp (AI)',
                path: ROUTE_PATHS.JOB_MATCHING,
                icon: IconSparkles,
                requiresAuth: true,
                roles: ['APPLICANT', 'ADMIN'],
            },
            {
                label: 'Phân tích CV bằng AI',
                path: ROUTE_PATHS.CV_ANALYSIS,
                icon: IconBrain,
                requiresAuth: true,
                roles: ['APPLICANT', 'ADMIN'],
            },
            {
                label: 'Phân tích Nghề nghiệp AI',
                path: ROUTE_PATHS.AI_CAREER_ANALYSIS,
                icon: IconBrain,
                requiresAuth: true,
                roles: ['APPLICANT', 'ADMIN'],
            },
            {
                label: 'Trung tâm AI tuyển dụng',
                path: ROUTE_PATHS.AI_FEATURES_CENTER,
                icon: IconSparkles,
                requiresAuth: true,
                roles: [ 'EMPLOYER', 'ADMIN'],
            },
            {
                label: 'AI Dashboard',
                path: ROUTE_PATHS.AI_DASHBOARD,
                icon: IconBrain,
                requiresAuth: true,
                roles: ['EMPLOYER', 'ADMIN'],
            },
        ],
    },
    {
        label: 'CV & Hồ sơ',
        items: [
            {
                label: 'Quản lý CV',
                path: ROUTE_PATHS.MY_CV,
                icon: IconFolder,
                requiresAuth: true,
                roles: ['APPLICANT', 'ADMIN'],
            },
        ],
    },
    {
        label: 'Cẩm nang nghề nghiệp',
        items: [
            {
                label: 'Tin tức việc làm',
                path: ROUTE_PATHS.CAREER_NEWS,
                icon: IconFileText,
                requiresAuth: false,
                roles: ['APPLICANT', 'ADMIN'],
            },
            {
                label: 'Bí kíp việc làm',
                path: ROUTE_PATHS.CAREER_TIPS,
                icon: IconFileText,
                requiresAuth: false,
                roles: ['APPLICANT', 'ADMIN'],
            },
            {
                label: 'Phỏng vấn',
                path: ROUTE_PATHS.CAREER_INTERVIEW,
                icon: IconFileText,
                requiresAuth: false,
                roles: ['APPLICANT', 'ADMIN'],
            },
        ],
    },
];

