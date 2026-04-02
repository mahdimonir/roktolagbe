'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Suspense, useEffect } from 'react';

// Shared Layout
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';

// Admin Components
import AdminOverview from './(admin)';
import AdminUsers from './(admin)/users';
import AdminRequests from './(admin)/requests';
import AdminOrganizations from './(admin)/organizations';
import AdminBadges from './(admin)/badges';
import AdminSettings from './(admin)/settings';
import AdminAnalytics from './(admin)/analytics';
import AdminDonations from './(admin)/donations';
import AdminAuditLogs from './(admin)/audit-logs';

// Manager Components
import ManagerOverview from './(manager)';
import ManagerInventory from './(manager)/inventory';
import ManagerRequests from './(manager)/requests';
import ManagerNewRequest from './(manager)/requests/NewRequest';
import ManagerProfile from './(manager)/profile';
import ManagerDonors from './(manager)/donors';
import ManagerVerify from './(manager)/verify';

// Donor Components
import DonorOverview from './(donor)';
import DonorHistory from './(donor)/history';
import DonorLogDonation from './(donor)/log-donation';
import DonorProfile from './(donor)/profile';
import DonorSettings from './(donor)/settings';
import DonorHospitalDiscovery from './(donor)/hubs';
import DonorRewards from './(donor)/rewards';

function DashboardContent() {
  const { user, isAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get('tab');

  useEffect(() => {
    // If we're fully mounted and definitely NOT authenticated
    if (!isAuthenticated && typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Determine which component to mount based on role and tab
  let ContentToRender = DonorOverview; // Default fallback

  if (user.role === 'ADMIN') {
    ContentToRender = AdminOverview;
    if (tab === 'users') ContentToRender = AdminUsers;
    else if (tab === 'requests') ContentToRender = AdminRequests;
    else if (tab === 'organizations') ContentToRender = AdminOrganizations;
    else if (tab === 'badges') ContentToRender = AdminBadges;
    else if (tab === 'settings') ContentToRender = AdminSettings;
    else if (tab === 'analytics') ContentToRender = AdminAnalytics;
    else if (tab === 'donations') ContentToRender = AdminDonations;
    else if (tab === 'audit-logs') ContentToRender = AdminAuditLogs;
  } 
  else if (user.role === 'MANAGER') {
    ContentToRender = ManagerOverview;
    if (tab === 'inventory') ContentToRender = ManagerInventory;
    else if (tab === 'requests') ContentToRender = ManagerRequests;
    else if (tab === 'requests-new') ContentToRender = ManagerNewRequest;
    else if (tab === 'profile') ContentToRender = ManagerProfile;
    else if (tab === 'donors') ContentToRender = ManagerDonors;
    else if (tab === 'verify') ContentToRender = ManagerVerify;
  }
  else if (user.role === 'DONOR') {
    ContentToRender = DonorOverview;
    if (tab === 'history') ContentToRender = DonorHistory;
    else if (tab === 'log-donation') ContentToRender = DonorLogDonation;
    else if (tab === 'profile') ContentToRender = DonorProfile;
    else if (tab === 'settings') ContentToRender = DonorSettings;
    else if (tab === 'hospitals') ContentToRender = DonorHospitalDiscovery;
    else if (tab === 'rewards') ContentToRender = DonorRewards;
  }

  // Wrap everything inside our brand new responsive DashboardLayout
  return (
    <DashboardLayout>
      <ContentToRender />
    </DashboardLayout>
  );
}

export default function DynamicDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
