import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useGetStatisticsQuery, useGetDailyStatisticsQuery } from '@/services/statisticsService.ts';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Legend
);



const AdminDashboard = () => {
    const { data: statistics, isLoading: isStatsLoading } = useGetStatisticsQuery();
    const { data: dailyStats, isLoading: isDailyLoading } = useGetDailyStatisticsQuery();

    const isLoading = isStatsLoading || isDailyLoading;

    const stats = statistics ? [
        { label: "Користувачі", value: statistics.userCount.toLocaleString(), icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
        { label: "Аури", value: statistics.pinCount.toLocaleString(), icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
        { label: "Теги", value: statistics.tagCount.toLocaleString(), icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 10V5a2 2 0 012-2z" },
        { label: "Категорії", value: statistics.categoryCount.toLocaleString(), icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
    ] : [];

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#ffffff50', font: { size: 10 } }
            },
            y: {
                grid: { color: '#ffffff10' },
                ticks: { color: '#ffffff50', font: { size: 10 } },
                border: { display: false }
            }
        }
    };

    const lineChartData = dailyStats ? {
        labels: dailyStats.dailyUserCounts.map(d => {
            const date = new Date(d.date);
            return date.toLocaleDateString('uk-UA', { weekday: 'short' });
        }),
        datasets: [{
            data: dailyStats.dailyUserCounts.map(d => d.count),
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#6366f1',
            pointRadius: 3,
        }]
    } : null;

    const barChartData = dailyStats ? {
        labels: dailyStats.dailyPinCounts.map(d => {
            const date = new Date(d.date);
            return date.toLocaleDateString('uk-UA', { weekday: 'short' });
        }),
        datasets: [{
            data: dailyStats.dailyPinCounts.map(d => d.count),
            backgroundColor: '#6366f1',
            borderRadius: 4,
            barThickness: 24,
        }]
    } : null;

    return (
        <SkeletonTheme baseColor="#202020" highlightColor="#333333">
            <div className="relative z-10 w-full max-w-full overflow-hidden">
                <h1 className="text-xl sm:text-2xl font-bold tracking-[-0.5px] mb-1">Dashboard</h1>
                <p className="text-xs sm:text-sm text-white/30 mb-6 sm:mb-8 tracking-[-0.3px]">Загальна статистика</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
                    {isLoading
                        ? Array.from({ length: 4 }).map((_, idx) => (
                            <div key={idx} className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
                                <Skeleton circle width={36} height={36} />
                                <div>
                                    <Skeleton width={80} height={12} style={{ marginBottom: '6px', marginTop: '4px' }} />
                                    <Skeleton width={60} height={28} />
                                </div>
                            </div>
                        ))
                        : stats.map(({label, value, icon}) => (
                            <div key={label} className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 transition-transform hover:-translate-y-1 duration-200">
                                <div className="w-9 h-9 rounded-xl bg-btn-primary/10 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-btn-primary" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d={icon}/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white/40 text-xs tracking-[-0.2px] mb-1">{label}</p>
                                    <p className="text-2xl sm:text-3xl font-bold tracking-[-1px]">{value}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>

                <h2 className="text-xs sm:text-sm text-white/40 tracking-[-0.3px] mb-3 uppercase">Аналітика активності</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-4 sm:p-6 h-[280px] sm:h-[320px] flex flex-col">
                        <h3 className="text-white/80 text-sm font-medium tracking-[-0.2px] mb-4">Нові користувачі (за тиждень)</h3>
                        <div className="relative flex-1 w-full min-h-0">
                            {isDailyLoading || !lineChartData ? (
                                <Skeleton height="100%" borderRadius={8} />
                            ) : (
                                <Line options={commonOptions} data={lineChartData} />
                            )}
                        </div>
                    </div>

                    <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-4 sm:p-6 h-[280px] sm:h-[320px] flex flex-col">
                        <h3 className="text-white/80 text-sm font-medium tracking-[-0.2px] mb-4">Створені Аури (за тиждень)</h3>
                        <div className="relative flex-1 w-full min-h-0">
                            {isDailyLoading || !barChartData ? (
                                <Skeleton height="100%" borderRadius={8} />
                            ) : (
                                <Bar options={commonOptions} data={barChartData} />
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </SkeletonTheme>
    );
};

export default AdminDashboard;