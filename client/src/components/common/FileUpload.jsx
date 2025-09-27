// client/src/components/common/FileUpload.jsx
const React = require("react");
const { useRef, useState } = React;
const { Upload, X, FileText, Image } = require("lucide-react");
const Button = require("../ui/Button");

const FileUpload = ({
  onFileSelect,
  accept = "image/*,.pdf",
  multiple = true,
  maxSize = 10,
  className = ""
}) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files) => {
    if (!files) return;

    const validFiles = Array.from(files).filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const dt = new DataTransfer();
      validFiles.forEach(file => dt.items.add(file));
      onFileSelect(dt.files);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  return React.createElement(
    "div",
    { className },
    React.createElement(
      "div",
      {
        className: `border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? "border-primary-500 bg-primary-50" : "border-gray-300 hover:border-gray-400"
        }`,
        onDragEnter: handleDrag,
        onDragLeave: handleDrag,
        onDragOver: handleDrag,
        onDrop: handleDrop
      },
      React.createElement("input", {
        ref: fileInputRef,
        type: "file",
        multiple,
        accept,
        onChange: (e) => handleFiles(e.target.files),
        className: "hidden"
      }),
      React.createElement(Upload, { className: "mx-auto h-12 w-12 text-gray-400" }),
      React.createElement(
        "p",
        { className: "mt-2 text-sm text-gray-600" },
        React.createElement(
          "button",
          {
            type: "button",
            onClick: () => fileInputRef.current?.click(),
            className: "font-medium text-primary-600 hover:text-primary-500"
          },
          "Click to upload"
        ),
        " or drag and drop"
      ),
      React.createElement(
        "p",
        { className: "text-xs text-gray-500" },
        `PNG, JPG, PDF up to ${maxSize}MB each`
      )
    )
  );
};

module.exports = FileUpload;
