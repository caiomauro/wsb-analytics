import React, { ReactNode, createContext, useContext, useState } from 'react';

interface NavbarContextType {
    activePage: string;
    setActivePage: (page: string) => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export const NavbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activePage, setActivePage] = useState("");

    return (
        <NavbarContext.Provider value={{ activePage, setActivePage }}>
            {children}
        </NavbarContext.Provider>
    );
};

export const useNavbar = () => {
    const context = useContext(NavbarContext);
    if (!context) {
        throw new Error('useNavbar must be used within a NavbarProvider');
    }
    return context;
};
