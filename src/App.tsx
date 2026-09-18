import React, { useState } from 'react';
import { Plus, MapPin, Calendar, Clock, Edit, Trash2, Plane } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Trip, TripFormData, ItineraryFormData } from './types';
import { generateId, formatDate, calculateDays } from './lib/utils';

function App() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showTripForm, setShowTripForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [showItineraryForm, setShowItineraryForm] = useState(false);

  const [tripForm, setTripForm] = useState<TripFormData>({
    title: '',
    destinationName: '',
    destinationCountry: '',
    startDate: '',
    endDate: '',
    description: '',
    budget: undefined
  });

  const [itineraryForm, setItineraryForm] = useState<ItineraryFormData>({
    day: 1,
    time: '',
    activity: '',
    location: '',
    notes: ''
  });

  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    
    const newTrip: Trip = {
      id: generateId(),
      title: tripForm.title,
      destination: {
        id: generateId(),
        name: tripForm.destinationName,
        country: tripForm.destinationCountry
      },
      startDate: tripForm.startDate,
      endDate: tripForm.endDate,
      description: tripForm.description,
      budget: tripForm.budget,
      itinerary: [],
      createdAt: now,
      updatedAt: now
    };

    if (editingTrip) {
      setTrips(trips.map(trip => 
        trip.id === editingTrip.id 
          ? { ...newTrip, id: editingTrip.id, createdAt: editingTrip.createdAt, itinerary: editingTrip.itinerary }
          : trip
      ));
      setEditingTrip(null);
    } else {
      setTrips([...trips, newTrip]);
    }

    setTripForm({
      title: '',
      destinationName: '',
      destinationCountry: '',
      startDate: '',
      endDate: '',
      description: '',
      budget: undefined
    });
    setShowTripForm(false);
  };

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setTripForm({
      title: trip.title,
      destinationName: trip.destination.name,
      destinationCountry: trip.destination.country,
      startDate: trip.startDate,
      endDate: trip.endDate,
      description: trip.description,
      budget: trip.budget
    });
    setShowTripForm(true);
  };

  const handleDeleteTrip = (tripId: string) => {
    setTrips(trips.filter(trip => trip.id !== tripId));
    if (selectedTrip?.id === tripId) {
      setSelectedTrip(null);
    }
  };

  const handleAddItineraryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip) return;

    const newItem = {
      id: generateId(),
      ...itineraryForm
    };

    const updatedTrip = {
      ...selectedTrip,
      itinerary: [...selectedTrip.itinerary, newItem].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time)),
      updatedAt: new Date().toISOString()
    };

    setTrips(trips.map(trip => trip.id === selectedTrip.id ? updatedTrip : trip));
    setSelectedTrip(updatedTrip);
    setItineraryForm({
      day: 1,
      time: '',
      activity: '',
      location: '',
      notes: ''
    });
    setShowItineraryForm(false);
  };

  const handleDeleteItineraryItem = (itemId: string) => {
    if (!selectedTrip) return;

    const updatedTrip = {
      ...selectedTrip,
      itinerary: selectedTrip.itinerary.filter(item => item.id !== itemId),
      updatedAt: new Date().toISOString()
    };

    setTrips(trips.map(trip => trip.id === selectedTrip.id ? updatedTrip : trip));
    setSelectedTrip(updatedTrip);
  };

  if (selectedTrip) {
    const tripDays = calculateDays(selectedTrip.startDate, selectedTrip.endDate);
    
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedTrip(null)}
              className="flex items-center gap-2"
            >
              ← Back to Trips
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">{selectedTrip.title}</h1>
            <Button
              onClick={() => handleEditTrip(selectedTrip)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Trip
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Destination
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{selectedTrip.destination.name}</p>
                <p className="text-gray-600">{selectedTrip.destination.country}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedTrip.startDate)} - {formatDate(selectedTrip.endDate)}
                </p>
                <p className="font-semibold">{tripDays} days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">
                  {selectedTrip.budget ? `$${selectedTrip.budget.toLocaleString()}` : 'Not set'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{selectedTrip.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Itinerary</CardTitle>
                <Button
                  onClick={() => setShowItineraryForm(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Activity
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {selectedTrip.itinerary.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No activities planned yet</p>
              ) : (
                <div className="space-y-4">
                  {selectedTrip.itinerary.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                              Day {item.day}
                            </span>
                            <span className="flex items-center gap-1 text-gray-600">
                              <Clock className="w-4 h-4" />
                              {item.time}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">{item.activity}</h4>
                          <p className="text-gray-600 mb-2">{item.location}</p>
                          {item.notes && (
                            <p className="text-sm text-gray-500">{item.notes}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItineraryItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {showItineraryForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Add Activity</CardTitle>
                </CardHeader>
                <form onSubmit={handleAddItineraryItem}>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Day</label>
                      <Input
                        type="number"
                        min="1"
                        max={tripDays}
                        value={itineraryForm.day}
                        onChange={(e) => setItineraryForm({...itineraryForm, day: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Time</label>
                      <Input
                        type="time"
                        value={itineraryForm.time}
                        onChange={(e) => setItineraryForm({...itineraryForm, time: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Activity</label>
                      <Input
                        value={itineraryForm.activity}
                        onChange={(e) => setItineraryForm({...itineraryForm, activity: e.target.value})}
                        placeholder="e.g., Visit Eiffel Tower"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Location</label>
                      <Input
                        value={itineraryForm.location}
                        onChange={(e) => setItineraryForm({...itineraryForm, location: e.target.value})}
                        placeholder="e.g., Champ de Mars, Paris"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                      <Textarea
                        value={itineraryForm.notes}
                        onChange={(e) => setItineraryForm({...itineraryForm, notes: e.target.value})}
                        placeholder="Additional notes..."
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button type="submit">Add Activity</Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowItineraryForm(false)}
                    >
                      Cancel
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Plane className="w-8 h-8 text-blue-600" />
              Travel Planner
            </h1>
            <p className="text-gray-600 mt-2">Plan and organize your dream trips</p>
          </div>
          <Button
            onClick={() => setShowTripForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Trip
          </Button>
        </div>

        {trips.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips planned yet</h3>
              <p className="text-gray-600 mb-6">Start planning your next adventure!</p>
              <Button onClick={() => setShowTripForm(true)}>
                Create Your First Trip
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Card key={trip.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="truncate">{trip.title}</span>
                    <div className="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTrip(trip);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTrip(trip.id);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {trip.destination.name}, {trip.destination.country}
                  </CardDescription>
                </CardHeader>
                <CardContent onClick={() => setSelectedTrip(trip)}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {calculateDays(trip.startDate, trip.endDate)} days
                    </div>
                    {trip.budget && (
                      <div className="text-sm font-medium text-green-600">
                        Budget: ${trip.budget.toLocaleString()}
                      </div>
                    )}
                    <p className="text-sm text-gray-700 line-clamp-2">{trip.description}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setSelectedTrip(trip)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {showTripForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>{editingTrip ? 'Edit Trip' : 'Create New Trip'}</CardTitle>
              </CardHeader>
              <form onSubmit={handleCreateTrip}>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Trip Title</label>
                    <Input
                      value={tripForm.title}
                      onChange={(e) => setTripForm({...tripForm, title: e.target.value})}
                      placeholder="e.g., Summer Vacation in Paris"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Destination</label>
                    <Input
                      value={tripForm.destinationName}
                      onChange={(e) => setTripForm({...tripForm, destinationName: e.target.value})}
                      placeholder="e.g., Paris"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <Input
                      value={tripForm.destinationCountry}
                      onChange={(e) => setTripForm({...tripForm, destinationCountry: e.target.value})}
                      placeholder="e.g., France"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date</label>
                      <Input
                        type="date"
                        value={tripForm.startDate}
                        onChange={(e) => setTripForm({...tripForm, startDate: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">End Date</label>
                      <Input
                        type="date"
                        value={tripForm.endDate}
                        onChange={(e) => setTripForm({...tripForm, endDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Budget (optional)</label>
                    <Input
                      type="number"
                      value={tripForm.budget || ''}
                      onChange={(e) => setTripForm({...tripForm, budget: e.target.value ? parseInt(e.target.value) : undefined})}
                      placeholder="e.g., 2000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea
                      value={tripForm.description}
                      onChange={(e) => setTripForm({...tripForm, description: e.target.value})}
                      placeholder="Describe your trip plans..."
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button type="submit">
                    {editingTrip ? 'Update Trip' : 'Create Trip'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowTripForm(false);
                      setEditingTrip(null);
                      setTripForm({
                        title: '',
                        destinationName: '',
                        destinationCountry: '',
                        startDate: '',
                        endDate: '',
                        description: '',
                        budget: undefined
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;