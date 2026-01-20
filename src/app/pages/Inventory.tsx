import { useState } from 'react';
import { Package, AlertTriangle, TrendingDown, Warehouse, Truck, Building2, Search, Plus, Filter, Download, Upload, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useAuth } from '../context/AuthContext';
import { INVENTORY_ITEMS, PARTS_REQUESTS, getLowStockItems, getPendingPartsRequests, InventoryItem, PartsRequest } from '../data/inventory';
import { DIVISIONS } from '../data/divisions';

export default function Inventory() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('overview');

  const lowStockItems = getLowStockItems();
  const pendingRequests = getPendingPartsRequests();

  // Calculate total inventory value
  const totalInventoryValue = INVENTORY_ITEMS.reduce((sum, item) => {
    const totalQty = item.locations.reduce((locSum, loc) => locSum + loc.quantity, 0);
    return sum + (totalQty * item.unitCost);
  }, 0);

  // Filter inventory
  const filteredInventory = INVENTORY_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesLocation = locationFilter === 'all' || 
                           item.locations.some(loc => loc.locationId === locationFilter);
    
    // Division filter
    if (user?.role !== 'super-admin' && item.division && item.division !== user?.division) {
      return false;
    }

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const getTotalQuantity = (item: InventoryItem) => {
    return item.locations.reduce((sum, loc) => sum + loc.quantity, 0);
  };

  const getStockStatus = (item: InventoryItem) => {
    const totalQty = getTotalQuantity(item);
    if (totalQty === 0) return { label: 'Out of Stock', color: 'bg-red-500' };
    if (totalQty <= item.reorderPoint) return { label: 'Low Stock', color: 'bg-yellow-500' };
    return { label: 'In Stock', color: 'bg-green-500' };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory & Parts Management</h1>
          <p className="text-gray-600 mt-1">Warehouse, division stock, and truck inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalInventoryValue)}</div>
            <p className="text-xs text-gray-500 mt-1">{INVENTORY_ITEMS.length} unique items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Low Stock Items</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</div>
            <p className="text-xs text-gray-500 mt-1">Need reordering</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Requests</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingRequests.length}</div>
            <p className="text-xs text-gray-500 mt-1">Parts requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Locations</CardTitle>
            <Warehouse className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-500 mt-1">Warehouse, division, trucks</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">
            <Package className="h-4 w-4 mr-2" />
            All Inventory
          </TabsTrigger>
          <TabsTrigger value="requests">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Parts Requests ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="low-stock">
            <TrendingDown className="h-4 w-4 mr-2" />
            Low Stock ({lowStockItems.length})
          </TabsTrigger>
          <TabsTrigger value="locations">
            <Warehouse className="h-4 w-4 mr-2" />
            Locations
          </TabsTrigger>
        </TabsList>

        {/* All Inventory Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="plumbing-fittings">Plumbing Fittings</SelectItem>
                    <SelectItem value="plumbing-valves">Plumbing Valves</SelectItem>
                    <SelectItem value="plumbing-fixtures">Plumbing Fixtures</SelectItem>
                    <SelectItem value="roofing-shingles">Roofing Shingles</SelectItem>
                    <SelectItem value="roofing-materials">Roofing Materials</SelectItem>
                    <SelectItem value="insulation-batts">Insulation Batts</SelectItem>
                    <SelectItem value="gutter-sections">Gutter Sections</SelectItem>
                    <SelectItem value="tools">Tools</SelectItem>
                    <SelectItem value="safety-equipment">Safety Equipment</SelectItem>
                    <SelectItem value="consumables">Consumables</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="warehouse-main">Warehouse Principal</SelectItem>
                    <SelectItem value="plomberie">Plomberie Stock</SelectItem>
                    <SelectItem value="toitures">Toitures Stock</SelectItem>
                    <SelectItem value="tech-001">Marc Dubois - Truck</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items ({filteredInventory.length})</CardTitle>
              <CardDescription>All parts and materials across locations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Division</TableHead>
                    <TableHead>Total Qty</TableHead>
                    <TableHead>Locations</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => {
                    const totalQty = getTotalQuantity(item);
                    const status = getStockStatus(item);
                    const division = DIVISIONS.find(d => d.id === item.division);

                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {item.category.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {division ? (
                            <Badge style={{ backgroundColor: division.color }} className="text-white text-xs">
                              {division.nameFr}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">All</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">{totalQty}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.locations.map((loc, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {loc.locationType === 'warehouse' && <Warehouse className="h-3 w-3 mr-1" />}
                                {loc.locationType === 'division-stock' && <Building2 className="h-3 w-3 mr-1" />}
                                {loc.locationType === 'truck' && <Truck className="h-3 w-3 mr-1" />}
                                {loc.quantity}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(item.unitCost)}</TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(totalQty * item.unitCost)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${status.color} text-white text-xs`}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parts Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Parts Requests</CardTitle>
              <CardDescription>Requests from technicians in the field</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {PARTS_REQUESTS.map((request) => {
                  const division = DIVISIONS.find(d => d.id === request.division);
                  
                  return (
                    <Card key={request.id} className="border-l-4" style={{ borderLeftColor: division?.color }}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{request.technicianName}</h3>
                              <Badge style={{ backgroundColor: division?.color }} className="text-white text-xs">
                                {division?.nameFr}
                              </Badge>
                              <Badge 
                                className={`text-xs ${
                                  request.urgency === 'emergency' ? 'bg-red-500' :
                                  request.urgency === 'urgent' ? 'bg-orange-500' :
                                  'bg-blue-500'
                                } text-white`}
                              >
                                {request.urgency.toUpperCase()}
                              </Badge>
                              <Badge 
                                variant={request.status === 'pending' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {request.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Job #{request.jobId} • {new Date(request.requestedAt).toLocaleString('fr-CA')}
                            </p>
                            {request.notes && (
                              <p className="text-sm text-gray-800 mt-2 italic">"{request.notes}"</p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-lg">
                              {formatCurrency(request.items.reduce((sum, item) => sum + item.estimatedCost, 0))}
                            </div>
                            <div className="text-xs text-gray-500">{request.items.length} items</div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <h4 className="text-sm font-semibold mb-2">Requested Items:</h4>
                          <div className="space-y-1">
                            {request.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span>• {item.itemName} × {item.quantity}</span>
                                <span className="font-medium">{formatCurrency(item.estimatedCost)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {request.deliveryLocation && (
                          <div className="text-sm text-gray-600 mb-4">
                            📍 Delivery: {request.deliveryLocation}
                          </div>
                        )}

                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button className="flex-1 bg-green-600 hover:bg-green-700">
                              Approve Request
                            </Button>
                            <Button variant="outline" className="flex-1">
                              Request More Info
                            </Button>
                            <Button variant="destructive" className="flex-1">
                              Deny
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Low Stock Tab */}
        <TabsContent value="low-stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Items</CardTitle>
              <CardDescription>Items at or below reorder point</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockItems.map((item) => {
                  const totalQty = getTotalQuantity(item);
                  const division = DIVISIONS.find(d => d.id === item.division);

                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <Badge variant="outline" className="text-xs">{item.sku}</Badge>
                          {division && (
                            <Badge style={{ backgroundColor: division.color }} className="text-white text-xs">
                              {division.nameFr}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-red-600 font-medium">
                            Current: {totalQty} units
                          </span>
                          <span className="text-gray-500">
                            Reorder point: {item.reorderPoint} units
                          </span>
                          <span className="text-gray-500">
                            Reorder qty: {item.reorderQuantity} units
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold mb-2">
                          {formatCurrency(item.reorderQuantity * item.unitCost)}
                        </div>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Create PO
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Warehouse className="h-5 w-5 text-blue-600" />
                  <CardTitle>Warehouse Principal</CardTitle>
                </div>
                <CardDescription>Central storage facility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Items:</span>
                    <span className="font-semibold">{INVENTORY_ITEMS.filter(item => 
                      item.locations.some(loc => loc.locationId === 'warehouse-main')
                    ).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Value:</span>
                    <span className="font-semibold">{formatCurrency(45230)}</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-green-600" />
                  <CardTitle>Division Stock</CardTitle>
                </div>
                <CardDescription>Department inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Divisions:</span>
                    <span className="font-semibold">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Value:</span>
                    <span className="font-semibold">{formatCurrency(18750)}</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-orange-600" />
                  <CardTitle>Truck Inventory</CardTitle>
                </div>
                <CardDescription>Mobile technician stock</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Trucks:</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Value:</span>
                    <span className="font-semibold">{formatCurrency(12340)}</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
