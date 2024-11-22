import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, Info, Users, Lock } from "lucide-react";
import { useAccount } from "wagmi";

const gradientVariants = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-indigo-600",
  "from-teal-500 to-emerald-600",
  "from-orange-500 to-red-600",
  "from-cyan-500 to-blue-600",
];

const Home = () => {
  const { isConnected, address } = useAccount();
  const [activeFeature, setActiveFeature] = useState(null);
  const [currentGradient, setCurrentGradient] = useState(gradientVariants[0]);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Update the background gradient every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomGradient =
        gradientVariants[Math.floor(Math.random() * gradientVariants.length)];
      setCurrentGradient(randomGradient);
    }, 1000); // Change background color every second

    return () => clearInterval(intervalId);
  }, []);

  // Track the cursor position
  useEffect(() => {
    const handleMouseMove = (event) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const features = [
    {
      icon: ShieldCheck,
      title: "Secure Verification",
      description:
        "Anonymously verify your Aadhaar with zero knowledge proof technology",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your personal information remains completely confidential",
    },
    {
      icon: Users,
      title: "Decentralized Identity",
      description:
        "Leverage blockchain for trusted, tamper-proof identity verification",
    },
  ];

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br overflow-hidden p-4 transition-all duration-1000 ease-in-out"
      style={{
        background: `linear-gradient(45deg, ${currentGradient})`,
      }}
    >
      {/* Animated Background Circles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/10 rounded-full animate-float opacity-50"
            style={{
              width: `${Math.random() * 150 + 50}px`,
              height: `${Math.random() * 150 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Cursor Effect */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          transform: `translate(${cursorPosition.x / 30}px, ${cursorPosition.y / 30}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 200 200\'%3E%3Ccircle cx=\'100\' cy=\'100\' r=\'90\' fill=\'none\' stroke=\'#ffffff\' stroke-width=\'5\' stroke-dasharray=\'10,10\'/%3E%3C/svg%3E')] animate-pulse opacity-30"
        />
      </div>

      <div className="relative z-10 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl max-w-4xl w-full p-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
          Block-X AUTH: Secure Identity
          </h1>
          <p className="text-xl text-white/80">
            Blockchain-powered anonymous verification
          </p>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col items-center space-y-6 mb-12">
          <Link
            to="/verify-aadhaar"
            className={`flex items-center gap-3 px-8 py-4 rounded-full text-xl font-semibold 
            ${
              isConnected
                ? "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white hover:from-indigo-400 hover:via-purple-500 hover:to-pink-400"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }
            transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl
            hover:shadow-2xl`}
            onClick={(e) => !isConnected && e.preventDefault()}
          >
            {isConnected ? (
              <>
                Verify Aadhaar
                <ArrowRight className="w-6 h-6" />
              </>
            ) : (
              "Connect Wallet First"
            )}
          </Link>

          {!isConnected && (
            <p className="text-white/70 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Connect wallet to start verification
            </p>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              onMouseEnter={() => setActiveFeature(index)}
              onMouseLeave={() => setActiveFeature(null)}
              className={`
                bg-white/20 backdrop-blur-lg rounded-3xl p-6 
                transform transition-all duration-300 
                ${
                  activeFeature === index
                    ? "scale-105 shadow-2xl border-white/50 border"
                    : "scale-100 shadow-lg"
                }
              `}
            >
              <div className="flex items-center gap-4 mb-4">
                <feature.icon
                  className={`
                    w-12 h-12 
                    ${activeFeature === index ? "text-white" : "text-white/70"}
                    transition-colors duration-300
                  `}
                />
                <h3 className="text-2xl font-semibold text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="text-white/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
