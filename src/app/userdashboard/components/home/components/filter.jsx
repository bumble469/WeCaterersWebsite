const Filters = ({ filters, setFilters, applyFilters, resetFilters }) => (
  <>
    <h4 className="text-xl font-bold text-gray-800 mb-6">Find the Right Caterer</h4>

    {/* Event Type */}
    <div className="mb-5">
      <label className="block text-sm font-semibold mb-2 text-gray-700">🎪 Event Type</label>
      <select 
        value={filters.eventtype}
        onChange={(e) => setFilters(prev => ({ ...prev, eventtype: e.target.value }))}
        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400">
        <option value="All">All</option>
        <option value="Wedding">Wedding</option>
        <option value="Corporate">Corporate</option>
        <option value="Birthday">Birthday</option>
        <option value="Buffet">Buffet</option>
        <option value="Festival">Festival</option>
      </select>
    </div>

    {/* Rating */}
    <div className="mb-5">
      <label className="block text-sm font-semibold mb-2 text-gray-700">⭐ Rating</label>
      <select 
        value={filters.rating}
        onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400">
        <option value="All">All</option>
        <option value="4 stars & above">4 stars & above</option>
        <option value="3 stars & above">3 stars & above</option>
        <option value="Below 3 stars">Below 3 stars</option>
      </select>
    </div>

    {/* Price */}
    <div className="mb-5">
      <label className="block text-sm font-semibold mb-2 text-gray-700">💰 Price Range</label>
      <select 
        value={filters.price}
        onChange={(e) => setFilters(prev => ({ ...prev, price: e.target.value }))}
        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400">
        <option value="All">All</option>
        <option value="₹200 - ₹500">₹200 - ₹500</option>
        <option value="₹500 - ₹1000">₹500 - ₹1000</option>
        <option value="₹1000+">₹1000+</option>
      </select>
    </div>

    {/* Location */}
    <div className="mb-6">
      <label className="block text-sm font-semibold mb-2 text-gray-700">📍 Location</label>
      <input
        value={filters.location}
        onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
        type="text"
        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Enter city or area"
      />
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
