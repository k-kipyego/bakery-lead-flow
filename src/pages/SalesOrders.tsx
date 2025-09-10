import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Cake, ArrowLeft, Plus, Eye, FileText, Calendar, Users, Package, Truck, Edit, Trash, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import LogoutButton from '@/components/LogoutButton';

interface SalesOrderItem {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

interface SalesOrder {
  id: number;
  orderNumber: string;
  clientId: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  leadId?: number; // Reference to original CRM lead
  status: 'draft' | 'confirmed' | 'in_production' | 'completed' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  items: SalesOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
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

const ORDER_STATUSES = [
  { key: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  { key: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  { key: 'in_production', label: 'In Production', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { key: 'delivered', label: 'Delivered', color: 'bg-purple-100 text-purple-800' },
  { key: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
];

const SalesOrders = () => {
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(() => {
    return JSON.parse(localStorage.getItem('salesOrders') || '[]');
  });
  const [clients, setClients] = useState<Client[]>(() => {
    return JSON.parse(localStorage.getItem('clients') || '[]');
  });
  const [leads, setLeads] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('leads') || '[]');
  });
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [newItem, setNewItem] = useState({
    productName: '',
    category: '',
    quantity: 1,
    unit: 'kg',
    unitPrice: 0,
    notes: ''
  });

  // Check for pending sales order from CRM
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const createFromLead = urlParams.get('createFromLead');
    
    if (createFromLead === 'true') {
      const pendingOrder = localStorage.getItem('pendingSalesOrder');
      if (pendingOrder) {
        const leadData = JSON.parse(pendingOrder);
        createSalesOrder(leadData);
        localStorage.removeItem('pendingSalesOrder');
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Generate order number
  const generateOrderNumber = () => {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const count = salesOrders.length + 1;
    return `SO${year}${month}${day}-${count.toString().padStart(3, '0')}`;
  };

  // Create new sales order
  const createSalesOrder = (leadData?: any) => {
    // Create initial item from lead data if available
    const initialItems = leadData?.initialItem ? [{
      id: Date.now().toString(),
      productName: leadData.initialItem.productName,
      category: leadData.initialItem.category,
      quantity: leadData.initialItem.quantity,
      unit: leadData.initialItem.unit,
      unitPrice: leadData.initialItem.unitPrice,
      totalPrice: leadData.initialItem.quantity * leadData.initialItem.unitPrice,
      notes: leadData.initialItem.notes
    }] : [];

    // Calculate totals
    const subtotal = initialItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    const newOrder: SalesOrder = {
      id: Date.now(),
      orderNumber: generateOrderNumber(),
      clientId: leadData?.clientId || 0,
      clientName: leadData?.name || '',
      clientEmail: leadData?.email || '',
      clientPhone: leadData?.phone || '',
      leadId: leadData?.id,
      status: 'draft',
      orderDate: format(new Date(), 'yyyy-MM-dd'),
      items: initialItems,
      subtotal,
      tax,
      total,
      notes: leadData?.note || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSalesOrders([newOrder, ...salesOrders]);
    localStorage.setItem('salesOrders', JSON.stringify([newOrder, ...salesOrders]));
    
    setSelectedOrder(newOrder);
    setShowCreateForm(false);
    
    toast({
      title: "Sales Order Created",
      description: `Order ${newOrder.orderNumber} has been created from lead with ${initialItems.length} item(s)`,
    });
  };

  // Update order status
  const updateOrderStatus = (orderId: number, newStatus: string) => {
    const updatedOrders = salesOrders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus as any, updatedAt: new Date().toISOString() }
        : order
    );
    setSalesOrders(updatedOrders);
    localStorage.setItem('salesOrders', JSON.stringify(updatedOrders));
    
    toast({
      title: "Order Status Updated",
      description: `Order status changed to ${ORDER_STATUSES.find(s => s.key === newStatus)?.label}`,
    });
  };

  // Add item to order
  const addOrderItem = (orderId: number, item: Omit<SalesOrderItem, 'id'>) => {
    const newItem: SalesOrderItem = {
      ...item,
      id: Date.now().toString(),
      totalPrice: item.quantity * item.unitPrice
    };

    const updatedOrders = salesOrders.map(order => {
      if (order.id === orderId) {
        const updatedItems = [...order.items, newItem];
        const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const tax = subtotal * 0.16; // 16% VAT
        const total = subtotal + tax;
        
        return {
          ...order,
          items: updatedItems,
          subtotal,
          tax,
          total,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    });

    setSalesOrders(updatedOrders);
    localStorage.setItem('salesOrders', JSON.stringify(updatedOrders));
    
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(updatedOrders.find(o => o.id === orderId) || null);
    }
  };

  // Remove item from order
  const removeOrderItem = (orderId: number, itemId: string) => {
    const updatedOrders = salesOrders.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.filter(item => item.id !== itemId);
        const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const tax = subtotal * 0.16;
        const total = subtotal + tax;
        
        return {
          ...order,
          items: updatedItems,
          subtotal,
          tax,
          total,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    });

    setSalesOrders(updatedOrders);
    localStorage.setItem('salesOrders', JSON.stringify(updatedOrders));
    
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(updatedOrders.find(o => o.id === orderId) || null);
    }
  };

  // Update order details
  const updateOrderDetails = (orderId: number, updates: Partial<SalesOrder>) => {
    const updatedOrders = salesOrders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, ...updates, updatedAt: new Date().toISOString() };
        return updatedOrder;
      }
      return order;
    });

