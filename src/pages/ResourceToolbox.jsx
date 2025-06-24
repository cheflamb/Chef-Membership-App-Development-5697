import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArchive, FiDownload, FiPlay, FiFile, FiLock, FiArrowRight, FiSearch, FiFilter } = FiIcons;

const ResourceToolbox = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const resources = [
    {
      id: 1,
      title: 'Chef Retention Recipe: 5-Step Framework',
      description: 'Proven framework to reduce turnover and build loyalty in your kitchen team.',
      type: 'pdf',
      category: 'retention',
      tier_required: 'free',
      download_count: 2847,
      file_size: '2.1 MB',
      created_at: '2024-01-15',
      featured: true
    },
    {
      id: 2,
      title: 'F&B Retention Playbook',
      description: 'Complete playbook for reducing turnover across all F&B operations.',
      type: 'pdf',
      category: 'retention',
      tier_required: 'free',
      download_count: 1923,
      file_size: '4.8 MB',
      created_at: '2024-01-10',
      featured: true
    },
    {
      id: 3,
      title: 'Food Cost Calculator Spreadsheet',
      description: 'Comprehensive Excel template for tracking and optimizing food costs.',
      type: 'spreadsheet',
      category: 'operations',
      tier_required: 'brigade',
      download_count: 1456,
      file_size: '1.2 MB',
      created_at: '2024-01-20'
    },
    {
      id: 4,
      title: 'Kitchen Culture Assessment Tool',
      description: 'Evaluate your current kitchen culture and identify areas for improvement.',
      type: 'pdf',
      category: 'culture',
      tier_required: 'brigade',
      download_count: 892,
      file_size: '1.8 MB',
      created_at: '2024-01-25'
    },
    {
      id: 5,
      title: 'Leadership Communication Scripts',
      description: 'Ready-to-use scripts for difficult conversations and feedback sessions.',
      type: 'pdf',
      category: 'communication',
      tier_required: 'fraternity',
      download_count: 634,
      file_size: '3.2 MB',
      created_at: '2024-01-12'
    },
    {
      id: 6,
      title: 'Team Performance Review Template',
      description: 'Structured template for conducting effective performance reviews.',
      type: 'template',
      category: 'management',
      tier_required: 'fraternity',
      download_count: 545,
      file_size: '0.8 MB',
      created_at: '2024-01-18'
    },
    {
      id: 7,
      title: 'Strategic Planning Workbook for Executive Chefs',
      description: 'Comprehensive workbook for developing and executing strategic plans.',
      type: 'workbook',
      category: 'strategy',
      tier_required: 'guild',
      download_count: 123,
      file_size: '6.4 MB',
      created_at: '2024-01-22'
    },
    {
      id: 8,
      title: 'Monthly Leadership Deep Dive: Conflict Resolution',
      description: 'Recording from January\'s leadership workshop on handling workplace conflicts.',
      type: 'video',
      category: 'workshops',
      tier_required: 'fraternity',
      duration: '85 min',
      view_count: 234,
      created_at: '2024-01-28'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Resources' },
    { value: 'retention', label: 'Staff Retention' },
    { value: 'operations', label: 'Kitchen Operations' },
    { value: 'culture', label: 'Kitchen Culture' },
    { value: 'communication', label: 'Communication' },
    { value: 'management', label: 'Team Management' },
    { value: 'strategy', label: 'Strategic Planning' },
    { value: 'workshops', label: 'Workshop Recordings' }
  ];

  const canAccessResource = (resource) => {
    if (!user) return resource.tier_required === 'free';
    
    const tierHierarchy = ['free', 'brigade', 'fraternity', 'guild'];
    const userTierIndex = tierHierarchy.indexOf(user.tier);
    const requiredTierIndex = tierHierarchy.indexOf(resource.tier_required);
    
    return userTierIndex >= requiredTierIndex;
  };

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'free': return { label: 'FREE', color: 'bg-gray-100 text-gray-800' };
      case 'brigade': return { label: 'BRIGADE', color: 'bg-red-100 text-red-800' };
      case 'fraternity': return { label: 'FRATERNITY', color: 'bg-yellow-100 text-yellow-800' };
      case 'guild': return { label: 'GUILD', color: 'bg-gold text-charcoal' };
      default: return { label: 'FREE', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'pdf': return FiFile;
      case 'spreadsheet': return FiFile;
      case 'template': return FiFile;
      case 'workbook': return FiFile;
      case 'video': return FiPlay;
      default: return FiFile;
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const featuredResources = resources.filter(r => r.featured);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-montserrat font-bold text-charcoal mb-4">
              Resource Toolbox
            </h1>
            <p className="text-xl font-lato text-gray-600 max-w-3xl mx-auto">
              Download practical tools, templates, and resources to implement leadership principles in your kitchen.
            </p>
          </div>

          {/* Featured Resources for Free Users */}
          {!user && (
            <div className="mb-12">
              <h2 className="text-2xl font-montserrat font-bold text-charcoal mb-6 text-center">
                Free Leadership Resources
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {featuredResources.map((resource) => {
                  const ResourceIcon = getResourceIcon(resource.type);
                  const tierBadge = getTierBadge(resource.tier_required);

                  return (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl shadow-lg p-6 border-2 border-primary"
                    >
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="bg-primary p-3 rounded-lg">
                          <SafeIcon icon={ResourceIcon} className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-montserrat font-bold text-charcoal">
                              {resource.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-montserrat font-bold ${tierBadge.color}`}>
                              {tierBadge.label}
                            </span>
                          </div>
                          <p className="font-lato text-gray-600 text-sm mb-3">
                            {resource.description}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{resource.download_count.toLocaleString()} downloads</span>
                            <span>{resource.file_size}</span>
                          </div>
                        </div>
                      </div>
                      <Link
                        to="/join"
                        className="w-full bg-primary text-white py-3 rounded-lg font-lato font-medium hover:bg-red-800 transition-colors flex items-center justify-center space-x-2"
                      >
                        <SafeIcon icon={FiDownload} className="h-4 w-4" />
                        <span>Join Free to Download</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              <div className="text-center">
                <Link
                  to="/join"
                  className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg font-lato font-medium hover:bg-red-800 transition-colors"
                >
                  <span>Join Free & Access Tools</span>
                  <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Search and Filter */}
          {user && (
            <div className="mb-8 bg-white rounded-2xl p-6 border border-gray-200">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-lato"
                  />
                </div>
                <div className="relative">
                  <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-lato appearance-none"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Resources Grid */}
          {user && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource, index) => {
                const canAccess = canAccessResource(resource);
                const ResourceIcon = getResourceIcon(resource.type);
                const tierBadge = getTierBadge(resource.tier_required);

                return (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className={`p-3 rounded-lg ${canAccess ? 'bg-primary' : 'bg-gray-400'}`}>
                          {canAccess ? (
                            <SafeIcon icon={ResourceIcon} className="h-6 w-6 text-white" />
                          ) : (
                            <SafeIcon icon={FiLock} className="h-6 w-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-montserrat font-bold ${tierBadge.color}`}>
                              {tierBadge.label}
                            </span>
                            {resource.featured && (
                              <span className="px-2 py-1 rounded-full text-xs font-montserrat font-bold bg-gold text-charcoal">
                                FEATURED
                              </span>
                            )}
                          </div>
                          <h3 className="font-montserrat font-bold text-charcoal mb-2">
                            {resource.title}
                          </h3>
                        </div>
                      </div>

                      <p className="font-lato text-gray-600 text-sm mb-4">
                        {resource.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        {resource.type === 'video' ? (
                          <>
                            <span>{resource.view_count} views</span>
                            <span>{resource.duration}</span>
                          </>
                        ) : (
                          <>
                            <span>{resource.download_count?.toLocaleString()} downloads</span>
                            <span>{resource.file_size}</span>
                          </>
                        )}
                      </div>

                      {canAccess ? (
                        <button className="w-full bg-primary text-white py-3 rounded-lg font-lato font-medium hover:bg-red-800 transition-colors flex items-center justify-center space-x-2">
                          {resource.type === 'video' ? (
                            <>
                              <SafeIcon icon={FiPlay} className="h-4 w-4" />
                              <span>Watch Now</span>
                            </>
                          ) : (
                            <>
                              <SafeIcon icon={FiDownload} className="h-4 w-4" />
                              <span>Download</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="text-center">
                          <div className="bg-gray-100 text-gray-600 py-3 rounded-lg font-lato font-medium mb-2 flex items-center justify-center space-x-2">
                            <SafeIcon icon={FiLock} className="h-4 w-4" />
                            <span>Requires {tierBadge.label} Membership</span>
                          </div>
                          <Link
                            to="/pricing"
                            className="text-primary font-lato font-medium hover:text-red-800 text-sm"
                          >
                            Upgrade membership →
                          </Link>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 font-lato">
                        Added {new Date(resource.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {user && filteredResources.length === 0 && (
            <div className="text-center py-12">
              <SafeIcon icon={FiArchive} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-montserrat font-bold text-gray-900 mb-2">
                No resources found
              </h3>
              <p className="font-lato text-gray-600">
                Try adjusting your search or category filter.
              </p>
            </div>
          )}

          {/* Call to Action for Non-Users */}
          {!user && (
            <div className="mt-16 bg-gradient-to-r from-primary to-red-800 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-montserrat font-bold text-white mb-4">
                Ready to Build Your Leadership Toolkit?
              </h2>
              <p className="text-xl font-lato text-red-100 mb-8">
                Join The Brigade and get instant access to our complete resource library.
              </p>
              <Link
                to="/join"
                className="inline-flex items-center space-x-2 bg-white text-primary px-8 py-4 rounded-lg text-lg font-lato font-medium hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Join Free & Access Resources</span>
                <SafeIcon icon={FiArrowRight} className="h-5 w-5" />
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResourceToolbox;