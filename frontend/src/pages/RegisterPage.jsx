import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { registerSchema } from "../schemas/authSchemas";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "../components/ui/sonner";

export const RegisterPage = () => {
  const { register: authRegister, login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      full_name: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values) => {
    setServerError("");
    try {
      await authRegister({
        username: values.username.trim(),
        email: values.email.trim(),
        full_name: values.full_name?.trim() || undefined,
        password: values.password,
      });

      toast.success("Account created!", {
        description: "Logging you in automatically...",
      });

      // Auto login after registration
      await login(values.username.trim(), values.password);
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      const message =
        err.response?.data?.detail || "Registration failed. Please check inputs and try again.";
      setServerError(message);
      toast.error("Registration Failed", {
        description: message,
      });
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-lg shadow-lg border-border/80 bg-card">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserPlus className="h-6 w-6 stroke-[2]" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create an Account
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Join Guntur Store with strict Zod schema validation & client security
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {serverError && (
            <div
              className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive border border-destructive/20 animate-in fade-in-50"
              role="alert"
            >
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. alex_coder"
                          autoComplete="username"
                          autoFocus
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="alex@domain.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Legal Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Alex Morgan (Optional)"
                        autoComplete="name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Used for delivery recipient identification
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Min 8 chars (letters + numbers)"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Repeat password"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-4"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {isSubmitting ? "Registering..." : "Create Account"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 border-t border-border/40 pt-4 text-center text-xs text-muted-foreground">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Sign In Instead
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
