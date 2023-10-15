import { useContext } from "react";
import useInit from "../hooks/useInit";
import ConfigContext from "./ConfigContext";

const ConfigProvider = ({ children }) => {
  const initParams = useInit();

  const providerValues = {
    smartAccountProvider: initParams.smartAccountProvider,
    smartAccountAddress: initParams.smartAccountAddress,
    provider: initParams.provider,
    getSmartWalletHandler: initParams.getSmartWalletHandler,
    getEOA: initParams.getEOA,
  };

  console.log("Context : ", { providerValues });

  return (
    <>
      <ConfigContext.Provider value={providerValues}>
        {children}
      </ConfigContext.Provider>
    </>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within an ConfigProvider");
  }
  return context;
};

export default ConfigProvider;