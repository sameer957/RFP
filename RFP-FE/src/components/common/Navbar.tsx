import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { PATHS } from '../../utils/Paths';
import { HiMenu, HiX } from 'react-icons/hi';
import { TEXT } from '../../utils/TextConstants';

function Navbar() {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<string>('Dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { item: TEXT.NAVBAR.DASHBOARD, path: PATHS.DASHBOARD },
    { item: TEXT.NAVBAR.VENDORS, path: PATHS.VENDORS },
    { item: TEXT.NAVBAR.CREATE_RFP, path: PATHS.CREATE_RFP },
    { item: TEXT.NAVBAR.PROPOSALS, path: PATHS.PROPOSALS },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full h-16 shadow-lg flex items-center justify-between px-4 md:px-10 bg-white z-50 fixed top-0">
        <p className="text-2xl md:text-3xl font-bold text-gray-900">{TEXT.NAME}</p>

        <div className="hidden md:flex items-center gap-10">
          {navItems.map((nav, idx) => (
            <div
              key={idx}
              className={`cursor-pointer text-base font-medium ${
                selectedItem === nav.item
                  ? 'text-gray-900 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
              onClick={() => {
                navigate(nav.path);
                setSelectedItem(nav.item);
              }}
            >
              {nav.item}
            </div>
          ))}
        </div>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <HiX className="w-8 h-8 text-gray-900" />
            ) : (
              <HiMenu className="w-8 h-8 text-gray-900" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg mt-16 w-full absolute z-40 flex flex-col">
          {navItems.map((nav, idx) => (
            <div
              key={idx}
              className={`cursor-pointer py-4 px-6 border-b ${
                selectedItem === nav.item
                  ? 'text-gray-900 font-semibold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              onClick={() => {
                navigate(nav.path);
                setSelectedItem(nav.item);
                setMenuOpen(false);
              }}
            >
              {nav.item}
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 bg-gray-100 mt-16">
        <Outlet />
      </div>
    </div>
  );
}

export default Navbar;
