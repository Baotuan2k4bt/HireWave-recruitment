import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import FindJobsPage from './FindJobsPage';
import HeaderNew from '../Components/Header/HeaderNew';
import JobPage from './JobPage';
import ApplyJobPage from './ApplyJobPage';

import TalentProfilePage from './TalentProfilePage';
import CompanyPage from './CompanyPage';
import JobHistoryPage from './JobHistoryPage';
import PostedJobPage from './PostedJobPage';
import PostJobPage from './PostJobPage';
import SignUpPage from './SignUpPage';
import HomePage from './HomePage';
import { useSelector } from 'react-redux';
import Footer from '../Components/Footer/Footer';
import ProfilePage from './ProfilePage';
import ProfilePageNew from './ProfilePageNew';
import PersonalSecurityPage from './PersonalSecurityPage';
import ChangePasswordPage from './ChangePasswordPage';
import ProtectedRoute from '../Services/ProtectedRoute';
import PublicRoute from '../Services/PublicRoute';
import Unauthorized from './UnauthroizedPage';
import NotFoundPage from './NotFoundPage';
import { LoadingOverlay } from '@mantine/core';
import AdminDashboard from './AdminDashboard';
import CVAnalysisPage from './CVAnalysisPage';
import MyCvPage from './MyCvPage';
import SavedJobsPage from './SavedJobsPage';
import CareerNewsPage from './CareerNewsPage';
import CareerTipsPage from './CareerTipsPage';
import CareerInterviewPage from './CareerInterviewPage';
import AiCareerAnalysisPage from './AiCareerAnalysisPage';
import JobMatchingPage from './JobMatchingPage';
import AIFeaturesPage from './AIFeaturesPage';
import AIDashboardPage from './AIDashboardPage';
import EmployerCompanyPage from './EmployerCompanyPage';

const AppRoutes = () => {
  const overlay = useSelector((state: any) => state.overlay);
  return <BrowserRouter>
    <div className='relative overflow-hidden'>
      {overlay && <div className='fixed !z-[2000] w-full h-full flex  items-center justify-center'>
        <LoadingOverlay
          visible={overlay}
          zIndex={2000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'oceanTeal.4', type: 'bars' }}
        />

      </div>}
      <HeaderNew />
      <div className="pt-16">
        <Routes>
        <Route path='/' element={<HomePage />} />
        <Route
            path='/admin-dashboard'
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
        />
        <Route path='/unauthorized' element={<Unauthorized />} />
        <Route path='/find-jobs' element={<ProtectedRoute allowedRoles={['APPLICANT', ]}><FindJobsPage /></ProtectedRoute>} />
        <Route path='/job-matching' element={<ProtectedRoute allowedRoles={['APPLICANT']}><JobMatchingPage /></ProtectedRoute>} />
        <Route path='/jobs/:id' element={<ProtectedRoute allowedRoles={['APPLICANT', ]}><JobPage /></ProtectedRoute>} />
        <Route path='/apply-job/:id' element={<ProtectedRoute allowedRoles={['APPLICANT']}><ApplyJobPage /></ProtectedRoute>} />

        <Route path='/talent-profile/:id' element={<ProtectedRoute allowedRoles={['EMPLOYER']}><TalentProfilePage /></ProtectedRoute>} />
        <Route path='/company/:name' element={<ProtectedRoute allowedRoles={['APPLICANT','EMPLOYER']}><CompanyPage /></ProtectedRoute>} />
        <Route path='/job-history' element={<ProtectedRoute allowedRoles={['APPLICANT']}><JobHistoryPage /></ProtectedRoute>} />
        <Route path='/saved-jobs' element={<ProtectedRoute allowedRoles={['APPLICANT']}><SavedJobsPage /></ProtectedRoute>} />
        <Route path='/posted-jobs/:id' element={<ProtectedRoute allowedRoles={['EMPLOYER']}><PostedJobPage /></ProtectedRoute>} />
        <Route path='/post-job/:id' element={<ProtectedRoute allowedRoles={['EMPLOYER']}><PostJobPage /></ProtectedRoute>} />

        <Route path='/employer/company' element={<ProtectedRoute allowedRoles={['EMPLOYER']}><EmployerCompanyPage /></ProtectedRoute>} />
        <Route path='/signup' element={<PublicRoute><SignUpPage /></PublicRoute>} />
        <Route path='/login' element={<PublicRoute><SignUpPage /></PublicRoute>} />
        <Route path='/profile' element={<ProtectedRoute allowedRoles={['APPLICANT', 'EMPLOYER']}><ProfilePageNew /></ProtectedRoute>} />
        <Route path='/my-cv' element={<ProtectedRoute allowedRoles={['APPLICANT', 'EMPLOYER']}><MyCvPage /></ProtectedRoute>} />
        <Route path='/upload-cv' element={<ProtectedRoute allowedRoles={['APPLICANT', 'EMPLOYER']}><MyCvPage /></ProtectedRoute>} />
        <Route path='/cv-analysis' element={<ProtectedRoute allowedRoles={['APPLICANT', 'EMPLOYER']}><CVAnalysisPage /></ProtectedRoute>} />
        <Route path='/personal-security' element={<ProtectedRoute allowedRoles={['APPLICANT', 'ADMIN', 'EMPLOYER']}><PersonalSecurityPage /></ProtectedRoute>} />
        <Route path='/change-password' element={<ProtectedRoute allowedRoles={['APPLICANT', 'ADMIN', 'EMPLOYER']}><ChangePasswordPage /></ProtectedRoute>} />
        <Route path='/career-guide/tin-tuc-viec-lam' element={<CareerNewsPage />} />
        <Route path='/career-guide/bi-kip-viec-lam' element={<CareerTipsPage />} />
        <Route path='/career-guide/phong-van' element={<CareerInterviewPage />} />
        <Route path='/ai-career-analysis' element={<ProtectedRoute allowedRoles={['APPLICANT',  'EMPLOYER']}><AiCareerAnalysisPage /></ProtectedRoute>} />
        <Route path='/ai-features' element={<ProtectedRoute allowedRoles={['APPLICANT', 'EMPLOYER']}><AIFeaturesPage /></ProtectedRoute>} />
        <Route path='/ai-features/:jobId' element={<ProtectedRoute allowedRoles={['EMPLOYER']}><AIFeaturesPage /></ProtectedRoute>} />
        <Route path='/ai-features/dashboard' element={<ProtectedRoute allowedRoles={[ 'EMPLOYER']}><AIDashboardPage /></ProtectedRoute>} />
        <Route path='/ai-features/dashboard/:jobId' element={<ProtectedRoute allowedRoles={[ 'EMPLOYER']}><AIDashboardPage /></ProtectedRoute>} />
        <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  </BrowserRouter>
}
export default AppRoutes;