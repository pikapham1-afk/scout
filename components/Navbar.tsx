export default function Navbar() {
  return (
    <header className="h-16 bg-white shadow-md flex items-center justify-between px-6">

      <div>
        <h1 className="text-2xl font-bold text-green-600">
          SCOUT
        </h1>

        <p className="text-xs text-gray-500">
          Community Climate Map
        </p>
      </div>

      <div className="flex gap-3">

        <div className="bg-green-100 px-3 py-1 rounded-full text-sm">
          🌤 31°C
        </div>

        <div className="bg-blue-100 px-3 py-1 rounded-full text-sm">
          AQI 68
        </div>

      </div>

    </header>
  );
}