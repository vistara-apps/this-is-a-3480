export const mockUser = {
  id: '1',
  email: 'adjuster@insurance.com',
  companyName: 'SafeGuard Insurance',
  subscriptionTier: 'professional',
  createdAt: '2024-01-15T10:00:00Z'
}

export const mockClaims = [
  {
    id: '1',
    userId: '1',
    claimNumber: 'CLM-2024-001',
    dateReported: '2024-01-20T09:00:00Z',
    status: 'active',
    propertyAddress: '123 Main St, Anytown, USA',
    damageType: 'Water Damage',
    photoCount: 24
  },
  {
    id: '2',
    userId: '1',
    claimNumber: 'CLM-2024-002',
    dateReported: '2024-01-18T14:30:00Z',
    status: 'review',
    propertyAddress: '456 Oak Ave, Somewhere, USA',
    damageType: 'Fire Damage',
    photoCount: 18
  },
  {
    id: '3',
    userId: '1',
    claimNumber: 'CLM-2024-003',
    dateReported: '2024-01-15T11:15:00Z',
    status: 'completed',
    propertyAddress: '789 Pine Rd, Elsewhere, USA',
    damageType: 'Storm Damage',
    photoCount: 32
  }
]

export const mockPhotos = [
  {
    id: '1',
    claimId: '1',
    filename: 'kitchen_water_damage_1.jpg',
    fileUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
    tags: ['kitchen', 'water damage', 'flooring'],
    damageType: 'water',
    location: 'kitchen',
    qualityScore: 95,
    isDuplicate: false,
    uploadedAt: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    claimId: '1',
    filename: 'living_room_ceiling_1.jpg',
    fileUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    tags: ['living room', 'ceiling', 'water stain'],
    damageType: 'water',
    location: 'living room',
    qualityScore: 88,
    isDuplicate: false,
    uploadedAt: '2024-01-20T10:31:00Z'
  },
  {
    id: '3',
    claimId: '2',
    filename: 'fire_damage_exterior.jpg',
    fileUrl: 'https://images.unsplash.com/photo-1574263867128-eba156c63ca0?w=400',
    tags: ['exterior', 'fire damage', 'structural'],
    damageType: 'fire',
    location: 'exterior',
    qualityScore: 92,
    isDuplicate: false,
    uploadedAt: '2024-01-18T15:00:00Z'
  },
  {
    id: '4',
    claimId: '3',
    filename: 'storm_roof_damage.jpg',
    fileUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
    tags: ['roof', 'storm damage', 'shingles'],
    damageType: 'storm',
    location: 'roof',
    qualityScore: 90,
    isDuplicate: false,
    uploadedAt: '2024-01-15T12:00:00Z'
  }
]

export const damageTypes = [
  'water',
  'fire',
  'storm',
  'structural',
  'electrical',
  'vandalism',
  'theft',
  'mold'
]

export const commonTags = [
  'kitchen',
  'bathroom',
  'living room',
  'bedroom',
  'basement',
  'attic',
  'exterior',
  'roof',
  'flooring',
  'ceiling',
  'walls',
  'windows',
  'doors'
]