import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Users, 
  History, 
  Calendar, 
  DollarSign, 
  Clock, 
  Tag, 
  MessageSquare, 
  Phone, 
  Mail,
  MapPin,
  ExternalLink,
  AlertCircle,
  Cake,
  TrendingUp,
  Search,
  Filter,
  Cookie,
  Heart
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import LogoutButton from '@/components/LogoutButton';
import { Package } from 'lucide-react';

const STAGES = [
  { key: 'new', label: 'New Inquiries' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'quoted', label: 'Quote Sent' },
  { key: 'converted', label: 'Order Confirmed' },
  { key: 'lost', label: 'Not Interested' }
];

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  productType: string;
  category: string;
  message: string;
  status: string;
  createdAt: string;
  lastUpdated: string;
  estimatedValue: number;
  note: string;
  clientId?: number;
  isExistingClient?: boolean;
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

interface OpportunityHistory {
  date: string;
  action: string;
  details: string;
}

// Add a helper function for safe date formatting
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Not available';
  try {
    return format(new Date(dateString), 'PPP');
  } catch (error) {
    return 'Invalid date';
  }
};

const CRMDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const storedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
      return storedLeads.map((lead: any) => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        productType: lead.productType || lead.cakeType || '',
        message: lead.message,
        status: lead.status || 'new',
        createdAt: lead.createdAt || new Date().toISOString(),
        lastUpdated: lead.lastUpdated || lead.createdAt || new Date().toISOString(),
        estimatedValue: lead.estimatedValue || 0,
        note: lead.note || '',
        category: lead.category || 'Uncategorized', // Initialize category
      }));
    } catch (error) {
      console.error('Error loading leads:', error);
      return [];
    }
  });

  const [clients, setClients] = useState<Client[]>(() => {
    return JSON.parse(localStorage.getItem('clients') || '[]');
  });

  // Refresh leads periodically
  useEffect(() => {
    const interval = setInterval(() => {
      try {
    const storedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
        if (storedLeads.length !== leads.length) {
          setLeads(storedLeads.map((lead: any) => ({
            id: lead.id,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            productType: lead.productType || lead.cakeType || '',
            message: lead.message,
            status: lead.status || 'new',
            createdAt: lead.createdAt || new Date().toISOString(),
            lastUpdated: lead.lastUpdated || lead.createdAt || new Date().toISOString(),
            estimatedValue: lead.estimatedValue || 0,
            note: lead.note || '',
            category: lead.category || 'Uncategorized', // Ensure category is set
          })));
        }
      } catch (error) {
        console.error('Error refreshing leads:', error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [leads.length]);

  // Check for existing clients when leads change
  useEffect(() => {
    const updatedLeads = leads.map(lead => {
      const existingClient = clients.find(
        client => client.email.toLowerCase() === lead.email.toLowerCase()
      );
      return {
        ...lead,
        clientId: existingClient?.id,
        isExistingClient: !!existingClient
      };
    });
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
  }, [clients]);

  const convertToClient = (lead: Lead) => {
    if (lead.isExistingClient) return;

    const newClient: Client = {
      id: Date.now(),
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      totalOrders: 0,
      totalSpent: 0,
      lastOrder: '-'
    };

    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));

    const updatedLeads = leads.map(l => {
      if (l.id === lead.id) {
        return {
          ...l,
          clientId: newClient.id,
          isExistingClient: true
        };
      }
      return l;
    });
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));

    toast({
      title: "Client Created",
      description: `${lead.name} has been added to your client list.`
    });
  };

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [note, setNote] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  // Group leads by stage
  const leadsByStage = STAGES.reduce((acc, stage) => {
    acc[stage.key] = leads.filter(lead => lead.status === stage.key);
    return acc;
  }, {} as Record<string, Lead[]>);

  // Calculate metrics by category
  const categoryMetrics = useMemo(() => {
    const metrics: Record<string, { total: number; converted: number; value: number }> = {};
    
    leads.forEach(lead => {
      const category = lead.category || 'Uncategorized';
      if (!metrics[category]) {
        metrics[category] = { total: 0, converted: 0, value: 0 };
      }
      metrics[category].total += 1;
      if (lead.status === 'converted') {
        metrics[category].converted += 1;
        metrics[category].value += lead.estimatedValue;
      }
    });

    return metrics;
  }, [leads]);

  // Update localStorage whenever leads change
  useEffect(() => {
    localStorage.setItem('leads', JSON.stringify(leads));
  }, [leads]);

  // Handle drag end with status update
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const sourceStage = result.source.droppableId;
    const destStage = result.destination.droppableId;
    
    if (sourceStage === destStage && result.source.index === result.destination.index) return;
    
    const sourceLeads = Array.from(leadsByStage[sourceStage]);
    const [movedLead] = sourceLeads.splice(result.source.index, 1);
    
    const updatedLead = {
      ...movedLead,
      status: destStage,
      lastUpdated: new Date().toISOString()
    };

    const updatedLeads = leads.map(lead =>
      lead.id === updatedLead.id ? updatedLead : lead
    );

    setLeads(updatedLeads);
    
    toast({
      title: "Lead Status Updated",
      description: `${updatedLead.name}'s status changed to ${getStatusLabel(destStage)}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'border-blue-200';
      case 'contacted': return 'border-yellow-200';
      case 'quoted': return 'border-purple-200';
      case 'converted': return 'border-green-200';
      case 'lost': return 'border-red-200';
      default: return 'border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'New Inquiry';
      case 'contacted': return 'Contacted';
      case 'quoted': return 'Quote Sent';
      case 'converted': return 'Order Confirmed';
      case 'lost': return 'Not Interested';
      default: return status;
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.productType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalValue = leads.reduce((sum, lead) => sum + lead.estimatedValue, 0);
  const convertedValue = leads.filter(lead => lead.status === 'converted').reduce((sum, lead) => sum + lead.estimatedValue, 0);
  const conversionRate = leads.length > 0 ? Math.round((leads.filter(lead => lead.status === 'converted').length / leads.length) * 100) : 0;

  // Open modal for lead
  const openLeadModal = (lead: Lead) => {
    setSelectedLead(lead);
    setEditLead({ ...lead });
    setNote(lead.note || '');
  };

  // Handle lead update
  const handleUpdateLead = () => {
    if (!editLead) return;

    const updatedLead = {
      ...editLead,
      lastUpdated: new Date().toISOString()
    };

    const updatedLeads = leads.map((l) =>
      l.id === updatedLead.id ? updatedLead : l
    );

    setLeads(updatedLeads);
    setSelectedLead(null);
    setEditLead(null);

    toast({
      title: "Lead Updated",
      description: `${updatedLead.name}'s information has been updated`,
    });
  };

  // Handle lead deletion
  const handleDeleteLead = () => {
    if (!editLead) return;

    const updatedLeads = leads.filter((l) => l.id !== editLead.id);
    setLeads(updatedLeads);
    setSelectedLead(null);
    setEditLead(null);

    toast({
      title: "Lead Deleted",
      description: `${editLead.name}'s lead has been removed`,
      variant: "destructive"
    });
  };

  // Create sales order from lead
  const createSalesOrderFromLead = (lead: Lead) => {
    // Create comprehensive sales order data
    const salesOrderData = {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      clientId: lead.clientId,
      productType: lead.productType,
      category: lead.category,
      estimatedValue: lead.estimatedValue,
      message: lead.message,
      note: lead.note,
      // Create initial order item from lead data
      initialItem: {
        productName: lead.productType,
        category: lead.category,
        quantity: 1,
        unit: 'kg',
        unitPrice: lead.estimatedValue || 0,
        notes: lead.message
      }
    };

    // Store lead data for sales order creation
    localStorage.setItem('pendingSalesOrder', JSON.stringify(salesOrderData));
    
    // Redirect to sales orders page
    window.location.href = '/sales?createFromLead=true';
  };

  // Get client history
  const getClientHistory = (clientId?: number) => {
    if (!clientId) return [];
    
    const client = clients.find(c => c.id === clientId);
    if (!client) return [];

    const previousLeads = leads.filter(l => l.clientId === clientId && l.id !== selectedLead?.id);
    const history: OpportunityHistory[] = [];

    // Add client creation
    if (client.createdAt) {
      history.push({
        date: client.createdAt,
        action: 'Client Created',
        details: 'Added to client database'
      });
    }

    // Add previous leads/opportunities
    previousLeads.forEach(lead => {
      if (lead.createdAt) {
        history.push({
          date: lead.createdAt,
          action: 'Previous Inquiry',
          details: `${lead.category} - ${lead.productType} (${lead.status})`
        });
      }
    });

    // Add orders if any
    if (client.totalOrders > 0 && client.lastOrder) {
      history.push({
        date: client.lastOrder,
        action: 'Latest Order',
        details: `Total orders: ${client.totalOrders}, Total spent: KES ${client.totalSpent.toLocaleString()}`
      });
    }

    return history
      .filter(item => item.date) // Filter out items without dates
      .sort((a, b) => {
        try {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        } catch (error) {
          return 0;
        }
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  <Cake className="h-8 w-8 text-primary" />
                  <div>
                    <span className="font-serif text-xl font-bold text-primary">Treat Yo Self</span>
                    <span className="text-sm text-muted-foreground ml-2">Staff Portal</span>
                  </div>
                </Link>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button asChild variant="outline" size="sm">
                <Link to="/clients">
                  <Users className="h-4 w-4 mr-2" />
                  Clients
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/products">Products</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/sales">Sales Orders</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/invoicing">Invoicing</Link>
              </Button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-4xl font-bold text-primary">CRM Pipeline</h1>
          <div className="flex gap-4">
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded p-2"
            >
              <option value="all">All Statuses</option>
              {STAGES.map(stage => (
                <option key={stage.key} value={stage.key}>{stage.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Performance Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">Category Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categoryMetrics).map(([category, metrics]) => (
              <Card key={category} className="bg-white/80">
                <CardHeader>
                  <CardTitle className="text-lg">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Leads:</span>
                      <span className="font-medium">{metrics.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Converted:</span>
                      <span className="font-medium">{metrics.converted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Conversion Rate:</span>
                      <span className="font-medium">
                        {((metrics.converted / metrics.total) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Value:</span>
                      <span className="font-medium">KSH {metrics.value.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Existing Pipeline */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {STAGES.map(stage => (
              <Droppable droppableId={stage.key} key={stage.key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-white/80 rounded-lg shadow p-3 min-h-[300px] flex flex-col ${snapshot.isDraggingOver ? 'ring-2 ring-primary' : ''}`}
                  >
                    <div className="font-bold text-lg text-primary mb-2 text-center">{stage.label}</div>
                    {leadsByStage[stage.key].length === 0 && (
                      <div className="text-muted-foreground text-center text-sm py-4">No leads</div>
                    )}
                    {leadsByStage[stage.key].map((lead, idx) => (
                      <Draggable draggableId={lead.id.toString()} index={idx} key={lead.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-3 last:mb-0 bg-white rounded shadow p-3 border-l-4 ${getStatusColor(lead.status)} ${snapshot.isDragging ? 'ring-2 ring-primary' : ''} cursor-pointer`}
                            onClick={() => openLeadModal(lead)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                            <div className="font-semibold text-primary">{lead.name}</div>
                                <div className="text-xs text-muted-foreground">{lead.email} {lead.phone && <>| {lead.phone}</>}</div>
                              </div>
                              {lead.isExistingClient ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  Existing Client
                                </Badge>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    convertToClient(lead);
                                  }}
                                >
                                  Convert to Client
                                </Button>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mb-1">{lead.category} - {lead.productType}</div>
                            <div className="text-xs text-muted-foreground mb-1">Inquiry: {format(new Date(lead.createdAt), 'PPP')}</div>
                            <div className="text-xs text-muted-foreground mb-1">
                              Est. Value: KES {lead.estimatedValue ? lead.estimatedValue.toLocaleString() : '-'}
                            </div>
                            <div className="text-xs text-muted-foreground">{lead.message}</div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
        {/* Enhanced Lead/Opportunity Dialog */}
        <Dialog open={!!selectedLead} onOpenChange={(open) => {
          if (!open) {
            setSelectedLead(null);
            setEditLead(null);
            setShowHistory(false);
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedLead?.isExistingClient ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Existing Client
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      New Lead
                    </Badge>
                  )}
                  <span>Opportunity Details</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-xs"
                  >
                    <History className="h-4 w-4 mr-1" />
                    History
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Opportunity Details</TabsTrigger>
                <TabsTrigger value="history">Client History</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Contact Information</Label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{selectedLead?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedLead?.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedLead?.phone || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Opportunity Details</Label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedLead?.category} - {selectedLead?.productType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>Est. Value: KES {selectedLead?.estimatedValue?.toLocaleString() || 'Not set'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Created: {formatDate(selectedLead?.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Current Status</Label>
                      <select
                        className="w-full border rounded p-2"
                        value={editLead?.status}
                        onChange={e => setEditLead(prev => prev ? { ...prev, status: e.target.value } : null)}
                      >
                        {STAGES.map(stage => (
                          <option key={stage.key} value={stage.key}>{stage.label}</option>
                        ))}
                </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Inquiry Message</Label>
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm whitespace-pre-wrap">{selectedLead?.message}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Internal Notes</Label>
                      <Textarea
                        value={editLead?.note || ''}
                        onChange={e => setEditLead(prev => prev ? { ...prev, note: e.target.value } : null)}
                        placeholder="Add internal notes about this opportunity..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Estimated Value</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">KES</span>
                        <Input
                          type="number"
                          value={editLead?.estimatedValue || ''}
                          onChange={e => setEditLead(prev => prev ? { 
                            ...prev, 
                            estimatedValue: parseInt(e.target.value) || 0 
                          } : null)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <ScrollArea className="h-[400px] pr-4">
                  {selectedLead?.clientId ? (
                    <div className="space-y-4">
                      {getClientHistory(selectedLead.clientId).map((item, index) => (
                        <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <History className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{item.action}</div>
                            <div className="text-sm text-muted-foreground">{item.details}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatDate(item.date)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No history available - Convert to client to track history</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex justify-between items-center mt-6">
              <div className="flex gap-2">
                {!selectedLead?.isExistingClient && (
                  <Button
                    variant="outline"
                    onClick={() => selectedLead && convertToClient(selectedLead)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Convert to Client
                  </Button>
                )}
                {selectedLead?.status === 'converted' && (
                  <Button
                    variant="outline"
                    onClick={() => selectedLead && createSalesOrderFromLead(selectedLead)}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Create Sales Order
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={handleDeleteLead}
                >
                  Delete
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedLead(null);
                    setEditLead(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateLead}>
                  Update
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CRMDashboard;
