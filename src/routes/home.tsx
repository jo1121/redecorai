import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Video,
  Store,
  Boxes,
  Sparkles,
  LayoutDashboard,
  Wand2,
  HelpCircle,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "What is ReDécorAI?",
    description:
      "ReDécorAI is your AI-powered interior companion. Just scan your room — and instantly get intelligent redesigns using what you already own.",
  },
  {
    icon: LayoutDashboard,
    title: "Smart Suggestions",
    description:
      "AI analyzes layout, lighting, and color — and suggests intelligent, style-matching improvements for your space.",
  },
  {
    icon: Store,
    title: "Marketplace",
    description:
      "Sell and buy decor items directly from other users. Everything you see in your design is shoppable.",
  },
  {
    icon: Boxes,
    title: "Inventory",
    description:
      "Each scanned room adds items to your inventory. Reuse them in future designs, track ownership, and organize effortlessly.",
  },
  {
    icon: Wand2,
    title: "Effortless Design",
    description:
      "Redecorating should be fun. We combine AI with intuitive design tools to make styling your room simple and personal.",
  },
  {
    icon: HelpCircle,
    title: "Tutorial & Demo",
    description:
      "Interactive walkthroughs and demo mode let you explore the app before committing to a full scan.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const handleInventoryClick = () => {
    const isLoggedIn = localStorage.getItem("user") === "true";
    if (isLoggedIn) {
      navigate("/inventory");
    } else {
      setShowLogin(true);
    }
  };

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      {/* Section 1 - Hero */}
      <section className="relative snap-start h-screen flex items-center justify-center text-white">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/55555room454797888010777885200.mov" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50 z-10" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-20 text-center px-6"
        >
          <h1 className="text-5xl font-bold mb-4">ReDécorAI</h1>
          <p className="text-xl max-w-xl mx-auto mb-8">
            Scan. Style. Shop. Your AI home designer.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            <button
              onClick={() => navigate("/scan")}
              className="bg-white text-black px-6 py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <Camera size={18} /> Scan Your Room
            </button>
            <button
              onClick={() => navigate("/tutorial")}
              className="bg-white text-black px-6 py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <Video size={18} /> Watch Tutorial
            </button>
            <button
              onClick={() => navigate("/marketplace")}
              className="bg-white text-black px-6 py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <Store size={18} /> Marketplace
            </button>
            <button
              onClick={handleInventoryClick}
              className="bg-white text-black px-6 py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <Boxes size={18} /> Inventory
            </button>
          </div>
        </motion.div>
      </section>

      {/* Section 2 - Features */}
      <section className="snap-start bg-white dark:bg-zinc-900 text-black dark:text-white px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Explore Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg flex flex-col items-start"
              >
                <feat.icon
                  size={28}
                  className="mb-4 text-blue-600 dark:text-blue-400"
                />
                <h3 className="text-xl font-semibold mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {feat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 w-96 relative">
            <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 px-4 py-2 rounded border"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-3 px-4 py-2 rounded border"
            />
            <button
              className="bg-blue-600 text-white w-full py-2 rounded mt-2"
              onClick={() => {
                localStorage.setItem("user", "true");
                setShowLogin(false);
                navigate("/inventory");
              }}
            >
              Login
            </button>
            <p className="text-sm text-center mt-4">
              Don’t have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => {
                  setShowLogin(false);
                  navigate("/signup");
                }}
              >
                Sign up
              </span>
            </p>
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={() => setShowLogin(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
