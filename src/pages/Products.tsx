
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Cake, Plus, Edit, Trash2, Cookie, Heart, Search, Filter } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    status: 'active' as 'active' | 'inactive'
  });

  // Mock data - in real app this would come from Supabase
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Very Vanilla Cake',
      category: 'Simple Cakes',
      price: 2500,
      description: 'Classic vanilla cake with smooth vanilla frosting',
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Chocolate Marble Cake',
      category: 'Simple Cakes',
      price: 2500,
      description: 'Beautiful marble cake with chocolate and vanilla swirls',
      status: 'active',
      createdAt: '2024-01-14'
    },
    {
      id: 3,
      name: 'Red Velvet Cake',
      category: 'Classic Cakes',
      price: 2800,
      description: 'Rich red velvet cake with cream cheese frosting',
      status: 'active',
      createdAt: '2024-01-13'
    },
    {
      id: 4,
      name: 'Salted Caramel Cake',
      category: 'Specialty Cakes',
      price: 3000,
      description: 'Decadent cake with salted caramel layers and frosting',
      status: 'active',
      createdAt: '2024-01-12'
    },
    {
      id: 5,
      name: 'Chocolate Chip Cookies',
      category: 'Treats & More',
      price: 100,
      description: 'Classic chocolate chip cookies (per piece)',
      status: 'active',
      createdAt: '2024-01-11'
    }
  ]);

  const categories = ['Simple Cakes', 'Classic Cakes', 'Specialty Cakes', 'Treats & More'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(product => 
        product.id === editingProduct.id 
          ? {
              ...product,
              name: formData.name,
              category: formData.category,
              price: parseFloat(formData.price),
              description: formData.description,
              status: formData.status
            }
          : product
      ));
      
      toast({
        title: "Product updated successfully!",
        description: `${formData.name} has been updated.`,
      });
      
      setEditingProduct(null);
    } else {
      // Add new product
      const newProduct: Product = {
        id: Math.max(...products.map(p => p.id)) + 1,
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description,
        status: formData.status,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setProducts([...products, newProduct]);
      
      toast({
        title: "Product added successfully!",
        description: `${formData.name} has been added to your menu.`,
      });
    }
    
    // Reset form
    setFormData({
      name: '',
      category: '',
      price: '',
      description: '',
      status: 'active'
    });
    setShowAddForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
      status: product.status
    });
    setShowAddForm(true);
  };

  const handleDelete = (productId: number) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({
      title: "Product deleted",
      description: "The product has been removed from your menu.",
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Cake className="h-8 w-8 text-primary" />
              <div>
                <span className="font-serif text-xl font-bold text-primary">Treat Yo Self</span>
                <span className="text-sm text-muted-foreground ml-2">Product Management</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button asChild variant="outline" size="sm">
                <a href="/">Public Site</a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="/crm">CRM</a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="/sales">Sales Log</a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="/invoicing">Invoicing</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-4xl font-bold text-primary mb-2">Product Management</h1>
            <p className="text-muted-foreground">Manage your delicious menu items and pricing</p>
          </div>
          <Button 
            onClick={() => {
              setShowAddForm(true);
              setEditingProduct(null);
              setFormData({
                name: '',
                category: '',
                price: '',
                description: '',
                status: 'active'
              });
            }}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </Button>
        </div>

        {/* Add/Edit Product Form */}
        {showAddForm && (
          <Card className="mb-8 border-accent/20">
            <CardHeader>
              <CardTitle className="text-primary">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </CardTitle>
              <CardDescription>
                {editingProduct ? 'Update product information' : 'Add a new item to your menu'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Chocolate Cake"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (KSH) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      placeholder="2500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your product..."
                    rows={3}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button type="submit">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingProduct(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6 border-accent/20">
          <CardHeader>
            <CardTitle className="text-primary">Filter & Search Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="border-accent/20 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-primary">{product.name}</CardTitle>
                    <CardDescription className="mt-1">{product.category}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(product.status)}>
                    {product.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-primary">
                    KSH {product.price.toLocaleString()}
                  </div>
                  
                  {product.description && (
                    <p className="text-muted-foreground text-sm">{product.description}</p>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    Added: {product.createdAt}
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(product)}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card className="border-accent/20">
            <CardContent className="text-center py-12">
              <Cookie className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search or add a new product.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Products;
