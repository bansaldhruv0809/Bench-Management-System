import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Pages/Home/Login.js';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import {useEffect} from 'react';
import AuthState from './components/Global/AuthState.js';
import ViewEmployee from './components/Pages/ViewEmployee.js';
import 'react-toastify/dist/ReactToastify.css';
import ViewReport from './components/Pages/ViewReport.js';
import ManagerDashboard from './components/Pages/Dashboard/Manager/ManagerDashboard';
import AdminDashboard from './components/Pages/Dashboard/Admin/AdminDashboard';
import NewUser from './components/2FaSecurity/NewUser';
import ExistingUser from './components/2FaSecurity/ExistingUser';

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/admin", element: <AdminDashboard /> },
    { path: "/manager", element: <ManagerDashboard /> },
    { path: "/viewEmployee", element: <ViewEmployee /> },
    { path: "/viewReport", element: <ViewReport /> },
    { path: "/setup2fa", element: <NewUser /> },
    { path: "/verify2fa", element: <ExistingUser /> }
  ]);

  // preventing any forced refresh
  const onKeyDown = event => {
        if(event.ctrlKey && event.key > 'a' && event.key < 'z') event.preventDefault();
      }
  document.addEventListener('keydown', onKeyDown);

  return (
    <div className="App">
      <AuthState >
        <RouterProvider router={router} />
      </AuthState>
    </div>
  );
}
export default App;
