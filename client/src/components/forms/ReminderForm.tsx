// client/src/components/forms/ReminderForm.tsx
import React, { useState } from "react";
import { Save, X, Clock, Calendar, Pill, Stethoscope } from "lucide-react";
import Button from "@/components/ui/Button";

interface ReminderMetadata {
  medicationName?: string;
  dosage?: string;
  doctorName?: string;
  appointmentLocation?: string;
}

export interface ReminderFormData {
  title: string;
  type: "medication" | "appointment" | "checkup" | "test";
  description?: string;
  frequency: string;
  scheduledTime: string;
  metadata: ReminderMetadata;
  isActive: boolean;
}

interface ReminderFormProps {
  initialData?: Partial<ReminderFormData>;
  onSubmit: (data: ReminderFormData) => Promise<void>;
  onCancel: () => void;
}

const ReminderForm: React.FC<ReminderFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ReminderFormData>({
    title: initialData?.title || "",
    type: initialData?.type || "medication",
    description: initialData?.description || "",
    frequency: initialData?.frequency || "daily",
    scheduledTime: initialData?.scheduledTime || "",
    metadata: {
      medicationName: initialData?.metadata?.medicationName || "",
      dosage: initialData?.metadata?.dosage || "",
      doctorName: initialData?.metadata?.doctorName || "",
      appointmentLocation: initialData?.metadata?.appointmentLocation || "",
    },
    isActive: initialData?.isActive ?? true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type: inputType } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }

    if (name.startsWith("metadata.")) {
      const metadataKey = name.replace(
        "metadata.",
        ""
      ) as keyof ReminderMetadata;
      setFormData((prev) => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [metadataKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: inputType === "checkbox" ? checked : value,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.scheduledTime) {
      newErrors.scheduledTime = "Scheduled time is required";
    }

    // Type-specific validations
    if (formData.type === "medication") {
      if (!formData.metadata.medicationName?.trim()) {
        newErrors["metadata.medicationName"] =
          "Medication name is required for medication reminders";
      }
    }

    if (formData.type === "appointment" || formData.type === "checkup") {
      if (!formData.metadata.doctorName?.trim()) {
        newErrors["metadata.doctorName"] =
          "Doctor name is recommended for appointments";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const frequencyOptions = [
    { value: "once", label: "Once" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "bi-weekly", label: "Bi-weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "custom", label: "Custom" },
  ];

  const typeOptions = [
    {
      value: "medication",
      label: "Medication",
      icon: Pill,
      color: "text-blue-600",
    },
    {
      value: "appointment",
      label: "Appointment",
      icon: Stethoscope,
      color: "text-green-600",
    },
    {
      value: "checkup",
      label: "Check-up",
      icon: Calendar,
      color: "text-orange-600",
    },
    { value: "test", label: "Test", icon: Clock, color: "text-purple-600" },
  ];

  // Format datetime-local input value
  const formatDateTimeLocal = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    // Convert to local timezone and format for datetime-local input
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  const currentType = typeOptions.find((opt) => opt.value === formData.type);

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header with Type Selection */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            {currentType && (
              <div
                className={`p-3 rounded-full bg-gray-100 ${currentType.color}`}
              >
                <currentType.icon className="h-6 w-6" />
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {initialData ? "Edit" : "Create"} {currentType?.label} Reminder
          </h3>
        </div>

        {/* Basic Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
            Basic Information
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminder Type *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {typeOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`relative flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300 ${
                      formData.type === option.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={option.value}
                      checked={formData.type === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <IconComponent className={`h-5 w-5 mb-2 ${option.color}`} />
                    <span className="text-xs font-medium text-center">
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminder Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`input w-full ${
                errors.title ? "border-red-300 focus:ring-red-500" : ""
              }`}
              placeholder={`e.g., Take ${
                formData.type === "medication"
                  ? "morning vitamins"
                  : formData.type === "appointment"
                  ? "dentist appointment"
                  : "annual check-up"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description / Notes
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="input w-full resize-none"
              placeholder="Add additional details, instructions, or notes..."
            />
          </div>
        </div>

        {/* Scheduling */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
            Scheduling
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scheduled Date & Time *
              </label>
              <input
                type="datetime-local"
                name="scheduledTime"
                value={formatDateTimeLocal(formData.scheduledTime)}
                onChange={handleChange}
                className={`input w-full ${
                  errors.scheduledTime
                    ? "border-red-300 focus:ring-red-500"
                    : ""
                }`}
              />
              {errors.scheduledTime && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.scheduledTime}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency *
              </label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="input w-full"
              >
                {frequencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Type-specific Metadata */}
        {formData.type === "medication" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
            <h4 className="text-md font-medium text-blue-900 border-b border-blue-200 pb-2 flex items-center">
              <Pill className="h-5 w-5 mr-2" />
              Medication Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  Medication Name *
                </label>
                <input
                  type="text"
                  name="metadata.medicationName"
                  value={formData.metadata.medicationName}
                  onChange={handleChange}
                  className={`input w-full ${
                    errors["metadata.medicationName"]
                      ? "border-red-300 focus:ring-red-500"
                      : ""
                  }`}
                  placeholder="e.g., Aspirin, Vitamin D"
                />
                {errors["metadata.medicationName"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["metadata.medicationName"]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  Dosage
                </label>
                <input
                  type="text"
                  name="metadata.dosage"
                  value={formData.metadata.dosage}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="e.g., 100mg, 2 tablets"
                />
              </div>
            </div>
          </div>
        )}

        {(formData.type === "appointment" || formData.type === "checkup") && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
            <h4 className="text-md font-medium text-green-900 border-b border-green-200 pb-2 flex items-center">
              <Stethoscope className="h-5 w-5 mr-2" />
              Appointment Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-900 mb-2">
                  Doctor / Provider Name
                </label>
                <input
                  type="text"
                  name="metadata.doctorName"
                  value={formData.metadata.doctorName}
                  onChange={handleChange}
                  className={`input w-full ${
                    errors["metadata.doctorName"]
                      ? "border-orange-300 focus:ring-orange-500"
                      : ""
                  }`}
                  placeholder="e.g., Dr. Smith, City Clinic"
                />
                {errors["metadata.doctorName"] && (
                  <p className="mt-1 text-sm text-orange-600">
                    {errors["metadata.doctorName"]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-green-900 mb-2">
                  Location / Address
                </label>
                <input
                  type="text"
                  name="metadata.appointmentLocation"
                  value={formData.metadata.appointmentLocation}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="e.g., City Hospital, Room 205"
                />
              </div>
            </div>
          </div>
        )}

        {formData.type === "test" && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 space-y-4">
            <h4 className="text-md font-medium text-purple-900 border-b border-purple-200 pb-2 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Test Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-900 mb-2">
                  Healthcare Provider
                </label>
                <input
                  type="text"
                  name="metadata.doctorName"
                  value={formData.metadata.doctorName}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="e.g., Lab Corp, City Medical Center"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-900 mb-2">
                  Test Location
                </label>
                <input
                  type="text"
                  name="metadata.appointmentLocation"
                  value={formData.metadata.appointmentLocation}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="e.g., Main Lab, Building A"
                />
              </div>
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Reminder Settings
          </h4>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Active Reminder
              </label>
              <p className="text-sm text-gray-500">
                Turn off to pause notifications for this reminder
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {initialData ? "Update" : "Create"} Reminder
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReminderForm;
