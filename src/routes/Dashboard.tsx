import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = "User"; // Replace with real user data if available

  return (
    <div className="min-h-screen px-6 py-10 bg-white text-gray-900">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user} 👋</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-xl transition">
          <CardContent className="py-6">
            <CardTitle className="mb-4 text-xl">Add Inventory</CardTitle>
            <p className="mb-4 text-sm text-gray-600">
              Start by listing furniture or decor you already own — AI will use
              this later!
            </p>
            <Button onClick={() => navigate("/inventory")}>
              Open Inventory
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition">
          <CardContent className="py-6">
            <CardTitle className="mb-4 text-xl">Take Style Quiz</CardTitle>
            <p className="mb-4 text-sm text-gray-600">
              Not sure what your aesthetic is? Let us figure it out in 2
              minutes.
            </p>
            <Button onClick={() => navigate("/style-quiz")}>Start Quiz</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition">
          <CardContent className="py-6">
            <CardTitle className="mb-4 text-xl">Explore Templates</CardTitle>
            <p className="mb-4 text-sm text-gray-600">
              Browse ready-made room designs and get inspired.
            </p>
            <Button onClick={() => navigate("/templates")}>See Designs</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition">
          <CardContent className="py-6">
            <CardTitle className="mb-4 text-xl">Browse Marketplace</CardTitle>
            <p className="mb-4 text-sm text-gray-600">
              Discover curated, eco-friendly furniture matched to your style.
            </p>
            <Button onClick={() => navigate("/marketplace")}>Shop Now</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
