import React, { createContext, useContext, useState, useEffect } from 'react';
import { useOperations } from '../hooks/useData';

interface OperationContextType {
    selectedOperationId: string;
    setSelectedOperationId: (id: string) => void;
}

const OperationContext = createContext<OperationContextType | undefined>(undefined);

export const OperationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: operations } = useOperations();
    const [selectedOperationId, setSelectedOperationIdState] = useState<string>(() => {
        return localStorage.getItem('selectedOperationId') || '';
    });

    // Auto-select latest operation if none is selected
    useEffect(() => {
        if (operations && operations.length > 0 && !selectedOperationId) {
            const latestId = operations[0].id;
            setSelectedOperationIdState(latestId);
            localStorage.setItem('selectedOperationId', latestId);
        }
    }, [operations, selectedOperationId]);

    const setSelectedOperationId = (id: string) => {
        setSelectedOperationIdState(id);
        localStorage.setItem('selectedOperationId', id);
    };

    return (
        <OperationContext.Provider value={{ selectedOperationId, setSelectedOperationId }}>
            {children}
        </OperationContext.Provider>
    );
};

export const useOperation = () => {
    const context = useContext(OperationContext);
    if (!context) {
        throw new Error('useOperation must be used within an OperationProvider');
    }
    return context;
};
