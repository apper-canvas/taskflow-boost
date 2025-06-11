import React from 'react';
import { motion } from 'framer-motion';
import Text from '@/components/atoms/Text';

const CircularProgress = ({ percentage, size = 80, strokeWidth = 6, trackColor = '#E2E8F0', progressColor = '#5B4FE7', label = "Today's Progress" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="text-center">
      <div className="relative inline-flex items-center justify-center">
        <svg className={`transform -rotate-90`} width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: offset
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Text as="span" className="text-lg font-display font-bold text-surface-900">
            {Math.round(percentage)}%
          </Text>
        </div>
      </div>
      {label && <Text as="p" className="text-xs text-surface-600 mt-2">{label}</Text>}
    </div>
  );
};

export default CircularProgress;