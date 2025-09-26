// client/src/components/layout/AuthLayout.tsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Heart, Shield, Users } from 'lucide-react'

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12">
        <div className="max-w-md">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <span className="ml-3 text-2xl font-bold text-primary-900">HealthMitra</span>
          </div>
          
          {/* Tagline */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Trusted Digital Health Companion
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Securely manage your medical records, get AI-powered health insights, 
            and never miss important medications or appointments.
          </p>
          
          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-primary-600 mr-3" />
              <span className="text-gray-700">Secure & Private Health Records</span>
            </div>
            <div className="flex items-center">
              <Heart className="h-5 w-5 text-primary-600 mr-3" />
              <span className="text-gray-700">AI-Powered Health Insights</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-primary-600 mr-3" />
              <span className="text-gray-700">Easy Sharing with Healthcare Providers</span>
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Disclaimer:</strong> HealthMitra provides health information and AI suggestions 
              for educational purposes only. Always consult qualified healthcare providers for medical decisions.
            </p>
          </div>
        </div>
      </div>
      
      {/* Right Side - Auth Forms */}
      <div className="flex-1 lg:flex-none lg:w-96 bg-white shadow-xl">
        <div className="flex flex-col justify-center min-h-screen px-8 py-12">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold text-primary-900">HealthMitra</span>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout