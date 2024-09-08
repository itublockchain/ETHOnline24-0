import React, {createContext, useState, useContext, ReactNode} from 'react';

interface BalanceContextType {
  balance: number;
  updateBalance: (amount: number) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

// BalanceContext provider
export const BalanceProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const [balance, setBalance] = useState<number>(100);

  const updateBalance = (amount: number) => {
    setBalance((prevBalance: number) => prevBalance + amount);
  };

  return (
    <BalanceContext.Provider value={{balance, updateBalance}}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};
