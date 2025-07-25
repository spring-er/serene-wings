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
  Heart,
  Phone,
  Mail,
  MapPin,
  Clock,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function ContactPage() {
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    preferredTime: "",
    message: "",
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);

    if (
      !contactForm.fullName.trim() ||
      !contactForm.phone.trim() ||
      !contactForm.email.trim() ||
      !contactForm.message.trim()
    ) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsSubmittingContact(false);
      return;
    }

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
      console.log("EmailJS is ready for contact form");

      // Format preferred time for display
      const formattedPreferredTime = contactForm.preferredTime
        ? contactForm.preferredTime.charAt(0).toUpperCase() +
          contactForm.preferredTime.slice(1)
        : "No preference";

      // Prepare template parameters for EmailJS
      const templateParams = {
        from_name: contactForm.fullName.trim(),
        from_email: contactForm.email.trim(),
        phone_number: contactForm.phone.trim(),
        preferred_time: formattedPreferredTime,
        message: contactForm.message.trim(),
        to_name: "Serene Wings Team",
        reply_to: contactForm.email.trim(),
        subject: `Contact Form Message from ${contactForm.fullName.trim()}`,
      };

      console.log("Sending contact form email with params:", templateParams);

      // Send email using EmailJS
      const result = await (window as any).emailjs.send(
        "default_service",
        "template_xryflbn", // Using the same template as consultation form
        templateParams,
        {
          publicKey: "MBvyIzybQI8o_Z3w-",
        },
      );

      console.log("EmailJS contact form result:", result);

      if (result.status === 200 || result.text === "OK") {
        toast({
          title: "✅ Message sent successfully!",
          description:
            "We'll get back to you within 24 hours. Check your email for confirmation.",
          duration: 6000,
        });

        // Reset form
        setContactForm({
          fullName: "",
          phone: "",
          email: "",
          preferredTime: "",
          message: "",
        });
      } else {
        throw new Error(`EmailJS returned status: ${result.status}`);
      }
    } catch (error) {
      console.error("Error sending contact form:", error);

      let errorMessage =
        "There was an issue sending your message. Please call us directly at +1(919)449-5005, +1(919)633-2118, or +1(919)888-1810 and we'll be happy to help you.";

      if (error instanceof Error) {
        if (error.message.includes("EmailJS failed to load")) {
          errorMessage =
            "Email service is temporarily unavailable. Please call us directly at +1(919)449-5005, +1(919)633-2118, or +1(919)888-1810.";
        }
      }

      toast({
        title: "Message sending failed",
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
      });
    } finally {
      setIsSubmittingContact(false);
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
            <Link to="/contact" className="text-blue-600 font-medium">
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
                <span>+1(919)449-5005</span>
                <span>+1(919)633-2118</span>
                <span>+1(919)888-1810</span>
              </div>
            </Button>
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-blue-600 font-semibold mb-4">
              We're Here When You Need Us
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you have questions, want to book a free consultation, or
              just want to learn more about our services, we're ready to help.
            </p>
          </div>
        </section>

        {/* Contact Form and Info Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <Card className="p-8">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Send Us a Message
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Fill out the form below and we'll get back to you as soon
                      as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="fullName"
                          className="text-base font-medium"
                        >
                          Full Name *
                        </Label>
                        <Input
                          id="fullName"
                          value={contactForm.fullName}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              fullName: e.target.value,
                            })
                          }
                          placeholder="Enter your full name"
                          className="h-12 text-base"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="phone"
                            className="text-base font-medium"
                          >
                            Phone Number *
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={contactForm.phone}
                            onChange={(e) =>
                              setContactForm({
                                ...contactForm,
                                phone: e.target.value,
                              })
                            }
                            placeholder="(919) 555-0123"
                            className="h-12 text-base"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-base font-medium"
                          >
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={contactForm.email}
                            onChange={(e) =>
                              setContactForm({
                                ...contactForm,
                                email: e.target.value,
                              })
                            }
                            placeholder="your.email@example.com"
                            className="h-12 text-base"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-base font-medium">
                          Preferred Contact Time
                        </Label>
                        <Select
                          value={contactForm.preferredTime}
                          onValueChange={(value) =>
                            setContactForm({
                              ...contactForm,
                              preferredTime: value,
                            })
                          }
                        >
                          <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Select preferred time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">
                              Morning (8 AM - 12 PM)
                            </SelectItem>
                            <SelectItem value="afternoon">
                              Afternoon (12 PM - 5 PM)
                            </SelectItem>
                            <SelectItem value="evening">
                              Evening (5 PM - 8 PM)
                            </SelectItem>
                            <SelectItem value="anytime">Anytime</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="message"
                          className="text-base font-medium"
                        >
                          Message *
                        </Label>
                        <Textarea
                          id="message"
                          value={contactForm.message}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              message: e.target.value,
                            })
                          }
                          placeholder="Tell us about your care needs, questions, or how we can help..."
                          className="min-h-[120px] text-base"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base"
                        disabled={isSubmittingContact}
                      >
                        {isSubmittingContact ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Contact Information
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <Phone className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Phone
                        </h3>
                        <div className="text-gray-600 space-y-1">
                          <a
                            href="tel:+19194495005"
                            className="hover:text-blue-600 transition-colors block"
                          >
                            +1(919)449-5005
                          </a>
                          <a
                            href="tel:+19196332118"
                            className="hover:text-blue-600 transition-colors block"
                          >
                            +1(919)633-2118
                          </a>
                          <a
                            href="tel:+19198881810"
                            className="hover:text-blue-600 transition-colors block"
                          >
                            +1(919)888-1810
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <Mail className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Email
                        </h3>
                        <p className="text-gray-600">
                          <a
                            href="mailto:serenewingscaregivingllc@gmail.com"
                            className="hover:text-blue-600 transition-colors"
                          >
                            serenewingscaregivingllc@gmail.com
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Hours
                        </h3>
                        <p className="text-gray-600">
                          Monday – Friday | 8 AM – 6 PM
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-red-100 p-3 rounded-lg">
                        <Smartphone className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Emergency Line
                        </h3>
                        <p className="text-gray-600">
                          Available 24/7
                          <br />
                          <div className="space-y-1">
                            <a
                              href="tel:+19194495005"
                              className="hover:text-blue-600 transition-colors font-medium block"
                            >
                              +1(919)449-5005
                            </a>
                            <a
                              href="tel:+19196332118"
                              className="hover:text-blue-600 transition-colors font-medium block"
                            >
                              +1(919)633-2118
                            </a>
                            <a
                              href="tel:+19198881810"
                              className="hover:text-blue-600 transition-colors font-medium block"
                            >
                              +1(919)888-1810
                            </a>
                          </div>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 bg-blue-50">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready for a Personal Touch?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Want to meet us in person or schedule a home visit? We'd love to
              come to you and discuss your care needs in the comfort of your own
              home.
            </p>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg inline-flex items-center"
            >
              Request a Home Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
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
                    <span>+1(919)449-5005</span>
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
                    Personal Care
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
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Careers
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
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Contact Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-40">
        <div className="flex space-x-3">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center">
            <Phone className="mr-2 h-4 w-4" />
            Call Now
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Send Message
          </Button>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
