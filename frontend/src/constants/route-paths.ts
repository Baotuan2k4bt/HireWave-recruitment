/**
 * Route paths constants
 * Centralized route path definitions for the application
 */

export const ROUTE_PATHS = {
    // Public routes
    HOME: '/',
    FIND_JOBS: '/find-jobs',
    CREATE_CV: '/create-cv',
    CAREER_GUIDE: '/career-guide',
    CAREER_NEWS: '/career-guide/tin-tuc-viec-lam',
    CAREER_TIPS: '/career-guide/bi-kip-viec-lam',
    CAREER_INTERVIEW: '/career-guide/phong-van',
    
    // Auth routes
    LOGIN: '/login',
    SIGNUP: '/signup',
    UNAUTHORIZED: '/unauthorized',
    
    // Protected routes - Job related
    JOB_DETAIL: '/jobs/:id',
    APPLY_JOB: '/apply-job/:id',
    JOB_HISTORY: '/job-history',
    // Trang việc làm đã lưu riêng biệt
    SAVED_JOBS: '/saved-jobs',
    JOB_MATCHING: '/job-matching',
    
    // Protected routes - CV related
    MY_CV: '/my-cv',
    CV_ANALYSIS: '/cv-analysis',
    
    // Public routes - About & AI Career Analysis
    ABOUT: '/about',
    AI_CAREER_ANALYSIS: '/ai-career-analysis',
    AI_FEATURES_CENTER: '/ai-features',
    AI_DASHBOARD: '/ai-features/dashboard',
    
    // Protected routes - Employer related
    POST_JOB: '/post-job/:id',
    POSTED_JOBS: '/posted-jobs/:id',
    FIND_TALENT: '/find-talent',
    TALENT_PROFILE: '/talent-profile/:id',
    EMPLOYER_COMPANY: '/employer/company',
    EMPLOYER_PENDING_JOBS: '/employer/pending-jobs',
    
    // Protected routes - Company
    COMPANY: '/company/:name',
    
    // Protected routes - Profile
    PROFILE: '/profile',
    PERSONAL_SECURITY: '/personal-security',
    CHANGE_PASSWORD: '/change-password',
    
    // Protected routes - Admin
    ADMIN_DASHBOARD: '/admin-dashboard',
    
    // Fallback
    NOT_FOUND: '*',
} as const;

/**
 * Helper function to generate dynamic routes
 */
export const generateRoute = {
    jobDetail: (id: string | number): string => `/jobs/${id}`,
    applyJob: (id: string | number): string => `/apply-job/${id}`,
    postJob: (id: string | number): string => `/post-job/${id}`,
    postedJobs: (id: string | number): string => `/posted-jobs/${id}`,
    talentProfile: (id: string | number): string => `/talent-profile/${id}`,
    company: (name: string): string => `/company/${name}`,
    employerCompany: (): string => `/employer/company`,
    employerPendingJobs: (): string => `/employer/pending-jobs`,
};

