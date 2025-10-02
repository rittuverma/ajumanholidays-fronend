// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CustomerLogin from "./Customer/CustomerLogin";
import CustomerRegister from "./Customer/CustomerRegister";
import AdminLogin from "./pages/AdminLogin";
import ManageBooking from "./pages/ManageBooking";
import About from "./pages/about";
import WriteReview from "./pages/WriteReview";
// import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import CustomerDashboard from "./Customer/CustomerDashboard";
import CustomerAbout from "./Customer/CustomerAbout";
import CustomerManageBooking from "./Customer/CustomerManageBooking";
import CustomerProfile from "./Customer/CustomerProfile";
import NotificationsPage from "./Customer/NotificationsPage";
import Gallery from "./pages/Gallery";
import PaymentPage from "./Customer/PaymentPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import DashboardOverview from "./admin/DashboardOverview";
import AdminRoutesPage from "./admin/AdminRoutesPage";
import AdminCustomersPage from "./admin/AdminCustomersPage";
import AdminCustomerDetails from "./admin/AdminCustomerDetails";
import AllTicketsPage from "./admin/AllTicketsPage";
import CancelledTicketsPage from "./admin/CancelledTicketsPage";
import BusDetailsPage from "./admin/BusDetailsPage";
import BusInfoPage from "./admin/BusInfoPage";
import BusEditPage from "./admin/BusEditPage";
import AddStaffPage from "./admin/AddStaffPage";
import StaffListPage from "./admin/StaffListPage";
import EditStaffPage  from "./admin/EditStaffPage";
import SelectSeats from "./pages/SelectSeats";
import PaymentSuccess from "./pages/PaymentSuccess";

function App() {
  
  return (
    <div
      style={{
        backgroundImage: "url('/aboutBg.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/customers" element={<CustomerRegister />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/gallery" element={<Gallery />} />

         {/* Public manage booking */}
        <Route path="/manage-bookings" element={<ManageBooking />} />
        <Route path="/about" element={<About />} />
        <Route path="/write-review" element={<WriteReview />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />

        {/* Customer routes */}
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/customer-about" element={<CustomerAbout />} />
        <Route path="/customer/manage-booking" element={<CustomerManageBooking />} />
        <Route path="/customer-profile" element={<CustomerProfile />}/>
        <Route path="/notifications" element={<NotificationsPage />}/>
        <Route path="/payments" element={<PaymentPage />} />
        <Route path="/select-seats" element={<SelectSeats />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* Admin dashboard */}
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/dashboard-overview" element={<DashboardOverview />} />
        <Route path="/admin-routes" element={<AdminRoutesPage />} />
        <Route path="/admin-customers" element={<AdminCustomersPage />} />
        <Route path="/admin/customers/:id" element={<AdminCustomerDetails />} />
        <Route path="/admin/allticket" element={<AllTicketsPage />} />
        <Route path="/admin/cancelticket" element={<CancelledTicketsPage />} />
        <Route path="/admin/bus-detail" element={<BusDetailsPage />} />
        <Route path="/admin/bus-info" element={<BusInfoPage />} />
        <Route path="/admin/bus-edit/:id" element={<BusEditPage />} />
        <Route path="/admin/add-staff" element={<AddStaffPage />} />
        <Route path="/admin/staff" element={<StaffListPage />} />
        <Route path="/admin/edit-staff/:role/:id" element={<EditStaffPage />} />

      </Routes>
      
    </div>
  );
}

export default App;
  