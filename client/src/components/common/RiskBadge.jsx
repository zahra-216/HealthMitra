// client/src/components/common/RiskBadge.jsx
const React = require("react");
const { AlertCircle, AlertTriangle, Info, CheckCircle } = require("lucide-react");
const Badge = require("../ui/Badge");

const RiskBadge = ({ risk, size = "md", showIcon = true }) => {
  const getRiskConfig = () => {
    switch (risk) {
      case "low":
        return { variant: "success", icon: CheckCircle, text: "Low Risk" };
      case "medium":
        return { variant: "warning", icon: Info, text: "Medium Risk" };
      case "high":
        return { variant: "danger", icon: AlertTriangle, text: "High Risk" };
      case "critical":
        return { variant: "danger", icon: AlertCircle, text: "Critical Risk" };
      default:
        return { variant: "default", icon: Info, text: "Unknown Risk" };
    }
  };

  const { variant, icon: Icon, text } = getRiskConfig();

  return React.createElement(
    Badge,
    { variant, className: risk === "critical" ? "animate-pulse" : "" },
    showIcon && React.createElement(Icon, { className: "w-3 h-3 mr-1" }),
    text
  );
};

module.exports = RiskBadge;
