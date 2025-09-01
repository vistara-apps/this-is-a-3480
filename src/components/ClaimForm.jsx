import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Calendar, Home, AlertTriangle, Info, CheckCircle } from 'lucide-react'

export default function ClaimForm({ onSubmit, initialData = {} }) {
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors, isSubmitting, isValid, isDirty, touchedFields },
    reset
  } = useForm({
    defaultValues: initialData,
    mode: 'onChange'
  })
  
  const [formProgress, setFormProgress] = useState(0)
  const watchedFields = watch()
  
  // Calculate form completion progress
  useEffect(() => {
    const requiredFields = ['propertyAddress', 'damageType', 'dateReported']
    const completedFields = requiredFields.filter(field => 
      watchedFields[field] && watchedFields[field].trim !== ''
    )
    
    setFormProgress(Math.round((completedFields.length / requiredFields.length) * 100))
  }, [watchedFields])
  
  // Format today's date as YYYY-MM-DD for the max date attribute
  const today = new Date().toISOString().split('T')[0]
  
  const submitForm = (data) => {
    // Generate a claim number with format CLM-YYYY-XXX where XXX is a random 3-digit number
    const claimData = {
      ...data,
      claimNumber: `CLM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`
    }
    onSubmit(claimData)
  }

  return (
    <div>
      {/* Form progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Form completion</span>
          <span>{formProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              formProgress === 100 ? 'bg-green-500' : 'bg-primary'
            }`}
            style={{ width: `${formProgress}%` }}
          />
        </div>
      </div>
      
      <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="propertyAddress" className="input-label flex items-center">
              <Home className="h-4 w-4 mr-1 text-gray-500" aria-hidden="true" />
              Property Address <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                id="propertyAddress"
                {...register('propertyAddress', { 
                  required: 'Property address is required',
                  minLength: { value: 5, message: 'Address must be at least 5 characters' }
                })}
                type="text"
                className={`input-field ${errors.propertyAddress ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="123 Main St, City, State"
                aria-invalid={errors.propertyAddress ? 'true' : 'false'}
              />
              {touchedFields.propertyAddress && !errors.propertyAddress && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" aria-hidden="true" />
              )}
            </div>
            {errors.propertyAddress && (
              <p className="input-error flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" aria-hidden="true" />
                {errors.propertyAddress.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="damageType" className="input-label flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1 text-gray-500" aria-hidden="true" />
              Damage Type <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              id="damageType"
              {...register('damageType', { required: 'Damage type is required' })}
              className={`input-field ${errors.damageType ? 'border-red-300 focus:ring-red-500' : ''}`}
              aria-invalid={errors.damageType ? 'true' : 'false'}
            >
              <option value="">Select damage type</option>
              <option value="Water Damage">Water Damage</option>
              <option value="Fire Damage">Fire Damage</option>
              <option value="Storm Damage">Storm Damage</option>
              <option value="Structural Damage">Structural Damage</option>
              <option value="Vandalism">Vandalism</option>
              <option value="Other">Other</option>
            </select>
            {errors.damageType && (
              <p className="input-error flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" aria-hidden="true" />
                {errors.damageType.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="dateReported" className="input-label flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-gray-500" aria-hidden="true" />
            Date of Loss <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              id="dateReported"
              {...register('dateReported', { required: 'Date of loss is required' })}
              type="date"
              max={today}
              className={`input-field ${errors.dateReported ? 'border-red-300 focus:ring-red-500' : ''}`}
              aria-invalid={errors.dateReported ? 'true' : 'false'}
            />
            {touchedFields.dateReported && !errors.dateReported && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" aria-hidden="true" />
            )}
          </div>
          {errors.dateReported && (
            <p className="input-error flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" aria-hidden="true" />
              {errors.dateReported.message}
            </p>
          )}
          <p className="input-hint flex items-center">
            <Info className="h-3 w-3 mr-1" aria-hidden="true" />
            Date when the damage occurred
          </p>
        </div>

        <div>
          <label htmlFor="notes" className="input-label flex items-center">
            <Info className="h-4 w-4 mr-1 text-gray-500" aria-hidden="true" />
            Additional Notes
          </label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={4}
            className="input-field"
            placeholder="Describe the damage or any additional details..."
          />
          <p className="input-hint">
            Include any relevant details that might help with processing the claim
          </p>
        </div>

        <div className="flex items-center pt-4">
          <button 
            type="submit" 
            className="btn-primary w-full flex items-center justify-center"
            disabled={isSubmitting || !isValid}
          >
            <CheckCircle className="h-5 w-5 mr-2" aria-hidden="true" />
            Create Claim & Continue to Upload
          </button>
        </div>
      </form>
    </div>
  )
}
