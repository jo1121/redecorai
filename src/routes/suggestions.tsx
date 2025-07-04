export default function Suggestions() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="min-h-screen bg-white px-6 py-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Redesign Suggestions
        </h1>

        <div className="rounded-lg overflow-hidden shadow-md mb-4">
          <img
            src="/sample-room.jpg"
            alt="Suggested Layout"
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h2 className="font-semibold text-lg mb-2">Suggested Item</h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Waven Jute Rug</p>
                <p className="text-xs text-gray-500">by Wayfair</p>
              </div>
              <span className="text-green-600 font-bold">$99</span>
            </div>
            <button className="mt-2 text-sm text-blue-600 hover:underline">
              Swap Nearby
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
