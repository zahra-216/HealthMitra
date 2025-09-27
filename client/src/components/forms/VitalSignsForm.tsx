// client/src/components/forms/VitalSignsForm.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../ui/Button";
import { Input } from "../ui/FormElements";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

// =================================================================
// Zod Schema
// =================================================================
export const vitalSignsSchema = z.object({
  bloodPressure: z.object({
    systolic: z.number().min(50, "Min 50").max(300, "Max 300").optional(),
    diastolic: z.number().min(30, "Min 30").max(200, "Max 200").optional(),
  }),
  heartRate: z.number().min(30, "Min 30").max(220, "Max 220").optional(),
  temperature: z.number().min(30, "Min 30").max(50, "Max 50").optional(),
  weight: z.number().min(1, "Min 1").max(500, "Max 500").optional(),
  height: z.number().min(30, "Min 30").max(300, "Max 300").optional(),
  bloodSugar: z.object({
    fasting: z.number().min(20, "Min 20").max(500, "Max 500").optional(),
    postMeal: z.number().min(20, "Min 20").max(500, "Max 500").optional(),
    random: z.number().min(20, "Min 20").max(500, "Max 500").optional(),
  }),
  cholesterol: z.object({
    total: z.number().min(50, "Min 50").max(500, "Max 500").optional(),
    ldl: z.number().min(20, "Min 20").max(300, "Max 300").optional(),
    hdl: z.number().min(10, "Min 10").max(150, "Max 150").optional(),
    triglycerides: z
      .number()
      .min(20, "Min 20")
      .max(1000, "Max 1000")
      .optional(),
  }),
});

// TypeScript type inferred from schema
export type VitalSignsFormData = z.infer<typeof vitalSignsSchema>;

// =================================================================
// Component Props
// =================================================================
interface VitalSignsFormProps {
  onSubmit: (data: VitalSignsFormData) => void;
  initialData?: Partial<VitalSignsFormData>;
  isLoading?: boolean;
}

// =================================================================
// Component
// =================================================================
const VitalSignsForm: React.FC<VitalSignsFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<VitalSignsFormData>({
    resolver: zodResolver(vitalSignsSchema),
    defaultValues: initialData || {
      bloodPressure: { systolic: undefined, diastolic: undefined },
      bloodSugar: {
        fasting: undefined,
        postMeal: undefined,
        random: undefined,
      },
      cholesterol: {
        total: undefined,
        ldl: undefined,
        hdl: undefined,
        triglycerides: undefined,
      },
    },
  });

  const weight = watch("weight");
  const height = watch("height");

  const bmi =
    weight !== undefined && height !== undefined && height > 0
      ? (weight / Math.pow(height / 100, 2)).toFixed(1)
      : null;

  const handleFormSubmit: SubmitHandler<VitalSignsFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Blood Pressure */}
      <Card>
        <CardHeader>
          <CardTitle>Blood Pressure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Systolic (mmHg)"
              type="number"
              placeholder="120"
              {...register("bloodPressure.systolic", { valueAsNumber: true })}
              error={errors.bloodPressure?.systolic?.message}
            />
            <Input
              label="Diastolic (mmHg)"
              type="number"
              placeholder="80"
              {...register("bloodPressure.diastolic", { valueAsNumber: true })}
              error={errors.bloodPressure?.diastolic?.message}
            />
          </div>
        </CardContent>
      </Card>

      {/* Basic Vitals */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Vitals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Heart Rate (BPM)"
              type="number"
              placeholder="72"
              {...register("heartRate", { valueAsNumber: true })}
              error={errors.heartRate?.message}
            />
            <Input
              label="Temperature (°C)"
              type="number"
              step={0.1}
              placeholder="36.5"
              {...register("temperature", { valueAsNumber: true })}
              error={errors.temperature?.message}
            />
            <Input
              label="Weight (kg)"
              type="number"
              placeholder="70"
              {...register("weight", { valueAsNumber: true })}
              error={errors.weight?.message}
            />
            <Input
              label="Height (cm)"
              type="number"
              placeholder="175"
              {...register("height", { valueAsNumber: true })}
              error={errors.height?.message}
            />
            {bmi && (
              <div className="md:col-span-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
                Your calculated BMI:{" "}
                <span className="font-bold text-lg text-primary">{bmi}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Blood Sugar */}
      <Card>
        <CardHeader>
          <CardTitle>Blood Sugar (mg/dL)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Fasting"
              type="number"
              placeholder="90"
              {...register("bloodSugar.fasting", { valueAsNumber: true })}
              error={errors.bloodSugar?.fasting?.message}
            />
            <Input
              label="Post-Meal"
              type="number"
              placeholder="140"
              {...register("bloodSugar.postMeal", { valueAsNumber: true })}
              error={errors.bloodSugar?.postMeal?.message}
            />
            <Input
              label="Random"
              type="number"
              placeholder="120"
              {...register("bloodSugar.random", { valueAsNumber: true })}
              error={errors.bloodSugar?.random?.message}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cholesterol */}
      <Card>
        <CardHeader>
          <CardTitle>Cholesterol (mg/dL)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Total"
              type="number"
              placeholder="200"
              {...register("cholesterol.total", { valueAsNumber: true })}
              error={errors.cholesterol?.total?.message}
            />
            <Input
              label="LDL"
              type="number"
              placeholder="100"
              {...register("cholesterol.ldl", { valueAsNumber: true })}
              error={errors.cholesterol?.ldl?.message}
            />
            <Input
              label="HDL"
              type="number"
              placeholder="60"
              {...register("cholesterol.hdl", { valueAsNumber: true })}
              error={errors.cholesterol?.hdl?.message}
            />
            <Input
              label="Triglycerides"
              type="number"
              placeholder="150"
              {...register("cholesterol.triglycerides", {
                valueAsNumber: true,
              })}
              error={errors.cholesterol?.triglycerides?.message}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Vital Signs"}
      </Button>
    </form>
  );
};

export default VitalSignsForm;
