import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NavigationScreen = ({ 
  origin, 
  destination, 
  currentFloor,
  distance,
  onBackPress,
  onArrival
}) => {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [remainingDistance, setRemainingDistance] = useState(distance || 0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  
  // Generate navigation steps based on origin and destination
  useEffect(() => {
    if (!origin || !destination) return;
    
    // In a real app, this would use pathfinding algorithms
    // For this POC, we'll generate mock steps
    const mockSteps = generateMockSteps(origin, destination);
    setSteps(mockSteps);
    
    // Calculate estimated time (assuming 1.2m/s walking speed)
    const time = Math.ceil(distance / 1.2);
    setEstimatedTime(time);
  }, [origin, destination]);
  
  // Simulate progress for the POC
  useEffect(() => {
    if (steps.length === 0) return;
    
    const interval = setInterval(() => {
      // Reduce remaining distance
      setRemainingDistance(prev => {
        const newDistance = Math.max(0, prev - 0.5);
        
        // If we've reached the destination
        if (newDistance === 0 && onArrival) {
          clearInterval(interval);
          onArrival();
        }
        
        return newDistance;
      });
      
      // Advance to next step occasionally
      if (Math.random() > 0.8 && currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [steps]);
  
  // Generate mock navigation steps
  const generateMockSteps = (origin, destination) => {
    // In a real app, this would use actual pathfinding
    const sameFloor = origin.floor === destination.floor;
    
    if (sameFloor) {
      return [
        { 
          id: 1, 
          instruction: `Start walking from ${origin.name}`, 
          icon: 'walk-outline',
          distance: distance * 0.2
        },
        { 
          id: 2, 
          instruction: `Continue straight ahead`, 
          icon: 'arrow-forward-outline',
          distance: distance * 0.3
        },
        { 
          id: 3, 
          instruction: `Turn right at the corridor`, 
          icon: 'arrow-forward-outline',
          distance: distance * 0.3
        },
        { 
          id: 4, 
          instruction: `${destination.name} will be on your left`, 
          icon: 'location-outline',
          distance: distance * 0.2
        },
      ];
    } else {
      // Different floor navigation
      const floorDiff = destination.floor - origin.floor;
      const direction = floorDiff > 0 ? 'up' : 'down';
      const floors = Math.abs(floorDiff);
      
      return [
        { 
          id: 1, 
          instruction: `Start walking from ${origin.name}`, 
          icon: 'walk-outline',
          distance: distance * 0.15
        },
        { 
          id: 2, 
          instruction: `Head to the nearest elevator or stairs`, 
          icon: 'arrow-forward-outline',
          distance: distance * 0.25
        },
        { 
          id: 3, 
          instruction: `Go ${direction} ${floors} floor${floors > 1 ? 's' : ''}`, 
          icon: direction === 'up' ? 'arrow-up-outline' : 'arrow-down-outline',
          distance: distance * 0.2
        },
        { 
          id: 4, 
          instruction: `Exit the elevator and turn left`, 
          icon: 'arrow-forward-outline',
          distance: distance * 0.2
        },
        { 
          id: 5, 
          instruction: `Continue straight ahead`, 
          icon: 'arrow-forward-outline',
          distance: distance * 0.1
        },
        { 
          id: 6, 
          instruction: `${destination.name} will be on your right`, 
          icon: 'location-outline',
          distance: distance * 0.1
        },
      ];
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Navigation</Text>
          <Text style={styles.headerSubtitle}>To: {destination?.name}</Text>
        </View>
      </View>
      
      {/* Progress information */}
      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <View style={styles.progressItem}>
            <Text style={styles.progressValue}>{remainingDistance.toFixed(1)}m</Text>
            <Text style={styles.progressLabel}>Remaining</Text>
          </View>
          <View style={styles.progressDivider} />
          <View style={styles.progressItem}>
            <Text style={styles.progressValue}>{estimatedTime}s</Text>
            <Text style={styles.progressLabel}>Est. Time</Text>
          </View>
          <View style={styles.progressDivider} />
          <View style={styles.progressItem}>
            <Text style={styles.progressValue}>Floor {currentFloor}</Text>
            <Text style={styles.progressLabel}>Current</Text>
          </View>
        </View>
      </View>
      
      {/* Current step */}
      {steps.length > 0 && (
        <View style={styles.currentStepContainer}>
          <View style={styles.stepIconContainer}>
            <Ionicons name={steps[currentStep].icon} size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.currentStepText}>{steps[currentStep].instruction}</Text>
        </View>
      )}
      
      {/* Step list */}
      <View style={styles.stepListContainer}>
        <Text style={styles.stepListTitle}>Navigation Steps</Text>
        {steps.map((step, index) => (
          <View 
            key={step.id} 
            style={[
              styles.stepItem,
              index === currentStep ? styles.activeStepItem : null,
              index < currentStep ? styles.completedStepItem : null,
            ]}
          >
            <View style={[
              styles.stepNumber,
              index === currentStep ? styles.activeStepNumber : null,
              index < currentStep ? styles.completedStepNumber : null,
            ]}>
              <Text style={[
                styles.stepNumberText,
                index === currentStep ? styles.activeStepNumberText : null,
                index < currentStep ? styles.completedStepNumberText : null,
              ]}>
                {index + 1}
              </Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[
                styles.stepText,
                index === currentStep ? styles.activeStepText : null,
                index < currentStep ? styles.completedStepText : null,
              ]}>
                {step.instruction}
              </Text>
              {step.distance > 0 && (
                <Text style={styles.stepDistance}>{step.distance.toFixed(1)}m</Text>
              )}
            </View>
            {index < currentStep && (
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            )}
          </View>
        ))}
      </View>
      
      {/* Cancel button */}
      <TouchableOpacity style={styles.cancelButton} onPress={onBackPress}>
        <Text style={styles.cancelButtonText}>Cancel Navigation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#777777',
  },
  progressContainer: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  progressItem: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  progressLabel: {
    fontSize: 12,
    color: '#777777',
    marginTop: 4,
  },
  progressDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#DDDDDD',
  },
  currentStepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3F51B5',
    padding: 16,
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  currentStepText: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepListContainer: {
    flex: 1,
    padding: 16,
  },
  stepListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  activeStepItem: {
    backgroundColor: 'rgba(63, 81, 181, 0.05)',
  },
  completedStepItem: {
    opacity: 0.7,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeStepNumber: {
    backgroundColor: '#3F51B5',
  },
  completedStepNumber: {
    backgroundColor: '#4CAF50',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#777777',
  },
  activeStepNumberText: {
    color: '#FFFFFF',
  },
  completedStepNumberText: {
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: 14,
    color: '#333333',
  },
  activeStepText: {
    fontWeight: 'bold',
    color: '#3F51B5',
  },
  completedStepText: {
    color: '#777777',
  },
  stepDistance: {
    fontSize: 12,
    color: '#777777',
    marginTop: 2,
  },
  cancelButton: {
    margin: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#FF5252',
    fontWeight: 'bold',
  },
});

export default NavigationScreen;
