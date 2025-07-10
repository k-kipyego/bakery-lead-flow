import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, TrendingUp, Calendar, DollarSign, Search, Filter, Cake, Cookie, Heart } from 'lucide-react';

const CRMDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - in real app this would come from Supabase
  const leads = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@email.com',
      phone: '(254) 700-123-456',
      productType: 'Specialty Cake - Salted Caramel',
      message: 'Need a 2kg birthday cake for next Saturday. Love the salted caramel flavor!',
      status: 'new',
      createdAt: '2024-01-15',
      estimatedValue: 4500
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      phone: '(254) 700-987-654',
      productType: 'Cookies - Death by Chocolate',
      message: 'Office party order - need 5 dozen cookies for Friday delivery',
      status: 'contacted',
      createdAt: '2024-01-14',
      estimatedValue: 2500
    },
    {
      id: 3,
      name: 'Emma Williams',
      email: 'emma.w@email.com',
      phone: '(254) 700-456-789',
      productType: 'Classic Cake - Red Velvet',
      message: 'Wedding cake consultation needed. Looking for 3-tier red velvet design.',
      status: 'quoted',
      createdAt: '2024-01-13',
      estimatedValue: 8500
    },
    {
      id: 4,
      name: 'David Brown',
      email: 'david.brown@email.com',
      phone: '(254) 700-321-987',
      productType: 'Brownies - Classic',
      message: 'Regular weekly order for my café. Need 3 dozen brownies every Tuesday.',
      status: 'converted',
      createdAt: '2024-01-12',
      estimatedValue: 1800
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'quoted': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'converted': return 'bg-green-100 text-green-800 border-green-200';
      case 'lost': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
                <span className="text-sm text-muted-foreground ml-2">Staff Portal</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button asChild variant="outline" size="sm">
                <a href="/">Public Site</a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="/products">Products</a>
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
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-primary mb-2">Customer Management</h1>
          <p className="text-muted-foreground">Track inquiries and manage your sweet customer relationships</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Inquiries</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{leads.length}</div>
              <p className="text-xs text-muted-foreground">Active customer leads</p>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{conversionRate}%</div>
              <p className="text-xs text-muted-foreground">Inquiries to orders</p>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pipeline Value</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">KSH {totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Potential revenue</p>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed Orders</CardTitle>
              <Heart className="h-4 w-4 text-primary" fill="currentColor" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">KSH {convertedValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Revenue secured</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-accent/20">
          <CardHeader>
            <CardTitle className="text-primary">Filter & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New Inquiries</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="quoted">Quote Sent</SelectItem>
                  <SelectItem value="converted">Confirmed Orders</SelectItem>
                  <SelectItem value="lost">Not Interested</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leads List */}
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className="border-accent/20 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                  <div>
                    <CardTitle className="text-lg text-primary">{lead.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-1">
                      <span>{lead.email}</span>
                      {lead.phone && <span>{lead.phone}</span>}
                      <span className="text-xs">Inquiry: {lead.createdAt}</span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(lead.status)}>
                      {getStatusLabel(lead.status)}
                    </Badge>
                    <Badge variant="outline" className="text-primary border-primary/50">
                      KSH {lead.estimatedValue.toLocaleString()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <strong className="text-primary">Product Interest:</strong>
                    <span className="ml-2 text-muted-foreground">{lead.productType}</span>
                  </div>
                  <div>
                    <strong className="text-primary">Message:</strong>
                    <p className="mt-1 text-muted-foreground">{lead.message}</p>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="default">
                      Contact Customer
                    </Button>
                    <Button size="sm" variant="outline">
                      Send Quote
                    </Button>
                    <Button size="sm" variant="outline">
                      Mark as Converted
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLeads.length === 0 && (
          <Card className="border-accent/20">
            <CardContent className="text-center py-12">
              <Cookie className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No customers found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CRMDashboard;
