
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cake, Plus, Search, Tag, DollarSign, Edit, Trash, Copy } from 'lucide-react';

interface ProductSize {
  size: string;
  price: number;
}

interface ProductVariant {
  type: string;
  price: number;
}

interface ProductPack {
  type: string;
  size: string;
  price: number;
}

interface Product {
  id: number;
  name: string;
  basePrice: number;
  unit: "kg" | "piece";
  description: string;
  options: string[];
  minQuantity?: number;
  sizes?: ProductSize[];
  variants?: ProductVariant[];
  packs?: ProductPack[];
}

// Default product categories as initial data
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Simple Cakes",
    basePrice: 2500,
    unit: "kg",
    description: "Classic flavors made with love",
    options: ["Very Vanilla", "Chocolate Marble", "Strawberry Marble", "Strawberry", "Lemon", "Orange"],
    sizes: [
      { size: "1 kg", price: 2500 },
      { size: "1.5 kg", price: 3500 },
      { size: "2 kg", price: 4500 },
      { size: "2.5 kg", price: 5000 },
      { size: "3 kg", price: 5500 },
      { size: "4 kg", price: 7000 },
      { size: "5 kg", price: 8000 }
    ]
  },
  {
    id: 2,
    name: "Classic Cakes",
    basePrice: 2800,
    unit: "kg",
    description: "Traditional favorites that never go out of style",
    options: ["Banana Bread", "Carrot", "Chocolate", "Red Velvet", "Funfetti"],
    sizes: [
      { size: "1 kg", price: 2800 },
      { size: "1.5 kg", price: 3800 },
      { size: "2 kg", price: 4800 },
      { size: "2.5 kg", price: 5300 },
      { size: "3 kg", price: 5800 },
      { size: "4 kg", price: 7300 },
      { size: "5 kg", price: 8300 }
    ]
  },
  {
    id: 3,
    name: "Specialty Cakes",
    basePrice: 3000,
    unit: "kg",
    description: "Unique flavors for adventurous taste buds",
    options: ["Blueberry Lemon", "Cookies & Cream", "Salted Caramel", "Chocolate Caramel", "Chocolate Mint"],
    sizes: [
      { size: "1 kg", price: 3000 },
      { size: "1.5 kg", price: 4000 },
      { size: "2 kg", price: 5000 },
      { size: "2.5 kg", price: 5500 },
      { size: "3 kg", price: 6000 },
      { size: "4 kg", price: 7500 },
      { size: "5 kg", price: 8500 }
    ]
  },
  {
    id: 4,
    name: "Bento Cakes",
    basePrice: 1200,
    unit: "piece",
    description: "Perfect personal-sized cakes for special moments",
    options: ["Simple", "Classic", "Specialty"],
    variants: [
      { type: "Simple cakes", price: 1200 },
      { type: "Classic cakes", price: 1500 },
      { type: "Specialty cakes", price: 1800 }
    ]
  },
  {
    id: 5,
    name: "Cupcakes",
    basePrice: 150,
    unit: "piece",
    description: "Delightful bite-sized treats",
    minQuantity: 6,
    options: ["Simple/Classic", "Specialty"],
    packs: [
      { type: "Simple/Classic", size: "6 pack", price: 900 },
      { type: "Simple/Classic", size: "12 pack", price: 1800 },
      { type: "Specialty", size: "6 pack", price: 1100 },
      { type: "Specialty", size: "12 pack", price: 2200 }
    ]
  },
  {
    id: 6,
    name: "Cookies & Brownies",
    basePrice: 100,
    unit: "piece",
    description: "Perfect for sharing or personal indulgence",
    minQuantity: 6,
    options: ["Chocolate Chip Cookies", "Red Velvet White Choc Chip", "Death by Chocolate", "Classic Brownies", "Red Velvet Brownies"],
    packs: [
      { type: "Cookies", size: "6 pieces", price: 600 },
      { type: "Cookies", size: "12 pieces", price: 1200 },
      { type: "Brownies", size: "6 pieces", price: 900 },
      { type: "Brownies", size: "12 pieces", price: 1800 }
    ]
  }
];

