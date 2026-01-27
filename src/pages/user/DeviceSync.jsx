import React from 'react';
import { Watch, Bluetooth, Activity, Heart, Zap } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';

export function DeviceSync() {
  const devices = [
    { id: 1, name: 'Apple Watch Series 8', type: 'Smartwatch', connected: true, battery: 87 },
    { id: 2, name: 'Fitbit Charge 5', type: 'Fitness Tracker', connected: false, battery: null },
    { id: 3, name: 'Garmin Forerunner', type: 'GPS Watch', connected: false, battery: null },
  ];

  const syncedData = [
    { label: 'Heart Rate', value: '72 bpm', icon: Heart, color: 'text-red-500' },
    { label: 'Steps Today', value: '8,423', icon: Activity, color: 'text-blue-500' },
    { label: 'Active Minutes', value: '45 min', icon: Zap, color: 'text-orange-500' },
    { label: 'Calories Burned', value: '450 kcal', icon: Zap, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 dark:text-white mb-2">Device Sync</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Connect your smartwatch to sync real-time workout data
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-gray-900 dark:text-white">Available Devices</h3>
          {devices.map((device) => (
            <Card key={device.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                    <Watch className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 dark:text-white mb-1">{device.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{device.type}</p>
                    {device.connected && device.battery && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Battery: {device.battery}%
                      </p>
                    )}
                  </div>
                </div>
                {device.connected ? (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs text-emerald-500">Connected</span>
                  </div>
                ) : (
                  <Button size="sm" variant="outline">
                    <Bluetooth className="w-4 h-4" />
                    Connect
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-gray-900 dark:text-white">Live Data</h3>
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-950 dark:to-black text-white">
            <div className="flex items-center justify-between mb-4">
              <h4>Real-Time Metrics</h4>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-emerald-400">LIVE</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {syncedData.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="text-center p-4 bg-white/5 rounded-lg">
                    <Icon className={`w-6 h-6 ${item.color} mx-auto mb-2`} />
                    <p className="text-2xl mb-1">{item.value}</p>
                    <p className="text-xs text-gray-400">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <h4 className="text-gray-900 dark:text-white mb-4">Sync History</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Last sync</span>
                <span className="text-gray-900 dark:text-white">2 minutes ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Data points synced</span>
                <span className="text-gray-900 dark:text-white">1,247</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <span className="text-emerald-600 dark:text-emerald-400">Active</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
    );
}
