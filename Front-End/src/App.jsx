import React from 'react'
import { useEffect } from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';

import Login from './Components/Login';

import Home from './Container/Home';
import { fetchUser } from './utils/fetchUser';

const App = () => {
      const navigate = useNavigate();

      useEffect(() => {
            const user = fetchUser();

            if (!user) {
                  navigate('/login')
            }
      }, [])

  return (
      <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<Home />} />
      </Routes>
      )
}

export default App