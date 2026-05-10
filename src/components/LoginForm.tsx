import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../lib/validations";
import { FormField } from "./FormFieldRHF";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  loading,
}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: email,
      password: password,
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setEmail(data.email);
    setPassword(data.password);
    // Crear un evento fake para compatibilidad con handleLogin existente
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    handleLogin(fakeEvent);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Correo electrónico
        </label>
        <input
          {...register("email")}
          id="email"
          type="email"
          placeholder="ejemplo@correo.com"
          className={`w-full h-10 px-4 rounded-lg border bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
            errors.email ? "border-red-500 focus-visible:ring-red-500" : "border-input"
          }`}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Contraseña
        </label>
        <input
          {...register("password")}
          id="password"
          type="password"
          placeholder="••••••••"
          className={`w-full h-10 px-4 rounded-lg border bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
            errors.password ? "border-red-500 focus-visible:ring-red-500" : "border-input"
          }`}
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full h-10 mt-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}