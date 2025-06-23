import {
  Shield,
  Award,
  Clock,
  Users,
  Star,
  CheckCircle,
  Phone,
  Heart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TrustIndicatorProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

function TrustIndicator({
  icon,
  title,
  description,
  color,
}: TrustIndicatorProps) {
  return (
    <div className="text-center">
      <div
        className={`${color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
      >
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

export function TrustBadges() {
  return (
    <div className="grid md:grid-cols-4 gap-8 mb-16">
      <TrustIndicator
        icon={<Shield className="h-8 w-8 text-blue-600" />}
        title="Licensed & Bonded"
        description="Fully licensed caregivers with comprehensive background checks"
        color="bg-blue-100"
      />
      <TrustIndicator
        icon={<Award className="h-8 w-8 text-green-600" />}
        title="Certified Care"
        description="CNA and HHA certified professionals with ongoing training"
        color="bg-green-100"
      />
      <TrustIndicator
        icon={<Clock className="h-8 w-8 text-purple-600" />}
        title="24/7 Support"
        description="Round-the-clock availability for emergencies and peace of mind"
        color="bg-purple-100"
      />
      <TrustIndicator
        icon={<Users className="h-8 w-8 text-orange-600" />}
        title="Family Focused"
        description="Regular updates and family involvement in care planning"
        color="bg-orange-100"
      />
    </div>
  );
}

export function SocialProof() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center space-x-3 mb-4">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
          ))}
        </div>
        <div>
          <p className="font-semibold text-gray-900">4.9/5 Rating</p>
          <p className="text-sm text-gray-600">200+ Happy Families</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span>Licensed & Insured</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span>Background Checked</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span>Locally Owned</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span>9+ Years Experience</span>
        </div>
      </div>
    </div>
  );
}

export function UrgencyIndicator() {
  return (
    <Card className="border-l-4 border-l-red-500 bg-red-50">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="bg-red-100 p-2 rounded-full">
            <Clock className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h4 className="font-semibold text-red-900">Limited Availability</h4>
            <p className="text-sm text-red-700">
              Only 3 caregiver slots available this month. Book your
              consultation today.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EmergencyContact() {
  return (
    <div className="fixed bottom-20 right-4 md:bottom-4 md:right-4 z-50">
      <Button
        size="lg"
        className="bg-red-600 hover:bg-red-700 text-white shadow-lg rounded-full px-6 py-3 animate-pulse"
      >
        <Phone className="h-5 w-5 mr-2" />
        Emergency: (919) 888-1810
      </Button>
    </div>
  );
}

export function LocalCredentials() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Trusted by Raleigh Families Since 2015
        </h3>
        <p className="text-gray-600">
          Locally owned and operated with deep community roots
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Award className="h-6 w-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900">NC Licensed</h4>
          <p className="text-sm text-gray-600">
            State certified home care agency
          </p>
        </div>

        <div className="text-center">
          <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900">Fully Insured</h4>
          <p className="text-sm text-gray-600">$2M liability coverage</p>
        </div>

        <div className="text-center">
          <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Heart className="h-6 w-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900">Community Partner</h4>
          <p className="text-sm text-gray-600">
            Active in local senior centers
          </p>
        </div>
      </div>
    </div>
  );
}
