import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiShield, FiAward, FiCrown } = FiIcons;

const TierBadge = ({ tier, size = 'sm', showIcon = true, className = '' }) => {
  const getTierConfig = (tier) => {
    switch (tier) {
      case 'free':
        return {
          label: 'FREE',
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: FiUser
        };
      case 'brigade':
        return {
          label: 'BRIGADE',
          color: 'bg-red-100 text-red-800 border-red-300',
          icon: FiShield
        };
      case 'fraternity':
        return {
          label: 'FRATERNITY',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          icon: FiAward
        };
      case 'guild':
        return {
          label: 'GUILD',
          color: 'bg-gold text-charcoal border-gold',
          icon: FiCrown
        };
      default:
        return {
          label: 'MEMBER',
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: FiUser
        };
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'xs':
        return 'px-2 py-0.5 text-xs';
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'md':
        return 'px-3 py-1 text-sm';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-2 py-1 text-xs';
    }
  };

  const config = getTierConfig(tier);
  const sizeClasses = getSizeClasses(size);

  return (
    <span 
      className={`inline-flex items-center space-x-1 rounded-full font-montserrat font-bold border ${config.color} ${sizeClasses} ${className}`}
    >
      {showIcon && (
        <SafeIcon icon={config.icon} className="h-3 w-3" />
      )}
      <span>{config.label}</span>
    </span>
  );
};

export default TierBadge;