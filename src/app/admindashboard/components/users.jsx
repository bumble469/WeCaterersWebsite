'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaSearch, FaEdit, FaBan } from 'react-icons/fa';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        // Try to refresh token
        try {
          await axios.get('/api/admin/refresh'); // Adjust path based on your API
          const retry = await axios.get('/api/admin/users');
          setUsers(retry.data);
          setError('');
        } catch (refreshErr) {
          setError('Session expired. Please log in again.');
        }
      } else {
        setError('Failed to load users.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.fullname.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Users</h2>

      {/* Search */}
      <div className="flex items-center gap-2 mb-4 bg-white rounded-md px-4 py-2 shadow-sm max-w-md">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="outline-none w-full bg-transparent text-gray-500"
        />
      </div>

      {/* Status / Error */}
      {loading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Total Orders</th>
                <th className="px-6 py-3">Confirmed</th>
                <th className="px-6 py-3">Delivered</th>
                <th className="px-6 py-3">Cancelled</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.userid}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">{user.fullname}</td>
                    <td className="px-6 py-4 text-gray-800">{user.email}</td>
                    <td className="px-6 py-4 text-gray-800">{user.totalorders}</td>
                    <td className="px-6 py-4 text-blue-700">{user.confirmedorders}</td>
                    <td className="px-6 py-4 text-green-600">{user.deliveredorders}</td>
                    <td className="px-6 py-4 text-red-500">{user.cancelledorders}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FaEdit />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <FaBan />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4 text-gray-500 italic" colSpan="7">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default AdminUsers;
