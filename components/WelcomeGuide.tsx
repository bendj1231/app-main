import React from 'react';
import { LayoutGrid, FileText, LineChart, BookOpen, ArrowRight, HelpCircle, Award, Target, Users } from 'lucide-react';
import { View } from '../types';

interface WelcomeGuideProps {
  onNavigate: (view: View) => void;
}

const WelcomeGuide: React.FC<WelcomeGuideProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sky-700 to-sky-900 rounded-2xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-block px-3 py-1 bg-sky-600/50 rounded-full text-sky-100 text-sm font-semibold mb-4 border border-sky-500/50">
            About WingMentor
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Don't let your investment crash. <br/>
            <span className="text-sky-300">Build the experience that gets you hired.</span>
          </h1>
          <p className="text-sky-100 text-lg md:text-xl leading-relaxed opacity-90">
            We bridge the gap between graduation and your career.
          </p>
        </div>
        {/* Decorative background element */}
        <div className="absolute -right-20 -bottom-40 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* The Story / Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-7 space-y-6 text-slate-600 leading-relaxed text-lg">
          <p>
            The day you graduate with a commercial pilot license is the proudest day within your pilot career. You spent $50,000 to get here. You finally earned your wings.
          </p>
          <p>
            But the industry has a different story. Thousands of resumes. Same license. Same hours. <strong className="text-slate-800">On paper? You look exactly like everyone else.</strong>
          </p>
          <p>
            We know how hard it is to explain to your family that despite the degree and the investment... you are still "under-qualified." Being a “Low Timer pilot“ in the aviation industry is hard to start. They see your degree and hours, but you see a waiting list or a phone call in 2 years' time.
          </p>
          <div className="bg-sky-50 border-l-4 border-sky-600 p-6 my-8 rounded-r-xl">
             <h3 className="text-sky-800 font-bold text-xl mb-2">Our Mission</h3>
             <p className="text-sky-700 font-medium italic">
               "We could not standby and observe many pilots give up. The gap in the industry isn’t just a lack of talent, it’s a lack of opportunity to start building experience."
             </p>
          </div>
          <p>
            Introducing <strong className="text-sky-600">WingMentor</strong>. This isn't just practical training; it is an experience of one-to-one CRM skills through consultation and support. It is a program where you become a mentor, preparing others with assessment skills and supporting fellow pilots under our supervision.
          </p>
          <p>
            You differentiate yourself from a traditional instructor by developing critical thinking and error assessment skills. So when you sit in an interview for your first Instructor job, you don't just say "I have a license and Hours.” In confidence, you will say:
          </p>
          <p className="font-bold text-slate-800 text-xl">
            "I have hands-on experience identifying pilot errors and guiding them to solutions."
          </p>
          <p>
            You aren't just a pilot with a standard license and hours anymore. You are prepared for a career ahead in your future.
          </p>
        </div>

        {/* Feature Highlights Sidebar */}
        <div className="md:col-span-5 space-y-6">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <div className="flex items-center space-x-3 mb-4 text-sky-600">
               <Target size={24} />
               <h3 className="font-bold text-slate-800 text-lg">CRM Skills</h3>
             </div>
             <p className="text-slate-600">Master Crew Resource Management through real consultation scenarios.</p>
           </div>
           
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <div className="flex items-center space-x-3 mb-4 text-emerald-600">
               <Users size={24} />
               <h3 className="font-bold text-slate-800 text-lg">Mentorship</h3>
             </div>
             <p className="text-slate-600">Become a mentor. Support fellow pilots and build leadership experience.</p>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <div className="flex items-center space-x-3 mb-4 text-amber-600">
               <Award size={24} />
               <h3 className="font-bold text-slate-800 text-lg">Career Ready</h3>
             </div>
             <p className="text-slate-600">Develop the critical thinking and error assessment skills airlines hire for.</p>
           </div>
        </div>
      </div>

      <div className="border-t border-slate-200 my-8"></div>

      {/* User Guide Section */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Platform User Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Apps & Tools */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-sky-300 transition-all group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-sky-100 text-sky-600 rounded-lg group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <LayoutGrid size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Apps & Tools</h2>
            </div>
            <p className="text-slate-600 mb-4 min-h-[48px]">
              Access our suite of integrated applications including flight planners, weather services, and checklist tools.
            </p>
            <button 
              onClick={() => onNavigate(View.PILOT_APPS)}
              className="mt-2 flex items-center space-x-2 text-sky-600 font-semibold hover:text-sky-700 hover:underline"
            >
              <span>Go to Pilot Apps Directory</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Logs & Verification */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-sky-300 transition-all group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <FileText size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Program Logs</h2>
            </div>
            <p className="text-slate-600 mb-4 min-h-[48px]">
              Track your sessions. Entries marked as "WingMentor Member" are sent for verification to validate your experience.
            </p>
            <button 
               onClick={() => onNavigate(View.LOGS)}
               className="mt-2 flex items-center space-x-2 text-emerald-600 font-semibold hover:text-emerald-700 hover:underline"
            >
              <span>Manage Logs</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Performance Tracking */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-sky-300 transition-all group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <LineChart size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Performance Tracking</h2>
            </div>
            <p className="text-slate-600 mb-4">
              Visualize your progress. The Dashboard offers a quick snapshot, while the Progress view provides detailed analytics.
            </p>
            <button 
               onClick={() => onNavigate(View.PROGRESS)}
               className="mt-auto flex items-center space-x-2 text-indigo-600 font-semibold hover:text-indigo-700 hover:underline"
            >
              <span>View Progress Report</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Operating Handbook */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-sky-300 transition-all group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <BookOpen size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Operating Handbook</h2>
            </div>
            <p className="text-slate-600 mb-4">
              Your central repository for all standard operating procedures (SOPs), emergency checklists, and aircraft performance data.
            </p>
            <button 
               onClick={() => onNavigate(View.HANDBOOK)}
               className="mt-auto flex items-center space-x-2 text-amber-600 font-semibold hover:text-amber-700 hover:underline"
            >
              <span>Open Handbook</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Support Info */}
      <div className="bg-slate-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between border border-slate-200">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="p-3 bg-white rounded-full text-slate-500 shadow-sm">
             <HelpCircle size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Need additional help?</h3>
            <p className="text-sm text-slate-500">Our support team is available 24/7 for technical issues.</p>
          </div>
        </div>
        <button 
          onClick={() => onNavigate(View.CONTACT)}
          className="px-6 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default WelcomeGuide;