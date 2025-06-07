import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Camera, LayoutDashboard, Leaf, Users, Box } from "lucide-react";

const features = [
  {
    icon: <Camera className="w-6 h-6 text-blue-600" />,
    title: "Scan & Style",
    description:
      "Use your phone camera or upload to scan your room. AI tags furniture and suggests stylish redesigns.",
  },
  {
    icon: <LayoutDashboard className="w-6 h-6 text-green-600" />,
    title: "Personalized Redesign",
    description:
      "AI suggests layouts and decor tailored to your space and taste — even budget options.",
  },
  {
    icon: <Leaf className="w-6 h-6 text-emerald-600" />,
    title: "Sustainability First",
    description:
      "Reduce waste and cost by reusing furniture and shopping second-hand with AI recommendations.",
  },
  {
    icon: <Users className="w-6 h-6 text-violet-600" />,
    title: "AR & Community",
    description:
      "Try AR previews, join challenges, and share room makeovers with others.",
  },
  {
    icon: <LayoutDashboard className="w-6 h-6 text-orange-500" />,
    title: "Marketplace",
    description:
      "Discover furniture and decor items — new, used, and sustainable — matched to your needs.",
  },
  {
    icon: <Box className="w-6 h-6 text-teal-500" />,
    title: "My Inventory",
    description:
      "Keep track of your existing furniture and let ReDécorAI optimize your layout around it.",
  },
];

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: JSX.Element;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white/80 p-6 rounded-xl shadow"
    >
      <div className="mb-3">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-700">{description}</p>
    </motion.div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("user") !== null;
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const seenTutorial = localStorage.getItem("seenTutorial");
    if (!seenTutorial) {
      setShowTutorial(true);
      localStorage.setItem("seenTutorial", "true");
    }
    if (isLoggedIn) {
      const timeout = setTimeout(() => navigate("/scan"), 5000);
      return () => clearTimeout(timeout);
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="relative h-screen w-full overflow-auto bg-black text-white">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/55555room454797888010777885200.mov" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center justify-center h-screen px-6 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          Welcome to ReDécorAI
        </h1>
        <p className="mb-6 text-lg max-w-2xl text-white/90">
          Redesign your space with AI — smart, sustainable, and beautiful.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link to="/scan">
              {isLoggedIn ? "Start Scanning" : "Scan Your Room"}
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/marketplace">Browse Marketplace</Link>
          </Button>
          <Button variant="destructive" asChild>
            <Link to="/inventory">My Inventory</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/profile">Profile</Link>
          </Button>
          <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
            <DialogTrigger asChild>
              <Button variant="ghost">📖 How to Use / Try Demo</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>How to Use ReDécorAI</DialogTitle>
                <DialogDescription>Step-by-step guide</DialogDescription>
              </DialogHeader>
              <ul className="space-y-3 pt-4 text-sm text-gray-700">
                <li>
                  📷 <strong>Scan:</strong> Use your camera or upload a room
                  image
                </li>
                <li>
                  🧠 <strong>AI Tags:</strong> Furniture and layout detected
                  automatically
                </li>
                <li>
                  🎨 <strong>Redesign:</strong> Suggestions tailored to your
                  taste
                </li>
                <li>
                  🛍️ <strong>Shop or Reuse:</strong> AI suggests reuse or eco
                  buys
                </li>
                <li>
                  📲 <strong>Preview:</strong> See changes in AR
                </li>
              </ul>
              <div className="mt-4">
                <video
                  controls
                  className="rounded-lg w-full shadow"
                  poster="/tutorial-thumbnail.jpg"
                >
                  <source src="/tutorial.mp4" type="video/mp4" />
                  Your browser does not support video playback.
                </video>
              </div>

              <p className="pt-6 text-center text-sm">
                Or{" "}
                <Link to="/demo" className="underline">
                  try the live demo
                </Link>
                .
              </p>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 text-white text-3xl animate-bounce cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => {
          document
            .getElementById("features")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        ⬇
      </motion.div>

      <section
        id="features"
        className="relative z-10 px-6 py-16 bg-white text-gray-900"
      >
        <div className="max-w-6xl mx-auto text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            What is ReDécorAI?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-700 max-w-3xl mx-auto"
          >
            ReDécorAI helps you scan, restyle, and redesign your room using AI —
            reuse what you own, save money, and choose sustainable solutions.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
