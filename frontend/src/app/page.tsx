'use client';

import CTASection from '@/components/common/CTASection';
import AwarenessCampaigns from '@/components/home/AwarenessCampaigns';
import FAQSection from '@/components/home/FAQSection';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import ImpactWall from '@/components/home/ImpactWall';
import CommunityTrust from '@/components/home/CommunityTrust';
import Stats from '@/components/home/Stats';
import Testimonials from '@/components/home/Testimonials';
import ThalassemiaAwareness from '@/components/home/ThalassemiaAwareness';
import UrgentRequests from '@/components/home/UrgentRequests';
import WhyDonate from '@/components/home/WhyDonate';
import { api } from '@/lib/api/axios';
import { useQuery } from '@tanstack/react-query';
import {
   Activity,
   Award,
   HeartPulse,
   Hospital,
   Target,
   UserPlus,
   Users
} from 'lucide-react';

export default function Home() {
   // 1. Fetch Stats
   const { data: statsData } = useQuery({
      queryKey: ['public-stats'],
      queryFn: async () => {
         const res: any = await api.get('/public/stats');
         return (res as any)?.data;
      }
   });

   // 2. Fetch Urgent Requests
   const { data: urgentResponse } = useQuery({
      queryKey: ['urgent-requests'],
      queryFn: async () => {
         const res: any = await api.get('/blood-requests?limit=4');
         return (res as any)?.data;
      }
   });

   const stats = [
      { label: 'Verified Donors', value: statsData?.totalDonors?.toLocaleString() || '1,500', icon: <Users className="w-6 h-6 text-red-600" /> },
      { label: 'Active Requests', value: statsData?.urgentRequests?.toLocaleString() || '42', icon: <Activity className="w-6 h-6 text-red-600" /> },
      { label: 'Lives Saved', value: statsData?.livesSaved?.toLocaleString() || '890', icon: <HeartPulse className="w-6 h-6 text-red-600" /> },
      { label: 'Partner Hospitals', value: statsData?.partnerHospitals?.toLocaleString() || '12', icon: <Hospital className="w-6 h-6 text-red-600" /> },
   ];

   const steps = [
      {
         title: 'Quick Register',
         titleBn: 'নিবন্ধন করুন',
         desc: 'Sign up as a donor and join our life-saving community in seconds.',
         icon: <UserPlus className="w-10 h-10" />
      },
      {
         title: 'Find Matches',
         titleBn: 'খুঁজুন বা পোস্ট করুন',
         desc: 'Search for blood donors or post an emergency request near your location.',
         icon: <Target className="w-10 h-10" />
      },
      {
         title: 'Connect Instantly',
         titleBn: 'সংযুক্ত হোন',
         desc: 'Directly contact donors or hospitals to coordinate blood collection.',
         icon: <Activity className="w-10 h-10" />
      },
      {
         title: 'Save a Life',
         titleBn: 'জীবন বাঁচান',
         desc: 'Complete the donation, earn badges, and make a real-world impact.',
         icon: <Award className="w-10 h-10" />
      },
   ];

   const displayRequests = urgentResponse || [];

   return (
      <main className="min-h-screen bg-white dark:bg-[#0a0a0d] pb-12 md:pb-16 italic font-black text-gray-900 dark:text-gray-100 overflow-x-hidden transition-colors duration-500">
         <Hero />
         <UrgentRequests displayRequests={displayRequests} />
         <Stats stats={stats} />
         <HowItWorks steps={steps} />
         <ThalassemiaAwareness />
         <AwarenessCampaigns />
         <WhyDonate />
         <ImpactWall />
         <Testimonials />
         <FAQSection />
         <CommunityTrust />
         
         <CTASection 
            title="THE PULSE OF HOPE."
            subtitle="Join thousands of heroes today. Your simple act of kindness ensures that the pulse of life never stops for someone in need."
            primaryBtnText="BECOME A DONOR"
            primaryBtnLink="/register"
            secondaryBtnText="REQUEST SUPPORT"
            secondaryBtnLink="/urgent-requests"
         />
      </main>
   );
}
