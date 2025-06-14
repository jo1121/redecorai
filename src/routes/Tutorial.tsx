import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Tutorial() {
  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      {/* Page 1: Welcome + Video */}
      <section className="h-screen snap-start flex flex-col items-center justify-center text-white px-6 relative bg-black">
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
      <section className="h-screen snap-start flex flex-col items-center justify-center bg-[#f9f9f6] text-gray-800 px-6 text-center">
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
        <a
          href="/"
          className="mt-8 px-6 py-3 bg-black text-white rounded-full hover:scale-105 transition"
        >
          Return to Home
        </a>
      </section>
    </div>
  );
}
