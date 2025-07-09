
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Cake, Heart, Star, Phone, Mail, MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react';

const PublicWebsite = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cakeType: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here we would normally submit to Supabase
    console.log('Lead submitted:', formData);
    
    toast({
      title: "Thank you for your inquiry!",
      description: "We'll get back to you within 24 hours to discuss your cake order.",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      cakeType: '',
      message: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const cakeTypes = [
    { name: "Wedding Cakes", description: "Elegant tiered cakes for your special day", price: "From $200" },
    { name: "Birthday Cakes", description: "Custom designs that make birthdays memorable", price: "From $45" },
    { name: "Cupcakes", description: "Perfectly portioned treats for any occasion", price: "From $24/dozen" },
    { name: "Custom Designs", description: "Bring your vision to life with our artistic touch", price: "Quote on request" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Cake className="h-8 w-8 text-primary" />
              <span className="font-serif text-2xl font-bold text-primary">Sweet Delights</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
              <a href="#services" className="text-foreground hover:text-primary transition-colors">Services</a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
              <Button asChild variant="outline" size="sm">
                <a href="/crm">CRM Login</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-primary mb-6 text-balance">
            Artisanal Cakes Made with <Heart className="inline h-12 w-12 text-accent" fill="currentColor" />
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-balance">
            From wedding masterpieces to birthday surprises, we craft every cake with passion and premium ingredients.
          </p>
          <Button size="lg" className="text-lg px-8 py-3" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
            Order Your Dream Cake
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-primary mb-4">Our Story</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
              For over a decade, Sweet Delights has been the heart of our community's celebrations. 
              Every cake tells a story, and we're honored to be part of your most precious moments.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardHeader className="text-center">
                <Star className="h-12 w-12 text-accent mx-auto mb-4" fill="currentColor" />
                <CardTitle>Premium Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  We source only the finest organic flour, farm-fresh eggs, and real vanilla to ensure every bite is exceptional.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="text-center">
                <Heart className="h-12 w-12 text-accent mx-auto mb-4" fill="currentColor" />
                <CardTitle>Made with Love</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Each cake is handcrafted with attention to detail and a genuine passion for creating something beautiful.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="text-center">
                <Cake className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Custom Creations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  From intricate wedding designs to whimsical birthday themes, we bring your vision to delicious life.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-primary mb-4">Our Specialties</h2>
            <p className="text-lg text-muted-foreground text-balance">
              Every occasion deserves a cake as unique as the celebration itself
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cakeTypes.map((cake, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <CardTitle className="text-lg">{cake.name}</CardTitle>
                  <CardDescription>{cake.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="w-full justify-center py-2">
                    {cake.price}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-primary mb-4">Let's Create Something Sweet</h2>
            <p className="text-lg text-muted-foreground text-balance">
              Ready to order your perfect cake? Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Request a Quote</CardTitle>
              <CardDescription>Tell us about your dream cake and we'll make it happen</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cakeType">Cake Type</Label>
                    <Input
                      id="cakeType"
                      name="cakeType"
                      value={formData.cakeType}
                      onChange={handleInputChange}
                      placeholder="Wedding, Birthday, Custom, etc."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Tell us about your vision *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Describe your ideal cake - size, flavors, design ideas, event date, etc."
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Send My Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Cake className="h-6 w-6" />
                <span className="font-serif text-xl font-bold">Sweet Delights</span>
              </div>
              <p className="text-primary-foreground/80 mb-4">
                Creating sweet memories one cake at a time since 2010.
              </p>
              <div className="flex space-x-4">
                <a href="https://instagram.com" className="hover:text-accent transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://facebook.com" className="hover:text-accent transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="https://wa.me/5551234567" className="hover:text-accent transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-primary-foreground/80">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>(555) 123-CAKE</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>hello@sweetdelights.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>123 Bakery Lane, Sweet City</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Hours</h3>
              <div className="space-y-1 text-primary-foreground/80">
                <p>Monday - Friday: 7AM - 7PM</p>
                <p>Saturday: 8AM - 8PM</p>
                <p>Sunday: 9AM - 5PM</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
            <p>&copy; 2024 Sweet Delights Bakery. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicWebsite;
