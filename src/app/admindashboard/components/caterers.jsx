'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaSyncAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const statusColors = {
  Active: 'bg-green-100 text-green-800',
  Inactive: 'bg-red-100 text-red-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Suspended: 'bg-gray-100 text-gray-700',
};

const AdminCaterers = () => {
  const [search, setSearch] = useState('');
  const [caterers, setCaterers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIds, setExpandedIds] = useState([]);

  const fetchCaterers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/admin/caterers', {withCredentials: true});
      setCaterers(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          const refreshRes = await axios.post('/api/auth/admin/refreshtoken', {}, { withCredentials: true });
          if(refreshRes.status !== 200) {
            const retryRes = await axios.get('/api/admin/caterers', {}, { withCredentials: true });
            setCaterers(retryRes.data);
          }
        } catch {
          setError('Session expired. Please log in again.');
          console.error('Session expired. Please log in again.');
        }
      } else {
        setError('Failed to fetch caterers.');
        console.error('Failed to fetch caterers:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaterers();
  }, []);

  const filteredCaterers = caterers.filter(
    (caterer) =>
      caterer.cateringname.toLowerCase().includes(search.toLowerCase()) ||
      caterer.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  return (
    <motion.div
      className="w-full max-w-none bg-gray-50 rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-5 border-b pb-2">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Caterers</h2>
        <button
          onClick={fetchCaterers}
          aria-label="Refresh"
          className="p-2 rounded-md hover:bg-gray-200 transition-colors"
          title="Refresh Caterers"
        >
          <FaSyncAlt className="text-gray-600" />
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 mb-5 bg-white rounded-md px-3 py-2 shadow-sm w-full max-w-md">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search caterers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="outline-none w-full bg-transparent text-gray-600 text-sm"
        />
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm animate-pulse">Loading caterers...</p>
      ) : error ? (
        <p className="text-red-600 text-sm italic">{error}</p>
      ) : filteredCaterers.length === 0 ? (
        <p className="text-gray-500 italic text-sm">No caterers found.</p>
      ) : (
        filteredCaterers.map((caterer) => {
          const isExpanded = expandedIds.includes(caterer.cateringid);
          return (
            <motion.div
              key={caterer.cateringid}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer mb-8 p-4 bg-white text-sm"
            >
              {/* Minimal info row */}
              <div
                className="flex justify-between items-center px-2 py-2 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => toggleExpand(caterer.cateringid)}
                aria-expanded={isExpanded}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    toggleExpand(caterer.cateringid);
                  }
                }}
              >
                <div className="flex flex-wrap md:flex-nowrap gap-x-8 gap-y-1 text-sm text-gray-800 font-medium">
                  <span className="min-w-[140px]">
                    <span className="text-gray-500 mr-1">ID:</span> #{caterer.cateringid}
                  </span>
                  <span className="min-w-[160px] truncate">
                    <span className="text-gray-500 mr-1">Name:</span> {caterer.cateringname}
                  </span>
                  <span className="min-w-[160px] truncate">
                    <span className="text-gray-500 mr-1">Owner:</span> {caterer.ownername}
                  </span>
                  <span className="min-w-[120px]">
                    <span className="text-gray-500 mr-1">Rating:</span> {caterer.overallrating ?? 'N/A'}
                  </span>
                </div>
                <div className="text-gray-500 ml-3">
                  {isExpanded ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
                </div>
              </div>


              {/* Expanded details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 border-t pt-4 text-xs text-gray-700"
                  >
                    <h3 className="text-lg font-semibold mb-2 border-b pb-1 text-gray-800">Catering Info</h3>
                    <div className="flex flex-col md:flex-row gap-6 mb-4">
                      <table className="flex-1 min-w-[280px] table-fixed text-left border-collapse">
                        <tbody>
                          {[
                            ['Email', caterer.email],
                            ['Owner', caterer.ownername],
                            ['Registered Date', new Date(caterer.latestorderdate).toLocaleDateString()],
                            ['Status', <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">Active</span>],
                            ['Total Orders', caterer.totalorders],
                            ['Confirmed Orders', caterer.confirmedorders],
                            ['Delivered Orders', caterer.deliveredorders],
                            ['Cancelled Orders', caterer.cancelledorders],
                          ].map(([label, value], idx) => (
                            <tr key={label} className={`${idx % 2 === 0 ? 'bg-gray-50' : ''} border-b border-gray-200`}>
                              <th className="py-2 pr-2 font-semibold text-gray-700 w-1/3">{label}</th>
                              <td className="py-2 text-gray-800">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <table className="flex-1 min-w-[280px] table-fixed text-left border-collapse">
                        <tbody>
                          {[
                            ['Address', caterer.address],
                            ['Description', caterer.description],
                            ['Event Type', caterer.eventtype],
                            ['Price Range', `₹${caterer.pricerange}`],
                            ['Contact Number', caterer.contact],
                          ].map(([label, value], idx) => (
                            <tr key={label} className={`${idx % 2 === 0 ? 'bg-gray-50' : ''} border-b border-gray-200`}>
                              <th className="py-2 pr-2 font-semibold text-gray-700 w-1/3">{label}</th>
                              <td className="py-2 text-gray-800">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <h3 className="text-lg font-semibold mb-2 border-b pb-1 text-gray-800">Menu and Services</h3>
                    <div className="flex flex-col md:flex-row gap-6">
                      <table className="flex-1 min-w-[280px] table-fixed text-left border-collapse">
                        <tbody>
                          {[
                            ['Total Menu Items', caterer.totalmenuitems],
                            ['Menu Items Delivered', caterer.totalmenuitemsdelivered],
                            ['Number of Ratings', caterer.numberofratings],
                            ['Average User Rating', caterer.averageuserrating],
                          ].map(([label, value], idx) => (
                            <tr key={label} className={`${idx % 2 === 0 ? 'bg-gray-50' : ''} border-b border-gray-200`}>
                              <th className="py-2 pr-2 font-semibold text-gray-700 w-1/3">{label}</th>
                              <td className="py-2 text-gray-800">{value ?? 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <table className="flex-1 min-w-[280px] table-fixed text-left border-collapse">
                        <tbody>
                          {[
                            ['Total Services', caterer.totalservices],
                            ['Available Services', caterer.availableservices],
                          ].map(([label, value], idx) => (
                            <tr key={label} className={`${idx % 2 === 0 ? 'bg-gray-50' : ''} border-b border-gray-200`}>
                              <th className="py-2 pr-2 font-semibold text-gray-700 w-1/3">{label}</th>
                              <td className="py-2 text-gray-800">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          );
        })
      )}
    </motion.div>

  );
};

export default AdminCaterers;
