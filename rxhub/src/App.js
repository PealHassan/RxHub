
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './screens/LoginPage.js';
import NavBar from './components/NavBar.js';
import RegisterPage from './screens/RegisterPage.js';
import HomePage from './screens/HomePage.js';
import AddChamberPage from './screens/AddChamberPage.js';
import ViewChamberPage from './screens/ViewChamberPage.js';
import UpdateChamberPage from './screens/UpdateChamberPage.js';
import GenPresPage from './screens/GenPresPage.js';
import AppointmentSchedulerPage from './screens/AppointmentSchedulerPage.js';
import AppointmentsPage from './screens/AppointmentsPage.js';
import AppointmentCopyPage from './screens/AppointmentCopyPage.js';
import PatientListPage from './screens/PatientListPage.js';
import PrescriptionHistory from './screens/PrescriptionHistory.js';
import SettingsPage from './screens/Settings.js';
import ActiveUsersPage from './screens/ActiveUsersPage.js';
import BlockedUsersPage from './screens/BlocedUsersPage.js';
import SendMessagePage from './screens/SendMessagePage.js';
import PendingRequestPage from './screens/PendingRequestPage.js';
import AdminAppointmentPage from './screens/AdminAppointmentPage.js';
import FixAppointment from './screens/FixAppointment.js';
import Dashboard from './screens/Dashboard.js';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/addChamber" element={<AddChamberPage />} />
          <Route path="/viewChamber" element={<ViewChamberPage/>} />
          <Route path="/updateChamber/:chamberId" element={<UpdateChamberPage/>} />
          <Route path="/GenPresPage" element={<GenPresPage/>} />
          <Route path="/AppointmentSchedule" element={<AppointmentSchedulerPage/>}/>
          <Route path="/Appointments" element={<AppointmentsPage/>}/>
          <Route path="/AppointmentCopy/:appointId" element={<AppointmentCopyPage/>}/>
          <Route path="/PatientList" element={<PatientListPage/>}/>
          <Route path="/prescriptionHistory" element={<PrescriptionHistory/>}/>
          <Route path="/settings" element={<SettingsPage/>}/>
          <Route path="/activeUsers" element={<ActiveUsersPage/>}/>
          <Route path="/blockedUsers" element={<BlockedUsersPage/>}/>
          <Route path="/sendMessage" element={<SendMessagePage/>}/>
          <Route path="/pendingRequestPage" element={<PendingRequestPage/>}/>
          <Route path="/showAppointments" element={<AdminAppointmentPage/>}/>
          <Route path="/fixAppointment" element={<FixAppointment/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
