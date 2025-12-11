import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api.js';
import Button from '../components/common/Button.jsx';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizzes: 0,
    activeClasses: 0,
    completionRate: 0,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) setUser(JSON.parse(userStr));

      const [statsRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        setUsers(users.filter(u => u.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-x-hidden">
      <div className="flex h-full w-full">
        {/* Sidebar */}
        <aside className="flex h-screen min-h-full flex-col justify-between bg-white dark:bg-[#182431] p-4 border-r border-gray-200 dark:border-gray-700 w-64 fixed">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3 px-3">
              <div className="bg-primary/20 text-primary flex items-center justify-center aspect-square rounded-full size-10">
                <span className="material-symbols-outlined text-2xl">quiz</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-[#111418] dark:text-white text-base font-medium">QuizPlatform</h1>
                <p className="text-[#777777] dark:text-gray-400 text-sm">Admin Panel</p>
              </div>
            </div>
            <nav className="flex flex-col gap-2">
              <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/20 text-primary" href="#dashboard">
                <span className="material-symbols-outlined text-2xl">dashboard</span>
                <p className="text-primary text-sm font-medium">Dashboard</p>
              </a>
              <a onClick={() => navigate('/admin/users')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-[#333333] dark:text-gray-300 cursor-pointer">
                <span className="material-symbols-outlined text-2xl">group</span>
                <p className="text-sm font-medium">Users</p>
              </a>
              <a onClick={() => navigate('/admin/quizzes')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-[#333333] dark:text-gray-300 cursor-pointer">
                <span className="material-symbols-outlined text-2xl">rule</span>
                <p className="text-sm font-medium">Quizzes</p>
              </a>
              <a onClick={() => navigate('/admin/classes')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-[#333333] dark:text-gray-300 cursor-pointer">
                <span className="material-symbols-outlined text-2xl">school</span>
                <p className="text-sm font-medium">Classes</p>
              </a>
              <a onClick={() => navigate('/admin/settings')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-[#333333] dark:text-gray-300 cursor-pointer">
                <span className="material-symbols-outlined text-2xl">settings</span>
                <p className="text-sm font-medium">Settings</p>
              </a>
            </nav>
          </div>
          <div className="flex flex-col gap-2 border-t border-gray-200 dark:border-gray-700 pt-4">
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-[#333333] dark:text-gray-300 cursor-pointer" href="#support">
              <span className="material-symbols-outlined text-2xl">help</span>
              <p className="text-sm font-medium">Support</p>
            </a>
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-[#333333] dark:text-gray-300 text-left w-full">
              <span className="material-symbols-outlined text-2xl">logout</span>
              <p className="text-sm font-medium">Logout</p>
            </button>
          </div>
        </aside>

        <main className="flex flex-col flex-1 ml-64">
          {/* Header */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-10 py-4 bg-white dark:bg-[#182431] sticky top-0 z-10">
            <div className="flex items-center gap-8">
              <h2 className="text-[#111418] dark:text-white text-lg font-bold">Dashboard</h2>
              <label className="flex flex-col min-w-40 !h-10 max-w-64">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  <div className="text-gray-500 dark:text-gray-400 flex bg-gray-100 dark:bg-gray-700 items-center justify-center pl-4 rounded-l-lg border-r-0">
                    <span className="material-symbols-outlined text-2xl">search</span>
                  </div>
                  <input className="form-input flex w-full min-w-0 flex-1 rounded-r-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-gray-100 dark:bg-gray-700 h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 pl-2 text-base" placeholder="Search..." />
                </div>
              </label>
            </div>
            <div className="flex flex-1 justify-end items-center gap-6">
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-gray-100 dark:bg-gray-700 text-[#111418] dark:text-white">
                <span className="material-symbols-outlined text-2xl">notifications</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: user?.avatar ? `url(${user.avatar})` : 'url(/assets/images/default-avatar.png)'}} />
                <div className="flex flex-col text-left">
                  <p className="text-[#111418] dark:text-white text-sm font-medium">{user?.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Administrator</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="p-10">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-[#182431] border border-gray-200 dark:border-gray-700">
                <p className="text-[#333333] dark:text-gray-300 text-base font-medium">Total Users</p>
                <p className="text-[#111418] dark:text-white text-3xl font-bold">{stats.totalUsers}</p>
                <p className="text-[#50E3C2] text-base font-medium">+5.4% this month</p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-[#182431] border border-gray-200 dark:border-gray-700">
                <p className="text-[#333333] dark:text-gray-300 text-base font-medium">Total Quizzes</p>
                <p className="text-[#111418] dark:text-white text-3xl font-bold">{stats.totalQuizzes}</p>
                <p className="text-[#50E3C2] text-base font-medium">+2.1% this month</p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-[#182431] border border-gray-200 dark:border-gray-700">
                <p className="text-[#333333] dark:text-gray-300 text-base font-medium">Active Classes</p>
                <p className="text-[#111418] dark:text-white text-3xl font-bold">{stats.activeClasses}</p>
                <p className="text-[#50E3C2] text-base font-medium">+10% this month</p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-[#182431] border border-gray-200 dark:border-gray-700">
                <p className="text-[#333333] dark:text-gray-300 text-base font-medium">Completion Rate</p>
                <p className="text-[#111418] dark:text-white text-3xl font-bold">{stats.completionRate}%</p>
                <p className="text-[#F5A623] text-base font-medium">-1.2% this month</p>
              </div>
            </div>

            {/* User Management Table */}
            <div className="mt-8">
              <div className="flex justify-between items-center pb-3 pt-5">
                <h2 className="text-[#111418] dark:text-white text-[22px] font-bold">Manage Users</h2>
                <Button onClick={() => navigate('/admin/users/new')} icon={<span className="material-symbols-outlined text-xl">add</span>}>
                  Add New User
                </Button>
              </div>
              <div className="overflow-x-auto bg-white dark:bg-[#182431] rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-[#333333] dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3">User ID</th>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Last Login</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((usr) => (
                      <tr key={usr.id} className="bg-white dark:bg-[#182431] border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-6 py-4">#{usr.id}</td>
                        <th className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{usr.name}</th>
                        <td className="px-6 py-4">{usr.email}</td>
                        <td className="px-6 py-4 capitalize">{usr.role}</td>
                        <td className="px-6 py-4">{new Date(usr.lastLogin).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded-full ${usr.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                            {usr.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button onClick={() => navigate(`/admin/users/${usr.id}/edit`)} className="text-primary hover:text-primary/80">
                            <span className="material-symbols-outlined text-xl">edit</span>
                          </button>
                          <button onClick={() => handleDeleteUser(usr.id)} className="text-red-500 hover:text-red-400">
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;