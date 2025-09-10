
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';
import { Cake, ArrowLeft, Calendar as CalendarIcon, Plus, TrendingUp, Calculator, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

// Product categories and their base prices
const PRODUCT_CATEGORIES = [
  {
    name: "Simple Cakes",
    basePrice: 2500,
    unit: "kg",
    options: ["Very Vanilla", "Chocolate Marble", "Strawberry Marble", "Strawberry", "Lemon", "Orange"]
  },
  {
    name: "Classic Cakes",
    basePrice: 2800,
    unit: "kg",
    options: ["Banana Bread", "Carrot", "Chocolate", "Red Velvet", "Funfetti"]
  },
  {
    name: "Specialty Cakes",
    basePrice: 3000,
    unit: "kg",
    options: ["Blueberry Lemon", "Cookies & Cream", "Salted Caramel", "Chocolate Caramel", "Chocolate Mint"]
  },
  {
    name: "Bento Cakes",
    basePrice: 1200,
    unit: "piece",
    options: ["Simple", "Classic", "Specialty"]
  },
  {
    name: "Cupcakes",
    basePrice: 150,
    unit: "piece",
    minQuantity: 6,
    options: ["Simple/Classic", "Specialty"]
  },
  {
    name: "Cookies & Brownies",
    basePrice: 100,
    unit: "piece",
    minQuantity: 6,
    options: ["Chocolate Chip Cookies", "Red Velvet White Choc Chip", "Death by Chocolate", "Classic Brownies", "Red Velvet Brownies"]
  }
];

interface Sale {
  id: number;
  date: string;
  clientId: number;
  clientName: string;
  category: string;
  productType: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
  notes: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
}

const SalesLog = () => {
  const [sales, setSales] = useState<Sale[]>(() => {
    return JSON.parse(localStorage.getItem('sales') || '[]');
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newSale, setNewSale] = useState({
    date: new Date(),
    clientId: '',
    category: '',
    productType: '',
    quantity: 1,
    pricePerUnit: 0,
    notes: ''
  });
  const [clients, setClients] = useState<Client[]>(() => {
    return JSON.parse(localStorage.getItem('clients') || '[]');
  });

  // Get product options based on selected category
  const getProductOptions = () => {
    const category = PRODUCT_CATEGORIES.find(cat => cat.name === newSale.category);
    return category?.options || [];
  };

  // Get base price and unit for selected category
  const getCategoryInfo = () => {
    return PRODUCT_CATEGORIES.find(cat => cat.name === newSale.category) || {
      basePrice: 0,
      unit: 'piece',
      minQuantity: 1
    };
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    const { basePrice } = getCategoryInfo();
    return newSale.quantity * (newSale.pricePerUnit || basePrice);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryInfo = getCategoryInfo();
    const totalPrice = calculateTotalPrice();
    const selectedClient = clients.find(c => c.id.toString() === newSale.clientId?.toString());
    
    if (!selectedClient) {
      toast({
        title: "Error",
        description: "Please select a client",
        variant: "destructive"
      });
      return;
    }

    const sale: Sale = {
      id: Date.now(),
      date: format(newSale.date, 'yyyy-MM-dd'),
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      category: newSale.category,
      productType: newSale.productType,
      quantity: newSale.quantity,
      unit: categoryInfo.unit,
      pricePerUnit: newSale.pricePerUnit || categoryInfo.basePrice,
      totalPrice,
      notes: newSale.notes
    };
    
    // Update sales
    const updatedSales = [sale, ...sales];
    setSales(updatedSales);
    localStorage.setItem('sales', JSON.stringify(updatedSales));

    // Update client stats
    const updatedClients = clients.map(client => {
      if (client.id === selectedClient.id) {
        return {
          ...client,
          totalOrders: client.totalOrders + 1,
          totalSpent: client.totalSpent + totalPrice,
          lastOrder: format(new Date(), 'yyyy-MM-dd')
        };
      }
      return client;
    });
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));

    // Reset form
    setNewSale({
      date: new Date(),
      clientId: '',
      category: '',
      productType: '',
      quantity: 1,
      pricePerUnit: 0,
      notes: ''
    });
    setIsAddingNew(false);
    
    toast({
      title: "Sale recorded!",
      description: `Added ${sale.quantity}${sale.unit} of ${sale.productType} for ${selectedClient.name}`,
    });
  };

  // Calculate stats
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const totalItems = sales.reduce((sum, sale) => sum + sale.quantity, 0);
  const todaySales = sales.filter(sale => sale.date === format(new Date(), 'yyyy-MM-dd'));
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.totalPrice, 0);

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
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="font-serif text-xl font-bold text-primary">Sales Log</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button asChild variant="outline" size="sm">
                <Link to="/clients">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Clients
                </Link>
              </Button>
              <Button onClick={() => setIsAddingNew(true)} disabled={isAddingNew}>
                <Plus className="h-4 w-4 mr-2" />
                Record Sale
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="text-lg">Today's Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">KES {todayRevenue.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="text-lg">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">KES {totalRevenue.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="text-lg">Total Items Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{totalItems}</p>
            </CardContent>
          </Card>
        </div>

        {/* New Sale Form */}
        {isAddingNew && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Record New Sale</CardTitle>
              <CardDescription>Enter the sale details below</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(newSale.date, 'PPP')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newSale.date}
                          onSelect={(date) => date && setNewSale(prev => ({ ...prev, date }))}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Client *</Label>
                    <Select
                      value={newSale.clientId?.toString()}
                      onValueChange={(value) => setNewSale(prev => ({ ...prev, clientId: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select 
                      value={newSale.category}
                      onValueChange={(value) => setNewSale(prev => ({ 
                        ...prev, 
                        category: value,
                        productType: '',
                        pricePerUnit: PRODUCT_CATEGORIES.find(cat => cat.name === value)?.basePrice || 0
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_CATEGORIES.map((category) => (
                          <SelectItem key={category.name} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Product *</Label>
                    <Select
                      value={newSale.productType}
                      onValueChange={(value) => setNewSale(prev => ({ ...prev, productType: value }))}
                      disabled={!newSale.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {getProductOptions().map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity *</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min={getCategoryInfo().minQuantity || 1}
                        value={newSale.quantity}
                        onChange={(e) => setNewSale(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                        required
                      />
                      <span className="text-sm text-muted-foreground">{getCategoryInfo().unit}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Price per {getCategoryInfo().unit} *</Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">KES</span>
                      <Input
                        type="number"
                        min={0}
                        value={newSale.pricePerUnit || getCategoryInfo().basePrice}
                        onChange={(e) => setNewSale(prev => ({ ...prev, pricePerUnit: parseFloat(e.target.value) || 0 }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Total Price</Label>
                    <div className="flex items-center space-x-2 h-10 px-3 border rounded-md bg-muted">
                      <span className="text-sm text-muted-foreground">KES</span>
                      <span className="font-medium">{calculateTotalPrice().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Input
                    value={newSale.notes}
                    onChange={(e) => setNewSale(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Optional notes about this sale"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button type="submit">Record Sale</Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddingNew(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>Sales History</CardTitle>
            <CardDescription>All recorded sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price/Unit</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">
                        {new Date(sale.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{sale.clientName}</TableCell>
                      <TableCell>{sale.category}</TableCell>
                      <TableCell>{sale.productType}</TableCell>
                      <TableCell>{sale.quantity} {sale.unit}</TableCell>
                      <TableCell>KES {sale.pricePerUnit.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">KES {sale.totalPrice.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">{sale.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesLog;
