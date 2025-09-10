import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Download, Eye, FileText, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import LogoutButton from '@/components/LogoutButton';

interface SalesOrder {
  id: number;
  orderNumber: string;
  clientId: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  status: string;
  orderDate: string;
  deliveryDate?: string;
  items: any[];
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  salesOrderId: number;
  salesOrderNumber: string;
  clientId: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  invoiceDate: string;
  dueDate: string;
  items: any[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes: string;
  createdAt: string;
}

const Invoicing = () => {
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(() => {
    return JSON.parse(localStorage.getItem('salesOrders') || '[]');
  });
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    return JSON.parse(localStorage.getItem('invoices') || '[]');
  });
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Check for orderId parameter from sales orders
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    
    if (orderId) {
      const order = salesOrders.find(o => o.id.toString() === orderId);
      if (order && order.status === 'completed') {
        setSelectedOrder(order);
      }
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [salesOrders]);

  // Generate invoice number
  const generateInvoiceNumber = () => {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const count = invoices.length + 1;
    return `INV${year}${month}${day}-${count.toString().padStart(3, '0')}`;
  };

  // Create invoice from sales order
  const createInvoice = (order: SalesOrder) => {
    const invoice: Invoice = {
      id: Date.now(),
      invoiceNumber: generateInvoiceNumber(),
      salesOrderId: order.id,
      salesOrderNumber: order.orderNumber,
      clientId: order.clientId,
      clientName: order.clientName,
      clientEmail: order.clientEmail,
      clientPhone: order.clientPhone,
      invoiceDate: format(new Date(), 'yyyy-MM-dd'),
      dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // 30 days from now
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      status: 'draft',
      notes: order.notes,
      createdAt: new Date().toISOString()
    };

    setInvoices([invoice, ...invoices]);
    localStorage.setItem('invoices', JSON.stringify([invoice, ...invoices]));
    
    toast({
      title: "Invoice Created",
      description: `Invoice ${invoice.invoiceNumber} created from order ${order.orderNumber}`,
    });

    setSelectedOrder(null);
  };

  // Update invoice status
  const updateInvoiceStatus = (invoiceId: number, newStatus: string) => {
    const updatedInvoices = invoices.map(invoice => 
      invoice.id === invoiceId 
        ? { ...invoice, status: newStatus as any }
        : invoice
    );
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    
    toast({
      title: "Invoice Status Updated",
      description: `Invoice status changed to ${newStatus}`,
    });
  };

  // Filter completed sales orders (available for invoicing)
  const completedOrders = salesOrders.filter(order => order.status === 'completed');
  
  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.salesOrderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalInvoices = invoices.length;
  const totalValue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const paidInvoices = invoices.filter(invoice => invoice.status === 'paid').length;
  const pendingValue = invoices.filter(invoice => ['draft', 'sent'].includes(invoice.status))
    .reduce((sum, invoice) => sum + invoice.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/sales">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sales Orders
                </Link>
              </Button>
              <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <FileText className="h-6 w-6 text-primary" />
                <span className="font-serif text-xl font-bold text-primary">Invoicing</span>
              </Link>
            </div>
            <div className="flex space-x-4">
              <Button asChild variant="outline" size="sm">
                <Link to="/sales">
                  <Package className="h-4 w-4 mr-2" />
                  Sales Orders
                </Link>
              </Button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="text-lg">Total Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{totalInvoices}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="text-lg">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">Ksh {totalValue.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="text-lg">Paid Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{paidInvoices}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="text-lg">Pending Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">Ksh {pendingValue.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Available Orders for Invoicing */}
        {completedOrders.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Completed Orders Ready for Invoicing</CardTitle>
              <CardDescription>These completed sales orders can be converted to invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{order.orderNumber}</div>
                      <div className="text-sm text-muted-foreground">{order.clientName}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.items.length} items • Ksh {order.total.toLocaleString()}
                      </div>
                    </div>
                    <Button onClick={() => createInvoice(order)}>
                      Create Invoice
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Manage your invoices and track payment status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Sales Order</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Invoice Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.salesOrderNumber}</TableCell>
                      <TableCell>{invoice.clientName}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                            invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                            invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        >
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(invoice.invoiceDate), 'PPP')}</TableCell>
                      <TableCell>{format(new Date(invoice.dueDate), 'PPP')}</TableCell>
                      <TableCell className="font-medium">Ksh {invoice.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            PDF
                          </Button>
                          {invoice.status === 'draft' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateInvoiceStatus(invoice.id, 'sent')}
                            >
                              Send
                            </Button>
                          )}
                          {invoice.status === 'sent' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                            >
                              Mark Paid
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {filteredInvoices.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No invoices found</h3>
              <p className="text-muted-foreground">
                {completedOrders.length === 0 
                  ? "Complete some sales orders to create invoices"
                  : "Try adjusting your search or filter criteria"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Invoicing;