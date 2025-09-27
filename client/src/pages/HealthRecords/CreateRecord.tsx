// client/src/pages/HealthRecords/CreateRecord.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/redux";
import { createHealthRecord } from "@/store/slices/healthSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import HealthRecordForm from "@/components/forms/HealthRecordForm";
import { CreateHealthRecordData } from "@/types";

const CreateRecord: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (data: any) => {
    try {
      // Cast files properly
      const files = data.files as FileList | undefined;

      const payload: CreateHealthRecordData = {
        ...data,
        recordType: data.recordType || "OTHER",
        fileUrls: files ? Array.from(files).map((f) => f.name) : undefined,
      };

      await dispatch(createHealthRecord(payload)).unwrap();
      navigate("/health-records");
    } catch (error) {
      console.error("Failed to create health record:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Health Record</h1>
        <p className="mt-1 text-sm text-gray-600">
          Upload and organize your medical documents
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health Record Information</CardTitle>
        </CardHeader>
        <CardContent>
          <HealthRecordForm onSubmit={handleSubmit} isLoading={false} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRecord;
