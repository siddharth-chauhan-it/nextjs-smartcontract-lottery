import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";

const ManualHeader = () => {
  const {
    enableWeb3,
    isWeb3Enabled,
    account,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
  }, [enableWeb3, isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed to ${account}`);
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("Null account found");
      }
    });
  }, [Moralis, deactivateWeb3]);

  return (
    <div>
      <div className="px-4">
        {account ? (
          <div>
            Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
          </div>
        ) : (
          <div>
            <button
              className={`p-1 border border-gray-400 ${
                isWeb3EnableLoading && "opacity-50"
              }`}
              onClick={async () => {
                const success = await enableWeb3();
                if (typeof window !== "undefined") {
                  if (success) {
                    window.localStorage.setItem("connected", "injected");
                  }
                }
              }}
              disabled={isWeb3EnableLoading}
            >
              Connect
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualHeader;
