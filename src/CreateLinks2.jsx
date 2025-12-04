import React from 'react';
import { motion } from 'framer-motion';
import ShortlinkForm from './components/ShortlinkForm';
import ShortlinkList from './components/ShortlinkList';

const Dashboard = () => {
  const handleGenerate = (formData) => {
    console.log('Generated shortlink with data:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Shortlink Manager</h1>
          <p className="text-gray-600">Create and manage your shortened links with ease</p>
        </motion.div>

        <ShortlinkForm onGenerate={handleGenerate} />
        <ShortlinkList />
      </div>
    </div>
  );
};

export default Dashboard;