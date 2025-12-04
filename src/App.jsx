// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Interstitial from "./Interstitial";
import Homepage from "./homePage";
import Main from "./homeTesting";
import './App.css'
import BLogSection1 from "./blog1"
import BLogSection2 from "./blog2"
import Register from "./RegisterPage";
import Login from "./LoginPage";
import ResetPassword from "./PasswordReset"
import ResetPasswordForm from "./ResetPasswordForm"

// Import Halaman dan Layout Baru Anda
import MainLayout from "./MainLayout"; // 👈 Impor Layout
import Dashboard from "./Dashboard"; // Ini sekarang harus disederhanakan
import DashboardTest from "./DashboardTest";
import AdminDashboard from "./AdminDashboard";
import AdminWithdrawalsPage from "./AdminWithdrawalsPage"
import AdminLinksPage from "./AdminLinks";
import Withdrawal from "./Withdrawal";
import CreateLink from "./CreateLink"
import CreateLinks from "./CreateLinks"
import CreateLinks2 from "./CreateLinks2"
import LinksPage from "./LinksPage";
import SettingLevel from "./AdRattesSetting";
import AdminSendNotifications from "./AdminSendNotifications";
import LevelManager from "./LevelManager";
// import LevelManager from "./LevelManager";
import AdminUserTest from "./AdminUserTest";
import UserSettings from "./UserSettings";
import HistoryPage from "./HistoryPage";
import UserLevelsPage from "./UserLevelsPage";
import AnalyticsPage from "./AnalyticsPage";


import SuperAdminDashboard from "./SuperAdminDashboard";
import SuperAdminAdmins from "./SuperAdminAdmins";
import SuperAdminWithdrawalLogs from "./SuperAdminWithdrawalLogs";
import ReferralPage from './ReferralPage';
// import ReferralPage from './ReferralPage';
import DailyWithdrawalStats from './DailyWithdrawalStats';
import ReportAbuse from "./ReportAbuse";
import AdminReports from "./AdminReports";
import LinkFinalPage from "./LinkFinalPage";
import AdminDashboardMessages from "./AdminDashboardMessages";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = sessionStorage.getItem("auth_token");
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role if unauthorized
    if (user.role === 'super_admin') return <Navigate to="/admindashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admindashboard" replace />;
    return <Navigate to="/withdrawal" replace />;
  }

  return children;
};

export default function App() {
  const token = sessionStorage.getItem("auth_token");

  return (
    <Router>
      <Routes>
        {/* Rute Publik (Tanpa Sidebar/Header) */}
        <Route path="/" element={<Main />} />
        <Route path="/:code" element={<BLogSection1 />} />
        <Route path="/blog1" element={<BLogSection1 />} />
        <Route path="/blog2" element={<BLogSection2 />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/password-reset" element={<PasswordReset />} /> */}
        <Route path="/form-password" element={<ResetPasswordForm />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/report" element={<ReportAbuse />} />
        <Route path="/go" element={<LinkFinalPage />} />

        {/* Rute Privat (Menggunakan MainLayout) */}
        <Route element={<MainLayout />}>
          {/* User Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['user']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/createlink" element={
            <ProtectedRoute allowedRoles={['user']}>
              <CreateLink />
            </ProtectedRoute>
          } />
          <Route path="/createlinks" element={
            <ProtectedRoute allowedRoles={['user']}>
              <CreateLinks />
            </ProtectedRoute>
          } />
          <Route path="/createlinks2" element={
            <ProtectedRoute allowedRoles={['user']}>
              <CreateLinks2 />
            </ProtectedRoute>
          } />
          <Route path="/linkspage" element={
            <ProtectedRoute allowedRoles={['user']}>
              <LinksPage />
            </ProtectedRoute>
          } />
          <Route path="/withdrawal" element={
            <ProtectedRoute allowedRoles={['user']}>
              <Withdrawal />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admindashboard" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/adminwithdrawal" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminWithdrawalsPage />
            </ProtectedRoute>
          } />
          <Route path="/adminlinks" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminLinksPage />
            </ProtectedRoute>
          } />
          <Route path="/adminsendnotifications" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminSendNotifications />
            </ProtectedRoute>
          } />
          <Route path="/adminsetingrates" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <SettingLevel />
            </ProtectedRoute>
          } />
          <Route path="/adminLevelManager" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <LevelManager />
            </ProtectedRoute>
          } />
          <Route path="/adminuserlist" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminUserTest />
            </ProtectedRoute>
          } />
          <Route path="/adminreports" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminReports />
            </ProtectedRoute>
          } />
          <Route path="/admin/messages" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminDashboardMessages />
            </ProtectedRoute>
          } />

          {/* Super Admin Routes */}
          <Route path="/super-admin/dashboard" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/super-admin/admins" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminAdmins />
            </ProtectedRoute>
          } />
          <Route path="/super-admin/withdrawal-logs" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminWithdrawalLogs />
            </ProtectedRoute>
          } />

          {/* Shared Routes */}
          <Route path="/settings" element={<UserSettings />} />
          {/* <Route path="/admin/settings/ad-rates" element={<ProtectedRoute><AdRatesSettings /></ProtectedRoute>} /> */}
          <Route path="/admin/withdrawal-logs" element={<ProtectedRoute><SuperAdminWithdrawalLogs /></ProtectedRoute>} />
          <Route path="/admin/withdrawal-stats" element={<ProtectedRoute><DailyWithdrawalStats /></ProtectedRoute>} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/referrals" element={<ProtectedRoute><ReferralPage /></ProtectedRoute>} />
          <Route path="/levels" element={<UserLevelsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>

      </Routes>
    </Router>
  );
}