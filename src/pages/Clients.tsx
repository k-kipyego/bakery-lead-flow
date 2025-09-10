import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Users, Plus, Search, ArrowLeft, Phone, Mail, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  createdAt: string;
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(() => {
    return JSON.parse(localStorage.getItem('clients') || '[]');
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const client: Client = {
      id: Date.now(),
      ...newClient,
      totalOrders: 0,
      totalSpent: 0,
      lastOrder: '-',
      createdAt: new Date().toISOString()
    };

    const updatedClients = [client, ...clients];
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));

    setNewClient({
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: ''
    });
    setIsAddingNew(false);

    toast({
      title: "Client Added",
      description: `${client.name} has been added to your client list.`
    });
  };

  const handleUpdateClient = () => {
    if (!selectedClient) return;

    const updatedClients = clients.map(client =>
      client.id === selectedClient.id ? selectedClient : client
    );

    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
    setSelectedClient(null);

    toast({
      title: "Client Updated",
      description: `${selectedClient.name}'s information has been updated.`
    });
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const topClients = [...clients]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

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
                <Users className="h-6 w-6 text-primary" />
                <span className="font-serif text-xl font-bold text-primary">Clients</span>
              </Link>
            </div>
            <Button onClick={() => setIsAddingNew(true)} disabled={isAddingNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Clients */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">Top Clients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {topClients.map((client) => (
              <Card key={client.id} className="bg-white/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {client.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-sm text-muted-foreground">Orders: {client.totalOrders}</p>
                  <p className="text-sm font-medium">KES {client.totalSpent.toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Client List</CardTitle>
            <CardDescription>Manage your client relationships</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          {client.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          {client.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{client.totalOrders}</TableCell>
                    <TableCell>KES {client.totalSpent.toLocaleString()}</TableCell>
                    <TableCell>{client.lastOrder}</TableCell>
                    <TableCell className="max-w-xs truncate">{client.notes}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedClient(client)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add/Edit Client Dialog */}
        <Dialog open={isAddingNew || !!selectedClient} onOpenChange={(open) => {
          if (!open) {
            setIsAddingNew(false);
            setSelectedClient(null);
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={selectedClient ? handleUpdateClient : handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={selectedClient ? selectedClient.name : newClient.name}
                  onChange={(e) => selectedClient
                    ? setSelectedClient({ ...selectedClient, name: e.target.value })
                    : setNewClient({ ...newClient, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={selectedClient ? selectedClient.email : newClient.email}
                  onChange={(e) => selectedClient
                    ? setSelectedClient({ ...selectedClient, email: e.target.value })
                    : setNewClient({ ...newClient, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={selectedClient ? selectedClient.phone : newClient.phone}
                  onChange={(e) => selectedClient
                    ? setSelectedClient({ ...selectedClient, phone: e.target.value })
                    : setNewClient({ ...newClient, phone: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={selectedClient ? selectedClient.address : newClient.address}
                  onChange={(e) => selectedClient
                    ? setSelectedClient({ ...selectedClient, address: e.target.value })
                    : setNewClient({ ...newClient, address: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={selectedClient ? selectedClient.notes : newClient.notes}
                  onChange={(e) => selectedClient
                    ? setSelectedClient({ ...selectedClient, notes: e.target.value })
                    : setNewClient({ ...newClient, notes: e.target.value })
                  }
                />
              </div>

              <DialogFooter>
                <Button type="submit">
                  {selectedClient ? 'Update Client' : 'Add Client'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Clients; 