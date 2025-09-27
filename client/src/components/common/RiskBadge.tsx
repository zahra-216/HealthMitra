// client/src/components/common/RiskBadge.tsx
import React from 'react'
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react'
import Badge from '../ui/Badge'

interface RiskBadgeProps {
  risk: 'low' | 'medium' | 'high' | 'critical'
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ 
  risk, 
  size = 'md',
  showIcon = true 
}) => {
  const getRiskConfig = () => {
    switch (risk) {
      case 'low':
        return {
          variant: 'success' as const,
          icon: CheckCircle,
          text: 'Low Risk'
        }
      case 'medium':
        return {
          variant: 'warning' as const,
          icon: Info,
          text: 'Medium Risk'
        }
      case 'high':
        return {
          variant: 'danger' as const,
          icon: AlertTriangle,
          text: 'High Risk'
        }
      case 'critical':
        return {
          variant: 'danger' as const,
          icon: AlertCircle,
          text: 'Critical Risk'
        }
    }
  }

  const { variant, icon: Icon, text } = getRiskConfig()

  return (
    <Badge variant={variant} className={`${risk === 'critical' ? 'animate-pulse' : ''}`}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {text}
    </Badge>
  )
}

export default RiskBadge