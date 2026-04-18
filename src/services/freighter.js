/**
 * Utility to interact with Freighter wallet via the global window.freighterApi.
 * This avoids dependency on @stellar/freighter-api if it's not installed.
 */

export const isFreighterConnected = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    const api = (typeof window !== "undefined") && (window.freighterApi || window.stellarPirate);
    
    if (api) {
      try {
        const result = await api.isConnected();
        const connected = typeof result === "boolean" ? result : !!result?.isConnected;
        console.log("Freighter detection result:", result, "Evaluated to:", connected);
        return connected;
      } catch (e) {
        console.warn("Freighter connection check failed during attempt", i, e);
      }
    }
    
    // Wait 100ms before next retry
    if (i < retries - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log("Freighter not found in window. Available keys:", 
    Object.keys(window).filter(k => k.toLowerCase().includes("freighter") || k.toLowerCase().includes("stellar") || k.toLowerCase().includes("pirate"))
  );
  return false;
};

export const getFreighterAddress = async () => {
  const api = (typeof window !== "undefined") && (window.freighterApi || window.stellarPirate);
  if (api) {
    return await api.getAddress();
  }
  return { error: "Freighter wallet not found" };
};

export const signFreighterTransaction = async (xdr, network) => {
  const api = (typeof window !== "undefined") && (window.freighterApi || window.stellarPirate);
  if (api) {
    return await api.signTransaction(xdr, { network });
  }
  throw new Error("Freighter wallet not found");
};
