import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Venue {
  id: string;
  name: string;
  email: string;
  logo: string;
  type: string;
  address: string;
}

interface AuthContextType {
  venue: Venue | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (venueData: Omit<Venue, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<Venue>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [venue, setVenue] = useState<Venue | null>(null);

  useEffect(() => {
    const savedVenue = localStorage.getItem('venue');
    if (savedVenue) {
      setVenue(JSON.parse(savedVenue));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in production, this would call your API
    const venues = JSON.parse(localStorage.getItem('venues') || '[]');
    const foundVenue = venues.find((v: any) => v.email === email && v.password === password);
    
    if (foundVenue) {
      const { password: _, ...venueData } = foundVenue;
      setVenue(venueData);
      localStorage.setItem('venue', JSON.stringify(venueData));
      return true;
    }
    return false;
  };

  const signup = async (venueData: Omit<Venue, 'id'> & { password: string }): Promise<boolean> => {
    // Mock registration
    const venues = JSON.parse(localStorage.getItem('venues') || '[]');
    const existingVenue = venues.find((v: any) => v.email === venueData.email);
    
    if (existingVenue) {
      return false; // Email already exists
    }

    const newVenue = {
      ...venueData,
      id: Date.now().toString(),
    };

    venues.push(newVenue);
    localStorage.setItem('venues', JSON.stringify(venues));

    const { password: _, ...venueDataWithoutPassword } = newVenue;
    setVenue(venueDataWithoutPassword);
    localStorage.setItem('venue', JSON.stringify(venueDataWithoutPassword));
    return true;
  };

  const logout = () => {
    setVenue(null);
    localStorage.removeItem('venue');
  };

  const updateProfile = (data: Partial<Venue>) => {
    if (venue) {
      const updatedVenue = { ...venue, ...data };
      setVenue(updatedVenue);
      localStorage.setItem('venue', JSON.stringify(updatedVenue));
      
      // Update in venues array
      const venues = JSON.parse(localStorage.getItem('venues') || '[]');
      const updatedVenues = venues.map((v: any) => 
        v.id === venue.id ? { ...v, ...data } : v
      );
      localStorage.setItem('venues', JSON.stringify(updatedVenues));
    }
  };

  return (
    <AuthContext.Provider value={{ venue, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};