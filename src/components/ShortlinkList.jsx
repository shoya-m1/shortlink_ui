import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, MessageCircle, ChevronDown, ChevronUp, MoreVertical, MapPin, Calendar, Hand, DollarSign, Copy } from 'lucide-react';
import { mockShortlinks } from '../mock';

const ShortlinkList = () => {
  const [shortlinks, setShortlinks] = useState(mockShortlinks);
  const [copiedId, setCopiedId] = useState(null);

  const toggleExpand = (id) => {
    setShortlinks(prev =>
      prev.map(link =>
        link.id === id ? { ...link, expanded: !link.expanded } : link
      )
    );
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {shortlinks.map((link, index) => (
        <motion.div
          key={link.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-3xl shadow-md overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <Link2 className="h-6 w-6 text-white" />
              </motion.div>

              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">{link.createdAt}</p>
                <p className="text-lg font-semibold text-gray-800 truncate">{link.shortUrl}</p>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MessageCircle className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MoreVertical className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleExpand(link.id)}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  {link.expanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {link.expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-100 bg-gray-50"
              >
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">Destination Link</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-800 truncate flex-1">
                            {link.destinationUrl}
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleCopy(link.destinationUrl, `dest-${link.id}`)}
                            className="text-indigo-600 hover:text-indigo-700 flex-shrink-0"
                          >
                            <Copy className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Date Expired</p>
                        <p className="text-sm font-medium text-gray-800">{link.dateExpired}</p>
                      </div>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                        <Hand className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Total Click</p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-semibold text-gray-800">
                            {link.totalClicks.toLocaleString()}
                          </p>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                            ↑ {link.clickGrowth}%
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                        <DollarSign className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Total Earning</p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-semibold text-gray-800">
                            ${link.totalEarning.toLocaleString()}
                          </p>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                            ↑ ${link.earningGrowth.toFixed(3)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

export default ShortlinkList;