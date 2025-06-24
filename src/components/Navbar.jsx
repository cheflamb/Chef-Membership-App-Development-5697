import React, {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {motion} from 'framer-motion';
import {useAuth} from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiHome, FiUsers, FiBookOpen, FiVideo, FiArchive, FiUser, FiLogOut, FiMenu, FiX, FiRadio, FiTarget} = FiIcons;

const Navbar = () => {
  const {user, signOut} = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleRadioClick = () => {
    window.open('https://feeds.captivate.fm/therealchefliferadio/', '_blank');
  };

  const navigation = [
    {name: 'Home', href: '/', icon: FiHome},
    {name: "Chef's Table", href: '/chefs-table', icon: FiUsers},
    {name: 'Leadership LevelUp', href: '/leadership-levelup', icon: FiBookOpen},
    {name: 'Live Events', href: '/live-events', icon: FiVideo},
    {name: 'Resource Toolbox', href: '/resource-toolbox', icon: FiArchive},
    {
      name: 'Chef Life Radio',
      href: '#',
      icon: FiRadio,
      onClick: handleRadioClick,
      external: true,
      hasLogo: true
    },
  ];

  if (user) {
    navigation.push({name: 'My Chefcoat', href: '/my-chefcoat', icon: FiUser});
  }

  const getTierColor = (tier) => {
    switch (tier) {
      case 'free': return 'text-charcoal bg-background border-charcoal';
      case 'brigade': return 'text-primary bg-red-50 border-primary';
      case 'fraternity': return 'text-gold bg-yellow-50 border-gold';
      case 'guild': return 'text-charcoal bg-gold border-gold';
      default: return 'text-charcoal bg-background border-charcoal';
    }
  };

  const getTierLabel = (tier) => {
    switch (tier) {
      case 'free': return 'FREE';
      case 'brigade': return 'BRIGADE';
      case 'fraternity': return 'FRATERNITY';
      case 'guild': return 'GUILD';
      default: return 'MEMBER';
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img
                  src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1750727120961-Brigade2.png"
                  alt="The Successful Chef Brigade Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <span className="text-lg font-montserrat font-bold text-charcoal">The Successful Chef</span>
                <div className="text-sm font-montserrat font-bold text-primary">BRIGADE</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              if (item.external && item.onClick) {
                return (
                  <button
                    key={item.name}
                    onClick={item.onClick}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-lato font-medium text-charcoal hover:text-primary hover:bg-red-50 transition-colors"
                  >
                    {item.hasLogo ? (
                      <img
                        src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1750727843097-1.png"
                        alt="Chef Life Radio Logo"
                        className="h-5 w-5 object-contain"
                      />
                    ) : (
                      <SafeIcon icon={item.icon} className="h-4 w-4" />
                    )}
                    <span>{item.name}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-lato font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-primary bg-red-50'
                      : 'text-charcoal hover:text-primary hover:bg-red-50'
                  }`}
                >
                  <SafeIcon icon={item.icon} className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-montserrat font-bold border ${getTierColor(user.tier)}`}>
                    {getTierLabel(user.tier)}
                  </span>
                  <Link
                    to="/my-chefcoat"
                    className="flex items-center space-x-2 hover:bg-background rounded-lg p-2 transition-colors"
                  >
                    <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                    <span className="text-sm font-lato font-medium text-charcoal">{user.name}</span>
                  </Link>
                  {/* GetStarted Button */}
                  <Link
                    to="/get-started"
                    className="flex items-center space-x-2 bg-primary text-white px-3 py-2 rounded-lg text-sm font-lato font-medium hover:bg-red-800 transition-colors"
                  >
                    <SafeIcon icon={FiTarget} className="h-4 w-4" />
                    <span>Get Started</span>
                  </Link>
                  <button
                    onClick={signOut}
                    className="text-charcoal hover:text-primary transition-colors"
                  >
                    <SafeIcon icon={FiLogOut} className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/join"
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-lato font-medium hover:bg-red-800 transition-colors"
              >
                Join Brigade
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-charcoal hover:text-primary"
            >
              <SafeIcon icon={isMenuOpen ? FiX : FiMenu} className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{opacity: 0, y: -10}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: -10}}
          className="md:hidden bg-white border-t border-gray-200"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              if (item.external && item.onClick) {
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      item.onClick();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-lato font-medium text-charcoal hover:text-primary hover:bg-red-50 w-full text-left"
                  >
                    {item.hasLogo ? (
                      <img
                        src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1750727843097-1.png"
                        alt="Chef Life Radio Logo"
                        className="h-6 w-6 object-contain"
                      />
                    ) : (
                      <SafeIcon icon={item.icon} className="h-5 w-5" />
                    )}
                    <span>{item.name}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-lato font-medium ${
                    location.pathname === item.href
                      ? 'text-primary bg-red-50'
                      : 'text-charcoal hover:text-primary hover:bg-red-50'
                  }`}
                >
                  <SafeIcon icon={item.icon} className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {user && (
              <>
                <Link
                  to="/get-started"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-lato font-medium text-primary hover:bg-red-50 w-full text-left"
                >
                  <SafeIcon icon={FiTarget} className="h-5 w-5" />
                  <span>Get Started</span>
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-lato font-medium text-primary hover:bg-red-50 w-full text-left"
                >
                  <SafeIcon icon={FiLogOut} className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;