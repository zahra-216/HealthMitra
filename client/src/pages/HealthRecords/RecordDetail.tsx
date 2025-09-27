// client/src/pages/HealthRecords/RecordDetail.tsx
import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Share2,
  Download,
  Calendar,
  FileText,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  fetchHealthRecord,
  deleteHealthRecord,
} from "@/store/slices/healthSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Alert from "@/components/ui/Alert";
import { formatDate } from "@/utils/formatters";
import { FileItem } from "@/types";

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const RecordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentRecord, isLoading } = useAppSelector((state) => state.health);

  useEffect(() => {
    if (id) {
      dispatch(fetchHealthRecord(id));
    }
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (
      currentRecord &&
      window.confirm(
        "Are you sure you want to delete this health record? This action cannot be undone."
      )
    ) {
      try {
        await dispatch(deleteHealthRecord(currentRecord._id)).unwrap();
        navigate("/health-records");
      } catch (error) {
        console.error("Failed to delete record:", error);
      }
    }
  };

  const handleShare = () => {
    if (currentRecord) {
      console.log("Sharing record:", currentRecord._id);
    }
  };

  const handleEdit = () => {
    if (currentRecord) {
      navigate(`/health-records/${currentRecord._id}/edit`);
    }
  };

  const getRecordTypeColor = (
    type: string
  ): "primary" | "success" | "warning" | "danger" | "default" => {
    const colors: Record<
      string,
      "primary" | "success" | "warning" | "danger" | "default"
    > = {
      prescription: "primary",
      lab_report: "success",
      scan: "warning",
      visit_note: "default",
      vital_signs: "danger",
    };
    return colors[type] || "default";
  };

  const getRecordTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      prescription: "Prescription",
      lab_report: "Lab Report",
      scan: "Medical Scan",
      visit_note: "Visit Note",
      vital_signs: "Vital Signs",
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading health record..." />
      </div>
    );
  }

  if (!currentRecord) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Record not found
        </h3>
        <p className="text-gray-600 mb-4">
          The health record you're looking for doesn't exist or has been
          deleted.
        </p>
        <Link to="/health-records">
          <Button variant="primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Records
          </Button>
        </Link>
      </div>
    );
  }

  // FIX: Safely retrieve the files array, defaulting to an empty array
  const filesToDisplay: FileItem[] = (currentRecord.files as FileItem[]) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/health-records">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Records
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentRecord.title}
            </h1>
            <div className="flex items-center space-x-4 mt-1">
              <Badge variant={getRecordTypeColor(currentRecord.type || "")}>
                {getRecordTypeLabel(currentRecord.type || "")}
              </Badge>
              <span className="text-sm text-gray-500 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(currentRecord.recordDate)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {currentRecord.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {currentRecord.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Files */}
          {filesToDisplay.length > 0 && ( // <-- Check the length of the safe array
            <Card>
              <CardHeader>
                <CardTitle>Attached Files ({filesToDisplay.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filesToDisplay.map((file: FileItem, index: number) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        {file.mimeType.startsWith("image/") ? (
                          <img
                            src={file.url}
                            alt={file.originalName}
                            className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80"
                            onClick={() => window.open(file.url, "_blank")}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <FileText className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {file.originalName}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatFileSize(file.size)} • {file.mimeType}
                          </p>
                          {file.ocrText && (
                            <p className="text-xs text-blue-600 mt-1">
                              ✓ Text extracted
                            </p>
                          )}
                          <div className="mt-2 flex space-x-2">
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs text-primary-600 hover:text-primary-500"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </a>
                            {file.mimeType.startsWith("image/") && (
                              <button
                                onClick={() => window.open(file.url, "_blank")}
                                className="text-xs text-gray-600 hover:text-gray-500"
                              >
                                View Full Size
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {file.ocrText && (
                        <div className="mt-3 pt-3 border-t">
                          <h5 className="text-xs font-medium text-gray-900 mb-2">
                            Extracted Text:
                          </h5>
                          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                            <pre className="whitespace-pre-wrap font-mono">
                              {file.ocrText}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar (future content) */}
        <div className="lg:col-span-1">{/* Reserved */}</div>
      </div>

      {/* Medical Disclaimer */}
      <Alert variant="warning">
        <strong>Medical Disclaimer:</strong> This health record is for
        informational purposes only and should not replace professional medical
        advice. Always consult with qualified healthcare providers for medical
        decisions and treatment plans.
      </Alert>
    </div>
  );
};

export default RecordDetail;
