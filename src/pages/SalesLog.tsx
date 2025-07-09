
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
import { Cake, ArrowLeft, Calendar as CalendarIcon, Plus, TrendingUp, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

// Mock data - in real app this would come from Supabase
const mockSales = [
  { id: 1, date: '2024-01-15', cakeType: 'Wedding Cake', quantity: 1, price: 350, notes: '3-tier vanilla with roses' },
  { id: 2, date: '2024-01-15', cakeType: 'Birthday Cake', quantity: 2, price: 90, notes: 'Kids party - chocolate & vanilla' },
  { id: 3, date: '2024-01-14', cakeType: 'Cupcakes', quantity: 24, price: 48, notes: 'Assorted flavors for office' },
  { id: 4, date: '2024-01-14', cakeType: 'Custom Design', quantity: 1, price: 200, notes: 'Anniversary photo cake' },
  { id: 5, date: '2024-01-13', cakeType: 'Birthday Cake', quantity: 1, price: 65, notes: 'Unicorn theme' },
];

const SalesLog = () => {
  const [sales, setSales] = useState(mockSales);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSale, setNewSale] = useState({
    date: new Date(),
    cakeType: '',
    quantity: 1,
    price: 0,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sale = {
      id: Date.now(),
      date: format(newSale.date, 'yyyy-MM-dd'),
      cakeType: newSale.cakeType,
      quantity: newSale.quantity,
      price: newSale.price,
      notes: newSale.notes
    };
    
    setSales(prev => [sale, ...prev]);
    setNewSale({
      date: new Date(),
      cakeType: '',
      quantity: 1,
      price: 0,
      notes: ''
    });
    setIsAddingNew(false);
    
    toast({
      title: "Sale recorded!",
      description: `Added ${sale.quantity} ${sale.cakeType} for $${sale.price}`,
    });
  };

  // Calculate stats
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.price, 0);
  const totalCakes = sales.reduce((sum, sale) => sum + sale.quantity, 0);
  const todaySales = sales.filter(sale => sale.date === format(new Date(), 'yyyy-MM-dd'));
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.price, 0);

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
            <Button onClick={() => setIsAddingNew(true)} disabled={isAddingNew}>
              <Plus className="h-4 w-4 mr-2" />
              Record Sale
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue}</div>
              <p className="text-xs text-muted-foreground">All recorded sales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cakes</CardTitle>
              <Cake className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCakes}</div>
              <p className="text-xs text-muted-foreground">Cakes sold</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${todayRevenue}</div>
              <p className="text-xs text-muted-foreground">{todaySales.length} transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Sale</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${sales.length > 0 ? Math.round(totalRevenue / sales.length) : 0}
              </div>
              <p className="text-xs text-muted-foreground">Per transaction</p>
            </CardContent>
          </Card>
        </div>

        {/* Add New Sale Form */}
        {isAddingNew && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Record New Sale</CardTitle>
              <CardDescription>Log a completed cake sale</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Sale Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(newSale.date, 'MMM dd, yyyy')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newSale.date}
                          onSelect={(date) => date && setNewSale(prev => ({ ...prev, date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cakeType">Cake Type *</Label>
                    <Select value={newSale.cakeType} onValueChange={(value) => setNewSale(prev => ({ ...prev, cakeType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cake type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Wedding Cake">Wedding Cake</SelectItem>
                        <SelectItem value="Birthday Cake">Birthday Cake</SelectItem>
                        <SelectItem value="Cupcakes">Cupcakes</SelectItem>
                        <SelectItem value="Custom Design">Custom Design</SelectItem>
                        <SelectItem value="Sheet Cake">Sheet Cake</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={newSale.quantity}
                      onChange={(e) => setNewSale(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Total Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newSale.price}
                      onChange={(e) => setNewSale(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
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
            <CardDescription>All recorded cake sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Cake Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">
                        {new Date(sale.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{sale.cakeType}</TableCell>
                      <TableCell>{sale.quantity}</TableCell>
                      <TableCell className="font-medium">${sale.price}</TableCell>
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
