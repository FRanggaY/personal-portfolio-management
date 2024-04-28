"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import { getProfile, removeAccessToken } from '@/actions/auth/auth-action';

const AuthProfileContext = createContext();

export const AuthProfileProvider = ({ children }) => {
  const [authProfileData, setAuthProfileData] = useState(null);

  // Function to fetch profile data
  const fetchAuthProfile = async () => {
    try {
      const data = await getProfile();
      if (data?.detail) {
        if (data.detail?.message === 'Token invalid') {
          await removeAccessToken();
        } else {
          // Handle other errors or display a message
        }
      } else {
        setAuthProfileData(data);
      }
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    fetchAuthProfile();
  }, []);

  const value = useMemo(() => ({ 
    profile: authProfileData, 
    refresh: fetchAuthProfile,
  }), [authProfileData]);

  return (
    <AuthProfileContext.Provider value={value}>
      {children}
    </AuthProfileContext.Provider>
  );
};

// Add prop validation for children
AuthProfileProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuthProfile = () => useContext(AuthProfileContext);
