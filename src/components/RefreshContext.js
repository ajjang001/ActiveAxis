import React, { createContext, useContext, useState } from 'react';

const RefreshContext = createContext();

export const useRefresh = () => {
    return useContext(RefreshContext);
};

export const RefreshProvider = ({ children }) => {
    const [refresh, setRefresh] = useState(false);

    const refreshData = () => {
        setRefresh(true);
    };

    return (
        <RefreshContext.Provider value={{ refresh, refreshData, setRefresh }}>
            {children}
        </RefreshContext.Provider>
    );
};
