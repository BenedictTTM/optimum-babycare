'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { apiClient } from '@/api/clients';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Eye,
  Pencil,
  Ban,
  Calendar
} from 'lucide-react';

type Customer = {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent?: number;
  lastOrderDate: string;
  avatarUrl?: string | null;
};

type TimePeriod = 'all' | 'today' | 'week' | 'month';

const PAGE_SIZE = 10;

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');

  const getDateRange = (period: TimePeriod): { startDate?: string; endDate?: string } => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (period) {
      case 'today':
        return { startDate: today.toISOString() };
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return { startDate: weekAgo.toISOString() };
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return { startDate: monthAgo.toISOString() };
      default:
        return {};
    }
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);

        const dateRange = getDateRange(timePeriod);
        const queryParams = new URLSearchParams();
        if (dateRange.startDate) queryParams.append('startDate', dateRange.startDate);
        if (dateRange.endDate) queryParams.append('endDate', dateRange.endDate);

        const queryString = queryParams.toString();
        const url = `/users/customers/paid${queryString ? `?${queryString}` : ''}`;

        const response = await apiClient.get(url);

        const payload = response.data;
        const rows = Array.isArray(payload) ? payload : payload?.data ?? [];
        setCustomers(rows);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to load customers';
        setError(message);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [timePeriod]);

  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customers;
    const term = searchTerm.trim().toLowerCase();
    return customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term)
      );
    });
  }, [customers, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const paginatedCustomers = filteredCustomers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (nextPage: number) => {
    if (nextPage >= 1 && nextPage <= totalPages) {
      setCurrentPage(nextPage);
    }
  };

  const renderAvatar = (customer: Customer) => {
    if (customer.avatarUrl) {
      return (
        <Image
          src={customer.avatarUrl}
          alt={customer.name}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover"
        />
      );
    }

    const initials = customer.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');

    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
        {initials || 'CU'}
      </div>
    );
  };

  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const totalCustomers = customers.length;

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Paid Customers</h1>
          <p className="mt-2 text-sm text-red-900 sm:text-base">
            View and manage customers who have successfully paid for orders.
          </p>
        </header>

        {/* Summary Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total Paying Customers</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{totalCustomers}</p>
          </div>
          <div className="rounded-lg bg-white border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="mt-1 text-2xl font-bold text-[#E53935]">GHS {totalRevenue.toFixed(2)}</p>
          </div>
          <div className="rounded-lg bg-white border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Average Order Value</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              GHS {totalCustomers > 0 ? (totalRevenue / totalCustomers).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          {/* Time Period Filter */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Time Period:</span>
            {(['all', 'today', 'week', 'month'] as TimePeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => {
                  setTimePeriod(period);
                  setCurrentPage(1);
                }}
                className={`rounded-md px-3 py-1 text-sm font-medium transition ${timePeriod === period
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {period === 'all' ? 'All Time' : period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name or email..."
                className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
              <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                <Filter className="h-4 w-4 text-gray-500" />
                Filter
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                <ArrowUpDown className="h-4 w-4 text-gray-500" />
                Sort
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#cc2f2b]">
                <Plus className="h-4 w-4" />
                Add Customer
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-gray-100">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-[#FFF3F1]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Customer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Total Orders</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Total Spent</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Last Order Date</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">Loading paid customers...</td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-amber-600">{error}</td>
                  </tr>
                )}

                {!loading && !error && paginatedCustomers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-14 text-center text-sm text-gray-500">No paid customers found for this period</td>
                  </tr>
                )}

                {!loading && !error && paginatedCustomers.map((customer) => (
                  <tr key={customer.id} className="transition hover:bg-[#FFF9F7]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {renderAvatar(customer)}
                        <span className="text-sm font-medium text-gray-900">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.totalOrders}</td>
                    <td className="px-6 py-4 text-sm font-medium text-[#E53935]">
                      GHS {(customer.totalSpent || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.lastOrderDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3 text-gray-400">
                        <button className="rounded-full p-2 transition hover:bg-gray-100 hover:text-gray-600" aria-label={`View ${customer.name}`}>
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="rounded-full p-2 transition hover:bg-gray-100 hover:text-gray-600" aria-label={`Edit ${customer.name}`}>
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="rounded-full p-2 transition hover:bg-gray-100 hover:text-amber-600" aria-label={`Disable ${customer.name}`}>
                          <Ban className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredCustomers.length)} of {filteredCustomers.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>
              <div className="flex items-center gap-1 text-sm text-gray-700">
                <span>{page}</span>
                <span className="text-gray-400">/</span>
                <span>{totalPages}</span>
              </div>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}