    setSalesOrders(updatedOrders);
    localStorage.setItem('salesOrders', JSON.stringify(updatedOrders));
    
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(updatedOrders.find(o => o.id === orderId) || null);
    }
  };

  // Start editing order
  const startEditingOrder = (order: SalesOrder) => {
    setEditingOrder({ ...order });
    setIsEditingOrder(true);
  };

  // Save edited order
  const saveEditedOrder = () => {
    if (!editingOrder) return;

    // Recalculate totals
    const subtotal = editingOrder.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    const updatedOrder = {
      ...editingOrder,
      subtotal,
      tax,
      total,
      updatedAt: new Date().toISOString()
    };

    const updatedOrders = salesOrders.map(order => 
      order.id === editingOrder.id ? updatedOrder : order
    );

    setSalesOrders(updatedOrders);
    localStorage.setItem('salesOrders', JSON.stringify(updatedOrders));
    
    if (selectedOrder?.id === editingOrder.id) {
      setSelectedOrder(updatedOrder);
    }

    setIsEditingOrder(false);
    setEditingOrder(null);

    toast({
      title: "Order Updated",
      description: `Order ${editingOrder.orderNumber} has been updated successfully.`
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditingOrder(false);
    setEditingOrder(null);
  };

  // Add new item to order
  const handleAddItem = () => {
    if (!selectedOrder || !newItem.productName || !newItem.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in product name and category.",
        variant: "destructive"
      });
      return;
    }

    addOrderItem(selectedOrder.id, newItem);
    setNewItem({
      productName: '',
      category: '',
      quantity: 1,
      unit: 'kg',
      unitPrice: 0,
      notes: ''
    });
    setShowAddItemForm(false);

    toast({
      title: "Item Added",
      description: `${newItem.productName} has been added to the order.`
    });
  };

  // Filter orders
  const filteredOrders = salesOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalOrders = salesOrders.length;
  const totalValue = salesOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = salesOrders.filter(order => ['draft', 'confirmed', 'in_production'].includes(order.status)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-accent/20">
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
                <Package className="h-6 w-6 text-primary" />
                <span className="font-serif text-xl font-bold text-primary">Sales Orders</span>
              </Link>
            </div>
            <div className="flex space-x-4">
              <Button asChild variant="outline" size="sm">
                <Link to="/clients">
                  <Users className="h-4 w-4 mr-2" />
                  Clients
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/invoicing">
                  <FileText className="h-4 w-4 mr-2" />
                  Invoicing
                </Link>
              </Button>
              <Button onClick={() => createSalesOrder()}>
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="text-lg">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{totalOrders}</p>
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
              <CardTitle className="text-lg">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{pendingOrders}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search orders..."
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
                  {ORDER_STATUSES.map(status => (
                    <SelectItem key={status.key} value={status.key}>{status.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Orders</CardTitle>
            <CardDescription>Manage your sales orders and track their progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{order.clientName}</TableCell>
                      <TableCell>
                        <Badge className={ORDER_STATUSES.find(s => s.key === order.status)?.color}>
                          {ORDER_STATUSES.find(s => s.key === order.status)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(order.orderDate), 'PPP')}</TableCell>
                      <TableCell>
                        {order.deliveryDate ? format(new Date(order.deliveryDate), 'PPP') : '-'}
                      </TableCell>
                      <TableCell className="font-medium">Ksh {order.total.toLocaleString()}</TableCell>
                      <TableCell>{order.items.length}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditingOrder(order)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          {order.status === 'completed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                            >
                              <Link to={`/invoicing?orderId=${order.id}`}>
                                <FileText className="h-3 w-3 mr-1" />
                                Invoice
                              </Link>
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

        {/* Order Details Modal */}
        <Dialog open={!!selectedOrder} onOpenChange={(open) => {
          if (!open) setSelectedOrder(null);
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Sales Order Details - {selectedOrder?.orderNumber}</span>
                {selectedOrder?.leadId && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    From CRM Lead
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Client Information</Label>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="font-medium">{selectedOrder.clientName}</p>
                      <p className="text-sm text-muted-foreground">{selectedOrder.clientEmail}</p>
                      <p className="text-sm text-muted-foreground">{selectedOrder.clientPhone}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Order Status</Label>
                    <Select
                      value={selectedOrder.status}
                      onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map(status => (
                          <SelectItem key={status.key} value={status.key}>{status.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-2">
                  <Label>Order Items</Label>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.quantity} {item.unit}</TableCell>
                            <TableCell>Ksh {item.unitPrice.toLocaleString()}</TableCell>
                            <TableCell>Ksh {item.totalPrice.toLocaleString()}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeOrderItem(selectedOrder.id, item.id)}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-2">
                  <Label>Order Summary</Label>
                  <div className="p-3 bg-muted rounded-md space-y-1">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>Ksh {selectedOrder.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (16%):</span>
                      <span>Ksh {selectedOrder.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>Ksh {selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label>Order Notes</Label>
                  <Textarea
                    value={selectedOrder.notes}
                    onChange={(e) => {
                      const updatedOrder = { ...selectedOrder, notes: e.target.value };
                      setSelectedOrder(updatedOrder);
                      // Update in localStorage
                      const updatedOrders = salesOrders.map(o => 
                        o.id === selectedOrder.id ? updatedOrder : o
                      );
                      setSalesOrders(updatedOrders);
                      localStorage.setItem('salesOrders', JSON.stringify(updatedOrders));
                    }}
                    placeholder="Add notes about this order..."
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Order Modal */}
        <Dialog open={isEditingOrder} onOpenChange={(open) => {
          if (!open) cancelEditing();
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Edit Sales Order - {editingOrder?.orderNumber}</span>
                {editingOrder?.leadId && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    From CRM Lead
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            
            {editingOrder && (
              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Client Name</Label>
                    <Input
                      value={editingOrder.clientName}
                      onChange={(e) => setEditingOrder({ ...editingOrder, clientName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Client Email</Label>
                    <Input
                      value={editingOrder.clientEmail}
                      onChange={(e) => setEditingOrder({ ...editingOrder, clientEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Client Phone</Label>
                    <Input
                      value={editingOrder.clientPhone}
                      onChange={(e) => setEditingOrder({ ...editingOrder, clientPhone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Order Status</Label>
                    <Select
                      value={editingOrder.status}
                      onValueChange={(value) => setEditingOrder({ ...editingOrder, status: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map(status => (
                          <SelectItem key={status.key} value={status.key}>{status.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Order Date</Label>
                    <Input
                      type="date"
                      value={editingOrder.orderDate}
                      onChange={(e) => setEditingOrder({ ...editingOrder, orderDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Delivery Date</Label>
                    <Input
                      type="date"
                      value={editingOrder.deliveryDate || ''}
                      onChange={(e) => setEditingOrder({ ...editingOrder, deliveryDate: e.target.value || undefined })}
                    />
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Order Items</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAddItemForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {editingOrder.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Input
                                value={item.productName}
                                onChange={(e) => {
                                  const updatedItems = editingOrder.items.map(i =>
                                    i.id === item.id ? { ...i, productName: e.target.value } : i
                                  );
                                  setEditingOrder({ ...editingOrder, items: updatedItems });
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={item.category}
                                onChange={(e) => {
                                  const updatedItems = editingOrder.items.map(i =>
                                    i.id === item.id ? { ...i, category: e.target.value } : i
                                  );
                                  setEditingOrder({ ...editingOrder, items: updatedItems });
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const quantity = Number(e.target.value);
                                    const updatedItems = editingOrder.items.map(i =>
                                      i.id === item.id ? { 
                                        ...i, 
                                        quantity,
                                        totalPrice: quantity * i.unitPrice
                                      } : i
                                    );
                                    setEditingOrder({ ...editingOrder, items: updatedItems });
                                  }}
                                  className="w-16"
                                />
                                <span className="text-sm text-muted-foreground">{item.unit}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) => {
                                  const unitPrice = Number(e.target.value);
                                  const updatedItems = editingOrder.items.map(i =>
                                    i.id === item.id ? { 
                                      ...i, 
                                      unitPrice,
                                      totalPrice: i.quantity * unitPrice
                                    } : i
                                  );
                                  setEditingOrder({ ...editingOrder, items: updatedItems });
                                }}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              Ksh {item.totalPrice.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const updatedItems = editingOrder.items.filter(i => i.id !== item.id);
                                  setEditingOrder({ ...editingOrder, items: updatedItems });
                                }}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-2">
                  <Label>Order Summary</Label>
                  <div className="p-3 bg-muted rounded-md space-y-1">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>Ksh {editingOrder.items.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (16%):</span>
                      <span>Ksh {(editingOrder.items.reduce((sum, item) => sum + item.totalPrice, 0) * 0.16).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>Ksh {(editingOrder.items.reduce((sum, item) => sum + item.totalPrice, 0) * 1.16).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label>Order Notes</Label>
                  <Textarea
                    value={editingOrder.notes}
                    onChange={(e) => setEditingOrder({ ...editingOrder, notes: e.target.value })}
                    placeholder="Add notes about this order..."
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={cancelEditing}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={saveEditedOrder}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Item Modal */}
        <Dialog open={showAddItemForm} onOpenChange={setShowAddItemForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Item to Order</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Product Name *</Label>
                <Input
                  value={newItem.productName}
                  onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Input
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  placeholder="Enter category"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantity *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select value={newItem.unit} onValueChange={(value) => setNewItem({ ...newItem, unit: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="piece">piece</SelectItem>
                      <SelectItem value="pack">pack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Unit Price (Ksh) *</Label>
                <Input
                  type="number"
                  min="0"
                  value={newItem.unitPrice}
                  onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
                  placeholder="Enter unit price"
                />
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  placeholder="Add any special notes..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddItemForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SalesOrders;
