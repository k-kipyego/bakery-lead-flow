
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Cake, Heart, Star, Phone, Mail, MapPin, Instagram, Facebook, MessageCircle, Cookie, Sparkles } from 'lucide-react';

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
      description: "We'll get back to you within 24 hours to discuss your sweet order.",
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

  const handleWhatsAppChat = () => {
    const message = "Hi! I'm interested in ordering from Treat Yo Self Pastry Shop. Could you help me with my order?";
    const whatsappUrl = `https://wa.me/254700000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const productCategories = [
    { 
      name: "Simple Cakes", 
      description: "Classic flavors made with love",
      items: ["Very Vanilla", "Chocolate Marble", "Strawberry Marble", "Strawberry", "Lemon", "Orange"],
      price: "From KSH 2,500" 
    },
    { 
      name: "Classic Cakes", 
      description: "Traditional favorites that never go out of style",
      items: ["Banana Bread", "Carrot", "Chocolate", "Red Velvet", "Funfetti"],
      price: "From KSH 2,800" 
    },
    { 
      name: "Specialty Cakes", 
      description: "Unique flavors for adventurous taste buds",
      items: ["Blueberry Lemon", "Cookies & Cream", "Salted Caramel", "Chocolate Caramel", "Chocolate Mint"],
      price: "From KSH 3,000" 
    },
    { 
      name: "Treats & More", 
      description: "Perfect for sharing or personal indulgence",
      items: ["Chocolate Chip Cookies", "Red Velvet Brownies", "Death by Chocolate Cookies", "Classic Brownies"],
      price: "From KSH 100/piece" 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Cake className="h-8 w-8 text-primary" />
                <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1" />
              </div>
              <span className="font-serif text-2xl font-bold text-primary">Treat Yo Self</span>
              <span className="text-sm text-muted-foreground hidden sm:block">Pastry Shop</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
              <a href="#menu" className="text-foreground hover:text-primary transition-colors">Menu</a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
              <Button asChild variant="outline" size="sm">
                <a href="/crm">Staff Portal</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-primary mb-6 text-balance">
            Indulge Yourself with <Heart className="inline h-12 w-12 text-accent" fill="currentColor" />
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-balance">
            From decadent specialty cakes to irresistible cookies and brownies - every bite is crafted to make you smile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Order Your Treats
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3" onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}>
              View Menu
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-primary mb-4">Why Treat Yo Self?</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
              Life's too short for ordinary desserts. We believe every moment deserves something extraordinary, 
              from our signature specialty cakes to our indulgent cookies and brownies.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover border-accent/20">
              <CardHeader className="text-center">
                <Star className="h-12 w-12 text-primary mx-auto mb-4" fill="currentColor" />
                <CardTitle className="text-primary">Premium Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  We use only the finest ingredients to create treats that taste as amazing as they look.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover border-accent/20">
              <CardHeader className="text-center">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" fill="currentColor" />
                <CardTitle className="text-primary">Made with Passion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Every cake, cookie, and brownie is handcrafted with love and attention to detail.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover border-accent/20">
              <CardHeader className="text-center">
                <Cookie className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-primary">Variety for Everyone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  From simple classics to adventurous specialties, there's something perfect for every craving.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-primary mb-4">Our Delicious Menu</h2>
            <p className="text-lg text-muted-foreground text-balance">
              Every treat is made fresh to order with love and the finest ingredients
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {productCategories.map((category, index) => (
              <Card key={index} className="card-hover border-accent/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-primary">{category.name}</CardTitle>
                      <CardDescription className="mt-2">{category.description}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {category.price}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-accent"></div>
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              * Prices may vary based on size, design complexity, and special decorations
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-white/60">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-primary mb-4">Ready to Treat Yourself?</h2>
            <p className="text-lg text-muted-foreground text-balance">
              Let us know what sweet creation you're craving and we'll make it happen!
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <Card className="flex-1 border-accent/20">
              <CardHeader>
                <CardTitle className="text-primary">Request Your Custom Order</CardTitle>
                <CardDescription>Tell us about your dream treat and we'll create something special</CardDescription>
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
                        placeholder="Your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cakeType">What are you craving?</Label>
                      <Input
                        id="cakeType"
                        name="cakeType"
                        value={formData.cakeType}
                        onChange={handleInputChange}
                        placeholder="Cake, cookies, brownies, etc."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Tell us more about your order *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Describe your ideal treat - flavors, size, special occasions, delivery date, etc."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Send My Sweet Request
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="lg:w-80">
              <Card className="border-accent/20 mb-6">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Chat with Us
                  </CardTitle>
                  <CardDescription>
                    Need quick help? Chat with us directly on WhatsApp!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleWhatsAppChat}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Chat on WhatsApp
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-primary">Quick Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>(254) 700-000-000</span>
                  </div>
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>hello@treatyoself.co.ke</span>
                  </div>
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Nairobi, Kenya</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <Cake className="h-6 w-6" />
                  <Sparkles className="h-3 w-3 absolute -top-1 -right-1" />
                </div>
                <div>
                  <span className="font-serif text-xl font-bold">Treat Yo Self</span>
                  <p className="text-xs text-primary-foreground/80">Pastry Shop</p>
                </div>
              </div>
              <p className="text-primary-foreground/80 mb-4">
                Indulging your sweet tooth since day one - because you deserve the best treats!
              </p>
              <div className="flex space-x-4">
                <a href="https://instagram.com" className="hover:text-accent transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://facebook.com" className="hover:text-accent transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="https://wa.me/254700000000" className="hover:text-accent transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Get in Touch</h3>
              <div className="space-y-2 text-primary-foreground/80">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>(254) 700-000-000</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>hello@treatyoself.co.ke</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Nairobi, Kenya</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Shop Hours</h3>
              <div className="space-y-1 text-primary-foreground/80">
                <p>Tuesday - Friday: 9AM - 7PM</p>
                <p>Saturday: 10AM - 8PM</p>
                <p>Sunday: 11AM - 6PM</p>
                <p className="text-accent font-semibold">Monday: Closed (Baking Day!)</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
            <p>&copy; 2024 Treat Yo Self Pastry Shop. All rights reserved. | Life's too short for boring desserts!</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicWebsite;
