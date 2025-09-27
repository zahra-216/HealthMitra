// client/src/pages/Auth/Login.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { loginUser } from "@/store/slices/authSlice";
import Button from "@/components/ui/Button";
const { Input } = require('@/components/ui/FormElements');


const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
      <p className="text-sm text-gray-600 mb-6">
        Sign in to your HealthMitra account
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          autoComplete="email"
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          error={errors.password?.message}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={isLoading}
        >
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link className="text-primary-600 hover:text-primary-500" to="/auth/register">
          Create one here
        </Link>
      </p>

      <div className="mt-8 p-4 bg-gray-50 rounded-md text-xs text-gray-500">
        <p className="mb-2">Demo Credentials:</p>
        <p>
          <strong>Patient:</strong> patient@healthmitra.com / password123
        </p>
        <p>
          <strong>Doctor:</strong> doctor@healthmitra.com / password123
        </p>
      </div>
    </div>
  );
};

export default Login;
