import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Calendar, Copy } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/input';
import { socialPlatforms } from '../mock';
import * as Icons from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/Calendar';
import { format } from 'date-fns';

const ShortlinkForm = ({ onGenerate }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState({
    originalUrl: '',
    title: '',
    aliasCode: '',
    password: '',
    expirationDate: null,
    incomeLevel: ''
  });
  const [generatedLink, setGeneratedLink] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const incomeLevels = [
    { value: 'basic', label: 'Basic - $0.01 per click' },
    { value: 'standard', label: 'Standard - $0.05 per click' },
    { value: 'premium', label: 'Premium - $0.10 per click' },
    { value: 'enterprise', label: 'Enterprise - $0.25 per click' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    const newLink = {
      balance: 'short.link/talk112',
      destination: formData.originalUrl || 'https://kevinragil.vercel.app'
    };
    setGeneratedLink(newLink);
    if (onGenerate) onGenerate(formData);
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-lg p-8 mb-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Create Shortlink</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-medium text-sm hover:bg-indigo-700 transition-colors"
        >
          + Advanced Options
        </motion.button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Input
            placeholder="Paste your url here..."
            value={formData.originalUrl}
            onChange={(e) => handleInputChange('originalUrl', e.target.value)}
            className="h-14 rounded-full border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 text-gray-600 placeholder:text-gray-400"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Input
            placeholder="Set title here (optional)..."
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="h-14 rounded-full border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 text-gray-600 placeholder:text-gray-400"
          />
        </motion.div>
      </div>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-4 mb-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Input
                  placeholder="Set alias url here (optional)..."
                  value={formData.aliasCode}
                  onChange={(e) => handleInputChange('aliasCode', e.target.value)}
                  className="h-14 rounded-full border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 text-gray-600 placeholder:text-gray-400"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="relative"
              >
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-full h-14 px-4 rounded-full border border-gray-200 hover:border-indigo-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 text-left text-gray-600 bg-white transition-all flex items-center justify-between">
                      <span className={formData.expirationDate ? 'text-gray-800' : 'text-gray-400'}>
                        {formData.expirationDate ? format(formData.expirationDate, 'PPP') : 'Set expired date for link...'}
                      </span>
                      <Calendar className="h-5 w-5 text-indigo-600" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={formData.expirationDate}
                      onSelect={(date) => handleInputChange('expirationDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Input
                  type="password"
                  placeholder="Enter password here..."
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="h-14 rounded-full border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 text-gray-600 placeholder:text-gray-400"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <select
                  value={formData.incomeLevel}
                  onChange={(e) => handleInputChange('incomeLevel', e.target.value)}
                  className="w-full h-14 px-4 rounded-full border border-gray-200 hover:border-indigo-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 text-gray-600 bg-white transition-all appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236366F1' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
                >
                  <option value="">Select income level...</option>
                  {incomeLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Button
          onClick={handleGenerate}
          className="w-full h-14 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium rounded-full mb-6 transition-all flex items-center justify-center gap-2"
        >
          Generate Shortlink
          <Link2 className="h-4 w-4" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {generatedLink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-3 gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex items-center gap-3"
            >
              <Link2 className="h-5 w-5 text-gray-600" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Balance</p>
                <p className="text-sm font-medium text-gray-800 truncate">{generatedLink.balance}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleCopy(generatedLink.balance, 'balance')}
                className="text-indigo-600 hover:text-indigo-700"
              >
                <Copy className="h-4 w-4" />
              </motion.button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex items-center gap-3"
            >
              <div className="flex gap-2">
                {socialPlatforms.map((platform, index) => {
                  const IconComponent = Icons[platform.icon];
                  return (
                    <motion.button
                      key={platform.name}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all"
                      style={{ backgroundColor: platform.color }}
                    >
                      <IconComponent className="h-4 w-4" />
                    </motion.button>
                  );
                })}
              </div>
              <div className="flex items-center justify-center w-9 h-9">
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Icons.MoreVertical className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex items-center gap-3"
            >
              <Icons.MapPin className="h-5 w-5 text-gray-600" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Destination Link</p>
                <p className="text-sm font-medium text-gray-800 truncate">{generatedLink.destination}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleCopy(generatedLink.destination, 'destination')}
                className="text-indigo-600 hover:text-indigo-700"
              >
                <Copy className="h-4 w-4" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ShortlinkForm;