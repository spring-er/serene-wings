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
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

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
  const [submittedReviews, setSubmittedReviews] = useState<Review[]>(() => {
    // Load reviews from localStorage on component mount
    const savedReviews = localStorage.getItem("serene-wings-reviews");
    return savedReviews ? JSON.parse(savedReviews) : [];
  });
  const [reviewForm, setReviewForm] = useState({
    name: "",
    email: "",
    rating: 5,
    text: "",
  });

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

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % allTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + allTestimonials.length) % allTestimonials.length,
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !reviewForm.name.trim() ||
      !reviewForm.email.trim() ||
      !reviewForm.text.trim()
    ) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      name: reviewForm.name.trim(),
      rating: reviewForm.rating,
      text: reviewForm.text.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      location: "Raleigh Area",
    };

    const updatedReviews = [newReview, ...submittedReviews];
    setSubmittedReviews(updatedReviews);

    // Save to localStorage for persistence
    localStorage.setItem(
      "serene-wings-reviews",
      JSON.stringify(updatedReviews),
    );

    setReviewForm({ name: "", email: "", rating: 5, text: "" });
    setShowReviewForm(false);

    toast({
      title: "Thank you for your review!",
      description:
        "Your review has been submitted and is now visible on our site.",
    });
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
              <span>(919) 888-1810</span>
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

              {allTestimonials.length > 0 && (
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
                Call (919) 888-1810
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
                families throughout the Raleigh, NC area since 2015.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <span>(919) 888-1810</span>
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
              >
                Submit Review
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
