// client/src/components/ui/Alert.tsx
import React from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { clsx } from 'clsx'

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children: React.ReactNode
  className?: string
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  className
}) => {
  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle
  }
  
  const variantClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  }
  
  const iconClasses = {
    info: 'text-blue-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400'
  }

  const Icon = icons[variant]

  return (
    <div className={clsx(
      'rounded-md border p-4',
      variantClasses[variant],
      className
    )}>
      <div className="flex">
        <Icon className={clsx('h-5 w-5 mt-0.5', iconClasses[variant])} />
        <div className="ml-3">
          {title && (
            <h3 className="text-sm font-medium mb-1">{title}</h3>
          )}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Alert