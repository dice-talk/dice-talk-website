import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MemberManagement from './pages/Member';
import DeletedMember from './pages/DeletedMember';
import QnaManagment from './pages/QnaList'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin/signup" element={<Signup />} />
      <Route path="/" element={<Home />} />
      <Route path="/membership" element={<MemberManagement />} />
      <Route path="/membership/deleted" element={<DeletedMember />} />
      <Route path='/qnalist' element={<QnaManagment />} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}