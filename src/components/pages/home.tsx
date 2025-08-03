import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Heart,
  Phone,
  Star,
  Shield,
  Users,
  Clock,
  MapPin,
  Award,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Lock,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
// EmailJS integration and Supabase for testimonials
import { supabase } from "../../../supabase/supabase";
import {
  TrustBadges,
  SocialProof,
  UrgencyIndicator,
  EmergencyContact,
  LocalCredentials,
} from "@/components/ui/trust-indicators";
import {
  CountdownTimer,
  StickyCallToAction,
  ValueProposition,
  RiskReversal,
  TestimonialHighlight,
  CallToActionButtons,
} from "@/components/ui/conversion-optimizers";

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  location?: string;
}

export default function LandingPage() {
  const { toast } = useToast();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittedReviews, setSubmittedReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    email: "",
    rating: 5,
    text: "",
    location: "",
  });
  const [consultationForm, setConsultationForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    address: "",
    notes: "",
  });
  const [isSubmittingConsultation, setIsSubmittingConsultation] =
    useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);

  // Load testimonials from database on component mount
  useEffect(() => {
    const initializeTestimonials = async () => {
      setIsLoadingTestimonials(true);
      await fetchTestimonials();
    };
    initializeTestimonials();
  }, []);

  // Auto-refresh testimonials every 30 seconds to catch new submissions
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoadingTestimonials) {
        fetchTestimonials();
      }
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [isLoadingTestimonials]);

  const fetchTestimonials = async () => {
    const isDevelopment = import.meta.env.DEV;

    try {
      // In development, skip database fetch and use fallback data immediately
      if (isDevelopment) {
        console.log(
          "🔧 [Home] Development mode: Using fallback testimonials (database fetch bypassed)",
        );
        setSubmittedReviews([]);
        return;
      }

      console.log("🔄 [Home] Fetching testimonials from database...");

      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), 15000);
      });

      const fetchPromise = supabase
        .from("testimonials")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(50);

      const { data, error } = await Promise.race([
        fetchPromise,
        timeoutPromise,
      ]);

      if (error) {
        throw error;
      }

      // Transform database testimonials to match Review interface
      const dbTestimonials =
        data?.map((testimonial) => ({
          id: testimonial.id,
          name: testimonial.name,
          rating: testimonial.rating,
          text: testimonial.text,
          date: new Date(
            testimonial.created_at || Date.now(),
          ).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
          location: testimonial.location || "Raleigh Area",
        })) || [];

      setSubmittedReviews(dbTestimonials);
      console.log(
        `✅ [Home] Successfully loaded ${dbTestimonials.length} testimonials from database`,
      );
    } catch (error) {
      // Simplified error handling - no more certificate-specific logic needed
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const isCertError =
        errorMessage.includes("certificate") ||
        errorMessage.includes("CertificateError") ||
        errorMessage.includes("SSL certificate validation bypassed");

      if (isCertError && isDevelopment) {
        // Silent handling in development for certificate issues
        console.log(
          "🔧 [Home] Development mode: Database connection bypassed due to SSL certificate issues",
        );
      } else if (!isDevelopment) {
        // Only log errors in production
        console.error("❌ [Home] Error fetching testimonials:", error);
        toast({
          title: "Connection Issue",
          description:
            "Unable to load latest testimonials. Showing default reviews.",
          variant: "default",
          duration: 5000,
        });
      }

      // Always use fallback data
      setSubmittedReviews([]);
    } finally {
      setIsLoadingTestimonials(false);
    }
  };

  const defaultTestimonials = [
    {
      id: "default-1",
      name: "Sarah Johnson",
      location: "North Raleigh",
      text: "Serene Wings has been a blessing for our family. The caregiver they provided for my mother is compassionate, professional, and truly cares about her wellbeing.",
      rating: 5,
      date: "December 2024",
    },
    {
      id: "default-2",
      name: "Michael Chen",
      location: "Cary",
      text: "The Alzheimer's care program gave us peace of mind. Their specialized approach and 24/7 support made all the difference during a difficult time.",
      rating: 5,
      date: "November 2024",
    },
    {
      id: "default-3",
      name: "Linda Rodriguez",
      location: "Wake Forest",
      text: "Professional, reliable, and caring. Our caregiver has become like family to us. I highly recommend Serene Wings to anyone needing quality care.",
      rating: 5,
      date: "October 2024",
    },
  ];

  // Combine default testimonials with database testimonials
  const allTestimonials = [...submittedReviews, ...defaultTestimonials];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % allTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + allTestimonials.length) % allTestimonials.length,
    );
  };

  const scrollToConsultation = () => {
    const consultationSection = document.getElementById("consultation-form");
    if (consultationSection) {
      consultationSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingConsultation(true);

    // Get form data from the actual form elements
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const serviceType = formData.get("serviceType") as string;
    const preferredDate = formData.get("preferredDate") as string;
    const preferredTime = formData.get("preferredTime") as string;
    const address = formData.get("address") as string;
    const notes = formData.get("notes") as string;

    // Initialize templateParams early to avoid ReferenceError in catch block
    let templateParams: any = null;

    // Validate required fields
    if (
      !name?.trim() ||
      !email?.trim() ||
      !preferredDate ||
      !preferredTime ||
      !serviceType
    ) {
      toast({
        title: "Please fill in all required fields",
        description: "Name, email, date, time, and service type are required.",
        variant: "destructive",
      });
      setIsSubmittingConsultation(false);
      return;
    }

    try {
      // Wait for EmailJS to be available with timeout
      const waitForEmailJS = () => {
        return new Promise((resolve, reject) => {
          let attempts = 0;
          const maxAttempts = 50; // 5 seconds total

          const checkEmailJS = () => {
            attempts++;
            if (typeof window !== "undefined" && (window as any).emailjs) {
              resolve(true);
            } else if (attempts >= maxAttempts) {
              reject(new Error("EmailJS failed to load after 5 seconds"));
            } else {
              setTimeout(checkEmailJS, 100);
            }
          };

          checkEmailJS();
        });
      };

      // Wait for EmailJS to be ready
      await waitForEmailJS();
      console.log("EmailJS is ready");

      // Format service type for display
      const formattedServiceType = serviceType
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l: string) => l.toUpperCase());

      // Format date for display
      const formattedDate = new Date(preferredDate).toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      );

      // Prepare template parameters for EmailJS - using exact template variable names
      templateParams = {
        from_name: name.trim(),
        from_email: email.trim(),
        phone_number: phone?.trim() || "Not provided",
        service_type: formattedServiceType,
        preferred_date: formattedDate,
        preferred_time: preferredTime,
        client_address: address?.trim() || "Not provided",
        message: notes?.trim() || "No additional notes provided",
        to_name: "Serene Wings Team",
        reply_to: email.trim(),
      };

      console.log("Sending email with params:", templateParams);

      // Send email using EmailJS with proper error handling
      const result = await (window as any).emailjs.send(
        "default_service", // ✅ Use built-in EmailJS service
        "template_xryflbn",
        templateParams,
        "MBvyIzybQI8o_Z3w-", // Use public key as string parameter
      );

      console.log("EmailJS result:", result);

      // Check if the result indicates success
      if (result.status === 200 || result.text === "OK") {
        // Reset form only on success
        (e.target as HTMLFormElement).reset();

        // Show friendly confirmation message
        toast({
          title: "🎉 Request Received Successfully!",
          description:
            "Thank you! We've received your consultation request and will be in touch within 2-4 hours to confirm your appointment. Check your email for confirmation details.",
          duration: 6000,
        });

        // Show additional success message after a delay
        setTimeout(() => {
          toast({
            title: "📧 Confirmation Email Sent",
            description:
              "We've sent a confirmation email with next steps. If you don't see it, please check your spam folder.",
            duration: 5000,
          });
        }, 1000);
      } else {
        throw new Error(`EmailJS returned status: ${result.status}`);
      }
    } catch (error) {
      console.error("Detailed error sending consultation request:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        response:
          error && typeof error === "object" && "text" in error
            ? error.text
            : "No response text",
        status:
          error && typeof error === "object" && "status" in error
            ? error.status
            : "No status",
        templateParams: templateParams, // Now safely defined
      });

      // More specific error messages
      let errorMessage =
        "There was an issue submitting your request. Please call us directly at +1(919)633-2118 or +1(919)888-1810 and we'll be happy to help you schedule your consultation.";

      if (error instanceof Error) {
        if (error.message.includes("EmailJS failed to load")) {
          errorMessage =
            "Email service is temporarily unavailable. Please call us directly at +1(919)633-2118 or +1(919)888-1810 to schedule your consultation.";
        } else if (
          error.message.includes("Network") ||
          error.message.includes("fetch")
        ) {
          errorMessage =
            "Network connection issue. Please check your internet connection and try again, or call us at +1(919)633-2118 or +1(919)888-1810.";
        }
      }

      toast({
        title: "Submission Error",
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
      });
    } finally {
      setIsSubmittingConsultation(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);

    // Initialize templateParams early to avoid ReferenceError in catch block
    let templateParams: any = null;

    // Validate required fields
    if (
      !reviewForm.name.trim() ||
      !reviewForm.email.trim() ||
      !reviewForm.text.trim() ||
      !reviewForm.location.trim()
    ) {
      toast({
        title: "Please fill in all required fields",
        description: "Name, email, location, and review text are required.",
        variant: "destructive",
      });
      setIsSubmittingReview(false);
      return;
    }

    try {
      // Wait for EmailJS to be available with timeout (same as consultation form)
      const waitForEmailJS = () => {
        return new Promise((resolve, reject) => {
          let attempts = 0;
          const maxAttempts = 50; // 5 seconds total

          const checkEmailJS = () => {
            attempts++;
            if (typeof window !== "undefined" && (window as any).emailjs) {
              resolve(true);
            } else if (attempts >= maxAttempts) {
              reject(new Error("EmailJS failed to load after 5 seconds"));
            } else {
              setTimeout(checkEmailJS, 100);
            }
          };

          checkEmailJS();
        });
      };

      // Wait for EmailJS to be ready
      await waitForEmailJS();
      console.log("EmailJS is ready for testimonial submission");

      // Format rating for display
      const starRating = "⭐".repeat(reviewForm.rating);

      // Prepare template parameters for EmailJS - matching your template structure exactly
      templateParams = {
        from_name: reviewForm.name.trim(),
        from_email: reviewForm.email.trim(),
        message: `${starRating} (${reviewForm.rating}/5 stars)\n\nLocation: ${reviewForm.location.trim()}\n\nReview: ${reviewForm.text.trim()}`,
        to_name: "Serene Wings Team",
        reply_to: reviewForm.email.trim(),
      };

      console.log("Sending testimonial email with params:", templateParams);

      // Send email using EmailJS with your credentials
      const result = await (window as any).emailjs.send(
        "default_service", // Your service ID
        "template_f3hqekj", // Your template ID
        templateParams,
        "hY3udrZIX5U6NSVyG", // Use public key as string parameter
      );

      console.log("EmailJS testimonial result:", result);

      // Check if the result indicates success
      if (result.status === 200 || result.text === "OK") {
        // Save to database for persistence
        try {
          const { data, error } = await supabase
            .from("testimonials")
            .insert({
              name: reviewForm.name.trim(),
              email: reviewForm.email.trim(),
              rating: reviewForm.rating,
              text: reviewForm.text.trim(),
              location: reviewForm.location.trim(),
              is_approved: true,
            })
            .select()
            .single();

          if (error) {
            console.error("Database save failed:", error);
            // Add to local state as fallback
            const fallbackReview: Review = {
              id: Date.now().toString(),
              name: reviewForm.name.trim(),
              rating: reviewForm.rating,
              text: reviewForm.text.trim(),
              date: new Date().toLocaleDateString(),
              location: reviewForm.location.trim(),
            };
            setSubmittedReviews([fallbackReview, ...submittedReviews]);
          } else {
            console.log(
              "✅ [Home] Testimonial saved to database successfully!",
              data,
            );
            // Immediately refresh testimonials from database to get the latest data
            await fetchTestimonials();
          }
        } catch (dbError) {
          console.error("Database save error:", dbError);
          // Add to local state as fallback
          const fallbackReview: Review = {
            id: Date.now().toString(),
            name: reviewForm.name.trim(),
            rating: reviewForm.rating,
            text: reviewForm.text.trim(),
            date: new Date().toLocaleDateString(),
          };
          setSubmittedReviews([fallbackReview, ...submittedReviews]);
        }

        // Show friendly confirmation message (same as consultation form)
        toast({
          title: "🎉 Review Submitted Successfully!",
          description:
            "Thank you for your feedback! We've received your review and will be in touch soon.",
          duration: 6000,
        });

        // Show additional success message after a delay
        setTimeout(() => {
          toast({
            title: "📧 Confirmation Email Sent",
            description:
              "We've sent your review to our team. Thank you for sharing your experience!",
            duration: 5000,
          });
        }, 1000);

        // Reset form and close modal
        setReviewForm({
          name: "",
          email: "",
          rating: 5,
          text: "",
          location: "",
        });
        setShowReviewForm(false);
      } else {
        throw new Error(`EmailJS returned status: ${result.status}`);
      }
    } catch (error) {
      console.error("Detailed error sending testimonial:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        response:
          error && typeof error === "object" && "text" in error
            ? error.text
            : "No response text",
        status:
          error && typeof error === "object" && "status" in error
            ? error.status
            : "No status",
        templateParams: templateParams, // Now safely defined
      });

      // More specific error messages (same as consultation form)
      let errorMessage =
        "There was an issue submitting your review. Please try again or call us at +1(919)633-2118 or +1(919)888-1810.";

      if (error instanceof Error) {
        if (error.message.includes("EmailJS failed to load")) {
          errorMessage =
            "Email service is temporarily unavailable. Please call us directly at +1(919)633-2118 or +1(919)888-1810 to share your review.";
        } else if (
          error.message.includes("Network") ||
          error.message.includes("fetch")
        ) {
          errorMessage =
            "Network connection issue. Please check your internet connection and try again, or call us at +1(919)633-2118 or +1(919)888-1810.";
        }
      }

      toast({
        title: "Submission Error",
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">
                Serene Wings
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/services"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Services
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              About
            </Link>
            <Link
              to="/testimonials"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Testimonials
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="hidden sm:inline-flex items-center space-x-2"
            >
              <Phone className="h-4 w-4" />
              <div className="flex flex-col text-sm">
                <span>+1(919)633-2118</span>
                <span>+1(919)888-1810</span>
              </div>
            </Button>
            <Button
              onClick={scrollToConsultation}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero section */}
        <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Compassionate Care for Your
                  <span className="text-blue-600 block">Loved Ones</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Professional, personalized elderly care services in Raleigh,
                  NC. Our certified caregivers provide peace of mind for
                  families and dignity for seniors.
                </p>
                <div className="mb-8">
                  <CallToActionButtons
                    onConsultationClick={scrollToConsultation}
                  />
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-green-600 mr-2" />
                    <span>Licensed & Insured</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-green-600 mr-2" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80"
                  alt="Caring caregiver with elderly woman"
                  className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
                />
                <div className="absolute -bottom-6 -left-6">
                  <SocialProof />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Credentials Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Trusted by Families Across Raleigh
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our certified caregivers bring years of experience and genuine
                compassion to every home we serve.
              </p>
            </div>

            <TrustBadges />

            {/* Local Credentials */}
            <div className="mb-12">
              <LocalCredentials />
            </div>

            {/* Value Proposition */}
            <div className="mb-12">
              <ValueProposition />
            </div>

            {/* Testimonial Carousel */}
            <div
              className="bg-gray-50 rounded-2xl p-8 relative"
              id="testimonials"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  What Families Say
                </h3>
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <Button
                  onClick={() => setShowReviewForm(true)}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Give Us a Review
                </Button>
              </div>

              <div className="max-w-4xl mx-auto">
                {isLoadingTestimonials ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading testimonials...</p>
                  </div>
                ) : allTestimonials.length > 0 ? (
                  <>
                    <div className="text-center">
                      <blockquote className="text-lg text-gray-700 mb-6 italic">
                        &quot;{allTestimonials[currentTestimonial].text}&quot;
                      </blockquote>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">
                            {allTestimonials[currentTestimonial].name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {allTestimonials[currentTestimonial].location} •{" "}
                            {allTestimonials[currentTestimonial].date}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center items-center space-x-4 mt-8">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={prevTestimonial}
                        className="p-2 hover:bg-white"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <div className="flex space-x-2">
                        {allTestimonials.map((_, index) => (
                          <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentTestimonial
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                            onClick={() => setCurrentTestimonial(index)}
                          />
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={nextTestimonial}
                        className="p-2 hover:bg-white"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      No testimonials available at the moment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-gray-50" id="services">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Comprehensive Care Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From companionship to specialized medical care, we provide
                personalized services tailored to your loved one's unique needs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Companion Care</CardTitle>
                  <CardDescription>
                    Social interaction, meal preparation, light housekeeping,
                    and transportation assistance.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Personal Care</CardTitle>
                  <CardDescription>
                    Assistance with bathing, dressing, grooming, medication
                    reminders, and mobility support.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Alzheimer's & Dementia Care</CardTitle>
                  <CardDescription>
                    Specialized care for memory-related conditions with trained
                    professionals and structured routines.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>24/7 Live-In Care</CardTitle>
                  <CardDescription>
                    Round-the-clock care in the comfort of home with dedicated
                    live-in caregivers.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle>Respite Care</CardTitle>
                  <CardDescription>
                    Temporary relief for family caregivers, from a few hours to
                    several days.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle>Post-Hospital Care</CardTitle>
                  <CardDescription>
                    Transitional care support to ensure safe recovery and
                    prevent readmission.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Local Service Areas Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Serving the Greater Raleigh Area
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  We're proud to serve families throughout the Triangle area
                  with compassionate, professional care services. Our local
                  presence means we understand the unique needs of our
                  community.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Raleigh</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Cary</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Wake Forest</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Apex</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Morrisville</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Garner</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Check Service Availability
                </Button>
              </div>

              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&q=80"
                  alt="Raleigh NC skyline"
                  className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
                />
                <div className="absolute top-6 left-6 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Local Presence
                      </p>
                      <p className="text-sm text-gray-600">
                        Serving Triangle families since 2019
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Schedule Consultation Section */}
        <section className="py-16 bg-yellow-50" id="consultation-form">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                🟨 Schedule a Free Consultation
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Get started with a free consultation to discuss your care needs.
              </p>

              {/* Risk Reversal */}
              <div className="mb-8">
                <RiskReversal />
              </div>
            </div>

            <Card className="p-8">
              <form onSubmit={handleConsultationSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="consultName"
                      className="text-base font-medium"
                    >
                      Your Name *
                    </Label>
                    <Input
                      id="consultName"
                      name="name"
                      placeholder="Enter your full name"
                      className="h-12 text-base"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="consultEmail"
                      className="text-base font-medium"
                    >
                      Email Address *
                    </Label>
                    <Input
                      id="consultEmail"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="h-12 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="consultPhone"
                    className="text-base font-medium"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="consultPhone"
                    name="phone"
                    type="tel"
                    placeholder="(919) 555-0123"
                    className="h-12 text-base"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="preferredDate"
                      className="text-base font-medium"
                    >
                      Preferred Date *
                    </Label>
                    <Input
                      id="preferredDate"
                      name="preferredDate"
                      type="date"
                      className="h-12 text-base"
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="preferredTime"
                      className="text-base font-medium"
                    >
                      Preferred Time *
                    </Label>
                    <select
                      id="preferredTime"
                      name="preferredTime"
                      className="h-12 text-base w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select time</option>
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="serviceType"
                    className="text-base font-medium"
                  >
                    Type of Service Needed *
                  </Label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    className="h-12 text-base w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select service type</option>
                    <option value="Companion Care">Companion Care</option>
                    <option value="Personal Care">Personal Care</option>
                    <option value="Alzheimer's & Dementia Care">
                      Alzheimer's & Dementia Care
                    </option>
                    <option value="24/7 Live-In Care">24/7 Live-In Care</option>
                    <option value="Respite Care">Respite Care</option>
                    <option value="Post-Hospital Care">
                      Post-Hospital Care
                    </option>
                    <option value="Not Sure - Need Guidance">
                      Not Sure - Need Guidance
                    </option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-base font-medium">
                    Address <span className="text-gray-500">(optional)</span>
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="City, ZIP code for service availability"
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-base font-medium">
                    Additional Notes or Special Requests
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Tell us about specific care needs, preferences, or questions..."
                    className="min-h-[100px] text-base"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base"
                  disabled={isSubmittingConsultation}
                >
                  {isSubmittingConsultation ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    "🔵 Request Appointment"
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    ✅ You'll receive a confirmation by phone or email shortly
                    after submission.
                  </p>
                </div>
              </form>
            </Card>
          </div>
        </section>

        {/* Why This Process is Safe and Easy Section */}
        <section className="py-16 bg-purple-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                🟪 Why This Process is Safe and Easy
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  🛡️ Secure and Private
                </h3>
                <p className="text-gray-600">
                  Your data is encrypted and never shared without permission. We
                  follow HIPAA guidelines to protect your privacy.
                </p>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  📞 Human Support
                </h3>
                <p className="text-gray-600">
                  Need help? Call us anytime: <strong>+1(919)633-2118</strong>{" "}
                  or <strong>+1(919)888-1810</strong>. Real people are here to
                  assist you every step of the way.
                </p>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  👥 Personal Touch
                </h3>
                <p className="text-gray-600">
                  Every request is reviewed by a real care coordinator within
                  hours. No automated responses - just genuine care.
                </p>
              </Card>
            </div>

            {/* FAQ Section */}
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Frequently Asked Questions
              </h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">
                    Can I cancel an appointment later?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, absolutely. You can cancel or reschedule your
                    consultation at any time by calling us at +1(919)633-2118 or
                    +1(919)888-1810 or emailing us. We understand that schedules
                    change and we're flexible to accommodate your needs.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
                    How soon will a caregiver be assigned?
                  </AccordionTrigger>
                  <AccordionContent>
                    After your consultation, we typically match you with a
                    qualified caregiver within 24-48 hours. For urgent needs, we
                    can often arrange care the same day. Our goal is to provide
                    care as quickly as possible while ensuring the perfect
                    match.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
                    What happens during the free consultation?
                  </AccordionTrigger>
                  <AccordionContent>
                    During your free consultation, we'll discuss your loved
                    one's specific needs, preferences, and schedule. We'll
                    explain our services, answer all your questions, and create
                    a personalized care plan. There's no obligation to proceed
                    after the consultation.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">
                    Are your caregivers licensed and insured?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, all our caregivers are licensed, bonded, and insured.
                    They undergo comprehensive background checks and receive
                    ongoing training. We're fully licensed as a home care agency
                    and carry liability insurance for your peace of mind.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA Section with Social Proof */}
        <section className="py-16 bg-blue-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Testimonial Highlight */}
            <div className="mb-8">
              <TestimonialHighlight />
            </div>

            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join 200+ families who trust Serene Wings for compassionate
                care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
                  onClick={scrollToConsultation}
                >
                  Schedule Free Consultation
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg flex items-center"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call +1(919)633-2118
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-8 w-8 text-blue-400" />
                <span className="font-bold text-xl">
                  Serene Wings Caregiving
                </span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Providing compassionate, professional elderly care services to
                families throughout the Raleigh, NC area since 2019.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <div className="flex flex-col text-sm">
                    <span>+1(919)633-2118</span>
                    <span>+1(919)888-1810</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span>Serving Greater Raleigh, NC</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link
                    to="#services"
                    className="hover:text-white transition-colors"
                  >
                    Companion Care
                  </Link>
                </li>
                <li>
                  <Link
                    to="#services"
                    className="hover:text-white transition-colors"
                  >
                    Personal Care
                  </Link>
                </li>
                <li>
                  <Link
                    to="#services"
                    className="hover:text-white transition-colors"
                  >
                    Alzheimer's Care
                  </Link>
                </li>
                <li>
                  <Link
                    to="#services"
                    className="hover:text-white transition-colors"
                  >
                    24/7 Live-In Care
                  </Link>
                </li>
                <li>
                  <Link
                    to="#services"
                    className="hover:text-white transition-colors"
                  >
                    Respite Care
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/testimonials"
                    className="hover:text-white transition-colors"
                  >
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Emergency Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Serene Wings Caregiving. All rights reserved. Licensed &
              Insured.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Enhanced Mobile Experience */}
      <StickyCallToAction onConsultationClick={scrollToConsultation} />
      <EmergencyContact />

      {/* Review Form Modal */}
      <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share Your Experience</DialogTitle>
            <DialogDescription>
              Help other families by sharing your experience with Serene Wings
              Caregiving.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reviewName" className="text-sm font-medium">
                Full Name *
              </Label>
              <Input
                id="reviewName"
                value={reviewForm.name}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, name: e.target.value })
                }
                placeholder="Enter your full name"
                className="h-10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviewEmail" className="text-sm font-medium">
                Email Address *{" "}
                <span className="text-gray-500">(not shown publicly)</span>
              </Label>
              <Input
                id="reviewEmail"
                type="email"
                value={reviewForm.email}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, email: e.target.value })
                }
                placeholder="Enter your email"
                className="h-10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Rating *</Label>
              <Select
                value={reviewForm.rating.toString()}
                onValueChange={(value) =>
                  setReviewForm({ ...reviewForm, rating: parseInt(value) })
                }
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ (5 stars)</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ (4 stars)</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ (3 stars)</SelectItem>
                  <SelectItem value="2">⭐⭐ (2 stars)</SelectItem>
                  <SelectItem value="1">⭐ (1 star)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviewLocation" className="text-sm font-medium">
                Your Location *
              </Label>
              <Input
                id="reviewLocation"
                value={reviewForm.location}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, location: e.target.value })
                }
                placeholder="e.g., North Raleigh, Cary, Wake Forest"
                className="h-10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviewText" className="text-sm font-medium">
                Your Review *
              </Label>
              <Textarea
                id="reviewText"
                value={reviewForm.text}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, text: e.target.value })
                }
                placeholder="Share your experience with our caregiving services..."
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowReviewForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmittingReview}
              >
                {isSubmittingReview ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
