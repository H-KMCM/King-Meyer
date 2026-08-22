import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole, UserStatus } from '../../lib/types';
import { UserCheck, Shield, Check, X, RefreshCw, AlertCircle } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (userId: string, newStatus: UserStatus, newRole: UserRole) => {
    setActionSuccess(null);
    try {
      const res = await fetch('/api/admin/users/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: newStatus, role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`User status updated to ${newStatus} (${newRole})`);
        fetchUsers();
      }
    } catch (err) {
      console.error('Failed to update user', err);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 shadow-sm p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-200 gap-4">
        <div>
          <span className="text-gold text-xs uppercase tracking-widest font-bold">LP & Operator Clearance</span>
          <h2 className="text-navy text-2xl font-serif font-bold mt-1">User Management &amp; Tier Assignment</h2>
          <p className="text-slate text-sm font-light">
            Review allocator applications, enforce KYC/accreditation gates, and assign clearance tiers.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-slate hover:text-gold border border-slate-200 px-4 py-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="mt-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 rounded">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4 font-semibold">User / Entity</th>
              <th className="py-3 px-4 font-semibold">Clearance Role</th>
              <th className="py-3 px-4 font-semibold">Accreditation</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Last Activity</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-4 px-4">
                  <div className="font-semibold text-navy text-sm">{user.name}</div>
                  <div className="text-slate-500 font-mono text-[11px]">{user.email}</div>
                  {user.entityName && (
                    <div className="text-[11px] text-gold font-medium mt-0.5">{user.entityName}</div>
                  )}
                </td>

                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono uppercase font-bold rounded ${
                      user.role === 'SUPER_ADMIN'
                        ? 'bg-navy text-gold border border-gold/30'
                        : user.role === 'ADMIN'
                        ? 'bg-navy text-white'
                        : user.role === 'VERIFIED_LP'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    <Shield className="w-3 h-3" />
                    {user.role.replace(/_/g, ' ')}
                  </span>
                </td>

                <td className="py-4 px-4">
                  {user.isAccredited ? (
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                </td>

                <td className="py-4 px-4">
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase rounded-full ${
                      user.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : user.status === 'PENDING_REVIEW'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {user.status.replace(/_/g, ' ')}
                  </span>
                </td>

                <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                  {user.lastLoginIp && <div className="text-[10px] text-slate-400">IP: {user.lastLoginIp}</div>}
                </td>

                <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                  {user.status === 'PENDING_REVIEW' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(user.id, 'APPROVED', 'VERIFIED_LP')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all"
                        title="Approve as Verified LP"
                      >
                        Approve LP
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(user.id, 'REJECTED', 'PROSPECT_LP')}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all"
                        title="Reject Access"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {user.status === 'APPROVED' && user.role === 'PROSPECT_LP' && (
                    <button
                      onClick={() => handleUpdateStatus(user.id, 'APPROVED', 'VERIFIED_LP')}
                      className="bg-gold hover:bg-amber-700 text-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all"
                    >
                      Promote to Verified LP
                    </button>
                  )}

                  {user.role === 'VERIFIED_LP' && (
                    <button
                      onClick={() => handleUpdateStatus(user.id, 'APPROVED', 'PROSPECT_LP')}
                      className="border border-slate-300 text-slate-600 hover:text-navy px-3 py-1.5 text-[11px] font-medium tracking-wider transition-all"
                    >
                      Downgrade Tier
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
