import { motion } from "framer-motion";
import { ChevronDown, ArrowLeft, Home } from "lucide-react";

export default function Tutorial() {
  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth relative">
      {/* Fixed Header Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="text-lg font-semibold text-white">Tutorial</h1>
            <a
              href="/"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <Home className="w-5 h-5" />
              Home
            </a>
          </div>
        </div>
      </div>
      {/* Page 1: Welcome + Video */}
      <section className="h-screen snap-start flex flex-col items-center justify-center text-white px-6 relative bg-black pt-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-center"
        >
          Welcome to ReDécorAI
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-lg max-w-2xl mb-6"
        >
          Learn how to scan your room and let AI reimagine your space in
          seconds.
        </motion.p>
        <video
          autoPlay
          muted
          controls
          className="rounded-xl shadow-2xl w-full max-w-3xl"
        >
          <source
            src="/20250606_2105_Room Design with ReDécorAI_simple_compose_01jx3a49xfesfr2fgts8xj0tyz.mp4"
            type="video/mp4"
          />
        </video>

        <ChevronDown
          className="absolute bottom-8 animate-bounce opacity-70"
          size={32}
        />
      </section>

      {/* Page 2: How it works */}
      <section className="h-screen snap-start flex flex-col items-center justify-center bg-[#f9f9f6] text-gray-800 px-6 text-center pt-16">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          How It Works
        </h2>
        <ul className="text-lg max-w-xl space-y-4">
          <li>
            📸 <strong>Scan your room</strong> using your camera or upload a
            photo.
          </li>
          <li>
            🧠 <strong>AI analyzes</strong> your layout, lighting & existing
            furniture.
          </li>
          <li>
            ✨ <strong>Redecoration suggestions</strong> based on your
            inventory.
          </li>
          <li>
            🛒 <strong>Explore Marketplace</strong> to buy/sell used decor.
          </li>
          <li>
            📦 <strong>Everything saved</strong> to your inventory for reuse.
          </li>
        </ul>
        <div className="flex gap-4 mt-8">
          <a
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:scale-105 transition-transform"
          >
            <Home className="w-4 h-4" />
            Return to Home
          </a>
          <a
            href="/scan"
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:scale-105 transition-transform"
          >
            Start Scanning
          </a>
        </div>
      </section>
    </div>
  );
}
