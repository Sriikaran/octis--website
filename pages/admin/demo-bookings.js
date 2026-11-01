import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {
  Calendar,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Shield,
  Key,
  RefreshCw,
  Eye,
  Building2,
  Phone,
  Mail,
  ArrowLeft,
} from 'lucide-react';

export default function AdminDemoBookingsPage() {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');

  // Selected for detail modal
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Check saved admin key from sessionStorage on client load
  useEffect(() => {
    const saved = sessionStorage.getItem('octis_admin_key');
    if (saved) {
      setAdminKey(saved);
      loadBookings(saved);
    }
  }, []);

  const loadBookings = async (key) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      if (productFilter) params.set('product', productFilter);

      const res = await fetch(`/api/demo/bookings?${params.toString()}`, {
        headers: {
          'x-admin-key': key || adminKey,
        },
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setIsAuthorized(true);
        setBookings(data.bookings || []);
        if (key) sessionStorage.setItem('octis_admin_key', key);
      } else {
        setIsAuthorized(false);
        setError(data.error || 'Unauthorized: Invalid admin key.');
      }
    } catch (err) {
      setLoading(false);
      setError('Network error while retrieving bookings.');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!adminKey.trim()) return;
    loadBookings(adminKey.trim());
  };

  const handleStatusUpdate = async (referenceId, newStatus) => {
    try {
      const res = await fetch(`/api/demo/bookings/${referenceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Booking ${referenceId} marked as ${newStatus}`);
        loadBookings(adminKey);
        if (selectedBooking && selectedBooking.referenceId === referenceId) {
          setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
        }
      } else {
        toast.error(data.error || 'Failed to update status');
      }
    } catch (err) {
      toast.error('Network error updating status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            Pending
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            Cancelled
          </span>
        );
      default:
        return <span className="text-xs text-muted-foreground">{status}</span>;
    }
  };

  return (
    <>
      <Head>
        <title>Demo Enquiries &amp; Appointment Administration | Octis</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
        {/* Admin Navigation Bar */}
        <header className="bg-[#1a2f4a] text-white py-4 px-6 shadow-md border-b border-gold-400/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gold-300 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold-400" />
              <h1 className="font-display font-bold text-lg text-white">
                Octis Demo &amp; Appointment Management
              </h1>
              <Link href="/admin/blogs" className="ml-4 text-sm font-semibold text-gold-300 hover:text-white">
                Blogs
              </Link>
            </div>
          </div>

          {isAuthorized && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => loadBookings(adminKey)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 text-cream-50"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
              <button
                type="button"
                onClick={() => {
                  sessionStorage.removeItem('octis_admin_key');
                  setIsAuthorized(false);
                  setBookings([]);
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold"
              >
                Sign Out
              </button>
            </div>
          )}
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full p-6 sm:p-8">
          {/* Authorization Form Gate */}
          {!isAuthorized ? (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 shadow-xl text-center">
              <div className="w-12 h-12 rounded-xl bg-gold-400/15 text-primary flex items-center justify-center mx-auto mb-4">
                <Key className="w-6 h-6 text-gold-600" />
              </div>
              <h2 className="font-display text-xl font-bold text-[#1a2f4a] mb-2">
                Administrator Authentication
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Customer appointment records are strictly protected. Enter your administrator key to proceed.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter Admin Secret Key"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-center"
                />

                {error && <p className="text-xs text-rose-600">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-[#1a2f4a] text-gold-300 font-semibold text-sm hover:bg-[#15273d] transition-all disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Access Booking Records'}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Filter & Search Bar */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadBookings(adminKey)}
                    placeholder="Search name, phone, store..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none"
                  >
                    <option value="">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <select
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none"
                  >
                    <option value="">All Products</option>
                    <option value="jewellery-erp">Jewellery ERP</option>
                    <option value="pawnify">Pawnify</option>
                    <option value="bulion">Bulion</option>
                    <option value="multiple">Multiple</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => loadBookings(adminKey)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
                  >
                    Filter
                  </button>
                </div>
              </div>

              {/* Bookings Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Total Appointments ({bookings.length})
                  </span>
                  <span className="text-xs text-slate-400">Timezone: Asia/Kolkata (IST)</span>
                </div>

                {loading ? (
                  <div className="py-16 text-center text-xs text-slate-500">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading bookings...</span>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="py-16 text-center text-xs text-slate-500">
                    No bookings found matching current filters.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                          <th className="py-3 px-4">Reference</th>
                          <th className="py-3 px-4">Scheduled Slot</th>
                          <th className="py-3 px-4">Customer &amp; Store</th>
                          <th className="py-3 px-4">Contact</th>
                          <th className="py-3 px-4">Product</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {bookings.map((item) => (
                          <tr key={item.referenceId} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-slate-800">
                              {item.referenceId}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-900">{item.date}</div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {item.startTime} - {item.endTime} IST
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{item.showroomName}</div>
                              <div className="text-slate-500 text-[11px]">
                                {item.customerName} ({item.city})
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div>{item.phone}</div>
                              <div className="text-slate-400 text-[11px]">{item.email}</div>
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-700">
                              {item.product}
                            </td>
                            <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                            <td className="py-3 px-4 text-right space-x-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedBooking(item)}
                                title="View Details"
                                className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {item.status !== 'completed' && item.status !== 'cancelled' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleStatusUpdate(item.referenceId, 'completed')}
                                    title="Mark Completed"
                                    className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleStatusUpdate(item.referenceId, 'cancelled')}
                                    title="Cancel Appointment"
                                    className="p-1 rounded-md text-rose-500 hover:bg-rose-50"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Detail Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-base text-slate-800">
                    Booking {selectedBooking.referenceId}
                  </span>
                  {getStatusBadge(selectedBooking.status)}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold text-lg"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Showroom &amp; Representative</span>
                  <p className="text-sm font-bold text-slate-900">
                    {selectedBooking.showroomName} ({selectedBooking.city})
                  </p>
                  <p className="text-slate-600">Contact: {selectedBooking.customerName}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Phone</span>
                    <p className="font-mono font-medium">{selectedBooking.phone}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Email</span>
                    <p className="font-mono text-slate-700">{selectedBooking.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Appointment Date</span>
                    <p className="font-semibold text-slate-900">{selectedBooking.date}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Time Slot</span>
                    <p className="font-semibold text-emerald-700">
                      {selectedBooking.startTime} - {selectedBooking.endTime} IST
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block mb-0.5">Platform &amp; Scope</span>
                  <p className="font-semibold text-slate-800">
                    {selectedBooking.product} &bull; {selectedBooking.branches} branch(es) &bull;{' '}
                    {selectedBooking.businessType}
                  </p>
                  {selectedBooking.challenges && (
                    <p className="mt-1.5 p-2.5 rounded-lg bg-slate-50 text-slate-600 italic">
                      &quot;{selectedBooking.challenges}&quot;
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex gap-2">
                  {selectedBooking.status !== 'cancelled' && (
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(selectedBooking.referenceId, 'cancelled')}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold"
                    >
                      Cancel Booking
                    </button>
                  )}
                  {selectedBooking.status !== 'completed' && (
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(selectedBooking.referenceId, 'completed')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

