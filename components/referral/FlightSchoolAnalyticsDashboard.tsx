import React, { useState, useEffect } from 'react';
import { supabase } from '../../shared/lib/supabase';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface FlightSchoolAnalyticsDashboardProps {
  flightSchoolId: string;
}

interface ReferralData {
  total_referrals: number;
  clicked_referrals: number;
  sign_ups: number;
  completed_signups: number;
  conversion_rate: number;
  total_commission: number;
  paid_commission: number;
  pending_commission: number;
}

interface PayoutSummary {
  total: number;
  pending: number;
  completed: number;
}

export const FlightSchoolAnalyticsDashboard: React.FC<FlightSchoolAnalyticsDashboardProps> = ({ flightSchoolId }) => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<ReferralData | null>(null);
  const [payoutSummary, setPayoutSummary] = useState<PayoutSummary | null>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [flightSchoolId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch referral analytics
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('referral_analytics')
        .select('*')
        .eq('flight_school_id', flightSchoolId)
        .order('period_start', { ascending: false })
        .limit(30);

      if (analyticsError) throw analyticsError;

      // Fetch payout summary
      const { data: payoutsData, error: payoutsError } = await supabase
        .from('payouts')
        .select('status, amount')
        .eq('flight_school_id', flightSchoolId);

      if (payoutsError) throw payoutsError;

      // Fetch referrals
      const { data: referralsData, error: referralsError } = await supabase
        .from('referrals')
        .select('*')
        .eq('flight_school_id', flightSchoolId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (referralsError) throw referralsError;

      // Calculate summary
      const totalPayouts = payoutsData?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
      const pendingPayouts = payoutsData?.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
      const completedPayouts = payoutsData?.filter(p => p.status === 'completed').reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;

      setPayoutSummary({
        total: totalPayouts,
        pending: pendingPayouts,
        completed: completedPayouts
      });

      // Aggregate analytics data
      const aggregatedAnalytics = analyticsData?.reduce((acc: any, curr) => {
        acc.total_referrals += curr.total_referrals;
        acc.clicked_referrals += curr.clicked_referrals;
        acc.sign_ups += curr.sign_ups;
        acc.completed_signups += curr.completed_signups;
        acc.total_commission += curr.total_commission;
        acc.paid_commission += curr.paid_commission;
        acc.pending_commission += curr.pending_commission;
        return acc;
      }, {
        total_referrals: 0,
        clicked_referrals: 0,
        sign_ups: 0,
        completed_signups: 0,
        conversion_rate: 0,
        total_commission: 0,
        paid_commission: 0,
        pending_commission: 0
      }) || null;

      if (aggregatedAnalytics && aggregatedAnalytics.sign_ups > 0) {
        aggregatedAnalytics.conversion_rate = (aggregatedAnalytics.completed_signups / aggregatedAnalytics.sign_ups) * 100;
      }

      setAnalytics(aggregatedAnalytics);
      setReferrals(referralsData || []);

    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const chartData = referrals.slice(0, 10).map(r => ({
    name: r.pilot_email.substring(0, 20) + '...',
    status: r.status,
    commission: parseFloat(r.commission_amount)
  }));

  const statusDistribution = [
    { name: 'Pending', value: referrals.filter(r => r.status === 'pending').length, color: '#8884d8' },
    { name: 'Clicked', value: referrals.filter(r => r.status === 'clicked').length, color: '#82ca9d' },
    { name: 'Signed Up', value: referrals.filter(r => r.status === 'signed_up').length, color: '#ffc658' },
    { name: 'Completed', value: referrals.filter(r => r.status === 'completed').length, color: '#ff7300' },
    { name: 'Paid', value: referrals.filter(r => r.status === 'paid').length, color: '#00c49f' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Referral Analytics Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Referrals"
          value={analytics?.total_referrals || 0}
          change="+12%"
          positive
        />
        <MetricCard
          title="Conversion Rate"
          value={`${analytics?.conversion_rate.toFixed(1) || 0}%`}
          change="+5%"
          positive
        />
        <MetricCard
          title="Total Commission"
          value={`$${analytics?.total_commission.toFixed(2) || 0}`}
          change="+$240"
          positive
        />
        <MetricCard
          title="Pending Payouts"
          value={`$${payoutSummary?.pending.toFixed(2) || 0}`}
          change="-$50"
          positive={false}
        />
      </div>

      {/* Commission Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Commission Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Eligible</span>
              <span className="font-semibold text-green-600">
                ${analytics?.pending_commission.toFixed(2) || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Paid</span>
              <span className="font-semibold text-blue-600">
                ${analytics?.paid_commission.toFixed(2) || 0}
              </span>
            </div>
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-gray-900 font-semibold">Total</span>
              <span className="font-bold text-xl">
                ${analytics?.total_commission.toFixed(2) || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Referral Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Referrals */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Referrals</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pilot Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {referrals.map((referral) => (
                <tr key={referral.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {referral.pilot_email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={referral.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${parseFloat(referral.commission_amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(referral.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change: string;
  positive: boolean;
}> = ({ title, value, change, positive }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      <p className={`text-sm mt-2 ${positive ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </p>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-800',
    clicked: 'bg-blue-100 text-blue-800',
    signed_up: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    paid: 'bg-purple-100 text-purple-800'
  };

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[status] || colors.pending}`}>
      {status}
    </span>
  );
};
