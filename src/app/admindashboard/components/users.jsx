'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaEdit, FaBan } from 'react-icons/fa';

const AdminUsers = () => {
  const [search, setSearch] = useState('');

  const users = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Customer', status: 'Active' },
    { id: 2, name: 'Bob Singh', email: 'bob@example.com', role: 'Customer', status: 'Suspended' },
    { id: 3, name: 'Charlie Patel', email: 'charlie@example.com', role: 'Customer', status: 'Active' },
    { id: 4, name: 'Diana Roy', email: 'diana@example.com', role: 'Customer', status: 'Pending' },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
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

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{user.name}</td>
                  <td className="px-6 py-4 text-gray-800">{user.email}</td>
                  <td className="px-6 py-4 text-gray-800">{user.role}</td>
                  <td className={`px-6 py-4 font-semibold ${user.status === 'Active' ? 'text-green-600' : user.status === 'Suspended' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {user.status}
                  </td>
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
                <td className="px-6 py-4 text-gray-500 italic" colSpan="5">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminUsers;
