import React, { useEffect, useState } from 'react';
import { Briefcase, Boxes, Users, FileSpreadsheet, ListTodo, MoveRight } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
} from 'recharts';
import api from '../utils/api';

type NamedCount = { name: string; v: number };

const CHART_FILL = ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'];

const axisTick = { fill: '#64748b', fontSize: 11 };

/** Normalize list endpoints: body may be a raw array or wrapped as { data: [...] }. */
const extractList = (res: { data?: unknown } | undefined): Record<string, unknown>[] => {
  if (!res?.data) return [];
  const d = res.data;
  if (Array.isArray(d)) return d as Record<string, unknown>[];
  if (typeof d === 'object' && d !== null && 'data' in d && Array.isArray((d as { data: unknown }).data)) {
    return (d as { data: Record<string, unknown>[] }).data;
  }
  return [];
};

const logRejected = (label: string, r: PromiseSettledResult<unknown>) => {
  if (r.status === 'rejected') {
    const err = r.reason as { message?: string; response?: { status?: number; data?: unknown } };
    console.warn(`[Dashboard] ${label} failed:`, err?.message, err?.response?.status, err?.response?.data);
  }
};

const formatStatusLabel = (raw: string) =>
  raw
    .replace(/[-_]/g, ' ')
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

function aggregateTaskStatus(tasks: Record<string, unknown>[]): NamedCount[] {
  const map = new Map<string, number>();
  for (const t of tasks) {
    const raw = String(t.taskStatus ?? 'Unknown').trim() || 'Unknown';
    map.set(raw, (map.get(raw) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([name, v]) => ({ name: formatStatusLabel(name), v }))
    .sort((a, b) => b.v - a.v);
}

function prsLastSixMonths(prs: Record<string, unknown>[]): NamedCount[] {
  const now = new Date();
  const rows: NamedCount[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mo = d.toLocaleString('en', { month: 'short' });
    const yr = String(d.getFullYear()).slice(-2);
    const label = `${mo} '${yr}`;
    const y = d.getFullYear();
    const m = d.getMonth();
    let v = 0;
    for (const p of prs) {
      const raw = p.createdAt ?? p.requestDate;
      if (!raw) continue;
      const c = new Date(String(raw));
      if (c.getMonth() === m && c.getFullYear() === y) v += 1;
    }
    rows.push({ name: label, v });
  }
  return rows;
}

function isPrOpen(p: Record<string, unknown>): boolean {
  const s = String(p.approvalStatus ?? '');
  const closed = ['Approved', 'Rejected', 'Cancelled', 'PO Created'];
  return !closed.includes(s);
}

function isTaskOpen(t: Record<string, unknown>): boolean {
  const s = String(t.taskStatus ?? '').toLowerCase();
  return s !== 'completed';
}

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) => (
  <div className="bg-white p-5 rounded-xl border border-primary/5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="p-3 rounded-lg bg-slate-50 text-primary">{icon}</div>
    </div>
    <p className="mt-4 text-xs font-medium text-slate-600 leading-snug">{title}</p>
    <p className="mt-1 text-2xl font-semibold text-black tracking-tight tabular-nums">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projects: 0,
    items: 0,
    users: 0,
    openPRs: 0,
    openTasks: 0,
    totalTasks: 0,
  });
  const [pieData, setPieData] = useState<NamedCount[]>([]);
  const [barData, setBarData] = useState<NamedCount[]>(() => prsLastSixMonths([]));

  useEffect(() => {
    const load = async () => {
      try {
        const [projRes, itemsRes, usersRes, prRes, tasksRes] = await Promise.allSettled([
          api.get('/project/projects'),
          api.get('/inventory/items'),
          api.get('/master/users'),
          api.get('/procurement/pr'),
          api.get('/project/tasks'),
        ]);

        logRejected('projects', projRes);
        logRejected('inventory items', itemsRes);
        logRejected('users', usersRes);
        logRejected('purchase requests', prRes);
        logRejected('tasks', tasksRes);

        const projects = projRes.status === 'fulfilled' ? extractList(projRes.value) : [];
        const items = itemsRes.status === 'fulfilled' ? extractList(itemsRes.value) : [];
        const users = usersRes.status === 'fulfilled' ? extractList(usersRes.value) : [];
        const prs = prRes.status === 'fulfilled' ? extractList(prRes.value) : [];
        const tasks = tasksRes.status === 'fulfilled' ? extractList(tasksRes.value) : [];

        setStats({
          projects: projects.length,
          items: items.length,
          users: users.length,
          openPRs: prs.filter(isPrOpen).length,
          openTasks: tasks.filter(isTaskOpen).length,
          totalTasks: tasks.length,
        });

        const taskPie = aggregateTaskStatus(tasks);
        const sumPie = taskPie.reduce((s, x) => s + x.v, 0);
        setPieData(sumPie > 0 ? taskPie : [{ name: 'No tasks', v: 1 }]);

        setBarData(prsLastSixMonths(prs));
      } catch (e) {
        console.error('Dashboard load error:', e);
        setPieData([{ name: 'No data', v: 1 }]);
        setBarData(prsLastSixMonths([]));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="h-full w-full flex flex-col gap-6 p-4 lg:p-6 overflow-y-auto no-scrollbar animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 shrink-0">
        <StatCard title="Active projects" value={loading ? '—' : stats.projects} icon={<Briefcase size={20} />} />
        <StatCard title="Inventory stock keeping units" value={loading ? '—' : stats.items} icon={<Boxes size={20} />} />
        <StatCard title="Team members (users)" value={loading ? '—' : stats.users} icon={<Users size={20} />} />
        <StatCard title="Open purchase requests" value={loading ? '—' : stats.openPRs} icon={<FileSpreadsheet size={20} />} />
        <StatCard
          title="Open tasks (open count / total tasks)"
          value={loading ? '—' : `${stats.openTasks} / ${stats.totalTasks}`}
          icon={<ListTodo size={20} />}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-2 lg:gap-0 flex-1 min-h-0 items-stretch">
        <div className="flex-1 min-h-[min(48vh,440px)] flex flex-col bg-white rounded-xl border border-primary/5 shadow-sm overflow-hidden relative">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(125deg, #0f172a 0px, #0f172a 1px, transparent 1px, transparent 14px)',
            }}
            aria-hidden
          />
          <div className="shrink-0 px-5 pt-5 pb-1 flex items-center gap-2 relative z-10">
            <MoveRight className="text-primary/50 shrink-0" size={14} strokeWidth={2.25} />
            <p className="text-xs font-medium text-slate-600">Tasks by status (all statuses)</p>
          </div>
          <div className="flex-1 min-h-0 w-full min-h-[280px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 8, right: 12, bottom: 64, left: 12 }}>
                <Pie
                  data={pieData.length ? pieData : [{ name: 'No data', v: 1 }]}
                  dataKey="v"
                  nameKey="name"
                  cx="50%"
                  cy="46%"
                  innerRadius="40%"
                  outerRadius="68%"
                  paddingAngle={5}
                  stroke="#fff"
                  strokeWidth={2}
                  isAnimationActive={!loading}
                >
                  {(pieData.length ? pieData : [{ name: 'No data', v: 1 }]).map((row, i) => (
                    <Cell key={`${row.name}-${i}`} fill={CHART_FILL[i % CHART_FILL.length]} />
                  ))}
                </Pie>
                <Tooltip
                  cursor={false}
                  formatter={(value, name) => [`${Number(value ?? 0)} tasks`, String(name ?? '')]}
                  labelFormatter={() => 'Task status'}
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid rgb(241 245 249)',
                    fontSize: 12,
                    boxShadow: '0 4px 12px rgb(15 23 42 / 0.06)',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  layout="horizontal"
                  align="center"
                  iconType="circle"
                  formatter={(value) => <span className="text-slate-600">{String(value)}</span>}
                  wrapperStyle={{
                    fontSize: 12,
                    paddingTop: 8,
                    width: '100%',
                    lineHeight: 1.45,
                    whiteSpace: 'normal',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="hidden lg:flex flex-col items-center justify-center px-1 text-slate-200 select-none"
          aria-hidden
        >
          <MoveRight size={22} strokeWidth={1.5} className="opacity-60" />
          <MoveRight size={22} strokeWidth={1.5} className="-mt-1 opacity-35" />
        </div>

        <div className="flex-1 min-h-[min(48vh,440px)] flex flex-col bg-white rounded-xl border border-primary/5 shadow-sm overflow-hidden">
          <div className="shrink-0 px-5 pt-5 pb-1">
            <p className="text-xs font-medium text-slate-600">Purchase requests by month</p>
          </div>
          <div className="flex-1 min-h-0 w-full min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 12, right: 12, bottom: 28, left: 4 }}
                barCategoryGap="20%"
              >
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={axisTick} interval={0} />
                <YAxis
                  type="number"
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={axisTick}
                  width={28}
                  domain={[0, (dataMax: number) => Math.max(1, Math.ceil(dataMax * 1.12))]}
                />
                <Tooltip
                  cursor={{ fill: 'rgb(241 245 249)' }}
                  contentStyle={{
                    borderRadius: 6,
                    border: '1px solid rgb(241 245 249)',
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="v" radius={[6, 6, 0, 0]} maxBarSize={48} isAnimationActive={!loading}>
                  {barData.map((row, i) => (
                    <Cell key={`${row.name}-${i}`} fill={CHART_FILL[i % CHART_FILL.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
