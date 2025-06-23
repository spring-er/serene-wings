import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, UserRole } from "../../../supabase/auth";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldX } from "lucide-react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
  showError?: boolean;
}

export default function RoleGuard({
  children,
  allowedRoles,
  fallbackPath = "/",
  showError = true,
}: RoleGuardProps) {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return <LoadingScreen text="Checking permissions..." />;
  }

  if (!user || !userProfile) {
    return <Navigate to="/login" replace />;
  }

  if (!userProfile.is_active) {
    if (showError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert className="border-red-200 bg-red-50">
              <ShieldX className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Your account has been deactivated. Please contact an
                administrator for assistance.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }
    return <Navigate to={fallbackPath} replace />;
  }

  if (!allowedRoles.includes(userProfile.role)) {
    if (showError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert className="border-red-200 bg-red-50">
              <ShieldX className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                You don't have permission to access this page. Required role:{" "}
                {allowedRoles.join(" or ")}.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}

// Convenience components for specific roles
export function AdminGuard({
  children,
  fallbackPath,
  showError,
}: Omit<RoleGuardProps, "allowedRoles">) {
  return (
    <RoleGuard
      allowedRoles={["admin"]}
      fallbackPath={fallbackPath}
      showError={showError}
    >
      {children}
    </RoleGuard>
  );
}

export function WorkerGuard({
  children,
  fallbackPath,
  showError,
}: Omit<RoleGuardProps, "allowedRoles">) {
  return (
    <RoleGuard
      allowedRoles={["worker"]}
      fallbackPath={fallbackPath}
      showError={showError}
    >
      {children}
    </RoleGuard>
  );
}

export function AdminOrWorkerGuard({
  children,
  fallbackPath,
  showError,
}: Omit<RoleGuardProps, "allowedRoles">) {
  return (
    <RoleGuard
      allowedRoles={["admin", "worker"]}
      fallbackPath={fallbackPath}
      showError={showError}
    >
      {children}
    </RoleGuard>
  );
}
