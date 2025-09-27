// client/src/pages/HealthRecords/HealthRecords.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, FileText } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchHealthRecords } from "@/store/slices/healthSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
const { Input } = require('@/components/ui/FormElements');
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Format Date Utility
const formatDateString = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString();
};

const HealthRecords = () => {
  const dispatch = useAppDispatch();
  const { records, isLoading, pagination } = useAppSelector(
    (state) => state.health
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchHealthRecords({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        recordType: selectedType || undefined,
      })
    );
  }, [dispatch, currentPage, searchTerm, selectedType]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    dispatch(
      fetchHealthRecords({
        page: 1,
        search: searchTerm || undefined,
        recordType: selectedType || undefined,
      })
    );
  };

  const getRecordTypeColor = (type) => {
    const colors = {
      VITAL: "danger",
      LAB_RESULT: "success",
      MEDICATION: "primary",
      APPOINTMENT: "warning",
      OTHER: "default",
    };
    return colors[type] || "default";
  };

  const getRecordTypeLabel = (type) => {
    const labels = {
      VITAL: "Vital Signs",
      LAB_RESULT: "Lab Result",
      MEDICATION: "Medication",
      APPOINTMENT: "Appointment",
      OTHER: "Other",
    };
    return labels[type] || type;
  };

  if (isLoading && records.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading health records..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Records</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your medical documents and health history
          </p>
        </div>
        <Link to="/health-records/new">
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Record
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search records by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input min-w-[150px]"
            >
              <option value="">All Types</option>
              <option value="VITAL">Vital Signs</option>
              <option value="LAB_RESULT">Lab Results</option>
              <option value="MEDICATION">Medications</option>
              <option value="APPOINTMENT">Appointments</option>
              <option value="OTHER">Other</option>
            </select>
            <Button type="submit" variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Records Grid */}
      {records.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No health records yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start by adding your first medical record
            </p>
            <Link to="/health-records/new">
              <Button variant="primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Record
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((record) => (
            <Link key={record._id} to={`/health-records/${record._id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant={getRecordTypeColor(record.recordType)}>
                      {getRecordTypeLabel(record.recordType)}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatDateString(record.recordDate)}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{record.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {record.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {record.description}
                    </p>
                  )}

                  {record.fileUrls && record.fileUrls.length > 0 && (
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <FileText className="h-3 w-3 mr-1" />
                      {record.fileUrls.length} file
                      {record.fileUrls.length !== 1 ? "s" : ""}
                    </div>
                  )}

                  {record.tags && record.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {record.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                      {record.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{record.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {pagination.current} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === pagination.pages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default HealthRecords;
