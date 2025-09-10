
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Cake, Heart, Star, Phone, Mail, MapPin, Instagram, Facebook, MessageCircle, Cookie, Sparkles, Loader2 } from 'lucide-react';

const PublicWebsite = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cakeType: '',
    message: '',
    category: '' // Add category field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter your name",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Valid email is required",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.message.trim()) {
      toast({
        title: "Message is required",
        description: "Please tell us about your order",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Get existing leads to generate next ID
      const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]');
      const nextId = existingLeads.length > 0 
        ? Math.max(...existingLeads.map((l: any) => l.id)) + 1 
        : 1;

      // Create the new lead with additional metadata
      const newLead = {
        id: nextId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        productType: formData.cakeType.trim(),
        category: formData.category, // Add category
        message: formData.message.trim(),
        status: 'new',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        estimatedValue: 0,
        note: '',
      };

      // Add to existing leads
      existingLeads.push(newLead);
      
      // Save to localStorage
      localStorage.setItem('leads', JSON.stringify(existingLeads));

      // Show success message
      toast({
        title: "Thank you for your inquiry!",
        description: "Your request has been registered. We'll get back to you to discuss your sweet order.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        cakeType: '',
        message: '',
        category: ''
      });
    } catch (error) {
      console.error('Error saving lead:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleWhatsAppChat = () => {
    const message = "Hi! I'm interested in ordering from Treat Yo Self Pastry Shop. Could you help me with my order?";
    const whatsappUrl = `https://wa.me/254707900065?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Helper to format category price
  const formatPrice = (price: string) => {
    const [amount, unit] = price.split('/');
    return (
      <div className="flex flex-col items-end">
        <span className="text-xs font-medium text-primary/80">{amount}</span>
        {unit && <span className="text-[10px] text-muted-foreground">/{unit}</span>}
      </div>
    );
  };

  const productCategories = [
    { 
      name: "Simple Cakes", 
      description: "Classic flavors made with love",
      items: [
        "Very Vanilla",
        "Chocolate Marble",
        "Strawberry Marble",
        "Strawberry",
        "Lemon",
        "Orange"
      ],
      price: "From KSH 2,500/kg",
      note: "Available in sizes from 1kg to 5kg"
    },
    { 
      name: "Classic Cakes", 
      description: "Traditional favorites that never go out of style",
      items: [
        "Banana Bread",
        "Carrot",
        "Chocolate",
        "Red Velvet",
        "Funfetti"
      ],
      price: "From KSH 2,800/kg",
      note: "Available in sizes from 1kg to 5kg"
    },
    { 
      name: "Specialty Cakes", 
      description: "Unique flavors for adventurous taste buds",
      items: [
        "Blueberry Lemon",
        "Cookies & Cream",
        "Salted Caramel",
        "Chocolate Caramel",
        "Chocolate Mint"
      ],
      price: "From KSH 3,000/kg",
      note: "Available in sizes from 1kg to 5kg"
    },
    {
      name: "Bento Cakes",
      description: "Perfect personal-sized cakes for special moments",
      items: [
        "Simple Cakes",
        "Classic Cakes",
        "Specialty Cakes"
      ],
      price: "From KSH 1,200",
      note: "Single-serving sized cakes"
    },
    {
      name: "Cupcakes",
      description: "Delightful bite-sized treats",
      items: [
        "Simple/Classic Flavors",
        "Specialty Flavors",
        "Custom Designs Available"
      ],
      price: "From KSH 900/pack",
      note: "Minimum order: 6 pieces"
    },
    { 
      name: "Cookies & Brownies", 
      description: "Perfect for sharing or personal indulgence",
      items: [
        "Chocolate Chip Cookies",
        "Red Velvet White Choc Chip",
        "Death by Chocolate",
        "Classic Brownies",
        "Red Velvet Brownies"
      ],
      price: "From KsH 100/piece",
      note: "Minimum order: 6 pieces"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Cake className="h-8 w-8 text-pink-600" />
                <Sparkles className="h-4 w-4 text-pink-400 absolute -top-1 -right-1" />
              </div>
              <span className="font-serif text-2xl font-bold text-pink-800">Treat Yo Self</span>
              <span className="text-sm text-pink-600 hidden sm:block font-medium">Pastry Shop</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">About</a>
              <a href="#menu" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">Menu</a>
              <a href="#contact" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">Contact</a>
              <Button asChild variant="outline" size="sm" className="border-pink-200 text-pink-700 hover:bg-pink-50 hover:border-pink-300">
                <a href="/login">Login</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-pink-50/30 to-rose-50/30">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-pink-800 mb-6 text-balance">
            Indulge Yourself with <Heart className="inline h-12 w-12 text-pink-500" fill="currentColor" />
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 text-balance">
            From decadent specialty cakes to irresistible cookies and brownies - every bite is crafted to make you smile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Order Your Treats
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3 border-2 border-pink-300 text-pink-700 hover:bg-pink-50 hover:border-pink-400 transition-all duration-300" 
              onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Menu
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-pink-800 mb-4">Why Treat Yo Self?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto text-balance">
              Life's too short for ordinary desserts. We believe every moment deserves something extraordinary, 
              from our signature specialty cakes to our indulgent cookies and brownies.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-pink-100 hover:border-pink-300 bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <Star className="h-12 w-12 text-pink-500 mx-auto mb-4 group-hover:text-pink-600 transition-colors" fill="currentColor" />
                <CardTitle className="text-pink-800 group-hover:text-pink-900 transition-colors">Premium Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center leading-relaxed">
                  We use only the finest ingredients to create treats that taste as amazing as they look.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-pink-100 hover:border-pink-300 bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4 group-hover:text-pink-600 transition-colors" fill="currentColor" />
                <CardTitle className="text-pink-800 group-hover:text-pink-900 transition-colors">Made with Passion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center leading-relaxed">
                  Every cake, cookie, and brownie is handcrafted with love and attention to detail.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-pink-100 hover:border-pink-300 bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <Cookie className="h-12 w-12 text-pink-500 mx-auto mb-4 group-hover:text-pink-600 transition-colors" />
                <CardTitle className="text-pink-800 group-hover:text-pink-900 transition-colors">Variety for Everyone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center leading-relaxed">
                  From simple classics to adventurous specialties, there's something perfect for every craving.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 px-4 bg-gradient-to-br from-pink-50/50 to-rose-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-primary mb-4">Our Delicious Menu</h2>
            <p className="text-lg text-muted-foreground text-balance">
              Every treat is made fresh to order with love and the finest ingredients
            </p>
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-sm font-semibold mt-4">
              <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
              All prices in Kenyan Shillings (Ksh)
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productCategories.map((category, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 border-pink-100 hover:border-pink-300 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-pink-800 mb-2 font-bold group-hover:text-pink-900 transition-colors">
                        {category.name}
                      </CardTitle>
                      <CardDescription className="text-pink-600 font-medium text-sm leading-relaxed">
                        {category.description}
                      </CardDescription>
                    </div>
                    <Badge className="bg-pink-500 text-white border-0 px-3 py-1 text-xs font-bold shadow-md">
                      {formatPrice(category.price)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-3 group/item">
                          <div className="w-2 h-2 rounded-full bg-pink-400 group-hover/item:bg-pink-500 transition-colors"></div>
                          <span className="text-sm text-gray-700 font-medium group-hover/item:text-gray-800 transition-colors">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                    {category.note && (
                      <div className="mt-4 pt-3 border-t border-pink-200">
                        <div className="flex items-start space-x-2">
                          <div className="w-1 h-1 rounded-full bg-pink-400 mt-2"></div>
                          <p className="text-xs text-pink-600 font-semibold leading-relaxed">
                            {category.note}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-700 px-6 py-3 rounded-lg border border-pink-200">
              <span className="text-pink-500">*</span>
              <p className="text-sm font-medium">
                Prices may vary based on size, design complexity, and special decorations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-br from-pink-50/40 to-rose-50/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-pink-800 mb-4">Ready to Treat Yourself?</h2>
            <p className="text-lg text-gray-600 text-balance">
              Let us know what sweet creation you're craving and we'll make it happen!
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <Card className="flex-1 border-2 border-pink-200 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-pink-800">Request Your Custom Order</CardTitle>
                <CardDescription className="text-gray-600">Tell us about your dream treat and we'll create something special</CardDescription>
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
                      <Label htmlFor="category">Product Category *</Label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full border rounded-md h-10 px-3 bg-background"
                      >
                        <option value="">Select a category</option>
                        {productCategories.map((cat, idx) => (
                          <option key={idx} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cakeType">What are you craving? *</Label>
                    <Input
                      id="cakeType"
                      name="cakeType"
                      value={formData.cakeType}
                      onChange={handleInputChange}
                      required
                      placeholder="Describe your desired product"
                    />
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

                  <Button 
                    type="submit" 
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
                    size="lg" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send My Sweet Request'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="lg:w-80">
              <Card className="border-2 border-pink-200 bg-white/90 backdrop-blur-sm shadow-lg mb-6">
                <CardHeader>
                  <CardTitle className="text-pink-800 flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Chat with Us
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Need quick help? Chat with us directly on WhatsApp!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleWhatsAppChat}
                    className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Chat on WhatsApp
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-pink-200 bg-white/90 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-pink-800">Quick Contact</CardTitle>
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
      <footer className="bg-gradient-to-r from-pink-700 to-pink-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <Cake className="h-6 w-6 text-pink-200" />
                  <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-pink-300" />
                </div>
                <div>
                  <span className="font-serif text-xl font-bold">Treat Yo Self</span>
                  <p className="text-xs text-pink-200">Pastry Shop</p>
                </div>
              </div>
              <p className="text-pink-100 mb-4 leading-relaxed">
                Indulging your sweet tooth since day one - because you deserve the best treats!
              </p>
              <div className="flex space-x-4">
                <a href="https://instagram.com" className="hover:text-pink-200 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://facebook.com" className="hover:text-pink-200 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="https://wa.me/254707900065" className="hover:text-pink-200 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-pink-100">Get in Touch</h3>
              <div className="space-y-2 text-pink-100">
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
              <h3 className="font-semibold mb-4 text-pink-100">Shop Hours</h3>
              <div className="space-y-1 text-pink-100">
                <p>Tuesday - Friday: 9AM - 7PM</p>
                <p>Saturday: 10AM - 8PM</p>
                <p>Sunday: 11AM - 6PM</p>
                <p className="text-pink-200 font-semibold">Monday: Closed (Baking Day!)</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-pink-300/30 mt-8 pt-8 text-center text-pink-200">
            <p>&copy; 2025 Treat Yo Self Pastry Shop. All rights reserved. | Life's too short for boring desserts!</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicWebsite;
