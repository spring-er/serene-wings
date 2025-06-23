import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Calendar,
  Clock,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Gift,
  Zap,
} from "lucide-react";

interface CountdownTimerProps {
  onExpire?: () => void;
}

export function CountdownTimer({ onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          onExpire?.();
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onExpire]);

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg text-center">
      <div className="flex items-center justify-center space-x-2 mb-2">
        <Gift className="h-5 w-5" />
        <span className="font-semibold">Limited Time Offer</span>
      </div>
      <p className="text-sm mb-3">Free consultation expires in:</p>
      <div className="flex justify-center space-x-4">
        <div className="text-center">
          <div className="bg-white text-orange-600 rounded px-2 py-1 font-bold text-lg">
            {timeLeft.hours.toString().padStart(2, "0")}
          </div>
          <div className="text-xs mt-1">Hours</div>
        </div>
        <div className="text-center">
          <div className="bg-white text-orange-600 rounded px-2 py-1 font-bold text-lg">
            {timeLeft.minutes.toString().padStart(2, "0")}
          </div>
          <div className="text-xs mt-1">Minutes</div>
        </div>
        <div className="text-center">
          <div className="bg-white text-orange-600 rounded px-2 py-1 font-bold text-lg">
            {timeLeft.seconds.toString().padStart(2, "0")}
          </div>
          <div className="text-xs mt-1">Seconds</div>
        </div>
      </div>
    </div>
  );
}

export function StickyCallToAction({
  onConsultationClick,
}: {
  onConsultationClick: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      setIsVisible(scrollPosition > windowHeight * 0.5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50 md:hidden">
      <div className="flex space-x-3">
        <Button
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={onConsultationClick}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Free Consultation
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          <Phone className="mr-2 h-4 w-4" />
          Call Now
        </Button>
      </div>
    </div>
  );
}

export function ValueProposition() {
  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardContent className="p-6">
        <div className="text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Why Choose Serene Wings?
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  Same-Day Response
                </h4>
                <p className="text-sm text-gray-600">
                  We respond to all inquiries within 2-4 hours
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  Perfect Match Guarantee
                </h4>
                <p className="text-sm text-gray-600">
                  We'll find the right caregiver or it's free
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  Flexible Scheduling
                </h4>
                <p className="text-sm text-gray-600">
                  From 2 hours to 24/7 live-in care
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900">Local Expertise</h4>
                <p className="text-sm text-gray-600">
                  9+ years serving Raleigh families
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RiskReversal() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <div className="text-center">
        <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-6 w-6 text-yellow-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          100% Risk-Free Consultation
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>✅ No obligation to proceed after consultation</p>
          <p>✅ Cancel or reschedule anytime</p>
          <p>✅ Get expert advice even if you don't hire us</p>
          <p>✅ Receive a free care assessment ($200 value)</p>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          We're so confident you'll love our service, we offer a 30-day
          satisfaction guarantee.
        </p>
      </div>
    </div>
  );
}

export function TestimonialHighlight() {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Star className="h-6 w-6 text-blue-600 fill-current" />
          </div>
          <div className="flex-1">
            <blockquote className="text-gray-700 italic mb-3">
              "Serene Wings saved our family during the most difficult time.
              Their caregiver became like family to my mother, and the peace of
              mind they gave us was priceless."
            </blockquote>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900">
                Sarah J.
              </span>
              <Badge variant="outline" className="text-xs">
                Verified Client
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CallToActionButtons({
  onConsultationClick,
}: {
  onConsultationClick: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button
        size="lg"
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg group"
        onClick={onConsultationClick}
      >
        Get Your Free Consultation
        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg flex items-center"
      >
        <Phone className="mr-2 h-5 w-5" />
        Call (919) 888-1810
      </Button>
    </div>
  );
}
