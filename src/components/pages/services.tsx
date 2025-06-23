import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Heart,
  Phone,
  Users,
  Shield,
  Clock,
  ChefHat,
  Home,
  Stethoscope,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ServicesPage() {
  const services = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Personal Care Assistance",
      description:
        "Help with bathing, grooming, dressing, and hygiene to ensure safety and dignity.",
      bgColor: "bg-blue-50",
    },
    {
      icon: <Heart className="h-8 w-8 text-pink-600" />,
      title: "Companion Care",
      description:
        "Friendly conversation, games, errands, and emotional support to reduce isolation.",
      bgColor: "bg-pink-50",
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "Alzheimer's & Dementia Care",
      description:
        "Patient, structured care from trained professionals who understand memory challenges.",
      bgColor: "bg-purple-50",
    },
    {
      icon: <Stethoscope className="h-8 w-8 text-green-600" />,
      title: "Post-Surgical Support",
      description:
        "Assistance with recovery after procedures — medication reminders, mobility help, and more.",
      bgColor: "bg-green-50",
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      title: "24/7 & Live-In Care",
      description:
        "Around-the-clock peace of mind with continuous care and monitoring.",
      bgColor: "bg-orange-50",
    },
    {
      icon: <ChefHat className="h-8 w-8 text-yellow-600" />,
      title: "Meal Preparation & Nutrition",
      description:
        "Nutritious, personalized meal planning and cooking to support wellness.",
      bgColor: "bg-yellow-50",
    },
    {
      icon: <Home className="h-8 w-8 text-indigo-600" />,
      title: "Light Housekeeping",
      description:
        "Keeping living spaces clean, safe, and comfortable with routine tidying and laundry.",
      bgColor: "bg-indigo-50",
    },
  ];

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
              className="text-blue-600 font-medium transition-colors"
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
              Our Caregiving Services
            </h1>
            <p className="text-xl text-blue-600 font-medium mb-8">
              Compassionate, Personalized Care — When and Where It Matters Most
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              At Serene Wings Caregiving, we provide a full range of services
              tailored to meet the unique needs of every senior and family we
              serve. From daily companionship to specialized support, our
              trained caregivers deliver care with dignity, kindness, and
              excellence — right here in Raleigh.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow border-0 shadow-md"
                >
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 ${service.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                    >
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-center leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
              Not sure what level of care you need?
            </h2>
            <Link to="/contact">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
              >
                Schedule a Free Care Assessment →
              </Button>
            </Link>
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
    </div>
  );
}