const Products = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem('products');
    return stored ? JSON.parse(stored) : DEFAULT_PRODUCTS;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [newOption, setNewOption] = useState('');

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const handleAddProduct = () => {
      const newProduct: Product = {
      id: Math.max(0, ...products.map(p => p.id)) + 1,
      name: "",
      basePrice: 0,
      unit: "piece",
      description: "",
      options: [],
      sizes: []
    };
    setEditingProduct(newProduct);
    setIsEditing(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
    setIsEditing(true);
  };

  const handleDeleteProduct = (productId: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
      toast({
        title: "Product deleted",
        description: "The product has been removed from your catalog."
      });
    }
  };

  const handleSaveProduct = () => {
    if (!editingProduct) return;

    const updatedProducts = editingProduct.id
      ? products.map(p => p.id === editingProduct.id ? editingProduct : p)
      : [...products, editingProduct];

    setProducts(updatedProducts);
    setIsEditing(false);
    setEditingProduct(null);
    toast({
      title: editingProduct.id ? "Product updated" : "Product added",
      description: `${editingProduct.name} has been ${editingProduct.id ? 'updated' : 'added'} successfully.`
    });
  };

  const handleAddOption = () => {
    if (!editingProduct || !newOption.trim()) return;
    setEditingProduct({
      ...editingProduct,
      options: [...editingProduct.options, newOption.trim()]
    });
    setNewOption('');
    setIsAddingOption(false);
  };

  const handleRemoveOption = (index: number) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      options: editingProduct.options.filter((_, i) => i !== index)
    });
  };

  const handleAddSize = () => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      sizes: [...(editingProduct.sizes || []), { size: "", price: 0 }]
    });
  };

  const handleUpdateSize = (index: number, field: keyof ProductSize, value: string | number) => {
    if (!editingProduct || !editingProduct.sizes) return;
    const newSizes = [...editingProduct.sizes];
    newSizes[index] = {
      ...newSizes[index],
      [field]: field === 'price' ? Number(value) : value
    };
    setEditingProduct({
      ...editingProduct,
      sizes: newSizes
    });
  };

  const handleRemoveSize = (index: number) => {
    if (!editingProduct || !editingProduct.sizes) return;
    setEditingProduct({
      ...editingProduct,
      sizes: editingProduct.sizes.filter((_, i) => i !== index)
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.options.some(option => option.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/crm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to CRM
                </Link>
              </Button>
              <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <Cake className="h-6 w-6 text-primary" />
                <span className="font-serif text-xl font-bold text-primary">Products</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              <Button onClick={handleAddProduct}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-primary">{product.name}</CardTitle>
                    <CardDescription className="mt-2">{product.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-primary/5 border-primary/10">
                    From KES {product.basePrice.toLocaleString()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Options */}
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Available Options:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {product.options.map((option, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <Tag className="h-3 w-3 mr-2 text-primary" />
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Details */}
                  <div className="border-t pt-4">
                    <Label className="text-sm text-muted-foreground mb-2 block">Pricing:</Label>
                    {product.sizes && (
                      <div className="grid grid-cols-2 gap-2">
                        {product.sizes.map((size, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span>{size.size}</span>
                            <span className="font-medium">KES {size.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {product.variants && (
                      <div className="grid grid-cols-2 gap-2">
                        {product.variants.map((variant, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span>{variant.type}</span>
                            <span className="font-medium">KES {variant.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {product.packs && (
                      <div className="grid grid-cols-2 gap-2">
                        {product.packs.map((pack, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span>{pack.type} - {pack.size}</span>
                            <span className="font-medium">KES {pack.price.toLocaleString()}</span>
                      </div>
                    ))}
                      </div>
                    )}
                  </div>

                  {/* Minimum Order */}
                  {product.minQuantity && (
                    <div className="text-sm text-muted-foreground">
                      Minimum order: {product.minQuantity} {product.unit}s
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Product Dialog */}
        <Dialog open={isEditing} onOpenChange={(open) => {
          if (!open) {
            setIsEditing(false);
            setEditingProduct(null);
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingProduct?.id ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Name *</Label>
                  <Input
                    value={editingProduct?.name || ''}
                    onChange={(e) => setEditingProduct(prev => prev ? {
                      ...prev,
                      name: e.target.value
                    } : null)}
                    placeholder="Product name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Base Price (KES) *</Label>
                  <Input
                    type="number"
                    value={editingProduct?.basePrice || 0}
                    onChange={(e) => setEditingProduct(prev => prev ? {
                      ...prev,
                      basePrice: Number(e.target.value)
                    } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Unit *</Label>
                  <select
                    className="w-full border rounded-md h-10 px-3"
                    value={editingProduct?.unit}
                    onChange={(e) => setEditingProduct(prev => prev ? {
                      ...prev,
                      unit: e.target.value as "kg" | "piece"
                    } : null)}
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="piece">Piece</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Minimum Quantity</Label>
                  <Input
                    type="number"
                    value={editingProduct?.minQuantity || ''}
                    onChange={(e) => setEditingProduct(prev => prev ? {
                      ...prev,
                      minQuantity: Number(e.target.value) || undefined
                    } : null)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={editingProduct?.description || ''}
                  onChange={(e) => setEditingProduct(prev => prev ? {
                    ...prev,
                    description: e.target.value
                  } : null)}
                  placeholder="Product description"
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Options</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingOption(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {editingProduct?.options.map((option, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span>{option}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOption(idx)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Sizes & Prices</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSize}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Size
                  </Button>
                </div>
                <div className="space-y-2">
                  {editingProduct?.sizes?.map((size, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        placeholder="Size (e.g., 1 kg)"
                        value={size.size}
                        onChange={(e) => handleUpdateSize(idx, 'size', e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Price"
                        value={size.price}
                        onChange={(e) => handleUpdateSize(idx, 'price', e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSize(idx)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProduct}>
                {editingProduct?.id ? 'Update Product' : 'Add Product'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Option Dialog */}
        <Dialog open={isAddingOption} onOpenChange={setIsAddingOption}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Option</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Option Name</Label>
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Enter option name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingOption(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddOption}>
                Add Option
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Products;
