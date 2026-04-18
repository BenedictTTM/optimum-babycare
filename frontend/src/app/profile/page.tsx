'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SharedLoading from '@/Components/Loaders/SharedLoading';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function ProfilePage() {
  const router = useRouter();
  const { user: profile, isLoading } = useAuthGuard();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <SharedLoading size={64} color="#E43C3C" message="Loading your profile..." subMessage="Just a moment" />;
  }

  if (!profile) {
    return null;
  }

  const initials = profile.email.substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-xs p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Avatar */}
              {profile.profilePic ? (
                <Image
                  src={profile.profilePic}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E8D5C4] flex items-center justify-center">
                  <span className="text-lg sm:text-2xl font-semibold text-amber-500">{initials}</span>
                </div>
              )}

              {/* Email and Badges */}
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 truncate">{profile.email}</h1>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 font-medium rounded">
                    CUSTOMER
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 font-medium rounded">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => router.push('/profile/edit')}
              className="w-full sm:w-auto mt-3 sm:mt-0 px-6 text-amber-500 text-sm font-medium rounded-lg hover:text-amber-800 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* User Information Card */}
        <div className="bg-white rounded-lg shadow-xs p-4 md:p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">User Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* First Name */}
            <div className="order-3 md:order-1">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                First Name
              </label>
              <p className="text-gray-400 italic">
                {profile.firstName || 'Not set'}
              </p>
            </div>

            {/* Last Name */}
            <div className="order-4 md:order-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Last Name
              </label>
              <p className="text-gray-400 italic">
                {profile.lastName || 'Not set'}
              </p>
            </div>

            {/* Email */}
            <div className="order-1 md:order-3">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Email
              </label>
              <p className="text-gray-900">
                {profile.email}
              </p>
            </div>

            {/* Account Created */}
            <div className="order-2 md:order-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Account Created
              </label>
              <p className="text-gray-900">
                {profile.createdAt ? formatDate(profile.createdAt) : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Ready to Shop Card */}
          <div className="bg-white rounded-lg shadow-xs p-4 md:p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to Shop?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Explore our latest collections and find your new favorites.
            </p>
            <button
              onClick={() => router.push('/main/products')}
              className="w-full px-6 py-3 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-[#5A4D44] transition-colors"
            >
              Shop Now
            </button>
          </div>

          {/* My Orders Card */}
          <div className="bg-white rounded-lg shadow-xs p-4 md:p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">My Orders</h3>
            <p className="text-sm text-gray-600 mb-6">
              Check the status of your recent orders and view your purchase history.
            </p>
            <button
              onClick={() => router.push('/main/orders')}
              className="w-full px-6 py-3 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-[#5A4D44] transition-colors"
            >
              View Orders
            </button>
          </div>

          {/* Admin Panel Card - Only show for admin users */}
          {profile.role?.toLowerCase() === 'admin' && (
            <div className="bg-white rounded-lg shadow-xs p-4 md:p-6 md:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Admin Panel</h3>
              <p className="text-sm text-gray-600 mb-6">
                Manage the platform, view analytics, and oversee operations.
              </p>
              <button
                onClick={() => router.push('/accounts/addProducts')}
                className="w-full px-6 py-3 text-amber-500 text-sm font-medium rounded-lg hover:text-amber-800 transition-colors"
              >
                Go to Admin
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
