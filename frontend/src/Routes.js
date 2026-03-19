import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Student from './Student';
import Teacher from './Teacher';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/student" element={<Student />} />
      <Route path="/teacher" element={<Teacher />} />
    </Routes>
  );
}
