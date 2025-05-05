import { useEffect, useState } from 'react';
import { AlertTriangle, Activity, Clock, List, AlertCircle, Skull, Hospital, HeartPulse, AlertOctagon } from 'lucide-react';
import { FDAService } from '@/services/FDAService';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Cache for storing drug stats
const statsCache: { [key: string]: any } = {};

interface DrugStatsProps {
  drugName: string;
}

export function DrugStats({ drugName }: DrugStatsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [stats, setStats] = useState<{
    totalReports: number;
    seriousEvents: number;
    recentReports: number;
    commonReactions: { [key: string]: number };
    severityBreakdown: {
      death: number;
      hospitalization: number;
      lifeThreatening: number;
      disabling: number;
    };
  } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        setUsingFallback(false);

        // Check if we have cached data for this drug
        if (statsCache[drugName]) {
          setStats(statsCache[drugName]);
          // Check if using fallback data
          if (statsCache[drugName].totalReports === 0 && 
              Object.values(statsCache[drugName].commonReactions).every((v: number) => v === 0)) {
            setUsingFallback(true);
          }
          setLoading(false);
          return;
        }

        // If no cached data, fetch from API
        const data = await FDAService.getDrugStats(drugName);
        
        // Cache the results
        statsCache[drugName] = data;
        
        setStats(data);
        // Check if we're using fallback data
        if (data.totalReports === 0 && Object.values(data.commonReactions).every(v => v === 0)) {
          setUsingFallback(true);
        }
      } catch (err) {
        setError('Failed to fetch FDA statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (drugName) {
      fetchStats();
    }

    // Cleanup function to handle component unmount
    return () => {
      // We don't clear the cache on unmount to preserve it for future use
    };
  }, [drugName]);

  if (error) {
    return (
      <Card className="p-4 bg-red-50">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!stats) return null;

  // Get top 5 common reactions
  const topReactions = Object.entries(stats.commonReactions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-4">
      {usingFallback && (
        <Card className="p-4 bg-yellow-50">
          <div className="flex items-center gap-2 text-yellow-600">
            <AlertCircle className="h-5 w-5" />
            <p>FDA API data is currently unavailable. Displaying placeholder statistics.</p>
          </div>
        </Card>
      )}
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Total Reports</h3>
          </div>
          <p className="text-2xl font-bold">{stats.totalReports.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total adverse event reports in FDA FAERS</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold">Serious Events</h3>
          </div>
          <p className="text-2xl font-bold">{stats.seriousEvents.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Number of serious adverse events</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">Recent Reports</h3>
          </div>
          <p className="text-2xl font-bold">{stats.recentReports.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Reports in the last 30 days</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <List className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold">Common Reactions</h3>
          </div>
          <ul className="space-y-1">
            {topReactions.map(([reaction, count]) => (
              <li key={reaction} className="text-sm">
                {reaction.charAt(0).toUpperCase() + reaction.slice(1)}: {count}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Skull className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold">Death</h3>
          </div>
          <p className="text-2xl font-bold">{stats.severityBreakdown.death.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Fatal outcomes</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Hospital className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold">Hospitalization</h3>
          </div>
          <p className="text-2xl font-bold">{stats.severityBreakdown.hospitalization.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Required hospitalization</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <HeartPulse className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold">Life-Threatening</h3>
          </div>
          <p className="text-2xl font-bold">{stats.severityBreakdown.lifeThreatening.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Life-threatening events</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertOctagon className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Disabling</h3>
          </div>
          <p className="text-2xl font-bold">{stats.severityBreakdown.disabling.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Permanent disability</p>
        </Card>
      </div>
    </div>
  );
} 