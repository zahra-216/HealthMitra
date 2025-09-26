// client/src/pages/Auth/Register.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { registerUser } from "@/store/slices/authSlice";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { RegisterData } from "@/types";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(
      /^\+94\d{9}$/,
      "Please enter a valid Sri Lankan phone number (+94XXXXXXXXX)"
    ),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["patient", "doctor", "volunteer"]).optional(),
});

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "patient",
    },
  });

  const onSubmit = (data: RegisterData) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Create your account
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Join HealthMitra and start managing your health records
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            autoComplete="given-name"
            {...register("firstName")}
            error={errors.firstName?.message}
          />
          <Input
            label="Last Name"
            autoComplete="family-name"
            {...register("lastName")}
            error={errors.lastName?.message}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          autoComplete="email"
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+94701234567"
          autoComplete="tel"
          {...register("phone")}
          error={errors.phone?.message}
          helperText="Format: +94XXXXXXXXX"
        />

        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
          error={errors.password?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            I am a
          </label>
          <select {...register("role")} className="input">
            <option value="patient">Patient</option>
            <option value="doctor">Healthcare Provider</option>
            <option value="volunteer">Community Volunteer</option>
          </select>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={isLoading}
        >
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          className="text-primary-600 hover:text-primary-500"
          to="/auth/login"
        >
          Sign in here
        </Link>
      </p>

      <p className="mt-6 text-xs text-gray-500 text-center">
        By creating an account, you agree to our{" "}
        <a href="#" className="text-primary-600 hover:text-primary-500">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-primary-600 hover:text-primary-500">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};

export default Register;
