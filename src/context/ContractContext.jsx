import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { isConnected, getAddress } from "@stellar/freighter-api";

const ContractContext = createContext(null);

export const ContractProvider = ({ children }) => {
  const [contractId, setContractId] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isInteractActive, setIsInteractActive] = useState(false);
  const [error, setError] = useState(null);

  // Check if Freighter is connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (await isConnected()) {
          const { address } = await getAddress();
          if (address) setWalletAddress(address);
        }
      } catch (err) {
        console.error("Freighter connection check failed:", err);
      }
    };
    checkConnection();
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      setError(null);
      if (!(await isConnected())) {
        throw new Error("Freighter wallet not found. Please install the extension.");
      }
      const { address, error: freighterError } = await getAddress();
      if (freighterError) throw new Error(freighterError);
      if (address) {
        setWalletAddress(address);
        return address;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
  }, []);

  const value = {
    contractId,
    setContractId,
    walletAddress,
    connectWallet,
    disconnectWallet,
    isInteractActive,
    setIsInteractActive,
    error,
    setError,
  };

  return <ContractContext.Provider value={value}>{children}</ContractContext.Provider>;
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
};
