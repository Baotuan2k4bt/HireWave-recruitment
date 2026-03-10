/**
 * Navigation types and interfaces
 */

export type AccountType = 'APPLICANT' | 'EMPLOYER' | 'ADMIN';

export interface NavigationLink {
    name: string;
    url: string;
    roles: AccountType[];
    isPublic?: boolean;
}

export interface PublicNavigationLink extends Omit<NavigationLink, 'roles'> {
    isPublic: true;
}

export interface ProtectedNavigationLink extends NavigationLink {
    isPublic: false;
    roles: AccountType[];
}

