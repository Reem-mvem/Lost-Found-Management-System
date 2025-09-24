import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Package, Eye, MapPin, Calendar, Tag, Palette, Building2, Camera, Trash2 } from 'lucide-react';

interface LostItem {
  id: string;
  title: string;
  category: string;
  color: string;
  brand: string;
  location: string;
  dateFound: string;
  photos: string[];
  description: string;
  venueId: string;
  claims: Claim[];
}

interface Claim {
  id: string;
  itemId: string;
  userDescription: string;
  contactInfo: string;
  timestamp: string;
  status: 'pending' | 'verified' | 'rejected';
  trackingNumber: string;
}

const VenueDashboard: React.FC = () => {
  const { venue } = useAuth();
  
  // Demo venue fallback for prototype
  const demoVenue = {
    id: 'demo-venue',
    name: 'King Khalid University',
    email: 'kingkhalid@university.edu',
    type: 'University',
    address: '123 Campus-, Abha City'
  };
  
  const currentVenue = venue || demoVenue;
  const [activeTab, setActiveTab] = useState<'items' | 'claims' | 'add-item' | 'profile'>('items');
  const [items, setItems] = useState<LostItem[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [newItem, setNewItem] = useState({
    title: '',
    category: '',
    color: '',
    brand: '',
    location: '',
    description: '',
    photos: [] as string[]
  });

  useEffect(() => {
    // Always load items and claims for demo purposes
    loadDemoData();
    loadItems();
    loadClaims();
  }, []);

  const loadItems = () => {
    const savedItems = JSON.parse(localStorage.getItem('lostItems') || '[]');
    const venueItems = savedItems.filter((item: LostItem) => item.venueId === currentVenue.id);
    setItems(venueItems);
  };

  const loadClaims = () => {
    const savedClaims = JSON.parse(localStorage.getItem('claims') || '[]');
    const venueClaims = savedClaims.filter((claim: Claim) => {
      const savedItems = JSON.parse(localStorage.getItem('lostItems') || '[]');
      const item = savedItems.find((i: LostItem) => i.id === claim.itemId);
      return item?.venueId === venue?.id;
    });
    setClaims(venueClaims);
  };

  const loadDemoData = () => {
    const savedItems = JSON.parse(localStorage.getItem('lostItems') || '[]');
    
    // Check if demo data already exists for this venue
    const existingDemoItems = savedItems.filter((item: LostItem) => 
      item.venueId === currentVenue.id && item.id.startsWith('demo-')
    );
    
    if (existingDemoItems.length > 0) {
      return; // Demo data already exists, don't duplicate
    }

    // Create demo items for presentation
    const demoItems: LostItem[] = [
      {
        id: 'demo-prada-bag',
        title: 'Black Prada Handbag',
        category: 'Bags',
        color: 'Black',
        brand: 'Prada',
        location: 'Coffee Shop - First Floor',
        dateFound: new Date().toISOString(),
        photos: [],
        description: 'Medium-sized black leather Prada handbag with gold hardware and magnetic closure. Small scuff on bottom corner.',
        venueId: currentVenue.id,
        claims: []
      },
      {
        id: 'demo-iphone',
        title: 'iPhone 13 Pro',
        category: 'Electronics',
        color: 'Blue',
        brand: 'Apple',
        location: 'Library - Study Area Level 2',
        dateFound: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        photos: [],
        description: 'Blue iPhone 13 Pro with cracked screen protector. Black phone case with card holder.',
        venueId: currentVenue.id,
        claims: []
      },
      {
        id: 'demo-car-keys',
        title: 'Car Keys with BMW Keychain',
        category: 'Keys',
        color: 'Silver',
        brand: 'BMW',
        location: 'Main Parking Lot - Entrance Gate',
        dateFound: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        photos: [],
        description: 'Silver car keys with black BMW keychain. Two keys attached with small blue lanyard.',
        venueId: currentVenue.id,
        claims: []
      },
      {
        id: 'demo-sunglasses',
        title: 'Ray-Ban Aviator Sunglasses',
        category: 'Accessories',
        color: 'Gold',
        brand: 'Ray-Ban',
        location: 'Student Center - Main Cafeteria',
        dateFound: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        photos: [],
        description: 'Classic gold-frame Ray-Ban aviator sunglasses with green lenses. Small scratch on left lens.',
        venueId: currentVenue.id,
        claims: []
      },
      {
        id: 'demo-backpack',
        title: 'Red Nike Backpack',
        category: 'Bags',
        color: 'Red',
        brand: 'Nike',
        location: 'Gym - Locker Room Area',
        dateFound: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        photos: [],
        description: 'Red Nike sports backpack with black straps. Contains water bottle and gym towel.',
        venueId: currentVenue.id,
        claims: []
      }
    ];

    // Add demo items to localStorage
    const updatedItems = [...savedItems, ...demoItems];
    localStorage.setItem('lostItems', JSON.stringify(updatedItems));
    
    console.log('🎬 Demo data loaded - 5 items added for presentation');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + newItem.photos.length > 3) {
      alert('Maximum 3 photos allowed');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setNewItem(prev => ({
          ...prev,
          photos: [...prev.photos, reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setNewItem(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!venue) return;

    const item: LostItem = {
      id: Date.now().toString(),
      ...newItem,
      dateFound: new Date().toISOString(),
      venueId: currentVenue.id,
      claims: []
    };

    const savedItems = JSON.parse(localStorage.getItem('lostItems') || '[]');
    savedItems.push(item);
    localStorage.setItem('lostItems', JSON.stringify(savedItems));

    setNewItem({
      title: '',
      category: '',
      color: '',
      brand: '',
      location: '',
      description: '',
      photos: []
    });
    
    setActiveTab('items');
    loadItems();
  };

  const handleClaimAction = (claimId: string, action: 'verified' | 'rejected') => {
    const updatedClaims = claims.map(claim =>
      claim.id === claimId ? { ...claim, status: action } : claim
    );
    setClaims(updatedClaims);
    localStorage.setItem('claims', JSON.stringify(updatedClaims));
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      // Remove item from the items list
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      
      // Update localStorage
      const savedItems = JSON.parse(localStorage.getItem('lostItems') || '[]');
      const filteredItems = savedItems.filter((item: LostItem) => item.id !== itemId);
      localStorage.setItem('lostItems', JSON.stringify(filteredItems));
      
      // Also remove any claims associated with this item
      const updatedClaims = claims.filter(claim => claim.itemId !== itemId);
      setClaims(updatedClaims);
      localStorage.setItem('claims', JSON.stringify(updatedClaims));
    }
  };

  // Demo mode - no authentication required
  // if (!venue) {
  //   return <Navigate to="/venue-auth" replace />;
  // }

  const categories = [
    'Electronics', 'Clothing', 'Accessories', 'Bags', 'Keys', 'Documents', 
    'Jewelry', 'Sports Equipment', 'Books', 'Other'
  ];

  const colors = [
    'Black', 'White', 'Gray', 'Brown', 'Red', 'Blue', 'Green', 'Yellow', 
    'Orange', 'Purple', 'Pink', 'Gold', 'Silver', 'Multi-colored'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-4">
              {venue?.logo ? (
                <img src={venue.logo} alt="Venue Logo" className="h-12 w-12 object-cover rounded-lg" />
              ) : (
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentVenue.name}</h1>
                <p className="text-gray-600">{currentVenue.type} • {currentVenue.address}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{items.length}</div>
                <div className="text-sm text-gray-500">Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{claims.filter(c => c.status === 'pending').length}</div>
                <div className="text-sm text-gray-500">Pending Claims</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('items')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'items'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Package className="h-4 w-4 inline mr-2" />
                Lost Items ({items.length})
              </button>
              <button
                onClick={() => setActiveTab('claims')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'claims'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Eye className="h-4 w-4 inline mr-2" />
                Claims ({claims.length})
              </button>
              <button
                onClick={() => setActiveTab('add-item')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'add-item'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Plus className="h-4 w-4 inline mr-2" />
                Add Item
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Items Tab */}
            {activeTab === 'items' && (
              <div>
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No lost items yet</h3>
                    <p className="text-gray-500 mb-4">Start by adding found items to help people recover their belongings.</p>
                    <button
                      onClick={() => setActiveTab('add-item')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add First Item
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {item.category}
                            </span>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                              title="Delete item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        {item.photos.length > 0 && (
                          <img 
                            src={item.photos[0]} 
                            alt={item.title}
                            className="w-full h-32 object-cover rounded-lg mb-4"
                          />
                        )}
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Palette className="h-4 w-4 mr-2" />
                            <span>{item.color}</span>
                          </div>
                          {item.brand && (
                            <div className="flex items-center">
                              <Tag className="h-4 w-4 mr-2" />
                              <span>{item.brand}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{item.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{new Date(item.dateFound).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="text-xs text-gray-500">
                            {item.claims?.length || 0} claim(s)
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Claims Tab */}
            {activeTab === 'claims' && (
              <div>
                {claims.length === 0 ? (
                  <div className="text-center py-12">
                    <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No claims yet</h3>
                    <p className="text-gray-500">Claims will appear here when users submit requests for lost items.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {claims.map((claim) => {
                      const item = items.find(i => i.id === claim.itemId);
                      return (
                        <div key={claim.id} className="bg-gray-50 rounded-lg p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-gray-900">Claim #{claim.trackingNumber}</h3>
                              <p className="text-sm text-gray-600">Item: {item?.title || 'Unknown'}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              claim.status === 'verified' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">User Description:</h4>
                            <p className="text-gray-700 bg-white p-3 rounded border">{claim.userDescription}</p>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Contact Information:</h4>
                            <p className="text-gray-700">{claim.contactInfo}</p>
                          </div>
                          
                          <div className="text-xs text-gray-500 mb-4">
                            Submitted: {new Date(claim.timestamp).toLocaleString()}
                          </div>
                          
                          {claim.status === 'pending' && (
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleClaimAction(claim.id, 'verified')}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                              >
                                Verify Claim
                              </button>
                              <button
                                onClick={() => handleClaimAction(claim.id, 'rejected')}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                              >
                                Reject Claim
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Add Item Tab */}
            {activeTab === 'add-item' && (
              <form onSubmit={handleSubmitItem} className="max-w-2xl">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Lost Item</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newItem.title}
                      onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="e.g., iPhone 13, Blue Backpack, etc."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        required
                        value={newItem.category}
                        onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color *
                      </label>
                      <select
                        required
                        value={newItem.color}
                        onChange={(e) => setNewItem({...newItem, color: e.target.value})}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">Select color</option>
                        {colors.map((color) => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand (if applicable)
                      </label>
                      <input
                        type="text"
                        value={newItem.brand}
                        onChange={(e) => setNewItem({...newItem, brand: e.target.value})}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., Apple, Nike, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location Found *
                      </label>
                      <input
                        type="text"
                        required
                        value={newItem.location}
                        onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., Lobby, Parking Lot, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      rows={3}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Additional details about the item..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photos (Up to 3) *
                    </label>
                    <div className="flex flex-wrap gap-4 mb-4">
                      {newItem.photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img src={photo} alt={`Item photo ${index + 1}`} className="h-24 w-24 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {newItem.photos.length < 3 && (
                        <label className="h-24 w-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                          <div className="text-center">
                            <Camera className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                            <span className="text-xs text-gray-500">Add Photo</span>
                          </div>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="sr-only"
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">At least one photo is required. Photos help with AI matching but are never shown to users publicly.</p>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={newItem.photos.length === 0}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Item
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('items')}
                      className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDashboard;