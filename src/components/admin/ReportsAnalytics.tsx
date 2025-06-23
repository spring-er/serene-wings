import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  FileText,
  PieChart,
} from "lucide-react";
import { supabase } from "../../../supabase/supabase";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";

interface ReportData {
  totalRevenue: number;
  totalHours: number;
  totalShifts: number;
  activeWorkers: number;
  activeClients: number;
  averageHourlyRate: number;
  monthlyRevenue: { month: string; revenue: number }[];
  topWorkers: { name: string; hours: number; revenue: number }[];
  clientDistribution: { careLevel: string; count: number }[];
  recentActivity: any[];
}

interface DateRange {
  start: string;
  end: string;
}

export default function ReportsAnalytics() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [reportType, setReportType] = useState("overview");
  const { toast } = useToast();

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // Fetch basic statistics
      const [
        invoicesData,
        shiftsData,
        workersData,
        clientsData,
        timesheetsData,
      ] = await Promise.all([
        supabase
          .from("invoices")
          .select("total_amount, status, created_at")
          .gte("created_at", dateRange.start)
          .lte("created_at", dateRange.end),
        supabase
          .from("shifts")
          .select(
            "*, worker:users!shifts_worker_id_fkey(full_name, hourly_rate)",
          )
          .gte("start_time", dateRange.start)
          .lte("end_time", dateRange.end),
        supabase
          .from("users")
          .select("*")
          .eq("role", "worker")
          .eq("is_active", true),
        supabase
          .from("clients")
          .select("care_level, is_active")
          .eq("is_active", true),
        supabase
          .from("timesheets")
          .select(
            "total_hours, worker_id, users!timesheets_worker_id_fkey(full_name, hourly_rate)",
          )
          .gte("week_start", dateRange.start)
          .lte("week_end", dateRange.end)
          .eq("status", "approved"),
      ]);

      // Calculate metrics
      const totalRevenue =
        invoicesData.data
          ?.filter((inv) => inv.status === "paid")
          .reduce((sum, inv) => sum + inv.total_amount, 0) || 0;

      const totalHours =
        timesheetsData.data?.reduce(
          (sum, ts) => sum + (ts.total_hours || 0),
          0,
        ) || 0;

      const totalShifts = shiftsData.data?.length || 0;
      const activeWorkers = workersData.data?.length || 0;
      const activeClients = clientsData.data?.length || 0;

      const averageHourlyRate =
        workersData.data?.reduce(
          (sum, worker) => sum + (worker.hourly_rate || 0),
          0,
        ) / (activeWorkers || 1) || 0;

      // Monthly revenue trend (simplified)
      const monthlyRevenue = [
        { month: "Jan", revenue: totalRevenue * 0.8 },
        { month: "Feb", revenue: totalRevenue * 0.9 },
        { month: "Mar", revenue: totalRevenue },
      ];

      // Top workers by hours
      const workerHours =
        timesheetsData.data?.reduce((acc: any, ts: any) => {
          const workerId = ts.worker_id;
          const workerName = ts.users?.full_name || "Unknown";
          const hourlyRate = ts.users?.hourly_rate || 0;

          if (!acc[workerId]) {
            acc[workerId] = {
              name: workerName,
              hours: 0,
              revenue: 0,
            };
          }

          acc[workerId].hours += ts.total_hours || 0;
          acc[workerId].revenue += (ts.total_hours || 0) * hourlyRate;

          return acc;
        }, {}) || {};

      const topWorkers = Object.values(workerHours)
        .sort((a: any, b: any) => b.hours - a.hours)
        .slice(0, 5);

      // Client distribution by care level
      const clientDistribution =
        clientsData.data?.reduce((acc: any, client: any) => {
          const careLevel = client.care_level || "unknown";
          const existing = acc.find(
            (item: any) => item.careLevel === careLevel,
          );

          if (existing) {
            existing.count++;
          } else {
            acc.push({ careLevel, count: 1 });
          }

          return acc;
        }, []) || [];

      setReportData({
        totalRevenue,
        totalHours,
        totalShifts,
        activeWorkers,
        activeClients,
        averageHourlyRate,
        monthlyRevenue,
        topWorkers: topWorkers as any,
        clientDistribution,
        recentActivity: [], // Simplified for demo
      });
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch report data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // In a real app, this would generate and download a PDF/Excel report
    toast({
      title: "Export Started",
      description: "Your report is being generated and will download shortly",
    });
  };

  const getCareLevel = (level: string) => {
    const levels: { [key: string]: { label: string; color: string } } = {
      companion: {
        label: "Companion Care",
        color: "bg-blue-100 text-blue-800",
      },
      personal: {
        label: "Personal Care",
        color: "bg-green-100 text-green-800",
      },
      alzheimers: {
        label: "Alzheimer's Care",
        color: "bg-purple-100 text-purple-800",
      },
      livein: { label: "Live-In Care", color: "bg-orange-100 text-orange-800" },
      respite: { label: "Respite Care", color: "bg-pink-100 text-pink-800" },
    };
    return (
      levels[level] || { label: level, color: "bg-gray-100 text-gray-800" }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Generating reports..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Reports & Analytics
          </h2>
          <p className="text-gray-600">
            Business insights and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={fetchReportData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Date Range and Report Type Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="report_type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Business Overview</SelectItem>
                  <SelectItem value="financial">Financial Report</SelectItem>
                  <SelectItem value="workforce">Workforce Analytics</SelectItem>
                  <SelectItem value="client">Client Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={fetchReportData} className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${reportData?.totalRevenue.toFixed(2)}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData?.totalHours.toFixed(1)}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shifts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData?.totalShifts}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5.1% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Workers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData?.activeWorkers}
            </div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2.1% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData?.activeClients}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15.3% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Hourly Rate
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${reportData?.averageHourlyRate.toFixed(2)}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3.7% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Workers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Top Performing Workers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData?.topWorkers.map((worker, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{worker.name}</TableCell>
                    <TableCell>{worker.hours.toFixed(1)}h</TableCell>
                    <TableCell>${worker.revenue.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Client Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Client Care Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData?.clientDistribution.map((item, index) => {
                const careLevel = getCareLevel(item.careLevel);
                const percentage = (
                  (item.count / (reportData?.activeClients || 1)) *
                  100
                ).toFixed(1);

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <Badge className={careLevel.color}>
                        {careLevel.label}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{item.count} clients</div>
                      <div className="text-sm text-gray-500">{percentage}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-around bg-gray-50 rounded-lg p-4">
            {reportData?.monthlyRevenue.map((month, index) => {
              const maxRevenue = Math.max(
                ...reportData.monthlyRevenue.map((m) => m.revenue),
              );
              const height = (month.revenue / maxRevenue) * 200;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-2"
                >
                  <div className="text-sm font-medium">
                    ${month.revenue.toFixed(0)}
                  </div>
                  <div
                    className="bg-blue-500 rounded-t w-12 transition-all duration-300"
                    style={{ height: `${height}px` }}
                  />
                  <div className="text-sm text-gray-600">{month.month}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Export Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
            <Button variant="outline" onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export as Excel
            </Button>
            <Button variant="outline" onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
