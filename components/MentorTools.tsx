import React from 'react';
import { Users, FileCheck, Calendar, ClipboardList, PenTool, TrendingUp, AlertCircle } from 'lucide-react';

const MentorTools: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-slate-800">Mentor Productivity Tools</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
             <p className="text-slate-500 text-xs uppercase font-semibold">Active Students</p>
             <h3 className="text-2xl font-bold text-slate-800">12</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <FileCheck size={24} />
          </div>
          <div>
             <p className="text-slate-500 text-xs uppercase font-semibold">Endorsements Given</p>
             <h3 className="text-2xl font-bold text-slate-800">8</h3>
          </div>
        </div>
         <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <AlertCircle size={24} />
          </div>
          <div>
             <p className="text-slate-500 text-xs uppercase font-semibold">Pending Reviews</p>
             <h3 className="text-2xl font-bold text-slate-800">3</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tools List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-800">Instructor Toolkit</h3>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
             <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
               <div className="flex items-center space-x-4">
                 <div className="bg-slate-100 p-2 rounded-lg text-slate-600 group-hover:text-sky-600 group-hover:bg-sky-50 transition-colors"><ClipboardList size={20} /></div>
                 <div>
                   <h4 className="font-semibold text-slate-800">Lesson Plan Generator</h4>
                   <p className="text-xs text-slate-500">Create standardized flight lesson plans</p>
                 </div>
               </div>
               <button className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full group-hover:bg-sky-600 group-hover:text-white transition-colors">Open</button>
             </div>

             <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
               <div className="flex items-center space-x-4">
                 <div className="bg-slate-100 p-2 rounded-lg text-slate-600 group-hover:text-sky-600 group-hover:bg-sky-50 transition-colors"><PenTool size={20} /></div>
                 <div>
                   <h4 className="font-semibold text-slate-800">Endorsement Wizard</h4>
                   <p className="text-xs text-slate-500">Generate AC 61-65H compliant endorsements</p>
                 </div>
               </div>
               <button className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full group-hover:bg-sky-600 group-hover:text-white transition-colors">Open</button>
             </div>

             <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
               <div className="flex items-center space-x-4">
                 <div className="bg-slate-100 p-2 rounded-lg text-slate-600 group-hover:text-sky-600 group-hover:bg-sky-50 transition-colors"><TrendingUp size={20} /></div>
                 <div>
                   <h4 className="font-semibold text-slate-800">Student Progress Analyzer</h4>
                   <p className="text-xs text-slate-500">Visual analytics for student performance</p>
                 </div>
               </div>
               <button className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full group-hover:bg-sky-600 group-hover:text-white transition-colors">Open</button>
             </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-slate-800">Today's Schedule</h3>
             <Calendar size={18} className="text-slate-400" />
           </div>
           
           <div className="space-y-4">
             <div className="border-l-2 border-sky-500 pl-3 py-1">
               <p className="text-xs text-slate-400 font-medium">09:00 - 11:00</p>
               <p className="text-sm font-semibold text-slate-800">Pre-Solo Check</p>
               <p className="text-xs text-slate-500">Student: Alex Richardson</p>
             </div>
             
             <div className="border-l-2 border-green-500 pl-3 py-1">
               <p className="text-xs text-slate-400 font-medium">13:00 - 14:30</p>
               <p className="text-sm font-semibold text-slate-800">Ground School: Weather</p>
               <p className="text-xs text-slate-500">Classroom B</p>
             </div>

             <div className="border-l-2 border-slate-300 pl-3 py-1">
               <p className="text-xs text-slate-400 font-medium">15:00 - 16:30</p>
               <p className="text-sm font-semibold text-slate-800">Admin / Office Hours</p>
               <p className="text-xs text-slate-500">Flight Center</p>
             </div>
           </div>
           
           <button className="w-full mt-6 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
             View Full Calendar
           </button>
        </div>
      </div>
    </div>
  );
};

export default MentorTools;