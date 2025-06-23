import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarPlus,
  Search,
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Filter,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { supabase } from "../../../supabase/supabase";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile } from "../../../supabase/auth";

interface Shift {
  id: string;
  worker_id: string;
  client_id: string;
  start_time: string;
  end_time: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  notes?: string;
  created_at: string;
  worker?: UserProfile;
  client?: {
    id: string;
    full_name: string;
    address?: string;
  };
}

interface ShiftFormData {
  worker_id: string;
  client_id: string;
  start_time: string;
  end_time: string;
  notes: string;
}

export default function ShiftScheduling() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [workers, setWorkers] = useState<UserProfile[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState<ShiftFormData>({
    worker_id: "",
    client_id: "",
    start_time: "",
    end_time: "",
    notes: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch shifts with worker and client data
      const { data: shiftsData, error: shiftsError } = await supabase
        .from("shifts")
        .select(
          `
          *,
          worker:users!shifts_worker_id_fkey(*),
          client:clients!shifts_client_id_fkey(*)
        `,
        )
        .order("start_time", { ascending: true });

      if (shiftsError) throw shiftsError;

      // Fetch workers
      const { data: workersData, error: workersError } = await supabase
        .from("users")
        .select("*")
        .eq("role", "worker")
        .eq("is_active", true);

      if (workersError) throw workersError;

      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from("clients")
        .select("*")
        .eq("is_active", true);

      if (clientsError) throw clientsError;

      setShifts(shiftsData || []);
      setWorkers(workersData || []);
      setClients(clientsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch scheduling data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Check for scheduling conflicts
      const { data: conflictCheck, error: conflictError } = await supabase
        .from("shifts")
        .select("id")
        .eq("worker_id", formData.worker_id)
        .gte("start_time", formData.start_time)
        .lte("start_time", formData.end_time)
        .neq("status", "cancelled");

      if (conflictError) throw conflictError;

      if (conflictCheck && conflictCheck.length > 0) {
        toast({
          title: "Scheduling Conflict",
          description:
            "This worker already has a shift scheduled during this time",
          variant: "destructive",
        });
        return;
      }

      // Create new shift
      const { error } = await supabase.from("shifts").insert({
        ...formData,
        status: "scheduled",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shift scheduled successfully",
      });

      setShowAddDialog(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error scheduling shift:", error);
      toast({
        title: "Error",
        description: "Failed to schedule shift",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (shiftId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("shifts")
        .update({ status: newStatus })
        .eq("id", shiftId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shift status updated successfully",
      });

      fetchData();
    } catch (error) {
      console.error("Error updating shift status:", error);
      toast({
        title: "Error",
        description: "Failed to update shift status",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      worker_id: "",
      client_id: "",
      start_time: "",
      end_time: "",
      notes: "",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: {
        label: "Scheduled",
        variant: "default" as const,
        icon: CalendarIcon,
      },
      in_progress: {
        label: "In Progress",
        variant: "default" as const,
        icon: Clock,
      },
      completed: {
        label: "Completed",
        variant: "default" as const,
        icon: CheckCircle,
      },
      cancelled: {
        label: "Cancelled",
        variant: "destructive" as const,
        icon: AlertTriangle,
      },
    };
    return (
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.scheduled
    );
  };

  const filteredShifts = shifts.filter(
    (shift) =>
      shift.worker?.full_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      shift.client?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const todayShifts = shifts.filter(
    (shift) =>
      new Date(shift.start_time).toDateString() === new Date().toDateString(),
  );

  const upcomingShifts = shifts.filter(
    (shift) =>
      new Date(shift.start_time) > new Date() && shift.status === "scheduled",
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading schedule..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shift Scheduling</h2>
          <p className="text-gray-600">
            Manage worker schedules and assignments
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <CalendarPlus className="h-4 w-4 mr-2" />
                Schedule Shift
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Shift</DialogTitle>
                <DialogDescription>
                  Assign a worker to a client for a specific time period
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="worker_id">Worker *</Label>
                    <Select
                      value={formData.worker_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, worker_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select worker" />
                      </SelectTrigger>
                      <SelectContent>
                        {workers.map((worker) => (
                          <SelectItem key={worker.id} value={worker.id}>
                            {worker.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client_id">Client *</Label>
                    <Select
                      value={formData.client_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, client_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_time">Start Time *</Label>
                    <Input
                      id="start_time"
                      type="datetime-local"
                      value={formData.start_time}
                      onChange={(e) =>
                        setFormData({ ...formData, start_time: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_time">End Time *</Label>
                    <Input
                      id="end_time"
                      type="datetime-local"
                      value={formData.end_time}
                      onChange={(e) =>
                        setFormData({ ...formData, end_time: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Special instructions or notes for this shift..."
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Schedule Shift</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Shifts
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
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
              Upcoming Shifts
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingShifts.length}</div>
            <p className="text-xs text-muted-foreground">next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Workers
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workers.length}</div>
            <p className="text-xs text-muted-foreground">
              available for scheduling
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Shifts ({filteredShifts.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search shifts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Worker</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShifts.map((shift) => {
                const statusConfig = getStatusBadge(shift.status);
                const startTime = new Date(shift.start_time);
                const endTime = new Date(shift.end_time);
                const duration =
                  Math.round(
                    (endTime.getTime() - startTime.getTime()) /
                      (1000 * 60 * 60 * 100),
                  ) / 10;

                return (
                  <TableRow key={shift.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${shift.worker?.email}`}
                          />
                          <AvatarFallback>
                            {shift.worker?.full_name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "W"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {shift.worker?.full_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {shift.worker?.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{shift.client?.full_name}</p>
                        {shift.client?.address && (
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            {shift.client.address.substring(0, 30)}...
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">
                          {format(startTime, "MMM d, yyyy")}
                        </p>
                        <p className="text-gray-500">
                          {format(startTime, "h:mm a")} -{" "}
                          {format(endTime, "h:mm a")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        {duration}h
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig.variant}>
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={shift.status}
                        onValueChange={(value) =>
                          handleStatusChange(shift.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="in_progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredShifts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No shifts found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
