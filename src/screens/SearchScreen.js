import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock clinic/department data
const mockLocations = [
  { id: 'entrance', name: 'Main Entrance', floor: 1, category: 'General' },
  { id: 'reception', name: 'Reception', floor: 1, category: 'General' },
  { id: 'emergency', name: 'Emergency Room', floor: 1, category: 'Emergency' },
  { id: 'cafeteria', name: 'Cafeteria', floor: 1, category: 'Amenities' },
  { id: 'cardiology', name: 'Cardiology Department', floor: 2, category: 'Medical' },
  { id: 'radiology', name: 'Radiology Department', floor: 2, category: 'Medical' },
  { id: 'laboratory', name: 'Laboratory', floor: 2, category: 'Medical' },
  { id: 'surgery', name: 'Surgery Wing', floor: 3, category: 'Medical' },
  { id: 'pediatrics', name: 'Pediatrics Department', floor: 3, category: 'Medical' },
  { id: 'icu', name: 'Intensive Care Unit', floor: 3, category: 'Medical' },
  { id: 'pharmacy', name: 'Pharmacy', floor: 1, category: 'Amenities' },
  { id: 'restroom1', name: 'Restrooms - Floor 1', floor: 1, category: 'Amenities' },
  { id: 'restroom2', name: 'Restrooms - Floor 2', floor: 2, category: 'Amenities' },
  { id: 'restroom3', name: 'Restrooms - Floor 3', floor: 3, category: 'Amenities' },
  { id: 'elevator', name: 'Main Elevators', floor: 1, category: 'Navigation' },
  { id: 'stairs', name: 'Emergency Stairs', floor: 1, category: 'Navigation' },
];

const SearchScreen = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState(mockLocations);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'Medical', name: 'Medical' },
    { id: 'Emergency', name: 'Emergency' },
    { id: 'Amenities', name: 'Amenities' },
    { id: 'Navigation', name: 'Navigation' },
    { id: 'General', name: 'General' },
  ];

  // Filter locations based on search query and selected category
  useEffect(() => {
    let results = mockLocations;
    
    // Filter by category if one is selected
    if (selectedCategory && selectedCategory !== 'all') {
      results = results.filter(location => location.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      results = results.filter(location => 
        location.name.toLowerCase().includes(lowercaseQuery) ||
        location.category.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    setFilteredLocations(results);
  }, [searchQuery, selectedCategory]);

  // Handle location selection
  const handleSelectLocation = (location) => {
    // Add to recent searches if not already there
    if (!recentSearches.some(item => item.id === location.id)) {
      setRecentSearches(prevSearches => 
        [location, ...prevSearches].slice(0, 5) // Keep only the 5 most recent
      );
    }
    
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={20} color="#777777" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a clinic or department..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#777777" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Category filters */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.id ? styles.selectedCategoryButton : null,
              ]}
              onPress={() => setSelectedCategory(item.id === 'all' ? null : item.id)}
            >
              <Text 
                style={[
                  styles.categoryButtonText,
                  selectedCategory === item.id ? styles.selectedCategoryButtonText : null,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      
      {/* Recent searches section */}
      {recentSearches.length > 0 && searchQuery.length === 0 && (
        <View style={styles.recentSearchesContainer}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <FlatList
            data={recentSearches}
            keyExtractor={item => `recent-${item.id}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.locationItem}
                onPress={() => handleSelectLocation(item)}
              >
                <Ionicons name="time-outline" size={24} color="#777777" style={styles.locationIcon} />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{item.name}</Text>
                  <Text style={styles.locationDetails}>Floor {item.floor} • {item.category}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      
      {/* Search results */}
      <View style={styles.resultsContainer}>
        <Text style={styles.sectionTitle}>
          {searchQuery ? 'Search Results' : 'All Locations'}
          {filteredLocations.length > 0 && ` (${filteredLocations.length})`}
        </Text>
        
        {filteredLocations.length > 0 ? (
          <FlatList
            data={filteredLocations}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.locationItem}
                onPress={() => handleSelectLocation(item)}
              >
                <Ionicons 
                  name={
                    item.category === 'Medical' ? 'medkit-outline' :
                    item.category === 'Emergency' ? 'alert-circle-outline' :
                    item.category === 'Amenities' ? 'restaurant-outline' :
                    item.category === 'Navigation' ? 'navigate-outline' :
                    'location-outline'
                  } 
                  size={24} 
                  color="#3F51B5" 
                  style={styles.locationIcon} 
                />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{item.name}</Text>
                  <Text style={styles.locationDetails}>Floor {item.floor} • {item.category}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={48} color="#CCCCCC" />
            <Text style={styles.noResultsText}>No locations found</Text>
            <Text style={styles.noResultsSubtext}>Try a different search term or category</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  clearButton: {
    padding: 4,
  },
  categoriesContainer: {
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 4,
  },
  selectedCategoryButton: {
    backgroundColor: '#3F51B5',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#555555',
  },
  selectedCategoryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  recentSearchesContainer: {
    marginBottom: 16,
  },
  resultsContainer: {
    flex: 1,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  locationIcon: {
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 2,
  },
  locationDetails: {
    fontSize: 14,
    color: '#777777',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555555',
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#777777',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default SearchScreen;
