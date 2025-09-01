import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function ClaimForm({ onSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const submitForm = (data) => {
    const claimData = {
      ...data,
      claimNumber: `CLM-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`
    }
    onSubmit(claimData)
  }

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Address *
          </label>
          <input
            {...register('propertyAddress', { required: 'Property address is required' })}
            type="text"
            className="input-field"
            placeholder="123 Main St, City, State"
          />
          {errors.propertyAddress && (
            <p className="text-red-600 text-sm mt-1">{errors.propertyAddress.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Damage Type *
          </label>
          <select
            {...register('damageType', { required: 'Damage type is required' })}
            className="input-field"
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
            <p className="text-red-600 text-sm mt-1">{errors.damageType.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date of Loss *
        </label>
        <input
          {...register('dateReported', { required: 'Date of loss is required' })}
          type="date"
          className="input-field"
        />
        {errors.dateReported && (
          <p className="text-red-600 text-sm mt-1">{errors.dateReported.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes
        </label>
        <textarea
          {...register('notes')}
          rows={4}
          className="input-field"
          placeholder="Describe the damage or any additional details..."
        />
      </div>

      <button type="submit" className="btn-primary w-full">
        Create Claim & Continue to Upload
      </button>
    </form>
  )
}