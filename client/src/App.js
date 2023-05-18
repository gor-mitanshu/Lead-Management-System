import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './Layout/Layout'
import Login from "./Pages/Auth/Login"
import Register from './Pages/Auth/Register';
import ForgetPassword from './Pages/Auth/ForgetPassword';
import Dashboard from './Pages/Dashboard/Dashboard';
import Profile from './Pages/Profile/Profile';
import EditProfile from './Pages/Profile/EditProfile';
// import Clients from './Pages/Clients/Clients';
// import AddClient from './Pages/Clients/AddClient';
// import EditClient from './Pages/Clients/EditClient';
import Clients from './Pages/CompletedClient/CompletedClients';
import Employee from './Pages/Employee/Employee';
import EditClient from './Pages/CompletedClient/EditCompletedClient';
import AddEmployee from './Pages/Employee/AddEmployee';
import EditEmployee from './Pages/Employee/EditEmployee';
import Enquiry from './Pages/Enquiry/Enquiry';
import AddEnquiry from './Pages/Enquiry/AddEnquiry';
import EditEnquiry from './Pages/Enquiry/EditEnquiry';
import ChangePassword from './Pages/ChangePassword/ChangePassword';
import ViewEnquiry from './Pages/Enquiry/ViewEnquiry';
import { useLocation } from 'react-router-dom'
import useAuth from './Pages/useAuth'
import PageNotFound from './Pages/PageNotFound';


function App() {
  let token = JSON.parse(localStorage.getItem("auth"))?.result.token;
  let role;
  if (!!token) {
    role = JSON.parse(atob(token.split(".")[1])).admin.role;
  }

  function RequireAuth({ children }) {
    const { authed } = useAuth();
    const location = useLocation();
    const data = localStorage.getItem('auth');
    return authed === true ? (
      children
    ) : data ? (children) : (
      <Navigate to="/login" replace state={{ path: location.pathname }} />
    );
  }
  return (

    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<RequireAuth>  <Layout /></RequireAuth>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/editprofile/:id' element={<EditProfile />} />
            <Route path='/clients' element={<Clients />} />
            {/* <Route path='/addclient' element={role === "admin" ? <AddClient /> : <PageNotFound />} /> */}
            {/* <Route path='/editclient/:id' element={role === "admin" ? <EditClient /> : <PageNotFound />} /> */}
            <Route path='/editclient/:id' element={<EditClient />} />
            <Route path='/employees' element={<Employee />} />
            <Route path='/addemployee' element={role === "admin" ? <AddEmployee /> : <PageNotFound />} />
            <Route path='/editemployee/:id' element={role === "admin" ? <EditEmployee /> : <PageNotFound />} />
            <Route path='/enquiry' element={<Enquiry />} />
            <Route path='/addenquiry' element={role === "admin" ? <AddEnquiry /> : <PageNotFound />} />
            <Route path='/editenquiry/:id' element={<EditEnquiry />} />
            <Route path='/viewenquiry/:id' element={<ViewEnquiry />} />
            <Route path='/changepassword/:id' element={<ChangePassword />} />
          </Route>

          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer theme='colored' position='top-right' autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false}
        draggable pauseOnHover />
    </>
  );
}

export default App;
