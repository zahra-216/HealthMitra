// client/src/pages/Reminders/Reminders.jsx
const React = require("react");
const { useState, useEffect } = React;
const { Plus, Bell, Calendar, Pill, Stethoscope, Edit, Trash2 } = require("lucide-react");
const { useAppDispatch, useAppSelector } = require("@/hooks/redux");
const {
  fetchReminders,
  createReminder,
  updateReminder,
  deleteReminder,
} = require("@/store/slices/notificationSlice");
const { Card, CardContent, CardHeader, CardTitle } = require("@/components/ui/Card");
const Button = require("@/components/ui/Button");
const Badge = require("@/components/ui/Badge");
const Modal = require("@/components/ui/Modal");
const ReminderForm = require("@/components/forms/ReminderForm");
const LoadingSpinner = require("@/components/ui/LoadingSpinner");
const { formatDateTime } = require("@/utils/formatters");

const Reminders = function () {
  const dispatch = useAppDispatch();
  const { reminders, isLoading } = useAppSelector(state => state.notifications);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    dispatch(fetchReminders({ type: selectedType || undefined }));
  }, [dispatch, selectedType]);

  const handleCreateReminder = async function (data) {
    try {
      await dispatch(createReminder(data)).unwrap();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Failed to create reminder:", error);
    }
  };

  const handleUpdateReminder = async function (data) {
    if (!editingReminder) return;
    try {
      await dispatch(updateReminder({ id: editingReminder._id, data })).unwrap();
      setEditingReminder(null);
    } catch (error) {
      console.error("Failed to update reminder:", error);
    }
  };

  const handleDeleteReminder = async function (id) {
    if (window.confirm("Are you sure you want to delete this reminder?")) {
      try {
        await dispatch(deleteReminder(id)).unwrap();
      } catch (error) {
        console.error("Failed to delete reminder:", error);
      }
    }
  };

  const getReminderIcon = function (type) {
    const icons = {
      medication: Pill,
      appointment: Stethoscope,
      checkup: Calendar,
      test: Bell,
    };
    return icons[type] || Bell;
  };

  const getReminderColor = function (type) {
    const colors = {
      medication: "primary",
      appointment: "success",
      checkup: "warning",
      test: "secondary",
    };
    return colors[type] || "default";
  };

  if (isLoading) {
    return React.createElement("div", { className: "flex justify-center py-12" },
      React.createElement(LoadingSpinner, { size: "lg", text: "Loading reminders..." })
    );
  }

  const reminderCards = reminders.map(reminder => {
    const Icon = getReminderIcon(reminder.type);
    const isOverdue = new Date(reminder.scheduledTime) < new Date();

    // Metadata fields
    const metadataFields = [
      { label: "Medication", value: reminder.metadata.medicationName, extra: reminder.metadata.dosage ? ` (${reminder.metadata.dosage})` : "" },
      { label: "Doctor", value: reminder.metadata.doctorName },
      { label: "Location", value: reminder.metadata.appointmentLocation },
    ].filter(item => item.value);

    return React.createElement(Card, {
      key: reminder._id,
      className: isOverdue && reminder.isActive ? "ring-2 ring-red-500" : "",
    },
      React.createElement(CardHeader, { className: "pb-3" },
        React.createElement("div", { className: "flex justify-between items-start" },
          React.createElement(Badge, { variant: getReminderColor(reminder.type) },
            React.createElement(Icon, { className: "w-3 h-3 mr-1" }),
            reminder.type
          ),
          React.createElement("div", { className: "flex space-x-1" },
            isOverdue && reminder.isActive && React.createElement(Badge, { variant: "danger" }, "Overdue"),
            !reminder.isActive && React.createElement(Badge, { variant: "secondary" }, "Inactive")
          )
        ),
        React.createElement(CardTitle, { className: "text-lg" }, reminder.title)
      ),
      React.createElement(CardContent, null,
        React.createElement("div", { className: "space-y-2 text-sm" },
          React.createElement("div", null,
            React.createElement("span", { className: "font-medium" }, "Scheduled: "), formatDateTime(reminder.scheduledTime)
          ),
          React.createElement("div", null,
            React.createElement("span", { className: "font-medium" }, "Frequency: "), reminder.frequency
          ),
          reminder.description && React.createElement("div", null,
            React.createElement("span", { className: "font-medium" }, "Notes: "), reminder.description
          ),
          metadataFields.map((item, idx) => React.createElement("div", { key: idx },
            React.createElement("span", { className: "font-medium" }, item.label + ": "), item.value + (item.extra || "")
          ))
        ),
        React.createElement("div", { className: "mt-4 flex space-x-2" },
          React.createElement(Button, {
            variant: "outline",
            size: "sm",
            onClick: () => setEditingReminder(reminder)
          }, React.createElement(Edit, { className: "h-3 w-3 mr-1" }), "Edit"),
          React.createElement(Button, {
            variant: "outline",
            size: "sm",
            onClick: () => handleDeleteReminder(reminder._id)
          }, React.createElement(Trash2, { className: "h-3 w-3 mr-1" }), "Delete")
        )
      )
    );
  });

  return React.createElement("div", { className: "space-y-6" },
    // Header
    React.createElement("div", { className: "flex justify-between items-center" },
      React.createElement("div", null,
        React.createElement("h1", { className: "text-2xl font-bold text-gray-900" }, "Reminders"),
        React.createElement("p", { className: "mt-1 text-sm text-gray-600" }, "Manage your medication and appointment reminders")
      ),
      React.createElement(Button, { variant: "primary", onClick: () => setShowCreateModal(true) },
        React.createElement(Plus, { className: "h-4 w-4 mr-2" }),
        "Add Reminder"
      )
    ),
    // Filters
    React.createElement("div", { className: "flex items-center space-x-4" },
      React.createElement("label", { className: "text-sm font-medium text-gray-700" }, "Filter by type:"),
      React.createElement("select", {
        value: selectedType,
        onChange: e => setSelectedType(e.target.value),
        className: "input min-w-[150px]"
      },
        React.createElement("option", { value: "" }, "All Types"),
        React.createElement("option", { value: "medication" }, "Medication"),
        React.createElement("option", { value: "appointment" }, "Appointments"),
        React.createElement("option", { value: "checkup" }, "Check-ups"),
        React.createElement("option", { value: "test" }, "Tests")
      )
    ),
    // Reminders Grid
    reminders.length === 0 ?
      React.createElement(Card, null,
        React.createElement(CardContent, { className: "text-center py-12" },
          React.createElement(Bell, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }),
          React.createElement("h3", { className: "text-lg font-medium text-gray-900 mb-2" }, "No reminders set"),
          React.createElement("p", { className: "text-gray-600 mb-4" }, "Create reminders for medications, appointments, and health check-ups"),
          React.createElement(Button, { variant: "primary", onClick: () => setShowCreateModal(true) },
            React.createElement(Plus, { className: "h-4 w-4 mr-2" }),
            "Create Your First Reminder"
          )
        )
      )
      :
      React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, reminderCards),
    // Create Reminder Modal
    React.createElement(Modal, {
      isOpen: showCreateModal,
      onClose: () => setShowCreateModal(false),
      title: "Create New Reminder",
      size: "lg"
    }, React.createElement(ReminderForm, {
      onSubmit: handleCreateReminder,
      onCancel: () => setShowCreateModal(false)
    })),
    // Edit Reminder Modal
    React.createElement(Modal, {
      isOpen: !!editingReminder,
      onClose: () => setEditingReminder(null),
      title: "Edit Reminder",
      size: "lg"
    }, editingReminder && React.createElement(ReminderForm, {
      initialData: editingReminder,
      onSubmit: handleUpdateReminder,
      onCancel: () => setEditingReminder(null)
    }))
  );
};

module.exports = Reminders;
