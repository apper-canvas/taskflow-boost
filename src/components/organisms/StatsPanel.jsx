import React from 'react';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';
import CircularProgress from '@/components/atoms/CircularProgress';
import StatItem from '@/components/molecules/StatItem';

const StatsPanel = ({ stats }) => {
  if (!stats) return null;

  return (
    <Card>
      <Text as="h3" className="mb-4">Progress</Text>
      <div className="space-y-4">
        <CircularProgress percentage={stats.completionRate} />
        <div className="space-y-3">
          <StatItem
            iconName="CheckCircle"
            title="Completed Today"
            value={`${stats.completedToday} tasks`}
            bgColorClass="bg-success/5"
            iconColorClass="text-success"
          />
          <StatItem
            iconName="Calendar"
            title="This Week"
            value={`${stats.completedThisWeek} completed`}
            bgColorClass="bg-info/5"
            iconColorClass="text-info"
          />
          <StatItem
            iconName="Flame"
            title="Streak"
            value={`${stats.streak} days`}
            bgColorClass="bg-accent/5"
            iconColorClass="text-accent"
          />
        </div>
      </div>
    </Card>
  );
};

export default StatsPanel;