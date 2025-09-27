// client/src/components/forms/VitalSignsForm.js
const React = require("react");
const { useForm } = require("react-hook-form");
const { zodResolver } = require("@hookform/resolvers/zod");
const { z } = require("zod");
const Button = require("../ui/Button");
const { Input } = require("../ui/FormElements");
const { Card, CardContent, CardHeader, CardTitle } = require("../ui/Card");

// =================================================================
// Zod Schema
// =================================================================
const vitalSignsSchema = z.object({
  bloodPressure: z
    .object({
      systolic: z.number().min(50, "Min 50").max(300, "Max 300").optional(),
      diastolic: z.number().min(30, "Min 30").max(200, "Max 200").optional(),
    })
    .optional(),
  heartRate: z.number().min(30, "Min 30").max(220, "Max 220").optional(),
  temperature: z.number().min(30, "Min 30").max(50, "Max 50").optional(),
  weight: z.number().min(1, "Min 1").max(500, "Max 500").optional(),
  height: z.number().min(30, "Min 30").max(300, "Max 300").optional(),
  bloodSugar: z
    .object({
      fasting: z.number().min(20, "Min 20").max(500, "Max 500").optional(),
      postMeal: z.number().min(20, "Min 20").max(500, "Max 500").optional(),
      random: z.number().min(20, "Min 20").max(500, "Max 500").optional(),
    })
    .optional(),
  cholesterol: z
    .object({
      total: z.number().min(50, "Min 50").max(500, "Max 500").optional(),
      ldl: z.number().min(20, "Min 20").max(300, "Max 300").optional(),
      hdl: z.number().min(10, "Min 10").max(150, "Max 150").optional(),
      triglycerides: z
        .number()
        .min(20, "Min 20")
        .max(1000, "Max 1000")
        .optional(),
    })
    .optional(),
});

// =================================================================
// Component
// =================================================================
const VitalSignsForm = ({ onSubmit, initialData, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(vitalSignsSchema),
    defaultValues: initialData || {},
  });

  const weight = watch("weight");
  const height = watch("height");

  const bmi =
    weight !== undefined && height !== undefined && height > 0
      ? (weight / Math.pow(height / 100, 2)).toFixed(1)
      : null;

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return React.createElement(
    "form",
    { onSubmit: handleSubmit(handleFormSubmit), className: "space-y-6" },
    // Blood Pressure
    React.createElement(
      Card,
      null,
      React.createElement(
        CardHeader,
        null,
        React.createElement(CardTitle, null, "Blood Pressure")
      ),
      React.createElement(
        CardContent,
        null,
        React.createElement(
          "div",
          { className: "grid grid-cols-2 gap-4" },
          React.createElement(Input, {
            label: "Systolic (mmHg)",
            type: "number",
            placeholder: "120",
            ...register("bloodPressure.systolic", { valueAsNumber: true }),
            error: errors.bloodPressure?.systolic?.message,
          }),
          React.createElement(Input, {
            label: "Diastolic (mmHg)",
            type: "number",
            placeholder: "80",
            ...register("bloodPressure.diastolic", { valueAsNumber: true }),
            error: errors.bloodPressure?.diastolic?.message,
          })
        )
      )
    ),

    // Basic Vitals
    React.createElement(
      Card,
      null,
      React.createElement(
        CardHeader,
        null,
        React.createElement(CardTitle, null, "Basic Vitals")
      ),
      React.createElement(
        CardContent,
        null,
        React.createElement(
          "div",
          { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
          React.createElement(Input, {
            label: "Heart Rate (BPM)",
            type: "number",
            placeholder: "72",
            ...register("heartRate", { valueAsNumber: true }),
            error: errors.heartRate?.message,
          }),
          React.createElement(Input, {
            label: "Temperature (°C)",
            type: "number",
            step: "0.1",
            placeholder: "36.5",
            ...register("temperature", { valueAsNumber: true }),
            error: errors.temperature?.message,
          }),
          React.createElement(Input, {
            label: "Weight (kg)",
            type: "number",
            placeholder: "70",
            ...register("weight", { valueAsNumber: true }),
            error: errors.weight?.message,
          }),
          React.createElement(Input, {
            label: "Height (cm)",
            type: "number",
            placeholder: "175",
            ...register("height", { valueAsNumber: true }),
            error: errors.height?.message,
          }),
          bmi &&
            React.createElement(
              "div",
              {
                className:
                  "md:col-span-2 text-sm text-gray-600 dark:text-gray-400 mt-2",
              },
              "Your calculated BMI: ",
              React.createElement(
                "span",
                { className: "font-bold text-lg text-primary" },
                bmi
              )
            )
        )
      )
    ),

    // Blood Sugar
    React.createElement(
      Card,
      null,
      React.createElement(
        CardHeader,
        null,
        React.createElement(CardTitle, null, "Blood Sugar (mg/dL)")
      ),
      React.createElement(
        CardContent,
        null,
        React.createElement(
          "div",
          { className: "grid grid-cols-1 md:grid-cols-3 gap-4" },
          React.createElement(Input, {
            label: "Fasting",
            type: "number",
            placeholder: "90",
            ...register("bloodSugar.fasting", { valueAsNumber: true }),
            error: errors.bloodSugar?.fasting?.message,
          }),
          React.createElement(Input, {
            label: "Post-Meal",
            type: "number",
            placeholder: "140",
            ...register("bloodSugar.postMeal", { valueAsNumber: true }),
            error: errors.bloodSugar?.postMeal?.message,
          }),
          React.createElement(Input, {
            label: "Random",
            type: "number",
            placeholder: "120",
            ...register("bloodSugar.random", { valueAsNumber: true }),
            error: errors.bloodSugar?.random?.message,
          })
        )
      )
    ),

    // Cholesterol
    React.createElement(
      Card,
      null,
      React.createElement(
        CardHeader,
        null,
        React.createElement(CardTitle, null, "Cholesterol (mg/dL)")
      ),
      React.createElement(
        CardContent,
        null,
        React.createElement(
          "div",
          { className: "grid grid-cols-2 gap-4" },
          React.createElement(Input, {
            label: "Total",
            type: "number",
            placeholder: "200",
            ...register("cholesterol.total", { valueAsNumber: true }),
            error: errors.cholesterol?.total?.message,
          }),
          React.createElement(Input, {
            label: "LDL",
            type: "number",
            placeholder: "100",
            ...register("cholesterol.ldl", { valueAsNumber: true }),
            error: errors.cholesterol?.ldl?.message,
          }),
          React.createElement(Input, {
            label: "HDL",
            type: "number",
            placeholder: "60",
            ...register("cholesterol.hdl", { valueAsNumber: true }),
            error: errors.cholesterol?.hdl?.message,
          }),
          React.createElement(Input, {
            label: "Triglycerides",
            type: "number",
            placeholder: "150",
            ...register("cholesterol.triglycerides", { valueAsNumber: true }),
            error: errors.cholesterol?.triglycerides?.message,
          })
        )
      )
    ),

    React.createElement(
      Button,
      { type: "submit", className: "w-full", disabled: isLoading },
      isLoading ? "Saving..." : "Save Vital Signs"
    )
  );
};

module.exports = VitalSignsForm;
