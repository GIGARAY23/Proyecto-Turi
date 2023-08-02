import React, { createContext, useState } from "react";

export const TotalContext = createContext();

export const TotalProvider = ({ children }) => {
  const [totalPay, setTotalPay] = useState(0);

  return (
    <TotalContext.Provider value={{ totalPay, setTotalPay }}>
      {children}
    </TotalContext.Provider>
  );
};
