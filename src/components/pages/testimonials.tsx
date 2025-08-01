import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Heart, Phone, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "../../../supabase/supabase";

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  location: string;
}

export default function TestimonialsPage() {
  const { toast } = useToast();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittedReviews, setSubmittedReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    email: "",
    rating: 5,
    text: "",
    location: "",
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);

  // Load EmailJS SDK and fetch testimonials from database
  useEffect(() => {
    const loadEmailJS = () => {
      // Check if EmailJS is already initialized globally
      if (typeof window !== "undefined" && (window as any).emailjsInitialized) {
        console.log("✅ EmailJS already initialized globally");
        return;
      }

      if (typeof window !== "undefined" && !(window as any).emailjs) {
        const script = document.createElement("script");
        script.src = "https://cdn.emailjs.com/dist/email.min.js";
        script.onload = () => {
          (window as any).emailjs.init("hY3udrZIX5U6NSVyG");
          (window as any).emailjsInitialized = true;
          console.log("✅ EmailJS initialized for testimonials page");
        };
        document.head.appendChild(script);
      } else if (
        (window as any).emailjs &&
        !(window as any).emailjsInitialized
      ) {
        (window as any).emailjs.init("hY3udrZIX5U6NSVyG");
        (window as any).emailjsInitialized = true;
        console.log("✅ EmailJS initialized for testimonials page");
      }
    };

    const initializePage = async () => {
      setIsLoadingTestimonials(true);
      loadEmailJS();
      await fetchTestimonialsFromDatabase();
    };

    initializePage();
  }, []);

  // Auto-refresh testimonials every 30 seconds to catch new submissions
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoadingTestimonials) {
        fetchTestimonialsFromDatabase();
      }
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [isLoadingTestimonials]);

  const testimonials = [
    {
      id: "1",
      name: "Sarah Johnson",
      location: "North Raleigh",
      text: "Serene Wings has been a blessing for our family. The caregiver they provided for my mother is compassionate, professional, and truly cares about her wellbeing. We couldn't ask for better care.",
      rating: 5,
      date: "December 2024",
    },
    {
      id: "2",
      name: "Michael Chen",
      location: "Cary",
      text: "The Alzheimer's care program gave us peace of mind during a very difficult time. Their specialized approach and 24/7 support made all the difference for our father and our entire family.",
      rating: 5,
      date: "November 2024",
    },
    {
      id: "3",
      name: "Linda Rodriguez",
      location: "Wake Forest",
      text: "Professional, reliable, and caring. Our caregiver has become like family to us. I highly recommend Serene Wings to anyone needing quality care for their loved ones.",
      rating: 5,
      date: "October 2024",
    },
    {
      id: "4",
      name: "Robert Thompson",
      location: "Apex",
      text: "After my wife's surgery, we needed someone reliable for her recovery. Serene Wings provided excellent post-surgical care that helped her heal faster and gave me peace of mind.",
      rating: 5,
      date: "September 2024",
    },
    {
      id: "5",
      name: "Maria Gonzalez",
      location: "Morrisville",
      text: "The companion care service has been wonderful for my elderly mother. She looks forward to her caregiver's visits and has become much more social and happy.",
      rating: 5,
      date: "August 2024",
    },
    {
      id: "6",
      name: "David Williams",
      location: "Garner",
      text: "Exceptional service and genuine care. The team at Serene Wings went above and beyond to accommodate our family's specific needs and schedule.",
      rating: 5,
      date: "July 2024",
    },
  ];

  const allTestimonials = [...testimonials, ...submittedReviews];

  const fetchTestimonialsFromDatabase = async () => {
    try {
      console.log(
        "🔄 [Testimonials Page] Fetching testimonials from database...",
      );

      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(
          "❌ [Testimonials Page] Error fetching testimonials:",
          error,
        );
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

      // Sort by creation date (newest first) to ensure proper ordering
      dbTestimonials.sort((a, b) => {
        const dateA = new Date(
          data?.find((t) => t.id === a.id)?.created_at || 0,
        );
        const dateB = new Date(
          data?.find((t) => t.id === b.id)?.created_at || 0,
        );
        return dateB.getTime() - dateA.getTime();
      });

      setSubmittedReviews(dbTestimonials);
      console.log(
        `✅ [Testimonials Page] Successfully loaded ${dbTestimonials.length} testimonials from database`,
        dbTestimonials,
      );
    } catch (error) {
      console.error(
        "❌ [Testimonials Page] Error fetching testimonials:",
        error,
      );
      // Set empty array on error to prevent infinite loading
      setSubmittedReviews([]);
    } finally {
      setIsLoadingTestimonials(false);
    }
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % allTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + allTestimonials.length) % allTestimonials.length,
    );
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);

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

    // First, save to database immediately (more reliable than email)
    let databaseSaveSuccess = false;
    let newTestimonialId = null;

    try {
      console.log(
        "💾 [Testimonials Page] Saving testimonial to database first...",
      );

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
        console.error("❌ [Testimonials Page] Database save failed:", error);
        throw error;
      } else {
        console.log(
          "✅ [Testimonials Page] Testimonial saved to database successfully!",
          data,
        );
        databaseSaveSuccess = true;
        newTestimonialId = data.id;

        // Immediately refresh testimonials from database to show the new one
        await fetchTestimonialsFromDatabase();

        // Update current testimonial index to show the new one if it's the first
        if (allTestimonials.length === 0) {
          setCurrentTestimonial(0);
        }
      }
    } catch (dbError) {
      console.error("❌ [Testimonials Page] Database save error:", dbError);

      // Show database error but continue with email
      toast({
        title: "⚠️ Database Save Issue",
        description:
          "There was an issue saving to our database, but we'll still send your review via email.",
        variant: "destructive",
        duration: 5000,
      });
    }

    // Then, send email notification (secondary priority)
    try {
      // Wait for EmailJS to be available
      const waitForEmailJS = () => {
        return new Promise((resolve, reject) => {
          let attempts = 0;
          const maxAttempts = 50;

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

      await waitForEmailJS();
      console.log("EmailJS is ready for testimonial submission");

      // Format rating for display (matching your template structure)
      const starRating = "⭐".repeat(reviewForm.rating);

      // Prepare template parameters exactly as you specified
      const templateParams = {
        from_name: reviewForm.name.trim(),
        from_email: reviewForm.email.trim(),
        message: `${starRating} (${reviewForm.rating}/5 stars)\n\nLocation: ${reviewForm.location.trim()}\n\nReview: ${reviewForm.text.trim()}\n\n${databaseSaveSuccess ? `Database ID: ${newTestimonialId}` : "Database save failed - manual review needed"}`,
        to_name: "Serene Wings Team",
        reply_to: reviewForm.email.trim(),
      };

      console.log("Sending testimonial email with params:", templateParams);

      // Send email using your exact EmailJS configuration
      const result = await (window as any).emailjs.send(
        "default_service", // Your service ID
        "template_f3hqekj", // Your template ID
        templateParams,
        "hY3udrZIX5U6NSVyG", // Use public key as string parameter
      );

      console.log("EmailJS testimonial result:", result);

      if (result.status === 200 || result.text === "OK") {
        console.log("✅ [Testimonials Page] Email sent successfully!");
      } else {
        console.warn(
          "⚠️ [Testimonials Page] Email may not have sent properly:",
          result,
        );
      }
    } catch (emailError) {
      console.error("❌ [Testimonials Page] Email send error:", emailError);

      // Don't fail the entire process if email fails, since database save is more important
      if (!databaseSaveSuccess) {
        // Only show email error if database also failed
        toast({
          title: "⚠️ Email Send Issue",
          description:
            "There was an issue sending the email notification, but your review may still be saved.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }

    // Show success message if database save worked (regardless of email status)
    if (databaseSaveSuccess) {
      toast({
        title: "✅ Thank you for your testimonial!",
        description:
          "Your review has been saved successfully and will appear on our website. We appreciate your feedback!",
        duration: 6000,
      });

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
      // If database save failed, show error
      toast({
        title: "❌ Failed to save testimonial",
        description:
          "There was an issue saving your review. Please try again or call us at +1(919)633-2118 or +1(919)888-1810.",
        variant: "destructive",
        duration: 8000,
      });
    }

    setIsSubmittingReview(false);
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
              className="text-blue-600 font-medium transition-colors"
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
            <Link to="/contact">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Families Say About Us
            </h1>
            <p className="text-xl text-blue-600 font-medium mb-8">
              Real Stories from Real Families
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Don't just take our word for it. Hear from the families we've had
              the privilege to serve throughout the Raleigh area. Their stories
              inspire us every day to provide the best possible care.
            </p>
          </div>
        </section>

        {/* Featured Testimonial Carousel */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-50 rounded-2xl p-8 relative">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Featured Review
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
                  Share Your Experience
                </Button>
              </div>

              {isLoadingTestimonials ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading testimonials...</p>
                </div>
              ) : allTestimonials.length > 0 ? (
                <div className="max-w-3xl mx-auto">
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
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    No testimonials available at the moment.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* All Testimonials Grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                All Reviews
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Every review represents a family we've helped and a relationship
                we've built through compassionate care.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allTestimonials.map((testimonial, index) => (
                <Card
                  key={testimonial.id}
                  className="hover:shadow-lg transition-shadow border-0 shadow-md"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {testimonial.date}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {testimonial.name}
                    </CardTitle>
                    <CardDescription className="text-blue-600 font-medium">
                      {testimonial.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      &quot;{testimonial.text}&quot;
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-blue-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Experience Our Care?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join the families who trust Serene Wings for compassionate,
              professional caregiving services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
                >
                  Get Free Consultation
                </Button>
              </Link>
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
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
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
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link
                    to="/services"
                    className="hover:text-white transition-colors"
                  >
                    Personal Care
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="hover:text-white transition-colors"
                  >
                    Companion Care
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="hover:text-white transition-colors"
                  >
                    Alzheimer's Care
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="hover:text-white transition-colors"
                  >
                    24/7 Live-In Care
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
                  <Link
                    to="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Serene Wings Caregiving. All rights reserved. Licensed &
              Insured.
            </p>
          </div>
        </div>
      </footer>

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
                <SelectTrigger className="h-10" aria-label="Select rating">
                  <SelectValue placeholder="Select rating" />
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
                    Sending...
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
