// client/src/pages/Reminders/Reminders.tsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Bell,
  Calendar,
  Pill,
  Stethoscope,
  Edit,
  Trash2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  fetchReminders,
  createReminder,
  updateReminder,
  deleteReminder,
} from "@/store/slices/notificationSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import ReminderForm, {
  ReminderFormData,
} from "@/components/forms/ReminderForm";
import { Reminder, CreateReminderData } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatDate } from "@/utils/formatters";

// ---------------- Types ----------------
interface ReminderMetadata {
  medicationName?: string;
  dosage?: string;
  doctorName?: string;
  appointmentLocation?: string;
}

export interface ReminderType {
  _id: string;
  title: string;
  type: "medication" | "appointment" | "checkup" | "test" | string;
  description?: string;
  frequency: string;
  scheduledTime: string;
  metadata: ReminderMetadata;
  isActive: boolean;
}

const Reminders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { reminders, isLoading } = useAppSelector(
    (state: any) => state.notifications
  ) as {
    reminders: ReminderType[];
    isLoading: boolean;
  };

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [editingReminder, setEditingReminder] = useState<ReminderType | null>(
    null
  );
  const [selectedType, setSelectedType] = useState<string>("");

  useEffect(() => {
    dispatch(fetchReminders({ type: selectedType || undefined }));
  }, [dispatch, selectedType]);

  // ---------------- Handlers ----------------
  const handleCreateReminder = async (data: ReminderFormData) => {
    const payload: CreateReminderData = {
      title: data.title,
      time: data.scheduledTime, // backend expects "time"
      type:
        data.type === "checkup" || data.type === "test" ? "general" : data.type,
    };

    try {
      await dispatch(createReminder(payload)).unwrap();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Failed to create reminder:", error);
    }
  };

  const handleUpdateReminder = async (data: ReminderFormData) => {
    if (!editingReminder) return;

    const payload: Partial<Reminder> = {
      title: data.title,
      time: data.scheduledTime,
      type:
        data.type === "checkup" || data.type === "test" ? "general" : data.type,
    };

    try {
      await dispatch(
        updateReminder({ id: editingReminder._id, data: payload })
      ).unwrap();
      setEditingReminder(null);
    } catch (error) {
      console.error("Failed to update reminder:", error);
    }
  };

  const handleDeleteReminder = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this reminder?")) {
      try {
        await dispatch(deleteReminder(id)).unwrap();
      } catch (error) {
        console.error("Failed to delete reminder:", error);
      }
    }
  };

  const getReminderIcon = (type: string) => {
    const icons: Record<string, React.ElementType> = {
      medication: Pill,
      appointment: Stethoscope,
      checkup: Calendar,
      test: Bell,
    };
    return icons[type] || Bell;
  };

  const getReminderColor = (
    type: string
  ): "primary" | "success" | "warning" | "default" => {
    const colors: Record<
      string,
      "primary" | "success" | "warning" | "default"
    > = {
      medication: "primary",
      appointment: "success",
      checkup: "warning",
      test: "default",
    };
    return colors[type] || "default";
  };

  // ---------------- Loading ----------------
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading reminders..." />
      </div>
    );
  }

  // ---------------- Reminder Cards ----------------
  const reminderCards = reminders.map((reminder) => {
    const Icon = getReminderIcon(reminder.type);
    const isOverdue = new Date(reminder.scheduledTime) < new Date();

    const metadataFields = [
      {
        label: "Medication",
        value: reminder.metadata.medicationName,
        extra: reminder.metadata.dosage ? ` (${reminder.metadata.dosage})` : "",
      },
      { label: "Doctor", value: reminder.metadata.doctorName },
      { label: "Location", value: reminder.metadata.appointmentLocation },
    ].filter((item) => item.value);

    return (
      <Card
        key={reminder._id}
        className={isOverdue && reminder.isActive ? "ring-2 ring-red-500" : ""}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <Badge variant={getReminderColor(reminder.type)}>
              <Icon className="w-3 h-3 mr-1" />
              {reminder.type}
            </Badge>
            <div className="flex space-x-1">
              {isOverdue && reminder.isActive && (
                <Badge variant="danger">Overdue</Badge>
              )}
              {!reminder.isActive && <Badge variant="default">Inactive</Badge>}
            </div>
          </div>
          <CardTitle className="text-lg">{reminder.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Scheduled: </span>
              {formatDate(reminder.scheduledTime)}
            </div>
            <div>
              <span className="font-medium">Frequency: </span>
              {reminder.frequency}
            </div>
            {reminder.description && (
              <div>
                <span className="font-medium">Notes: </span>
                {reminder.description}
              </div>
            )}
            {metadataFields.map((item, idx) => (
              <div key={idx}>
                <span className="font-medium">{item.label}: </span>
                {item.value + (item.extra || "")}
              </div>
            ))}
          </div>
          <div className="mt-4 flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingReminder(reminder)}
            >
              <Edit className="h-3 w-3 mr-1" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteReminder(reminder._id)}
            >
              <Trash2 className="h-3 w-3 mr-1" /> Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  });

  // ---------------- Render ----------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reminders</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your medication and appointment reminders
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Reminder
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">
          Filter by type:
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="input min-w-[150px]"
        >
          <option value="">All Types</option>
          <option value="medication">Medication</option>
          <option value="appointment">Appointments</option>
          <option value="checkup">Check-ups</option>
          <option value="test">Tests</option>
        </select>
      </div>

      {/* Reminders Grid */}
      {reminders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reminders set
            </h3>
            <p className="text-gray-600 mb-4">
              Create reminders for medications, appointments, and health
              check-ups
            </p>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" /> Create Your First Reminder
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reminderCards}
        </div>
      )}

      {/* Create Reminder Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Reminder"
        size="lg"
      >
        <ReminderForm
          onSubmit={handleCreateReminder}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Reminder Modal */}
      <Modal
        isOpen={!!editingReminder}
        onClose={() => setEditingReminder(null)}
        title="Edit Reminder"
        size="lg"
      >
        {editingReminder && (
          <ReminderForm
            initialData={editingReminder as Partial<ReminderFormData>}
            onSubmit={handleUpdateReminder}
            onCancel={() => setEditingReminder(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Reminders;
