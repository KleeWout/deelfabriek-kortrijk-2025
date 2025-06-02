'use client';
import React from "react";

type LogItem = {
  id: number;
  message: string;
  timestamp: string; //verander naar Date
};

type ActivityLogProps = {
  logs: LogItem[];
};

export default function ActivityLog({ logs }: ActivityLogProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden p-4">
      <ul className="divide-y divide-gray-200">
        {logs.map((log) => (
          <li key={log.id} className="py-3">
            <p className="text-sm text-gray-800">{log.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              {log.timestamp}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}