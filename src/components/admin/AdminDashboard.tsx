import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  UserPlus,
  CalendarPlus,
  FileText,
  Settings,
  BarChart3,
} from "lucide-react";
import { supabase } from "../../../supabase/supabase";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import WorkerManagement from "./WorkerManagement";
import ClientManagement from "./ClientManagement";
import ShiftScheduling from "./ShiftScheduling";
import InvoiceManagement from "./InvoiceManagement";
import ReportsAnalytics from "./ReportsAnalytics";
import { useAuth } from "../../../supabase/auth";

interface DashboardStats {
  totalWorkers: number;
  activeWorkers: number;
  totalClients: number;
  activeClients: number;
  todayShifts: number;
  weeklyHours: number;
  pendingTimesheets: number;
  monthlyRevenue: number;
  pendingInvoices: number;
  pendingExpenses: number;
}

interface RecentActivity {
  id: string;
  type: "shift" | "timesheet" | "expense" | "invoice";
  description: string;
  user: string;
  timestamp: string;
  status?: string;
}

export default function AdminDashboard() {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch dashboard statistics
      const [
        workersData,
        clientsData,
        shiftsData,
        timesheetsData,
        invoicesData,
        expensesData,
      ] = await Promise.all([
        supabase.from("users").select("id, is_active").eq("role", "worker"),
        supabase.from("clients").select("id, is_active"),
        supabase
          .from("shifts")
          .select("id, start_time, status")
          .gte("start_time", new Date().toISOString().split("T")[0]),
        supabase
          .from("timesheets")
          .select("id, status, total_hours")
          .eq("status", "submitted"),
        supabase
          .from("invoices")
          .select("id, status, total_amount")
          .eq("status", "draft"),
        supabase.from("expenses").select("id, status").eq("status", "pending"),
      ]);

      const dashboardStats: DashboardStats = {
        totalWorkers: workersData.data?.length || 0,
        activeWorkers: workersData.data?.filter((w) => w.is_active).length || 0,
        totalClients: clientsData.data?.length || 0,
        activeClients: clientsData.data?.filter((c) => c.is_active).length || 0,
        todayShifts: shiftsData.data?.length || 0,
        weeklyHours:
          timesheetsData.data?.reduce(
            (sum, t) => sum + (t.total_hours || 0),
            0,
          ) || 0,
        pendingTimesheets: timesheetsData.data?.length || 0,
        monthlyRevenue:
          invoicesData.data?.reduce(
            (sum, i) => sum + (i.total_amount || 0),
            0,
          ) || 0,
        pendingInvoices: invoicesData.data?.length || 0,
        pendingExpenses: expensesData.data?.length || 0,
      };

      setStats(dashboardStats);

      // Fetch recent activity (simplified for demo)
      const activities: RecentActivity[] = [
        {
          id: "1",
          type: "timesheet",
          description: "Timesheet submitted for Margaret Johnson",
          user: "Sarah Wilson",
          timestamp: "2 hours ago",
          status: "submitted",
        },
        {
          id: "2",
          type: "shift",
          description: "New shift scheduled for William Chen",
          user: "Admin",
          timestamp: "4 hours ago",
          status: "scheduled",
        },
        {
          id: "3",
          type: "expense",
          description: "Travel expense submitted",
          user: "Mike Johnson",
          timestamp: "6 hours ago",
          status: "pending",
        },
      ];

      setRecentActivity(activities);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {userProfile?.full_name}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workers">Workers</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
            <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Workers
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.activeWorkers}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    of {stats?.totalWorkers} total workers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Today's Shifts
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.todayShifts}</div>
                  <p className="text-xs text-muted-foreground">
                    scheduled for today
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Timesheets
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.pendingTimesheets}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    awaiting approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Monthly Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${stats?.monthlyRevenue?.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    from {stats?.pendingInvoices} pending invoices
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    className="h-20 flex flex-col space-y-2"
                    variant="outline"
                  >
                    <UserPlus className="h-6 w-6" />
                    <span className="text-sm">Add Worker</span>
                  </Button>
                  <Button
                    className="h-20 flex flex-col space-y-2"
                    variant="outline"
                  >
                    <CalendarPlus className="h-6 w-6" />
                    <span className="text-sm">Schedule Shift</span>
                  </Button>
                  <Button
                    className="h-20 flex flex-col space-y-2"
                    variant="outline"
                  >
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">Create Invoice</span>
                  </Button>
                  <Button
                    className="h-20 flex flex-col space-y-2"
                    variant="outline"
                  >
                    <TrendingUp className="h-6 w-6" />
                    <span className="text-sm">View Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-4"
                      >
                        <div className="flex-shrink-0">
                          {activity.type === "timesheet" && (
                            <Clock className="h-5 w-5 text-blue-500" />
                          )}
                          {activity.type === "shift" && (
                            <Calendar className="h-5 w-5 text-green-500" />
                          )}
                          {activity.type === "expense" && (
                            <DollarSign className="h-5 w-5 text-orange-500" />
                          )}
                          {activity.type === "invoice" && (
                            <FileText className="h-5 w-5 text-purple-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            by {activity.user} • {activity.timestamp}
                          </p>
                        </div>
                        {activity.status && (
                          <Badge
                            variant={
                              activity.status === "submitted"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {activity.status}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alerts & Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          {stats?.pendingTimesheets} timesheets pending approval
                        </p>
                        <p className="text-xs text-yellow-600">
                          Review and approve worker timesheets
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          {stats?.pendingExpenses} expenses awaiting review
                        </p>
                        <p className="text-xs text-red-600">
                          Process expense reimbursements
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          All shifts covered for today
                        </p>
                        <p className="text-xs text-green-600">
                          No scheduling conflicts detected
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workers">
            <WorkerManagement />
          </TabsContent>

          <TabsContent value="clients">
            <ClientManagement />
          </TabsContent>

          <TabsContent value="scheduling">
            <ShiftScheduling />
          </TabsContent>

          <TabsContent value="invoicing">
            <InvoiceManagement />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
