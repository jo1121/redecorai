export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          About ReDécorAI
        </h2>
        <p className="text-gray-700 text-base">
          ReDécorAI is your smart interior styling assistant. Scan your space,
          get intelligent furniture suggestions, and explore a curated
          marketplace to decorate like a pro.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Built with AI and love to make your living space truly yours.
        </p>
      </div>
    </div>
  );
}
