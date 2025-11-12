// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Interstitial from "./Interstitial";
import Homepage from "./homePage";
import Main from "./homeTesting";
import './App.css'
import BLogSection1 from "./blog1"
import BLogSection2 from "./blog2"
import Register from "./RegisterPage";
import Login from "./LoginPage";
import Dashboard from "./Dashboard";
import DashboardTest from "./DashboardTest";
import AdminDashboard from "./AdminDashboard";
import AdminWithdrawalsPage from "./AdminWithdrawalsPage"
import AdminLinksPage from "./AdminLinks";
import Withdrawal from "./Withdrawal";
import CreateLink from "./CreateLink"
import CreateLinks from "./CreateLinks"
import LinksPage from "./LinksPage";


export default function App() {
  const token = sessionStorage.getItem("auth_token");
  // console.log(token)
  return (
    <Router>
      <Routes>
        {/* <Route path="/:code" element={<Interstitial />} /> */}
        <Route path="/" element={<Main />} />
        <Route path="/:code" element={<BLogSection1 />} />
        <Route path="/blog1" element={<BLogSection1 />} />
        <Route path="/blog2" element={<BLogSection2 />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Withdrawal" element={<Withdrawal />} />
        <Route path="/dashboardtest" element={<DashboardTest />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/adminwithdrawal" element={<AdminWithdrawalsPage />} />
        <Route path="/adminlinks" element={<AdminLinksPage />} />
        <Route path="/createlink" element={<CreateLink />} />
        <Route path="/linkspage" element={<LinksPage />} />
        <Route path="/createlinks" element={<CreateLinks />} />

        {/* <Route
          path="/dashboardtest"
          element={
            token ? <Dashboard /> : <Navigate to="/login" replace />
          } /> */}

      </Routes>
    </Router>
  );
}
