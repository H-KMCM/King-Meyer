import React, { useState, useEffect } from 'react';
import { AuditLogEntry } from '../../lib/types';
import { ShieldAlert, Download, LogIn, Edit, RefreshCw, Key, Filter } from 'lucide-react';

const AuditTrailViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/audit-trail');
      const data = await res.json();
      if (data.auditTrail) {
        setLogs(data.auditTrail);
      }
    } catch (err) {
      console.error('Failed to fetch audit trail', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filterAction === 'ALL') return true;
    return log.action.includes(filterAction);
  });

  const getActionBadge = (action: string) => {
    if (action.startsWith('AUTH_LOGIN_SUCCESS') || action.startsWith('AUTH_2FA')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
          <LogIn className="w-3 h-3" />
          {action}
        </span>
      );
    }
    if (action.startsWith('AUTH_LOGIN_FAILURE')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 bg-red-100 text-red-800 rounded">
          <ShieldAlert className="w-3 h-3" />
          {action}
        </span>
      );
    }
    if (action.startsWith('DOC_DOWNLOAD')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
          <Download className="w-3 h-3" />
          {action}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
        <Edit className="w-3 h-3" />
        {action}
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-200/80 shadow-sm p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-200 gap-4">
        <div>
          <span className="text-gold text-xs uppercase tracking-widest font-bold">Cryptographic Ledger</span>
          <h2 className="text-navy text-2xl font-serif font-bold mt-1">Immutable Audit Trail</h2>
          <p className="text-slate text-sm font-light">
            Real-time compliance logging of authentication attempts, IP addresses, document access, and system mutations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs border border-slate-200 px-3 py-1.5 bg-ghost">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-transparent text-navy text-xs font-semibold focus:outline-none"
            >
              <option value="ALL">All Events</option>
              <option value="AUTH">Authentication Events</option>
              <option value="DOC">Document Downloads &amp; Uploads</option>
              <option value="CMS">CMS Mutations</option>
              <option value="ATTESTATION">Attestations</option>
            </select>
          </div>

          <button
            onClick={fetchLogs}
            className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-slate hover:text-gold border border-slate-200 px-4 py-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4 font-semibold">Timestamp (UTC)</th>
              <th className="py-3 px-4 font-semibold">Event Classification</th>
              <th className="py-3 px-4 font-semibold">Actor / Entity</th>
              <th className="py-3 px-4 font-semibold">IP Address</th>
              <th className="py-3 px-4 font-semibold">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                  {new Date(log.timestamp).toISOString().replace('T', ' ').substring(0, 19)}
                </td>
                <td className="py-3.5 px-4">{getActionBadge(log.action)}</td>
                <td className="py-3.5 px-4 font-sans">
                  {log.userEmail ? (
                    <div>
                      <div className="font-semibold text-navy text-xs">{log.userEmail}</div>
                      {log.userRole && <div className="text-[10px] text-gold uppercase">{log.userRole}</div>}
                    </div>
                  ) : (
                    <span className="text-slate-400">Anonymous / System</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-slate-600 font-bold">{log.ipAddress}</td>
                <td className="py-3.5 px-4 font-sans text-slate-700 text-xs">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditTrailViewer;
