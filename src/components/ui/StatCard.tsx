import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './StatCard.css';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
  progress?: { current: number; total: number };
}

export default function StatCard({ title, value, subtitle, icon, trend, color = 'primary', progress }: StatCardProps) {
  const trendDir = trend ? (trend.value > 0 ? 'up' : trend.value < 0 ? 'down' : 'neutral') : null;

  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card-header">
        <div className="stat-card-info">
          <span className="stat-card-title">{title}</span>
          <div className="stat-card-value">{value}</div>
          {subtitle && <span className="stat-card-subtitle">{subtitle}</span>}
        </div>
        <div className={`stat-card-icon stat-card-icon--${color}`}>
          {icon}
        </div>
      </div>

      {(trend || progress) && (
        <div className="stat-card-footer">
          {trend && (
            <div className={`stat-card-trend stat-card-trend--${trendDir}`}>
              {trendDir === 'up' && <TrendingUp size={14} />}
              {trendDir === 'down' && <TrendingDown size={14} />}
              {trendDir === 'neutral' && <Minus size={14} />}
              <span>{trend.value > 0 ? '+' : ''}{trend.value}%</span>
              <span className="stat-card-trend-label">{trend.label}</span>
            </div>
          )}

          {progress && (
            <div className="stat-card-progress">
              <div className="stat-card-progress-bar">
                <div
                  className={`stat-card-progress-fill stat-card-progress-fill--${color}`}
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
              <span className="stat-card-progress-label">
                {progress.current} / {progress.total}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
