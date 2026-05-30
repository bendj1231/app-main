'use client';

import { Shield, UserCheck, Building2, X } from 'lucide-react';

export default function TheTriad() {
  const triadMembers = [
    {
      icon: Shield,
      name: 'Insurance Underwriter',
      vote: 'Risk Assessment',
      concern: 'This pilot will cost us more in premiums',
      color: 'bg-red-600',
    },
    {
      icon: UserCheck,
      name: 'Airline Recruiter',
      vote: 'Hiring Decision',
      concern: 'We need 1,500 hours for our metrics',
      color: 'bg-orange-500',
    },
    {
      icon: Building2,
      name: 'Governing Body',
      vote: 'Regulatory Approval',
      concern: 'Rules say 1,500, not our problem',
      color: 'bg-yellow-500',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#1e3a5f]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">The Triad</h2>
            <p className="text-xl text-gray-300">Who actually controls your career</p>
          </div>

          {/* Three Vote System */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {triadMembers.map((member, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <div
                  className={`w-12 h-12 ${member.color} rounded-lg flex items-center justify-center mb-4`}
                >
                  <member.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <div className="text-[#c41e3a] font-bold text-sm uppercase tracking-wider mb-3">
                  {member.vote}
                </div>
                <p className="text-gray-300 text-sm italic">"{member.concern}"</p>
              </div>
            ))}
          </div>

          {/* The Result */}
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex -space-x-2">
                {triadMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className={`w-10 h-10 ${member.color} rounded-full flex items-center justify-center border-2 border-white`}
                  >
                    <member.icon className="w-5 h-5 text-white" />
                  </div>
                ))}
              </div>
              <X className="w-8 h-8 text-red-600" />
            </div>

            <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4">
              Even With An A320 Type Rating
            </h3>
            <p className="text-gray-600 text-lg mb-4">
              Even with perfect training. Even with <strong>Airbus saying you're qualified</strong>.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 inline-block">
              <p className="text-red-800 font-bold text-xl">The Triad Labels You "High Risk"</p>
            </div>
          </div>

          {/* Bottom Quote */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-lg">All three must say YES. One NO = Rejection.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
