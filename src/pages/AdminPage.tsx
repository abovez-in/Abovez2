import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Users, Building, Calendar, Eye, RefreshCw, ArrowLeft, Clock, Search, Filter, CheckCircle2, AlertCircle, FileText, Activity, Laptop, MapPin, X, Link, Copy, Check, Lock, EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { User, EventItem, UserLog } from '../types';
import { AboveZLogo } from '../components/AboveZLogo';

export const AdminPage: React.FC = () => {
  const { setActiveTab } = useAuth();

  const [activeAdminTab, setActiveAdminTab] = useState<'logs' | 'crew' | 'handlers' | 'events' | 'audit'>('logs');
  const [copiedLink, setCopiedLink] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCrew: 0,
    totalHandlers: 0,
    totalEvents: 0,
    activeEvents: 0,
    totalApplications: 0,
    verifiedCrew: 0,
    pendingVerifications: 0,
    totalLogins: 0,
    totalWebsiteClicks: 0
  });

  const [loginLogs, setLoginLogs] = useState<UserLog[]>([]);
  const [crewList, setCrewList] = useState<User[]>([]);
  const [handlersList, setHandlersList] = useState<User[]>([]);
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingDoc, setViewingDoc] = useState<{ userName: string; docUrl: string } | null>(null);

  // Search & Filter state for Logged User Info
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [logRoleFilter, setLogRoleFilter] = useState<string>('all');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminDashboard();
      if (data.stats) setStats(data.stats);
      if (data.crewMembers) setCrewList(data.crewMembers);
      if (data.handlers) setHandlersList(data.handlers);
      if (data.events) setEventsList(data.events);
      
      const logs = await api.getAdminLoginLogs();
      setLoginLogs(logs || []);

      const audits = await api.getAdminAuditLogs();
      setAuditLogs(audits || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 15000); // Auto-refresh logs every 15s
    return () => clearInterval(interval);
  }, []);

  const handleVerifyCrewId = async (userId: string, currentStatus: boolean) => {
    try {
      await api.toggleVerifyCrewId(userId, !currentStatus);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update verification status.');
    }
  };

  // Filter login logs based on user query
  const filteredLogs = loginLogs.filter(log => {
    const matchesSearch =
      (log.userName || '').toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      (log.userEmail || '').toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      (log.userPhone || '').includes(logSearchQuery) ||
      (log.action || '').toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      (log.userCity || '').toLowerCase().includes(logSearchQuery.toLowerCase());

    const matchesRole = logRoleFilter === 'all' || log.userRole === logRoleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      
      {/* Top Operations Header Banner */}
      <section className="bg-slate-900 text-white py-5 px-4 border-b border-slate-800 sticky top-20 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            {/* BACK TO MAIN WEBSITE BUTTON */}
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-blue-600/30 group"
              title="Return to AboveZ Main Application"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Main Website</span>
            </button>

            <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <AboveZLogo size={52} />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-black text-white tracking-tight">AboveZ Operations Console</h1>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold text-[10px] rounded-full border border-emerald-500/30">
                    Database Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">User Login Logs, Database Records & Compliance Management</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl font-bold text-xs transition-all flex items-center gap-2 border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Secret Admin URL Banner & Direct Access Info */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-4 sm:p-5 text-white border border-slate-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-indigo-600/30 text-indigo-400 rounded-2xl border border-indigo-500/30 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-indigo-300 uppercase tracking-wider">Hidden Access Enabled</span>
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold rounded-full border border-indigo-500/30 flex items-center gap-1">
                  <EyeOff className="w-3 h-3" /> Hidden from Public
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Admin Panel navigation is hidden from public visitors. Access using administrator login credentials or secret bookmark URL.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 text-[11px] font-mono text-indigo-300 truncate max-w-xs select-all">
              {window.location.origin}/?admin=abovez
            </div>
            <button
              onClick={() => {
                const secretUrl = `${window.location.origin}/?admin=abovez`;
                navigator.clipboard.writeText(secretUrl);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 3000);
              }}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-md shadow-indigo-600/30"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copied!' : 'Copy Secret Link'}</span>
            </button>
          </div>
        </div>

        {/* Operations Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-3.5 rounded-2xl border border-indigo-700/50 shadow-md col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Website Visitors</span>
              <Eye className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">{stats.totalWebsiteClicks || 0}</div>
            <span className="text-[10px] text-indigo-300 font-semibold flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" /> Total Clicks & Views
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Logins</span>
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-blue-600 mt-1">{stats.totalLogins || loginLogs.length}</div>
            <span className="text-[10px] text-slate-400 font-semibold">With Date & Time</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
              <Users className="w-4 h-4 text-slate-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalUsers}</div>
            <span className="text-[10px] text-slate-400 font-semibold">{stats.totalCrew} Crew • {stats.totalHandlers} Handlers</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified Crew</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{stats.verifiedCrew}</div>
            <span className="text-[10px] text-emerald-600 font-semibold">ID Verified Badges</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending IDs</span>
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-600 mt-1">{stats.pendingVerifications}</div>
            <span className="text-[10px] text-amber-600 font-semibold">Requires Inspection</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Events</span>
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-purple-600 mt-1">{stats.activeEvents}</div>
            <span className="text-[10px] text-purple-600 font-semibold">Out of {stats.totalEvents} Total</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Applications</span>
              <Building className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-indigo-600 mt-1">{stats.totalApplications}</div>
            <span className="text-[10px] text-indigo-600 font-semibold">Crew Submissions</span>
          </div>
        </div>

        {/* Tab Selection Navigation Bar */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 flex flex-wrap gap-2 shadow-2xs">
          <button
            onClick={() => setActiveAdminTab('logs')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              activeAdminTab === 'logs'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Logged User Info & History ({loginLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('crew')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              activeAdminTab === 'crew'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Crew Members ({crewList.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('handlers')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              activeAdminTab === 'handlers'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Event Handlers ({handlersList.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('events')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              activeAdminTab === 'events'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Events Database ({eventsList.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('audit')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              activeAdminTab === 'audit'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Audit Logs ({auditLogs.length})</span>
          </button>
        </div>

        {/* TAB 1: LOGGED USER INFO & HISTORY WITH DATE & TIME */}
        {activeAdminTab === 'logs' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
            
            {/* Header & Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base font-black text-slate-900">Logged User Records & Activity History</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete breakdown of all user authentication logins, registrations, and actions with exact Date and Time.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search name, email, phone, action..."
                    value={logSearchQuery}
                    onChange={(e) => setLogSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-56"
                  />
                </div>

                <select
                  value={logRoleFilter}
                  onChange={(e) => setLogRoleFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="crew">Crew Members</option>
                  <option value="handler">Event Handlers</option>
                  <option value="admin">Administrators</option>
                </select>
              </div>
            </div>

            {/* Table of User Logs */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="p-3">User & Contact Info</th>
                    <th className="p-3">Role & Location</th>
                    <th className="p-3">Logged Activity / Event</th>
                    <th className="p-3">Exact Date</th>
                    <th className="p-3">Exact Time</th>
                    <th className="p-3">Device / IP</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="font-semibold text-slate-600">No user login logs recorded yet.</p>
                        <p className="text-[11px] text-slate-400 mt-1">Logs will appear automatically whenever users log in or perform actions.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* User Details */}
                        <td className="p-3">
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                              {(log.userName || 'U').charAt(0).toUpperCase()}
                            </div>
                            <span>{log.userName}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 ml-8">
                            {log.userEmail} • {log.userPhone}
                          </div>
                        </td>

                        {/* Role & Location */}
                        <td className="p-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider mb-1 ${
                            log.userRole === 'admin'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : log.userRole === 'handler'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}>
                            {log.userRole}
                          </span>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {log.userCity || 'Surat'}
                          </div>
                        </td>

                        {/* Logged Activity */}
                        <td className="p-3 font-semibold text-slate-800">
                          {log.action}
                        </td>

                        {/* Exact Date */}
                        <td className="p-3 font-mono font-bold text-slate-700">
                          <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" /> {log.date}</span>
                        </td>

                        {/* Exact Time */}
                        <td className="p-3 font-mono font-bold text-blue-600 bg-blue-50/50 rounded-lg">
                          <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3 text-blue-500" /> {log.time}</span>
                        </td>

                        {/* Client Info */}
                        <td className="p-3 text-[11px] text-slate-500">
                          <div className="font-mono text-slate-600">{log.ip}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{log.userAgent}</div>
                        </td>

                        {/* Status */}
                        <td className="p-3 text-right">
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-full inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                            RECORDED
                          </span>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: CREW MEMBERS LIST */}
        {activeAdminTab === 'crew' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-slate-800 text-xs uppercase tracking-wider flex justify-between items-center">
              <span>Crew Members List & Identity Document Verification</span>
              <span className="text-slate-400">{crewList.length} Total Registered</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="p-3">Name & Contact</th>
                    <th className="p-3">Location & Skills</th>
                    <th className="p-3">ID Verification Document</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {crewList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400">
                        No registered crew members yet.
                      </td>
                    </tr>
                  ) : (
                    crewList.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{c.name}</div>
                          <div className="text-[11px] text-slate-500">{c.email} • {c.phone}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-700">{c.address || 'Surat'}, {c.city || 'Surat'}</div>
                          <div className="text-[10px] text-slate-500 line-clamp-1">
                            {c.skills?.join(', ')}
                          </div>
                        </td>
                        <td className="p-3">
                          {c.idDocumentUrl ? (
                            <button
                              onClick={() => setViewingDoc({ userName: c.name, docUrl: c.idDocumentUrl! })}
                              className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold text-[11px] inline-flex items-center gap-1 border border-blue-200"
                            >
                              <Eye className="w-3 h-3 text-blue-600" /> Inspect Document
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">No Document Uploaded</span>
                          )}
                        </td>
                        <td className="p-3">
                          {c.idVerified ? (
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full inline-flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" /> VERIFIED
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded-full">
                              PENDING ID
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleVerifyCrewId(c.id, !!c.idVerified)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all ${
                              c.idVerified
                                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                            }`}
                          >
                            {c.idVerified ? 'Revoke Verification' : 'Approve & Mark Verified'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: EVENT HANDLERS */}
        {activeAdminTab === 'handlers' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-slate-800 text-xs uppercase tracking-wider flex justify-between items-center">
              <span>Registered Event Handlers & Agencies</span>
              <span className="text-slate-400">{handlersList.length} Total Agencies</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="p-3">Organizer Name</th>
                    <th className="p-3">Agency / Company</th>
                    <th className="p-3">Contact Email & Mobile</th>
                    <th className="p-3">City Location</th>
                    <th className="p-3 text-right">Subscription Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {handlersList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400">
                        No event handlers registered yet.
                      </td>
                    </tr>
                  ) : (
                    handlersList.map(h => (
                      <tr key={h.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-900">{h.name}</td>
                        <td className="p-3 font-semibold text-blue-600">{h.companyName || 'Independent Organizer'}</td>
                        <td className="p-3 text-slate-600">{h.email} • {h.phone}</td>
                        <td className="p-3 text-slate-600">{h.city || 'Surat'}</td>
                        <td className="p-3 text-right">
                          <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 font-bold text-[10px] rounded-full inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-blue-600" /> ACTIVE PLAN
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PUBLISHED EVENTS */}
        {activeAdminTab === 'events' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-slate-800 text-xs uppercase tracking-wider flex justify-between items-center">
              <span>AboveZ Platform Published Events Database</span>
              <span className="text-slate-400">{eventsList.length} Total Events</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="p-3">Event Title & Category</th>
                    <th className="p-3">Date & Time</th>
                    <th className="p-3">Location Address</th>
                    <th className="p-3">Pay Rate</th>
                    <th className="p-3">Crew Progress</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {eventsList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400">
                        No events published yet.
                      </td>
                    </tr>
                  ) : (
                    eventsList.map(e => (
                      <tr key={e.id} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{e.title}</div>
                          <div className="text-[10px] text-blue-600 font-semibold">{e.category}</div>
                        </td>
                        <td className="p-3 text-slate-600">
                          <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" /> {e.eventDate} ({e.startTime})</span>
                        </td>
                        <td className="p-3 text-slate-600">
                          <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {e.area}, {e.city}</span>
                        </td>
                        <td className="p-3 font-bold text-slate-900">₹{e.payPerPerson}/person</td>
                        <td className="p-3 font-semibold text-blue-600">
                          {e.approvedCrewCount} / {e.totalCrewNeeded} Selected
                        </td>
                        <td className="p-3 text-right">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                            {e.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: SYSTEM AUDIT LOGS */}
        {activeAdminTab === 'audit' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-slate-800 text-xs uppercase tracking-wider">
              System Audit Records & Compliance Logs
            </div>

            <div className="divide-y divide-slate-100">
              {auditLogs.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No system audit logs recorded.
                </div>
              ) : (
                auditLogs.map((a: any) => (
                  <div key={a.id} className="p-3.5 text-xs flex items-center justify-between hover:bg-slate-50/50">
                    <div>
                      <span className="font-bold text-slate-900">{a.action}</span>
                      <div className="text-[10px] text-slate-500 mt-0.5">Admin: {a.adminEmail}</div>
                    </div>
                    <div className="font-mono text-[10px] text-slate-400">
                      {new Date(a.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* Identity Document Inspection Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setViewingDoc(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">AboveZ Compliance Inspection</span>
              <h3 className="text-xl font-black text-slate-900">{viewingDoc.userName}</h3>
            </div>

            <div className="p-2 bg-slate-100 rounded-2xl border border-slate-200">
              <img
                src={viewingDoc.docUrl}
                alt="Government ID"
                className="w-full h-auto max-h-80 object-contain rounded-xl"
              />
            </div>

            <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Privacy Protected Document • Viewable only by AboveZ compliance administrators.</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
