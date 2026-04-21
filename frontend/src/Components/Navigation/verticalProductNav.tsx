'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Tag,
  Users,
  Activity,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  LogOut,
  Menu,
  Plus,
  Grid3x3,
  Calendar,
  Folder,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { useUserStore } from '@/store/userStore';
import { AuthService } from '@/lib/auth';
import Image from 'next/image';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, fetchUser } = useUserStore();

  const [activeItem, setActiveItem] = useState('');
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // ✅ Detect active item by route
  useEffect(() => {
    if (pathname.includes('/accounts/addProducts')) setActiveItem('Add Product');
    else if (pathname.includes('/accounts/grid')) setActiveItem('Product Grid');
    else if (pathname.includes('/accounts/addCategories')) setActiveItem('Categories');
    else if (pathname.includes('/accounts/customers')) setActiveItem('Customers');
    else if (pathname.includes('/accounts/adminFeedback')) setActiveItem('Admin Feedback');
    else if (pathname.includes('/accounts/blog') || pathname.includes('/accounts/blog')) setActiveItem('Blogs');
    else if (pathname.includes('/accounts/notifications')) setActiveItem('Notifications');
    else setActiveItem('Dashboard');
  }, [pathname]);

  // ✅ Load user profile once
  useEffect(() => {
    console.log('Sidebar: Mounting and fetching user...');
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    console.log('Sidebar: User state updated:', user);
  }, [user]);

  const getUserInitials = () =>
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : 'U';

  const getUserFullName = () =>
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : 'User';

  const menuItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/accounts' },
    {
      icon: Tag,
      label: 'Products',
      path: '/products',
      hasSubmenu: true,
      submenu: [
        { icon: Plus, label: 'Add Product', path: '/accounts/addProducts' },
        { icon: Grid3x3, label: 'Product Grid', path: '/accounts/grid' },
        { icon: Folder, label: 'Categories', path: '/accounts/addCategories' },
      ],
    },
    { icon: Users, label: 'Customers', path: '/accounts/customers' },
    { icon: MessageSquare, label: 'Admin Feedback', path: '/accounts/adminFeedback' },
    { icon: Activity, label: 'Blogs', path: '/accounts/blog' },
    { icon: Bell, label: 'Notifications', path: '/accounts/notifications' },
  ];

  const otherItems = [
    { icon: HelpCircle, label: 'Help', path: '/accounts/help' },
  ];

  const handleLogout = async () => {
    await AuthService.logout();
  };

  const toggleSubmenu = (label: string) => {
    if (!openSubmenu && label === 'Products') {
      setOpenSubmenu('Products');
    } else {
      setOpenSubmenu(openSubmenu === label ? null : label);
    }
  };

  // Open 'Products' by default if we are on a child page
  useEffect(() => {
    if (activeItem === 'Add Product' || activeItem === 'Product Grid' || activeItem === 'Categories') {
      setOpenSubmenu('Products');
    }
  }, [activeItem]);

  return (
    <>
      {/* Top Navbar for Mobile */}
      <div className="lg:hidden flex items-center justify-between px-4 py-4 bg-gray-100 border-gray-50">
        <Link href="/products" className="flex items-center text-xl font-bold text-gray-800">
          <Image src='/logo.png' alt="Logo" width={60} height={60} />
        </Link>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white flex flex-col transform transition-transform duration-300 ease-in-out border-r border-gray-50
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand */}
        <div className="hidden lg:flex items-center justify-between px-4 py-4 bg-transparent">
          <Link href="/products" className="hidden flex items-center text-xl font-bold text-gray-800">
            <Image src='/logo.png' alt="Logo" width={120} height={120} />
          </Link>
        </div>

        {/* User Profile */}
        <div className="px-5 py-2 mb-2">
          <div className="flex items-center gap-3">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt={getUserFullName()}
                className="w-[46px] h-[46px] rounded-full object-cover shadow-sm bg-white p-[2px] border border-gray-100"
              />
            ) : (
              <div className="w-[48px] h-[48px] rounded-full bg-gray-50 flex items-center justify-center text-amber-400 font-bold text-sm shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-gray-200">
                {getUserInitials()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-[14.5px] font-bold text-gray-800 truncate leading-tight">{getUserFullName()}</h3>
              <p className="text-[13px] text-gray-500 font-medium">Administrator</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide py-3">
          {/* MAIN Section Label */}
          <div className="px-5 mb-2 mt-2">
            <p className="text-[11px] font-semibold tracking-wider text-gray-400">MAIN</p>
          </div>

          <nav className="px-3 pb-4">
            {menuItems.map((item, index) => (
              <div key={index} className="mb-1">
                <button
                  onClick={() => {
                    if (item.hasSubmenu) {
                      toggleSubmenu(item.label);
                    } else {
                      setActiveItem(item.label);
                      router.push(item.path);
                      setIsMobileOpen(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-[9px] rounded-[10px] text-[14px] font-medium transition-all ${activeItem === item.label && !item.hasSubmenu
                      ? 'bg-gray-100 text-gray-900 border border-gray-100/50'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-[18px] h-[18px] ${activeItem === item.label && !item.hasSubmenu ? 'text-gray-700' : 'text-gray-500'}`} strokeWidth={2} />
                    <span>{item.label}</span>
                  </div>
                  {item.hasSubmenu ? (
                    <ChevronDown className={`w-[16px] h-[16px] text-gray-500 transition-transform ${openSubmenu === item.label ? 'rotate-0' : '-rotate-90'}`} />
                  ) : (
                    <ChevronRight className="w-[16px] h-[16px] text-gray-400" />
                  )}
                </button>

                {item.hasSubmenu && openSubmenu === item.label && (
                  <div className="relative mt-1 ml-[25px] mb-2">
                    {/* Vertical Tree Line */}
                    <div className="absolute left-0 top-0 bottom-[20px] w-[2px] bg-gray-200/80 rounded-full"></div>

                    <div className="space-y-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <div key={subIndex} className="relative flex items-center w-full">
                          {/* Horizontal branch */}
                          <div className={`absolute left-0 w-[14px] h-[2px] rounded-full  ${activeItem === subItem.label ? 'bg-amber-200' : 'bg-gray-200/80'}`}></div>

                          <button
                            onClick={() => {
                              setActiveItem(subItem.label);
                              router.push(subItem.path);
                              setIsMobileOpen(false);
                            }}
                            className={`flex-1 flex items-center justify-between ml-[20px] mr-0 p-[8px] pl-3 rounded-lg text-[13.5px] font-medium transition-all ${activeItem === subItem.label
                                ? 'bg-[#FEF5ED] text-[#ea580c] shadow-[0_1px_2px_rgba(234,88,12,0.05)]' // Amber tint
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <subItem.icon className={`w-[16px] h-[16px] ${activeItem === subItem.label ? 'text-[#ea580c]' : 'text-gray-400'}`} strokeWidth={2} />
                              <span>{subItem.label}</span>
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* OTHER Section Label */}
          <div className="px-5 mb-2 mt-4">
            <p className="text-[11px] font-semibold tracking-wider text-gray-400">OTHER</p>
          </div>

          <div className="px-3 pb-8 space-y-1">
            {otherItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveItem(item.label);
                  router.push(item.path);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-[9px] rounded-[10px] text-[14px] font-medium transition-all ${activeItem === item.label
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <item.icon className="w-[18px] h-[18px] text-gray-500" strokeWidth={2} />
                <span>{item.label}</span>
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-[9px] rounded-[10px] text-[14px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
            >
              <LogOut className="w-[18px] h-[18px] text-gray-500" strokeWidth={2} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}