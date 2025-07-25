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
  CheckCircle,
  Shield,
  Users,
  Clock,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  const whyChooseUs = [
    "Trusted caregivers",
    "Locally owned and operated",
    "Flexible care plans",
    "High client satisfaction",
    "Emergency-ready and background-checked staff",
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
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Services
            </Link>
            <Link
              to="/about"
              className="text-blue-600 font-medium transition-colors"
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
              About Serene Wings Caregiving
            </h1>
            <p className="text-xl text-blue-600 font-medium mb-8">
              Rooted in Raleigh. Driven by Compassion.
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Founded with a deep respect for our elders and a commitment to
              their dignity, Serene Wings Caregiving has been serving families
              in Raleigh with warmth, professionalism, and a personal touch. Our
              mission is simple: provide dependable care that feels like family.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  To uplift the lives of seniors through reliable,
                  heart-centered care that fosters independence, safety, and
                  connection.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Heart className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      Heart-Centered Care
                    </h3>
                    <p className="text-gray-600">
                      Every interaction is guided by compassion and respect
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80"
                  alt="Caregiver helping elderly person"
                  className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Us
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We're committed to providing the highest quality care with the
                personal touch that makes all the difference.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {whyChooseUs.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-white p-6 rounded-xl shadow-sm"
                >
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center border-0 shadow-md">
                <CardHeader>
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>Licensed & Insured</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Fully licensed and insured for your peace of mind and
                    protection.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-md">
                <CardHeader>
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle>Experienced Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Our caregivers bring years of experience and genuine
                    compassion.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-md">
                <CardHeader>
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle>24/7 Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Round-the-clock availability for emergencies and peace of
                    mind.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Meet Our Leadership
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our dedicated team brings together years of healthcare
                experience with a genuine passion for serving seniors.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center border-0 shadow-md">
                <CardHeader>
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">AM</span>
                  </div>
                  <CardTitle>Alice Momanyi</CardTitle>
                  <CardDescription className="text-green-600 font-medium">
                    Care Coordinator
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Alice's background in nursing and her bilingual abilities
                    help us serve diverse families with personalized care plans
                    and ongoing support.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-md">
                <CardHeader>
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">MM</span>
                  </div>
                  <CardTitle>Margaret Momanyi</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">
                    Founder & Director
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    With over 15 years in healthcare, Margaret founded Serene
                    Wings with a vision to provide dignified, compassionate care
                    that treats every client like family.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-md">
                <CardHeader>
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">JB</span>
                  </div>
                  <CardTitle>Joe Bosire</CardTitle>
                  <CardDescription className="text-purple-600 font-medium">
                    Senior Caregiver
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Joe specializes in Alzheimer's and dementia care, bringing
                    patience, understanding, and specialized training to support
                    memory care clients.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-blue-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Learn More?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Contact us today to discuss how we can provide the best care for
              your loved one.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
                >
                  Get in Touch
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
    </div>
  );
}
