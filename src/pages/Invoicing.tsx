
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Download, Eye, Plus, Minus, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for leads (would come from Supabase)
const mockLeads = [
  { id: 1, name: "Sarah Johnson", email: "sarah@email.com", cakeType: "Wedding Cake" },
  { id: 2, name: "Mike Chen", email: "mike.chen@email.com", cakeType: "Birthday Cake" },
  { id: 3, name: "Emily Rodriguez", email: "emily.r@email.com", cakeType: "Cupcakes" },
];

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  price: number;
}

const Invoicing = () => {
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { id: 1, description: '', quantity: 1, price: 0 }
  ]);
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    dueDate: '',
    notes: ''
  });

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now(),
      description: '',
      quantity: 1,
      price: 0
    };
    setInvoiceItems(prev => [...prev, newItem]);
  };

  const removeItem = (id: number) => {
    setInvoiceItems(prev => prev.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const subtotal = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const generateInvoice = () => {
    if (!selectedLead) {
      toast({
        title: "Select a customer",
        description: "Please select a customer for this invoice.",
        variant: "destructive"
      });
      return;
    }

    if (invoiceItems.some(item => !item.description || item.price <= 0)) {
      toast({
        title: "Complete invoice items",
        description: "Please fill in all item descriptions and prices.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would generate a PDF using a library like jsPDF or react-pdf
    const invoiceData = {
      customer: selectedLead,
      items: invoiceItems,
      details: invoiceDetails,
      totals: { subtotal, tax, total }
    };

    // Mock PDF generation
    console.log('Generating invoice:', invoiceData);
    
    toast({
      title: "Invoice generated!",
      description: `Invoice ${invoiceDetails.invoiceNumber} created for ${selectedLead.name}`,
    });

    // Reset form
    setSelectedLead(null);
    setInvoiceItems([{ id: 1, description: '', quantity: 1, price: 0 }]);
    setInvoiceDetails({
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      dueDate: '',
      notes: ''
    });
  };

  const previewInvoice = () => {
    if (!selectedLead) {
      toast({
        title: "Select a customer",
        description: "Please select a customer to preview the invoice.",
        variant: "destructive"
      });
      return;
    }

    // Mock preview functionality
    toast({
      title: "Preview ready",
      description: "Invoice preview would open in a new window.",
    });
  };

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
                <FileText className="h-6 w-6 text-primary" />
                <span className="font-serif text-xl font-bold text-primary">Invoice Generator</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Invoice Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Customer</CardTitle>
                <CardDescription>Choose a customer from your leads</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedLead?.id?.toString() || ''} onValueChange={(value) => {
                  const lead = mockLeads.find(l => l.id.toString() === value);
                  setSelectedLead(lead);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLeads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id.toString()}>
                        {lead.name} - {lead.cakeType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedLead && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium">{selectedLead.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedLead.email}</p>
                    <Badge variant="outline" className="mt-2">{selectedLead.cakeType}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Invoice Details */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input
                      id="invoiceNumber"
                      value={invoiceDetails.invoiceNumber}
                      onChange={(e) => setInvoiceDetails(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={invoiceDetails.dueDate}
                      onChange={(e) => setInvoiceDetails(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={invoiceDetails.notes}
                    onChange={(e) => setInvoiceDetails(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Payment terms, special instructions, etc."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Invoice Items */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Invoice Items</CardTitle>
                    <CardDescription>Add products or services</CardDescription>
                  </div>
                  <Button onClick={addItem} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoiceItems.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-6">
                        <Label className={index === 0 ? 'block' : 'sr-only'}>Description</Label>
                        <Input
                          placeholder="Cake description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className={index === 0 ? 'block' : 'sr-only'}>Qty</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Label className={index === 0 ? 'block' : 'sr-only'}>Price</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-1">
                        {invoiceItems.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Invoice Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (8%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Button onClick={previewInvoice} variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button onClick={generateInvoice} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate PDF
                  </Button>
                </div>

                {selectedLead && (
                  <div className="pt-4 border-t text-sm text-muted-foreground">
                    <p className="font-medium">Billing to:</p>
                    <p>{selectedLead.name}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoicing;
