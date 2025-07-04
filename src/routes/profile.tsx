export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="min-h-screen bg-white px-6 py-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">My Listings</h1>

        <ul className="space-y-4">
          {[
            { name: "Round Side Table", status: "Swap" },
            { name: "Table Lamp", status: "Sold" },
            { name: "Framed Artwork", status: "Active" },
          ].map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-xl shadow-sm"
            >
              <span className="font-medium">{item.name}</span>
              <span className="text-sm text-gray-500">{item.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
