import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Play,
  Square,
  FileText,
  Settings,
  Bell,
  Home,
  CalendarDays,
} from "lucide-react";
import { format } from "date-fns";
import { supabase } from "../../../supabase/supabase";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../../../supabase/auth";

interface Shift {
  id: string;
  client_id: string;
  start_time: string;
  end_time: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  notes?: string;
  client?: {
    id: string;
    full_name: string;
    address?: string;
    care_level: string;
  };
}

interface Timesheet {
  id: string;
  week_start: string;
  week_end: string;
  total_hours: number;
  status: "draft" | "submitted" | "approved" | "rejected";
  created_at: string;
}

interface ClockEntry {
  id: string;
  clock_in: string;
  clock_out?: string;
  shift_id?: string;
  status: "clocked_in" | "clocked_out";
}

export default function WorkerPortal() {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [currentClockEntry, setCurrentClockEntry] = useState<ClockEntry | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [showShiftDetails, setShowShiftDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchWorkerData();
    }
  }, [user]);

  const fetchWorkerData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch worker's shifts
      const { data: shiftsData, error: shiftsError } = await supabase
        .from("shifts")
        .select(
          `
          *,
          client:clients!shifts_client_id_fkey(*)
        `,
        )
        .eq("worker_id", user.id)
        .gte("start_time", new Date().toISOString().split("T")[0])
        .order("start_time", { ascending: true });

      if (shiftsError) throw shiftsError;

      // Fetch worker's timesheets
      const { data: timesheetsData, error: timesheetsError } = await supabase
        .from("timesheets")
        .select("*")
        .eq("worker_id", user.id)
        .order("week_start", { ascending: false })
        .limit(5);

      if (timesheetsError) throw timesheetsError;

      // Check if worker is currently clocked in
      const { data: clockData, error: clockError } = await supabase
        .from("time_entries")
        .select("*")
        .eq("worker_id", user.id)
        .eq("status", "clocked_in")
        .order("clock_in", { ascending: false })
        .limit(1);

      if (clockError) throw clockError;

      setShifts(shiftsData || []);
      setTimesheets(timesheetsData || []);
      setCurrentClockEntry(clockData?.[0] || null);
    } catch (error) {
      console.error("Error fetching worker data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch your data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async (shiftId?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("time_entries").insert({
        worker_id: user.id,
        shift_id: shiftId,
        clock_in: new Date().toISOString(),
        status: "clocked_in",
      });

      if (error) throw error;

      toast({
        title: "Clocked In",
        description: "You have successfully clocked in",
      });

      fetchWorkerData();
    } catch (error) {
      console.error("Error clocking in:", error);
      toast({
        title: "Error",
        description: "Failed to clock in",
        variant: "destructive",
      });
    }
  };

  const handleClockOut = async () => {
    if (!user || !currentClockEntry) return;

    try {
      const { error } = await supabase
        .from("time_entries")
        .update({
          clock_out: new Date().toISOString(),
          status: "clocked_out",
        })
        .eq("id", currentClockEntry.id);

      if (error) throw error;

      toast({
        title: "Clocked Out",
        description: "You have successfully clocked out",
      });

      fetchWorkerData();
    } catch (error) {
      console.error("Error clocking out:", error);
      toast({
        title: "Error",
        description: "Failed to clock out",
        variant: "destructive",
      });
    }
  };

  const getShiftStatus = (shift: Shift) => {
    const now = new Date();
    const startTime = new Date(shift.start_time);
    const endTime = new Date(shift.end_time);

    if (shift.status === "completed") {
      return {
        label: "Completed",
        variant: "default" as const,
        color: "bg-green-100 text-green-800",
      };
    }
    if (shift.status === "cancelled") {
      return {
        label: "Cancelled",
        variant: "destructive" as const,
        color: "bg-red-100 text-red-800",
      };
    }
    if (now >= startTime && now <= endTime) {
      return {
        label: "In Progress",
        variant: "default" as const,
        color: "bg-blue-100 text-blue-800",
      };
    }
    if (now < startTime) {
      return {
        label: "Upcoming",
        variant: "secondary" as const,
        color: "bg-yellow-100 text-yellow-800",
      };
    }
    return {
      label: "Past",
      variant: "secondary" as const,
      color: "bg-gray-100 text-gray-800",
    };
  };

  const getCareLevel = (level: string) => {
    const levels = {
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
      levels[level as keyof typeof levels] || {
        label: level,
        color: "bg-gray-100 text-gray-800",
      }
    );
  };

  const getTimesheetStatus = (status: string) => {
    const statusConfig = {
      draft: { label: "Draft", variant: "secondary" as const },
      submitted: { label: "Submitted", variant: "default" as const },
      approved: { label: "Approved", variant: "default" as const },
      rejected: { label: "Rejected", variant: "destructive" as const },
    };
    return (
      statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    );
  };

  const todayShifts = shifts.filter(
    (shift) =>
      new Date(shift.start_time).toDateString() === new Date().toDateString(),
  );

  const upcomingShifts = shifts
    .filter((shift) => new Date(shift.start_time) > new Date())
    .slice(0, 5);

  const totalHoursThisWeek = timesheets[0]?.total_hours || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
              />
              <AvatarFallback>
                {user?.full_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "W"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.full_name?.split(" ")[0] || "Worker"}!
              </h1>
              <p className="text-gray-600">
                {format(new Date(), "EEEE, MMMM d, yyyy")}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Clock In/Out Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Time Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              {currentClockEntry ? (
                <div>
                  <p className="text-sm text-gray-600">
                    Currently clocked in since:
                  </p>
                  <p className="text-lg font-semibold">
                    {format(new Date(currentClockEntry.clock_in), "h:mm a")}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">
                    Ready to start your shift?
                  </p>
                  <p className="text-lg font-semibold">Not clocked in</p>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              {currentClockEntry ? (
                <Button onClick={handleClockOut} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  Clock Out
                </Button>
              ) : (
                <Button onClick={() => handleClockIn()}>
                  <Play className="h-4 w-4 mr-2" />
                  Clock In
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Shifts
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayShifts.length}</div>
            <p className="text-xs text-muted-foreground">
              {todayShifts.filter((s) => s.status === "completed").length}{" "}
              completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              This Week's Hours
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalHoursThisWeek.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">hours logged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Shifts
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingShifts.length}</div>
            <p className="text-xs text-muted-foreground">next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Estimated Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${((user?.hourly_rate || 20) * totalHoursThisWeek).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayShifts.length > 0 ? (
              <div className="space-y-4">
                {todayShifts.map((shift) => {
                  const status = getShiftStatus(shift);
                  const careLevel = getCareLevel(
                    shift.client?.care_level || "",
                  );

                  return (
                    <div
                      key={shift.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedShift(shift);
                        setShowShiftDetails(true);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">
                          {shift.client?.full_name}
                        </h4>
                        <Badge className={status.color}>{status.label}</Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(new Date(shift.start_time), "h:mm a")} -
                          {format(new Date(shift.end_time), "h:mm a")}
                        </div>
                        <Badge className={careLevel.color} variant="outline">
                          {careLevel.label}
                        </Badge>
                      </div>
                      {shift.client?.address && (
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {shift.client.address}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No shifts scheduled for today</p>
                <p className="text-sm text-gray-400">Enjoy your day off!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Shifts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarDays className="h-5 w-5 mr-2" />
              Upcoming Shifts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingShifts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingShifts.map((shift) => {
                    const status = getShiftStatus(shift);

                    return (
                      <TableRow
                        key={shift.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          setSelectedShift(shift);
                          setShowShiftDetails(true);
                        }}
                      >
                        <TableCell className="font-medium">
                          {shift.client?.full_name}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{format(new Date(shift.start_time), "MMM d")}</p>
                            <p className="text-gray-500">
                              {format(new Date(shift.start_time), "h:mm a")}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={status.color}>{status.label}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming shifts</p>
                <p className="text-sm text-gray-400">
                  Check back later for new assignments
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Timesheets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Recent Timesheets
          </CardTitle>
        </CardHeader>
        <CardContent>
          {timesheets.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Week Period</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timesheets.map((timesheet) => {
                  const status = getTimesheetStatus(timesheet.status);

                  return (
                    <TableRow key={timesheet.id}>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(timesheet.week_start), "MMM d")} -
                          {format(new Date(timesheet.week_end), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {timesheet.total_hours.toFixed(1)} hours
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {format(
                            new Date(timesheet.created_at),
                            "MMM d, yyyy",
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No timesheets yet</p>
              <p className="text-sm text-gray-400">
                Your timesheets will appear here once submitted
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shift Details Dialog */}
      <Dialog open={showShiftDetails} onOpenChange={setShowShiftDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Shift Details</DialogTitle>
            <DialogDescription>
              Complete information about your assigned shift
            </DialogDescription>
          </DialogHeader>
          {selectedShift && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Client Information
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedShift.client?.full_name}
                    </p>
                    <p>
                      <span className="font-medium">Care Level:</span>
                      <Badge
                        className={
                          getCareLevel(selectedShift.client?.care_level || "")
                            .color + " ml-2"
                        }
                      >
                        {
                          getCareLevel(selectedShift.client?.care_level || "")
                            .label
                        }
                      </Badge>
                    </p>
                    {selectedShift.client?.address && (
                      <p>
                        <span className="font-medium">Address:</span>{" "}
                        {selectedShift.client.address}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Shift Information
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {format(
                        new Date(selectedShift.start_time),
                        "EEEE, MMMM d, yyyy",
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span>{" "}
                      {format(new Date(selectedShift.start_time), "h:mm a")} -{" "}
                      {format(new Date(selectedShift.end_time), "h:mm a")}
                    </p>
                    <p>
                      <span className="font-medium">Duration:</span>{" "}
                      {Math.round(
                        (new Date(selectedShift.end_time).getTime() -
                          new Date(selectedShift.start_time).getTime()) /
                          (1000 * 60 * 60 * 100),
                      ) / 10}{" "}
                      hours
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>
                      <Badge
                        className={
                          getShiftStatus(selectedShift).color + " ml-2"
                        }
                      >
                        {getShiftStatus(selectedShift).label}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>

              {selectedShift.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Special Instructions
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm">{selectedShift.notes}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowShiftDetails(false)}
                >
                  Close
                </Button>
                {!currentClockEntry &&
                  getShiftStatus(selectedShift).label === "In Progress" && (
                    <Button onClick={() => handleClockIn(selectedShift.id)}>
                      <Play className="h-4 w-4 mr-2" />
                      Clock In for Shift
                    </Button>
                  )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
