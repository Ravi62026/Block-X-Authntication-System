import { useWalletInfo } from "@web3modal/wagmi/react";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { ShieldCheck, Wallet, NetworkIcon } from "lucide-react";

const WalletLogin: FC = () => {
  const { address, isConnected } = useAccount();
  const { walletInfo } = useWalletInfo();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Particle background movement
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (walletInfo) {
      localStorage.setItem("walletInfo", JSON.stringify(walletInfo));
    }
    if (address) {
      localStorage.setItem("address", address || "");
    }
  }, [walletInfo, address]);

  useEffect(() => {
    if (isConnected) {
      setLoading(false);
      navigate("/");
    } else {
      setLoading(true);
    }
  }, [isConnected, navigate]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  const handleConnectionError = (errorMessage: string) => {
    setError(errorMessage);
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden p-4">
      {/* Dynamic Gradient Background with Auto Color Change */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-600 animate-gradient-x opacity-70 z-0 transition-all duration-1000"
        style={{
          animation: "color-change 3s infinite alternate",
        }}
      ></div>

      {/* Floating "Ravi Shankar" */}
      <div
        className="absolute text-white text-6xl font-bold animate-float"
        style={{
          top: `${Math.random() * 80}%`,
          left: `${Math.random() * 80}%`,
          animation: "moveText 10s infinite alternate",
        }}
      >
        Ravi Shankar
      </div>

      {/* Parallax Effect Background */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          transform: `translate(${mousePosition.x * 0.01}px, ${
            mousePosition.y * 0.01
          }px)`, // Slowed down by reducing multiplier to 0.01
        }}
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/10 rounded-full animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.6 + 0.4,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 bg-white/20 backdrop-blur-xl border border-green-300/30 rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all hover:scale-[1.02] duration-300 ease-in-out">
        <div className="flex items-center mb-8 space-x-4">
          <ShieldCheck className="text-green-300 w-12 h-12" />
          <h2 className="text-4xl font-bold text-white tracking-tight">
            Block-X AUTH
          </h2>
        </div>

        {/* Connect Wallet Button */}
        <div className="group relative mb-6">
          {/* Wallet Connect Button with Ripple Effect */}
          <w3m-button
            balance="show"
            loadingLabel="Loading Wallet Options..."
            onClick={() => setLoading(true)}
            className="w-full transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg relative overflow-hidden"
          >
            {/* Ripple Effect */}
            <span className="absolute inset-0 bg-green-500/20 rounded-lg animate-pulse group-hover:hidden"></span>
            <span className="relative z-10 text-green-300 font-semibold">
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 bg-green-300 rounded-full animate-bounce" />
                  <div className="text-white">Connecting...</div>
                </div>
              ) : (
                <>
                  <Wallet className="text-green-300 w-6 h-6" />
                  <span className="ml-2">Connect Wallet</span>
                </>
              )}
            </span>
          </w3m-button>
        </div>

        {/* Network Switcher */}
        <div className="flex items-center justify-between bg-white/10 rounded-full p-3 mb-6 border border-green-300/20 hover:bg-white/20 transition-all">
          <div className="flex items-center space-x-2">
            <NetworkIcon className="text-green-300 w-5 h-5" />
            <span className="text-green-200">Network</span>
          </div>
          <w3m-network-button />
        </div>

        {/* Connection Status */}
        <div className="text-center">
          {error && <p className="text-red-300 animate-pulse">{error}</p>}
          {loading ? (
            <div className="flex justify-center items-center space-x-2 py-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          ) : isConnected ? (
            <div className="bg-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wallet className="text-green-300 w-6 h-6" />
                <span className="text-green-200 truncate max-w-[200px]">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
              <button
                onClick={copyAddress}
                className="text-green-300 hover:text-white transition-colors"
              >
                Copy
              </button>
            </div>
          ) : (
            <p className="text-red-300 animate-pulse">
              Please connect your wallet
            </p>
          )}

          {showTooltip && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
              Address Copied!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletLogin;
