const Filters = ({ filters, setFilters, applyFilters, resetFilters }) => (
  <>
    <h4 className="text-xl font-bold text-gray-800 mb-6">Find the Right Food Menu</h4>

    {/* Cuisine Type */}
    <div className="mb-5">
      <label className="block text-sm font-semibold mb-2 text-gray-700">🍽️ Cuisine Type</label>
      <select 
        value={filters.cuisinetype}
        onChange={(e) => setFilters(prev => ({ ...prev, cuisinetype: e.target.value === "All" ? "" : e.target.value }))}
        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400">
        <option value="All">All</option>
        <option value="North Indian">North Indian</option>
        <option value="Chinese">Chinese</option>
        <option value="Italian">Italian</option>
        <option value="Mexican">Mexican</option>
        <option value="Continental">Continental</option>
      </select>
    </div>

    {/* Rating */}
    <div className="mb-5">
      <label className="block text-sm font-semibold mb-2 text-gray-700">⭐ Rating</label>
      <select 
        value={filters.rating === null ? "All" : filters.rating}
        onChange={(e) => {
          const val = e.target.value;
          setFilters(prev => ({ ...prev, rating: val === "All" ? null : parseInt(val) }));
        }}
        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400">
        <option value="All">All</option>
        <option value="4">4 stars & above</option>
        <option value="3">3 stars & above</option>
        <option value="0">Below 3 stars</option>
      </select>
    </div>

    <div className="mb-5">
      <label className="block text-sm font-semibold mb-2 text-gray-700">💰 Price (Max)</label>
      <select
        value={filters.price === null ? "All" : filters.price.toString()}
        onChange={(e) => {
          const val = e.target.value;
          setFilters(prev => ({
            ...prev,
            price: val === "All" ? null : parseInt(val),
          }));
        }}
        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="All">All</option>
        <option value="200">₹200</option>
        <option value="300">₹300</option>
        <option value="500">₹500</option>
        <option value="1000">₹1000</option>
        <option value="1500">₹1500</option>
      </select>
    </div>

    {/* Dietary Preference */}
    <div className="mb-5">
      <label className="block text-sm font-semibold mb-2 text-gray-700">🥗 Dietary Preference</label>
      <select 
        value={filters.dietarypreference}
        onChange={(e) => setFilters(prev => ({ ...prev, dietarypreference: e.target.value === "All" ? "" : e.target.value }))}
        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400">
        <option value="All">All</option>
        <option value="Vegetarian">Vegetarian</option>
        <option value="Non-vegetarian">Non-vegetarian</option>
        <option value="Vegan">Vegan</option>
      </select>
    </div>

    {/* Buttons */}
    <div className="flex justify-between gap-3 mt-6">
      <button 
        onClick={resetFilters}
        className="w-1/2 cursor-pointer bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 hover:bg-gray-200 transition">
        Reset
      </button>
      <button 
        onClick={applyFilters}
        className="w-1/2 bg-blue-600 cursor-pointer text-white rounded py-2 hover:bg-blue-700 transition">
        Apply
      </button>
    </div>
  </>
);

export default Filters;
