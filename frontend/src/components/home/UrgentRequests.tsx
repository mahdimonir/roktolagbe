import { Activity, ArrowRight, MapPin, Zap, Clock } from 'lucide-react';
import Link from 'next/link';

interface UrgentRequestsProps {
   displayRequests: any[];
}

export default function UrgentRequests({ displayRequests }: UrgentRequestsProps) {
   return (
      <section className="py-12 md:py-16 italic bg-gray-50/30 dark:bg-transparent">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-10 text-center md:text-left">
               <div className="space-y-3">
                  <p className="text-red-600 font-black text-[11px] uppercase tracking-[0.5em] leading-none italic">Emergency Dashboard</p>
                  <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">
                     Urgent <span className="text-red-600 italic">Needs</span>
                  </h2>
               </div>
               <Link href="/urgent-requests" className="w-full sm:w-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-4 group shadow-xl hover:bg-red-600 transition-all active:scale-95 italic">
                  Explore Live Feed <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
               </Link>
            </div>

            {displayRequests.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {displayRequests.map((request: any, i: number) => {
                     const confirmed = request.donations?.filter((d: any) => d.status === 'VERIFIED').length || 0;
                     const progress = Math.min(100, (confirmed / (request.units || 1)) * 100);
                     const deadlineDate = new Date(request.deadline);
                     const isExpired = deadlineDate < new Date();

                     return (
                        <div
                           key={request.id}
                           className={`p-6 rounded-2xl relative overflow-hidden transition-all duration-500 hover:-translate-y-2 group border dark:backdrop-blur-xl ${
                             request.isEmergency || request.urgency === 'EMERGENCY'
                               ? 'border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5'
                               : 'border-gray-100 dark:border-white/6 bg-white dark:bg-white/[0.03]'
                           } hover:shadow-2xl dark:hover:shadow-black/40 shadow-sm`}
                           style={{ animationDelay: `${i * 80}ms` }}
                        >
                           {/* Emergency Badge */}
                           {(request.urgency === 'EMERGENCY' || request.isEmergency) && (
                           <div className="absolute top-0 right-0 bg-red-600 text-white text-[8px] uppercase font-black px-4 py-1.5 rounded-bl-xl tracking-widest shadow-lg z-10 italic flex items-center gap-1.5">
                              <Zap size={10} /> Emergency
                           </div>
                           )}

                           {/* Top Row: Blood Group Badge + Location */}
                           <div className="flex items-start gap-4 mb-5">
                             <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 transition-all shadow-lg ${
                               request.isEmergency 
                                 ? 'bg-red-600 text-white shadow-red-600/30' 
                                 : 'bg-red-50 dark:bg-red-500/10 text-red-600 border-2 border-red-100 dark:border-red-500/20 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-500'
                             }`}>
                                <p className="text-2xl font-black italic tracking-tighter leading-none">{request.bloodGroup.replace('_POS', '+').replace('_NEG', '-')}</p>
                                <span className="text-[7px] font-black uppercase tracking-widest opacity-60 italic">Group</span>
                             </div>
                             <div className="min-w-0 flex-1 pt-1">
                                <h3 className="font-black text-base italic uppercase tracking-tight text-gray-900 dark:text-white leading-tight group-hover:text-red-600 transition-colors truncate">
                                   {request.hospitalName || 'Hospital Center'}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-1.5">
                                   <MapPin size={12} className="text-red-500 shrink-0" />
                                   <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider italic leading-none truncate">
                                     {request.thana ? `${request.thana}, ` : ''}{request.district}
                                   </p>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1">
                                   <Clock size={12} className={`shrink-0 ${isExpired ? 'text-gray-400' : 'text-blue-500'}`} />
                                   <p className={`text-[10px] font-bold uppercase tracking-wider italic leading-none ${isExpired ? 'text-gray-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                      {isExpired ? 'Expired' : deadlineDate.toLocaleDateString()}
                                   </p>
                                </div>
                             </div>
                           </div>

                           {/* Patient Info */}
                           {request.patientName && (
                             <div className="mb-4 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Patient</p>
                               <p className="text-sm font-black text-gray-900 dark:text-white italic truncate">{request.patientName}</p>
                             </div>
                           )}

                           {/* Details: Condition + Hemoglobin */}
                           <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5 text-center">
                                 <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Condition</p>
                                 <p className="text-[11px] font-black text-red-600 italic leading-tight truncate">{request.patientCondition || 'Emergency'}</p>
                              </div>
                              <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5 text-center">
                                 <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Hemoglobin</p>
                                 <p className="text-[11px] font-black text-blue-600 dark:text-blue-400 italic leading-tight">{request.hemoglobin ? `${request.hemoglobin} g/dL` : 'N/A'}</p>
                              </div>
                           </div>

                           {/* Donation Progress */}
                           <div className="mb-5 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest italic mb-2">
                                 <span className="text-gray-400">Progress</span>
                                 <span className="text-gray-900 dark:text-white font-mono">{confirmed}/{request.units} UNITS</span>
                              </div>
                              <div className="h-2 w-full bg-white dark:bg-white/10 rounded-full overflow-hidden border border-gray-100 dark:border-white/5">
                                 <div 
                                    className="h-full bg-red-600 rounded-full transition-all duration-1000"
                                    style={{ width: `${progress}%` }}
                                 />
                              </div>
                           </div>

                           <Link
                              href={`/urgent-requests/${request.id}`}
                              className={`block w-full text-center py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 italic flex items-center justify-center gap-3 ${
                                request.isEmergency 
                                  ? 'bg-red-600 text-white hover:bg-red-700' 
                                  : 'bg-gray-900 dark:bg-white/10 text-white hover:bg-red-600 dark:hover:bg-red-600'
                              }`}
                           >
                              Respond Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                           </Link>
                        </div>
                     );
                  })}
               </div>
            ) : (
               <div className="w-full bg-[#FBFAFA] dark:bg-white/[0.02] rounded-[3.5rem] p-12 md:p-24 border-4 border-dashed border-gray-100 dark:border-white/10 text-center space-y-8">
                  <Activity className="w-20 h-20 text-gray-200 dark:text-gray-600 mx-auto" />
                  <h3 className="text-3xl font-black text-gray-200 dark:text-gray-600 uppercase italic">On Standby.</h3>
                  <p className="text-gray-400 italic max-w-xl mx-auto">No urgent requests at the moment. Our network is in its stable, life-saving state.</p>
               </div>
            )}
         </div>
      </section>
   );
}
