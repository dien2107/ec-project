import React from "react";
import { Card, CardContent } from "~/components/ui/card";
import type { StatsCardProps } from "../types";

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  bgColor,
}) => (
  <Card>
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
      <div className={`p-3 rounded-lg ${bgColor}`}>{icon}</div>
    </CardContent>
  </Card>
);
export default StatsCard;
