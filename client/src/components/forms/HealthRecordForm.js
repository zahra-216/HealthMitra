// client/src/components/forms/HealthRecordForm.js
const React = require("react");
const { useState, forwardRef, useRef } = React;
const { useForm } = require("react-hook-form");
const { zodResolver } = require("@hookform/resolvers/zod");
const { z } = require("zod");
const { Upload, X, FileText, Image, Loader2 } = require("lucide-react");

// --- Utility for merging class names ---
const cn = (...classes) => classes.filter(Boolean).join(" ");

// =================================================================
// UI Components
// =================================================================
const buttonVariants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
};

const Button = forwardRef(
  (
    { children, className, variant = "primary", disabled, loading, ...props },
    ref
  ) => {
    const mergedClassNames = cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 px-4 py-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      buttonVariants[variant],
      className
    );

    return React.createElement(
      "button",
      {
        className: mergedClassNames,
        disabled: disabled || loading,
        ref,
        ...props,
      },
      loading
        ? React.createElement(Loader2, {
            className: "mr-2 h-4 w-4 animate-spin",
          })
        : children
    );
  }
);
Button.displayName = "Button";

const Input = forwardRef(
  ({ label, error, helperText, className, ...props }, ref) =>
    React.createElement(
      "div",
      { className: "space-y-1" },
      label &&
        React.createElement(
          "label",
          {
            className:
              "block text-sm font-medium text-gray-700 dark:text-gray-300",
          },
          label
        ),
      React.createElement("input", {
        className: cn(
          "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm",
          error ? "border-red-500" : "border-gray-300",
          className
        ),
        ref,
        ...props,
      }),
      error &&
        React.createElement(
          "p",
          { className: "mt-1 text-sm text-red-500" },
          error
        ),
      helperText &&
        !error &&
        React.createElement(
          "p",
          { className: "mt-1 text-xs text-gray-500 dark:text-gray-400" },
          helperText
        )
    )
);
Input.displayName = "Input";

const Textarea = forwardRef(
  ({ label, error, helperText, className, ...props }, ref) =>
    React.createElement(
      "div",
      { className: "space-y-1" },
      label &&
        React.createElement(
          "label",
          {
            className:
              "block text-sm font-medium text-gray-700 dark:text-gray-300",
          },
          label
        ),
      React.createElement("textarea", {
        className: cn(
          "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm",
          error ? "border-red-500" : "border-gray-300",
          className
        ),
        ref,
        ...props,
      }),
      error &&
        React.createElement(
          "p",
          { className: "mt-1 text-sm text-red-500" },
          error
        ),
      helperText &&
        !error &&
        React.createElement(
          "p",
          { className: "mt-1 text-xs text-gray-500 dark:text-gray-400" },
          helperText
        )
    )
);
Textarea.displayName = "Textarea";

const Select = forwardRef(
  (
    { label, error, helperText, className, options, placeholder, ...props },
    ref
  ) =>
    React.createElement(
      "div",
      { className: "space-y-1" },
      label &&
        React.createElement(
          "label",
          {
            className:
              "block text-sm font-medium text-gray-700 dark:text-gray-300",
          },
          label
        ),
      React.createElement(
        "select",
        {
          className: cn(
            "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10",
            error ? "border-red-500" : "border-gray-300",
            className
          ),
          ref,
          ...props,
        },
        placeholder &&
          React.createElement(
            "option",
            { value: "", disabled: true, hidden: true },
            placeholder
          ),
        options.map((option) =>
          React.createElement(
            "option",
            { key: option.value, value: option.value },
            option.label
          )
        )
      ),
      error &&
        React.createElement(
          "p",
          { className: "mt-1 text-sm text-red-500" },
          error
        ),
      helperText &&
        !error &&
        React.createElement(
          "p",
          { className: "mt-1 text-xs text-gray-500 dark:text-gray-400" },
          helperText
        )
    )
);
Select.displayName = "Select";

// =================================================================
// Health Record Form
// =================================================================
const RecordTypes = [
  "prescription",
  "lab_report",
  "scan",
  "visit_note",
  "vital_signs",
];
const RecordTypeEnum = z.enum(RecordTypes);

const healthRecordSchema = z.object({
  type: RecordTypeEnum,
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  recordDate: z.string().optional(),
  tags: z.string().optional(),
  hospital: z.string().optional(),
  doctorId: z.string().optional(),
  files: z.any().optional(),
});

