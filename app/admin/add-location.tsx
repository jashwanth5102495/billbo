import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  MapPin,
  Star,
  Users,
  Eye,
  Clock,
} from 'lucide-react-native';
import { locationService, Package } from '../../services/locationService';

export default function AddLocationScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isLoading, setIsLoading] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingPackageIndex, setEditingPackageIndex] = useState<number | null>(null);

  // Location form data
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: '4.5',
    reviews: '0',
    image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400',
    dailyFootfall: '',
    peakHours: '',
    demographics: '',
    visibility: '',
    interactiveFeatures: '', // Optional for public-wishes
  });

  const [packages, setPackages] = useState<Package[]>([]);

  // Package form data
  const [packageForm, setPackageForm] = useState({
    name: '',
    time: '',
    duration: '',
    price: '',
    type: 'basic' as Package['type'],
    description: '',
  });

  const resetPackageForm = () => {
    setPackageForm({
      name: '',
      time: '',
      duration: '',
      price: '',
      type: 'basic',
      description: '',
    });
  };

  const handleAddPackage = () => {
    setEditingPackageIndex(null);
    resetPackageForm();
    setShowPackageModal(true);
  };

  const handleEditPackage = (index: number) => {
    const pkg = packages[index];
    setPackageForm({
      name: pkg.name,
      time: pkg.time,
      duration: pkg.duration,
      price: pkg.price.toString(),
      type: pkg.type,
      description: pkg.description,
    });
    setEditingPackageIndex(index);
    setShowPackageModal(true);
  };

  const handleSavePackage = () => {
    if (!packageForm.name.trim() || !packageForm.time.trim() || !packageForm.duration.trim() || !packageForm.price.trim()) {
      Alert.alert('Error', 'Please fill in all package fields');
      return;
    }

    const price = parseFloat(packageForm.price);
    if (isNaN(price) || price < 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    const newPackage: Package = {
      id: editingPackageIndex !== null ? packages[editingPackageIndex].id : packages.length + 1,
      name: packageForm.name.trim(),
      time: packageForm.time.trim(),
      duration: packageForm.duration.trim(),
      price: price,
      type: packageForm.type,
      description: packageForm.description.trim(),
    };

    if (editingPackageIndex !== null) {
      const updatedPackages = [...packages];
      updatedPackages[editingPackageIndex] = newPackage;
      setPackages(updatedPackages);
    } else {
      setPackages([...packages, newPackage]);
    }

    setShowPackageModal(false);
    resetPackageForm();
  };

  const handleDeletePackage = (index: number) => {
    Alert.alert(
      'Delete Package',
      'Are you sure you want to delete this package?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedPackages = packages.filter((_, i) => i !== index);
            setPackages(updatedPackages);
          },
        },
      ]
    );
  };

  const handleSaveLocation = async () => {
    // Validate form
    if (!formData.name.trim() || !formData.location.trim() || !formData.dailyFootfall.trim() || !formData.peakHours.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (packages.length === 0) {
      Alert.alert('Error', 'Please add at least one package');
      return;
    }

    const rating = parseFloat(formData.rating);
    const reviews = parseInt(formData.reviews);

    if (isNaN(rating) || rating < 0 || rating > 5) {
      Alert.alert('Error', 'Please enter a valid rating (0-5)');
      return;
    }

    if (isNaN(reviews) || reviews < 0) {
      Alert.alert('Error', 'Please enter a valid number of reviews');
      return;
    }

    setIsLoading(true);

    try {
      const locationData = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        rating: rating,
        reviews: reviews,
        image: formData.image.trim() || 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400',
        dailyFootfall: formData.dailyFootfall.trim(),
        peakHours: formData.peakHours.trim(),
        demographics: formData.demographics.trim(),
        visibility: formData.visibility.trim(),
        packages: packages,
        ...(formData.interactiveFeatures.trim() && { interactiveFeatures: formData.interactiveFeatures.trim() }),
      };

      await locationService.addLocation(locationData);
      Alert.alert(
        'Success',
        'Location added successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error adding location:', error);
      Alert.alert('Error', 'Failed to add location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPackageTypeColor = (type: Package['type']) => {
    switch (type) {
      case 'basic':
        return '#10B981';
      case 'standard':
        return '#F59E0B';
      case 'premium':
        return '#8B5CF6';
      case 'custom':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#F8FAFC',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#374151' : '#E5E7EB',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#111827',
      marginLeft: 12,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#111827',
      marginBottom: 12,
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#D1D5DB' : '#374151',
      marginBottom: 6,
    },
    input: {
      backgroundColor: isDark ? '#374151' : '#FFFFFF',
      borderWidth: 1,
      borderColor: isDark ? '#4B5563' : '#D1D5DB',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#111827',
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    halfWidth: {
      flex: 1,
    },
    packagesSection: {
      marginBottom: 24,
    },
    addPackageButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#3B82F6',
      paddingVertical: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    addPackageText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    packageCard: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#E5E7EB',
    },
    packageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    packageName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#111827',
      flex: 1,
    },
    packageActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      padding: 6,
      borderRadius: 6,
    },
    packageDetails: {
      marginBottom: 8,
    },
    packageDetailText: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginBottom: 2,
    },
    packageType: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    packageTypeText: {
      fontSize: 10,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    saveButton: {
      backgroundColor: '#10B981',
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
    },
    saveButtonDisabled: {
      backgroundColor: '#9CA3AF',
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      width: '90%',
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#111827',
      marginBottom: 20,
      textAlign: 'center',
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: isDark ? '#374151' : '#E5E7EB',
    },
    confirmButton: {
      backgroundColor: '#3B82F6',
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    confirmButtonText: {
      color: '#FFFFFF',
    },
    typeSelector: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 12,
    },
    typeOption: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isDark ? '#4B5563' : '#D1D5DB',
    },
    selectedTypeOption: {
      backgroundColor: '#3B82F6',
      borderColor: '#3B82F6',
    },
    typeOptionText: {
      fontSize: 12,
      fontWeight: '500',
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    selectedTypeOptionText: {
      color: '#FFFFFF',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={isDark ? '#FFFFFF' : '#111827'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Location</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Times Square Billboard"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Full address of the billboard location"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
              multiline
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Rating (0-5)</Text>
              <TextInput
                style={styles.input}
                placeholder="4.5"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                value={formData.rating}
                onChangeText={(text) => setFormData({ ...formData, rating: text })}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Reviews Count</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                value={formData.reviews}
                onChangeText={(text) => setFormData({ ...formData, reviews: text })}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Daily Footfall *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 50,000+"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={formData.dailyFootfall}
              onChangeText={(text) => setFormData({ ...formData, dailyFootfall: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Peak Hours *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 5:00 PM - 8:00 PM"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={formData.peakHours}
              onChangeText={(text) => setFormData({ ...formData, peakHours: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Demographics</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Tourists, Families, Couples"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={formData.demographics}
              onChangeText={(text) => setFormData({ ...formData, demographics: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Visibility</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., High traffic intersection"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={formData.visibility}
              onChangeText={(text) => setFormData({ ...formData, visibility: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Interactive Features (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Touch screen, QR code recording"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={formData.interactiveFeatures}
              onChangeText={(text) => setFormData({ ...formData, interactiveFeatures: text })}
            />
          </View>
        </View>

        <View style={styles.packagesSection}>
          <Text style={styles.sectionTitle}>Packages</Text>
          
          <TouchableOpacity style={styles.addPackageButton} onPress={handleAddPackage}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addPackageText}>Add Package</Text>
          </TouchableOpacity>

          {packages.map((pkg, index) => (
            <View key={index} style={styles.packageCard}>
              <View style={styles.packageHeader}>
                <Text style={styles.packageName}>{pkg.name}</Text>
                <View style={styles.packageActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
                    onPress={() => handleEditPackage(index)}
                  >
                    <Eye size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
                    onPress={() => handleDeletePackage(index)}
                  >
                    <Trash2 size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.packageDetails}>
                <Text style={styles.packageDetailText}>Time: {pkg.time}</Text>
                <Text style={styles.packageDetailText}>Duration: {pkg.duration}</Text>
                <Text style={styles.packageDetailText}>Price: ₹{pkg.price}</Text>
                <Text style={styles.packageDetailText}>Description: {pkg.description}</Text>
              </View>
              <View style={[styles.packageType, { backgroundColor: getPackageTypeColor(pkg.type) }]}>
                <Text style={styles.packageTypeText}>{pkg.type.toUpperCase()}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSaveLocation}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Location'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Package Modal */}
      <Modal
        visible={showPackageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPackageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingPackageIndex !== null ? 'Edit Package' : 'Add Package'}
            </Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Package Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Quick Wish"
                  placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                  value={packageForm.name}
                  onChangeText={(text) => setPackageForm({ ...packageForm, name: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Display Time *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 30 seconds display"
                  placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                  value={packageForm.time}
                  onChangeText={(text) => setPackageForm({ ...packageForm, time: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Duration *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 1 hour"
                  placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                  value={packageForm.duration}
                  onChangeText={(text) => setPackageForm({ ...packageForm, duration: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Price (₹) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="299"
                  placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                  value={packageForm.price}
                  onChangeText={(text) => setPackageForm({ ...packageForm, price: text })}
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Package Type</Text>
                <View style={styles.typeSelector}>
                  {(['basic', 'standard', 'premium', 'custom'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeOption,
                        packageForm.type === type && styles.selectedTypeOption,
                      ]}
                      onPress={() => setPackageForm({ ...packageForm, type })}
                    >
                      <Text
                        style={[
                          styles.typeOptionText,
                          packageForm.type === type && styles.selectedTypeOptionText,
                        ]}
                      >
                        {type.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Package description"
                  placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                  value={packageForm.description}
                  onChangeText={(text) => setPackageForm({ ...packageForm, description: text })}
                  multiline
                />
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowPackageModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleSavePackage}
              >
                <Text style={[styles.modalButtonText, styles.confirmButtonText]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}