const HealthRecordForm = ({ onSubmit, isLoading }) => {
  const [filesData, setFilesData] = useState([]);
  const inputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(healthRecordSchema),
    defaultValues: {
      type: "prescription",
      title: "",
      description: "",
      recordDate: new Date().toISOString().split("T")[0],
      tags: "",
      hospital: "",
      doctorId: "",
    },
  });

  const recordTypeOptions = [
    { value: "prescription", label: "Prescription" },
    { value: "lab_report", label: "Lab Report" },
    { value: "scan", label: "Medical Scan" },
    { value: "visit_note", label: "Visit Note" },
    { value: "vital_signs", label: "Vital Signs" },
  ];

  const handleFiles = (newFiles) => {
    const mapped = Array.from(newFiles).map((file) => ({
      file,
      previewUrl: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));
    const updated = [...filesData, ...mapped];
    setFilesData(updated);
    setValue(
      "files",
      updated.map((f) => f.file)
    );
  };

  const handleFileChange = (e) => {
    if (!e.target.files) return;
    handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!e.dataTransfer.files) return;
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    const fileToRemove = filesData[index];
    if (fileToRemove.previewUrl) URL.revokeObjectURL(fileToRemove.previewUrl);
    const updated = filesData.filter((_, i) => i !== index);
    setFilesData(updated);
    setValue(
      "files",
      updated.map((f) => f.file)
    );
  };

  const handleFormSubmit = async (data) => {
    const tagsArray = data.tags
      ? data.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : undefined;
    const submissionData = {
      ...data,
      tags: tagsArray,
      files: filesData.map((f) => f.file),
    };
    await onSubmit(submissionData);
  };

  return React.createElement(
    "form",
    {
      onSubmit: handleSubmit(handleFormSubmit),
      className:
        "space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-4xl mx-auto",
    },
    React.createElement(
      "h2",
      { className: "text-2xl font-bold text-gray-900 dark:text-white mb-4" },
      "New Health Record"
    ),

    React.createElement(
      "div",
      { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
      React.createElement(Select, {
        label: "Record Type",
        placeholder: "Select record type...",
        options: recordTypeOptions,
        ...register("type"),
        error: errors.type?.message,
      }),
      React.createElement(Input, {
        label: "Record Date",
        type: "date",
        ...register("recordDate"),
        error: errors.recordDate?.message,
      })
    ),

    React.createElement(Input, {
      label: "Title",
      placeholder: "Enter record title...",
      ...register("title"),
      error: errors.title?.message,
    }),
    React.createElement(Textarea, {
      label: "Description",
      placeholder: "Enter description...",
      rows: 4,
      ...register("description"),
      error: errors.description?.message,
    }),

    React.createElement(
      "div",
      { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
      React.createElement(Input, {
        label: "Hospital/Clinic",
        placeholder: "e.g., Colombo General Hospital",
        ...register("hospital"),
        error: errors.hospital?.message,
      }),
      React.createElement(Input, {
        label: "Tags",
        placeholder: "e.g., diabetes, heart, medication (comma separated)",
        ...register("tags"),
        error: errors.tags?.message,
        helperText: "Separate multiple tags with commas",
      })
    ),

    React.createElement(
      "div",
      { className: "mt-4" },
      React.createElement(
        "label",
        {
          className:
            "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
        },
        "Upload Files"
      ),
      React.createElement(
        "div",
        {
          className:
            "border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer",
          onDragOver: (e) => e.preventDefault(),
          onDrop: handleDrop,
          onClick: () => inputRef.current.click(),
        },
        React.createElement("input", {
          type: "file",
          multiple: true,
          accept: "image/*,.pdf",
          ref: inputRef,
          onChange: handleFileChange,
          className: "hidden",
        }),
        React.createElement(
          "div",
          { className: "flex flex-col items-center" },
          React.createElement(Upload, {
            className: "h-12 w-12 text-gray-400 dark:text-gray-500",
          }),
          React.createElement(
            "p",
            { className: "mt-2 text-sm text-gray-600 dark:text-gray-400" },
            React.createElement(
              "span",
              { className: "font-medium text-blue-600 hover:text-blue-500" },
              "Click to upload"
            ),
            " or drag and drop"
          ),
          React.createElement(
            "p",
            { className: "text-xs text-gray-500 dark:text-gray-500" },
            "PNG, JPG, PDF up to 10MB each"
          )
        )
      ),

      filesData.length > 0 &&
        React.createElement(
          "div",
          { className: "mt-4" },
          React.createElement(
            "h4",
            {
              className:
                "text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
            },
            "Selected Files:"
          ),
          filesData.map((f, i) =>
            React.createElement(
              "div",
              {
                key: i,
                className:
                  "flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md",
              },
              React.createElement(
                "div",
                { className: "flex items-center" },
                f.file.type.startsWith("image/")
                  ? React.createElement(Image, {
                      className: "h-4 w-4 text-gray-400 mr-2",
                    })
                  : React.createElement(FileText, {
                      className: "h-4 w-4 text-gray-400 mr-2",
                    }),
                React.createElement(
                  "span",
                  { className: "text-sm text-gray-900 dark:text-gray-100" },
                  f.file.name
                ),
                React.createElement(
                  "span",
                  {
                    className: "text-xs text-gray-500 dark:text-gray-400 ml-2",
                  },
                  `(${(f.file.size / 1024 / 1024).toFixed(2)} MB)`
                )
              ),
              React.createElement(
                "button",
                {
                  type: "button",
                  onClick: () => removeFile(i),
                  className:
                    "text-red-500 hover:text-red-700 transition-colors",
                },
                React.createElement(X, { className: "h-4 w-4" })
              )
            )
          )
        )
    ),

    React.createElement(
      "div",
      { className: "flex justify-end space-x-4 mt-6" },
      React.createElement(
        Button,
        {
          type: "button",
          variant: "secondary",
          onClick: () => window.history.back(),
        },
        "Cancel"
      ),
      React.createElement(
        Button,
        { type: "submit", loading: isLoading },
        "Save Record"
      )
    )
  );
};

module.exports = { HealthRecordForm, Button, Input, Textarea, Select };
