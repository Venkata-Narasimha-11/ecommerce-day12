import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Sparkles,
  Layers,
  Palette,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  ChevronRight,
  Eye,
  Trash2,
  Plus,
  RefreshCw,
  Sliders,
  Shield,
  Keyboard,
  Moon,
  Sun,
  Laptop,
  Check,
  Code2,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  Send,
  HelpCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "../components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../components/ui/form";
import { ImageDropzone } from "../components/ui/image-dropzone";
import { toast } from "../components/ui/sonner";
import { useTheme } from "../context/ThemeContext";

// -------------------------------------------------------------
// Schema for Tab 2: React Forms & Zod Playground
// -------------------------------------------------------------
const labUserSchema = z
  .object({
    displayName: z
      .string()
      .min(3, "Display name must be at least 3 characters")
      .max(40, "Display name cannot exceed 40 characters"),
    email: z
      .string()
      .min(1, "Email address is required")
      .email("Must be a valid email format (e.g. name@example.com)"),
    age: z.coerce
      .number({ invalid_type_error: "Age must be a number" })
      .int("Age must be a whole number")
      .min(18, "You must be at least 18 years old")
      .max(120, "Age cannot exceed 120"),
    websiteUrl: z
      .string()
      .url("Must be a valid URL starting with http:// or https://")
      .optional()
      .or(z.literal("")),
    accountType: z.enum(["individual", "business", "enterprise"], {
      errorMap: () => ({ message: "Select an account tier" }),
    }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    termsAgreed: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// -------------------------------------------------------------
// Schema for Tab 3: Dynamic Forms (useFieldArray)
// -------------------------------------------------------------
const dynamicInvoiceSchema = z.object({
  invoiceTitle: z.string().min(3, "Title must be at least 3 characters"),
  clientName: z.string().min(2, "Client name required"),
  lineItems: z
    .array(
      z.object({
        description: z.string().min(2, "Item description required"),
        quantity: z.coerce.number().int().min(1, "Qty >= 1"),
        unitPrice: z.coerce.number().positive("Price > 0"),
      })
    )
    .min(1, "At least one line item is required")
    .max(10, "Maximum 10 items allowed"),
});

// -------------------------------------------------------------
// Schema for Tab 4: Multi-Step Interactive Wizard
// -------------------------------------------------------------
const wizardStep1Schema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 chars"),
  lastName: z.string().min(2, "Last name must be at least 2 chars"),
  organization: z.string().optional(),
});

const wizardStep2Schema = z.object({
  projectType: z.enum(["web", "mobile", "backend", "ai"], {
    errorMap: () => ({ message: "Choose project classification" }),
  }),
  budgetRange: z.enum(["low", "medium", "high"], {
    errorMap: () => ({ message: "Select budget range" }),
  }),
  timelineWeeks: z.coerce.number().int().min(1, "Min 1 week").max(52, "Max 52 weeks"),
});

export const Day12LabPage = () => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("shadcn");

  // Tab 1 States (Shadcn Gallery)
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isDemoDialogOpen, setIsDemoDialogOpen] = useState(false);

  // Tab 2 States (React Hook Form + Zod Playground)
  const [submittedUserData, setSubmittedUserData] = useState(null);
  const userForm = useForm({
    resolver: zodResolver(labUserSchema),
    defaultValues: {
      displayName: "Jane Developer",
      email: "jane.dev@example.com",
      age: 24,
      websiteUrl: "https://janedev.io",
      accountType: "individual",
      password: "Password123",
      confirmPassword: "Password123",
      termsAgreed: true,
    },
    mode: "onTouched",
  });

  const onUserFormSubmit = (data) => {
    setSubmittedUserData(data);
    toast.success("Zod Schema Passed!", {
      description: "Client-side validation verified all fields successfully.",
    });
  };

  // Tab 3 States (Dynamic useFieldArray Form)
  const [submittedInvoice, setSubmittedInvoice] = useState(null);
  const invoiceForm = useForm({
    resolver: zodResolver(dynamicInvoiceSchema),
    defaultValues: {
      invoiceTitle: "Quarterly Frontend Consulting",
      clientName: "Acme Cloud Solutions",
      lineItems: [
        { description: "Tailwind CSS & Shadcn Design System", quantity: 1, unitPrice: 1200 },
        { description: "React Hook Form & Zod Architecture", quantity: 2, unitPrice: 850 },
      ],
    },
    mode: "onTouched",
  });

  const {
    fields: invoiceFields,
    append: appendInvoiceItem,
    remove: removeInvoiceItem,
  } = useFieldArray({
    control: invoiceForm.control,
    name: "lineItems",
  });

  const watchedLineItems = invoiceForm.watch("lineItems") || [];
  const invoiceTotal = watchedLineItems.reduce((acc, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    return acc + qty * price;
  }, 0);

  const onInvoiceSubmit = (data) => {
    setSubmittedInvoice(data);
    toast.success("Dynamic Form Validated!", {
      description: `Invoice saved with ${data.lineItems.length} items totaling $${invoiceTotal.toFixed(2)}`,
    });
  };

  // Tab 4 States (Multi-Step Form)
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    firstName: "Michael",
    lastName: "Chen",
    organization: "NexGen Labs",
    projectType: "web",
    budgetRange: "medium",
    timelineWeeks: 8,
  });

  const step1Form = useForm({
    resolver: zodResolver(wizardStep1Schema),
    defaultValues: {
      firstName: wizardData.firstName,
      lastName: wizardData.lastName,
      organization: wizardData.organization,
    },
    mode: "onTouched",
  });

  const step2Form = useForm({
    resolver: zodResolver(wizardStep2Schema),
    defaultValues: {
      projectType: wizardData.projectType,
      budgetRange: wizardData.budgetRange,
      timelineWeeks: wizardData.timelineWeeks,
    },
    mode: "onTouched",
  });

  const handleStep1Next = (values) => {
    setWizardData((prev) => ({ ...prev, ...values }));
    setWizardStep(2);
    toast.info("Step 1 Validated");
  };

  const handleStep2Next = (values) => {
    setWizardData((prev) => ({ ...prev, ...values }));
    setWizardStep(3);
    toast.info("Step 2 Validated");
  };

  const handleWizardFinalSubmit = () => {
    toast.success("Multi-Step Wizard Completed! 🚀", {
      description: `Project for ${wizardData.firstName} (${wizardData.projectType}) confirmed!`,
    });
  };

  // Tab 5 States (Image Dropzone)
  const [dropzoneFile, setDropzoneFile] = useState(null);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-secondary/10 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/40 text-primary gap-1">
                <Sparkles className="h-3.5 w-3.5" /> Day 12 Mastery Lab
              </Badge>
              <Badge variant="secondary">Production Grade</Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Tailwind CSS, Shadcn/ui & Zod Form Engine
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Comprehensive interactive sandbox verifying utility styling, responsive breakpoints,
              Shadcn primitives, Zod schema validation, dynamic fields, multi-step wizards, file
              dropzones, and accessibility standards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
                toast.info(`Switched to ${theme === "dark" ? "Light" : "Dark"} mode`);
              }}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span>Toggle {theme === "dark" ? "Light" : "Dark"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto p-1.5 gap-1 max-w-full">
          <TabsTrigger value="shadcn" className="text-xs py-2">
            <Palette className="h-3.5 w-3.5 mr-1.5" /> Shadcn/ui
          </TabsTrigger>
          <TabsTrigger value="forms-zod" className="text-xs py-2">
            <Shield className="h-3.5 w-3.5 mr-1.5" /> Forms & Zod
          </TabsTrigger>
          <TabsTrigger value="dynamic" className="text-xs py-2">
            <Sliders className="h-3.5 w-3.5 mr-1.5" /> Dynamic Fields
          </TabsTrigger>
          <TabsTrigger value="multistep" className="text-xs py-2">
            <Layers className="h-3.5 w-3.5 mr-1.5" /> Multi-Step
          </TabsTrigger>
          <TabsTrigger value="dropzone" className="text-xs py-2">
            <UploadCloud className="h-3.5 w-3.5 mr-1.5" /> File Uploads
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="text-xs py-2">
            <Keyboard className="h-3.5 w-3.5 mr-1.5" /> A11y & Dark Mode
          </TabsTrigger>
        </TabsList>

        {/* ============================================================= */}
        {/* TAB 1: SHADCN/UI COMPONENT SUITE */}
        {/* ============================================================= */}
        <TabsContent value="shadcn" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Button Component Matrix */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Button Component (Variants & States)</span>
                  <Badge variant="outline">Shadcn / CVA</Badge>
                </CardTitle>
                <CardDescription>
                  Supports default, destructive, outline, secondary, ghost, link, and loading states
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="success">Success</Button>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon" variant="outline">
                    <Sparkles className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    isLoading={buttonLoading}
                    onClick={() => {
                      setButtonLoading(true);
                      setTimeout(() => setButtonLoading(false), 2000);
                    }}
                  >
                    {buttonLoading ? "Loading..." : "Test Spinner"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Dialog & DropdownMenu Components */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Dialog & Dropdown Components</span>
                  <Badge variant="outline">Radix Primitives</Badge>
                </CardTitle>
                <CardDescription>
                  Accessible modal dialog with focus trapping and dropdown action menu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  {/* Dialog Trigger */}
                  <Dialog open={isDemoDialogOpen} onOpenChange={setIsDemoDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Layers className="h-4 w-4 mr-2 text-primary" /> Open Shadcn Dialog
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Accessible Shadcn Dialog Modal</DialogTitle>
                        <DialogDescription>
                          This modal implements WAI-ARIA dialog specifications: keyboard focus trap,
                          backdrop blur, Escape key dismissal, and screen reader announcements.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="rounded-lg border p-4 bg-muted/30 text-xs space-y-2">
                        <p className="font-semibold text-foreground">Accessibility Highlights:</p>
                        <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                          <li>Focus is automatically captured upon open.</li>
                          <li>Pressing `Escape` closes the dialog safely.</li>
                          <li>Tabbing cycles strictly within modal boundaries.</li>
                        </ul>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDemoDialogOpen(false)}>
                          Dismiss
                        </Button>
                        <Button
                          onClick={() => {
                            toast.success("Dialog action executed!");
                            setIsDemoDialogOpen(false);
                          }}
                        >
                          Confirm Action
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* DropdownMenu Trigger */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary">
                        Dropdown Actions <ChevronRight className="h-4 w-4 ml-1.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      <DropdownMenuLabel className="text-xs">Quick Operations</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => toast.info("Profile clicked")}>
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.info("Settings clicked")}>
                        System Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.success("Export successful")}>
                        Export Data
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => toast.error("Action cancelled")}
                      >
                        Cancel Operation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Toast Notification Triggers */}
                <div className="pt-2 border-t space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground block">
                    Sonner Toast Notification System:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 text-xs"
                      onClick={() => toast.success("Operation completed successfully!")}
                    >
                      Success Toast
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-destructive/30 text-destructive hover:bg-destructive/10 text-xs"
                      onClick={() => toast.error("An error occurred during submission")}
                    >
                      Error Toast
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-amber-500/30 text-amber-600 hover:bg-amber-500/10 text-xs"
                      onClick={() => toast.warning("Session will expire in 5 minutes")}
                    >
                      Warning Toast
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() =>
                        toast("Message archived", {
                          action: {
                            label: "Undo",
                            onClick: () => toast.info("Action undone!"),
                          },
                        })
                      }
                    >
                      Action Toast
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table Component */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Shadcn Table Component</span>
                <Badge variant="secondary">WAI-ARIA Table</Badge>
              </CardTitle>
              <CardDescription>
                Responsive, accessible data display with headers, cells, captions, and badges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>A list of recent system microservices & health statuses.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Port / Protocol</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Latency</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "FastAPI REST Server", proto: ":8000 (HTTP)", status: "Active", latency: "14ms", variant: "success" },
                    { name: "Redis Cache Engine", proto: ":6379 (In-Memory)", status: "Connected", latency: "2ms", variant: "success" },
                    { name: "Celery Worker Hub", proto: "Solo Pool", status: "Idle", latency: "0ms", variant: "secondary" },
                    { name: "WebSocket Gateway", proto: "/ws/orders", status: "Listening", latency: "5ms", variant: "info" },
                  ].map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-semibold text-xs">{row.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{row.proto}</TableCell>
                      <TableCell>
                        <Badge variant={row.variant} className="text-xs">
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{row.latency}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => toast.info(`Inspecting ${row.name}`)}
                        >
                          Inspect
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================= */}
        {/* TAB 2: REACT HOOK FORM & ZOD VALIDATION */}
        {/* ============================================================= */}
        <TabsContent value="forms-zod" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* The Form (2 cols) */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>Client-Side Zod Validation Engine</span>
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      react-hook-form + zod
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Real-time error feedback, email regex, positive age bounds, password complexity & match refinement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...userForm}>
                    <form
                      onSubmit={userForm.handleSubmit(onUserFormSubmit)}
                      className="space-y-4"
                      noValidate
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={userForm.control}
                          name="displayName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>Display Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Jane Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={userForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="jane@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField
                          control={userForm.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>Age (Min 18)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="24" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={userForm.control}
                          name="accountType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>Account Tier</FormLabel>
                              <FormControl>
                                <select
                                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                  {...field}
                                >
                                  <option value="individual">Individual</option>
                                  <option value="business">Business</option>
                                  <option value="enterprise">Enterprise</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={userForm.control}
                          name="websiteUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Portfolio URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://janedev.io" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={userForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>Password (Uppercase + Digit)</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={userForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>Confirm Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={userForm.control}
                        name="termsAgreed"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-0.5"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-xs font-medium cursor-pointer">
                                I agree to the validation terms & Zod runtime contract
                              </FormLabel>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center justify-between pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            userForm.reset();
                            setSubmittedUserData(null);
                            toast.info("Form reset to defaults");
                          }}
                        >
                          <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset Form
                        </Button>
                        <Button type="submit" size="sm">
                          <Send className="h-3.5 w-3.5 mr-1.5" /> Validate & Submit
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Form State & Output Inspector (1 col) */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xs uppercase font-bold text-muted-foreground flex items-center justify-between">
                    <span>Live Form State</span>
                    <Badge variant={userForm.formState.isValid ? "success" : "warning"} className="text-[10px]">
                      {userForm.formState.isValid ? "VALID" : "INVALID"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-muted-foreground">isDirty:</span>
                    <span className={userForm.formState.isDirty ? "text-primary font-bold" : "text-muted-foreground"}>
                      {String(userForm.formState.isDirty)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-muted-foreground">isSubmitting:</span>
                    <span className="text-muted-foreground">{String(userForm.formState.isSubmitting)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-muted-foreground">Error Count:</span>
                    <span className={Object.keys(userForm.formState.errors).length > 0 ? "text-destructive font-bold" : "text-emerald-500"}>
                      {Object.keys(userForm.formState.errors).length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs uppercase font-bold text-muted-foreground flex items-center gap-1.5">
                    <Code2 className="h-3.5 w-3.5 text-primary" /> Validated JSON Output
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="rounded bg-muted/60 p-3 text-[11px] font-mono overflow-x-auto text-foreground max-h-60">
                    {submittedUserData
                      ? JSON.stringify(submittedUserData, null, 2)
                      : "// Click 'Validate & Submit' to inspect validated JSON"}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ============================================================= */}
        {/* TAB 3: DYNAMIC FORMS (useFieldArray) */}
        {/* ============================================================= */}
        <TabsContent value="dynamic" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sliders className="h-5 w-5 text-primary" /> Dynamic Form Fields with `useFieldArray`
                  </CardTitle>
                  <CardDescription>
                    Add, edit, remove, and validate unbounded list items dynamically with real-time calculations
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() =>
                    appendInvoiceItem({ description: "New Item Service", quantity: 1, unitPrice: 100 })
                  }
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Line Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...invoiceForm}>
                <form onSubmit={invoiceForm.handleSubmit(onInvoiceSubmit)} className="space-y-6" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={invoiceForm.control}
                      name="invoiceTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Invoice / Project Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Consulting Services" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={invoiceForm.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Client Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Corp" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Dynamic Line Items Section */}
                  <div className="space-y-3 border rounded-xl p-4 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-foreground">
                        Line Items ({invoiceFields.length})
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        Calculated Total:{" "}
                        <strong className="text-primary text-sm">${invoiceTotal.toFixed(2)}</strong>
                      </span>
                    </div>

                    <div className="space-y-2">
                      {invoiceFields.map((fieldItem, index) => (
                        <div
                          key={fieldItem.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2.5 rounded-lg border bg-card"
                        >
                          <div className="flex-1 w-full">
                            <FormField
                              control={invoiceForm.control}
                              name={`lineItems.${index}.description`}
                              render={({ field }) => (
                                <FormItem className="space-y-0">
                                  <FormControl>
                                    <Input placeholder="Service / Item Description" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="w-full sm:w-28">
                            <FormField
                              control={invoiceForm.control}
                              name={`lineItems.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem className="space-y-0">
                                  <FormControl>
                                    <Input type="number" min="1" placeholder="Qty" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="w-full sm:w-36">
                            <FormField
                              control={invoiceForm.control}
                              name={`lineItems.${index}.unitPrice`}
                              render={({ field }) => (
                                <FormItem className="space-y-0">
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="Price ($)"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-destructive hover:bg-destructive/10 shrink-0 self-end sm:self-auto"
                            disabled={invoiceFields.length <= 1}
                            onClick={() => removeInvoiceItem(index)}
                            title="Delete item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit">
                      <FileCheck className="h-4 w-4 mr-2" /> Save & Calculate Dynamic Invoice
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================= */}
        {/* TAB 4: MULTI-STEP FORM WORKFLOW */}
        {/* ============================================================= */}
        <TabsContent value="multistep" className="space-y-6 pt-4">
          <Card className="max-w-3xl mx-auto">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" /> Multi-Step Client Workflow
                  </CardTitle>
                  <CardDescription>
                    Structured form steps with independent validation gates and persistent data
                  </CardDescription>
                </div>
                <Badge variant="outline">Step {wizardStep} / 3</Badge>
              </div>

              {/* Progress step bar */}
              <div className="grid grid-cols-3 gap-2 pt-4">
                {[
                  { n: 1, label: "1. Identity" },
                  { n: 2, label: "2. Scope & Budget" },
                  { n: 3, label: "3. Confirmation" },
                ].map((s) => (
                  <div
                    key={s.n}
                    className={`p-2 rounded border text-center text-xs font-semibold transition-colors ${
                      wizardStep === s.n
                        ? "border-primary bg-primary/10 text-primary"
                        : wizardStep > s.n
                        ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </div>
                ))}
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              {/* STEP 1 */}
              {wizardStep === 1 && (
                <Form {...step1Form}>
                  <form onSubmit={step1Form.handleSubmit(handleStep1Next)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={step1Form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Michael" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={step1Form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Chen" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={step1Form.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Labs (Optional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end pt-4">
                      <Button type="submit">
                        Continue to Step 2 <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {/* STEP 2 */}
              {wizardStep === 2 && (
                <Form {...step2Form}>
                  <form onSubmit={step2Form.handleSubmit(handleStep2Next)} className="space-y-4">
                    <FormField
                      control={step2Form.control}
                      name="projectType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Project Classification</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              {...field}
                            >
                              <option value="web">Fullstack Web App (FastAPI + React)</option>
                              <option value="mobile">Mobile Application</option>
                              <option value="backend">Distributed Backend Hub</option>
                              <option value="ai">AI Agent & LLM Workflow</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={step2Form.control}
                        name="budgetRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Budget Allocation</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                {...field}
                              >
                                <option value="low">Startup Tier ($2,000 - $5,000)</option>
                                <option value="medium">Growth Tier ($5,000 - $15,000)</option>
                                <option value="high">Enterprise ($15,000+)</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={step2Form.control}
                        name="timelineWeeks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Target Timeline (Weeks)</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" max="52" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <Button type="button" variant="outline" onClick={() => setWizardStep(1)}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Step 1
                      </Button>
                      <Button type="submit">
                        Continue to Step 3 <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {/* STEP 3 */}
              {wizardStep === 3 && (
                <div className="space-y-6">
                  <div className="rounded-lg border p-4 bg-muted/20 space-y-3 text-xs">
                    <span className="font-bold text-foreground block">Submission Review:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground">Client:</span>
                        <p className="font-semibold text-foreground">
                          {wizardData.firstName} {wizardData.lastName}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Organization:</span>
                        <p className="font-semibold text-foreground">
                          {wizardData.organization || "Independent"}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Classification:</span>
                        <p className="font-semibold text-primary uppercase">{wizardData.projectType}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Timeline:</span>
                        <p className="font-semibold text-foreground">{wizardData.timelineWeeks} Weeks</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Button variant="outline" onClick={() => setWizardStep(2)}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Step 2
                    </Button>
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={handleWizardFinalSubmit}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Complete & Finish
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================= */}
        {/* TAB 5: FILE UPLOADS & PREVIEW (react-dropzone) */}
        {/* ============================================================= */}
        <TabsContent value="dropzone" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Interactive `react-dropzone` Sandbox</span>
                  <Badge variant="outline">WebP / PNG / JPG</Badge>
                </CardTitle>
                <CardDescription>
                  Drag and drop files with visual drop states, size bounds, and instant Object URL preview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageDropzone
                  value={dropzoneFile}
                  onFileSelect={(file) => setDropzoneFile(file)}
                  maxSize={5 * 1024 * 1024}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Inspection & Backend Architecture</span>
                  <Badge variant="secondary">Day 10/12 Bridge</Badge>
                </CardTitle>
                <CardDescription>
                  How frontend file dropzones hand off bytes to FastAPI Pillow services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-muted-foreground">
                <div className="rounded-lg border p-3 bg-muted/30 space-y-2">
                  <span className="font-semibold text-foreground block">
                    Frontend Dropzone Flow:
                  </span>
                  <p>1. User drops image or clicks to select file.</p>
                  <p>2. `react-dropzone` validates MIME types & 5MB file size limit.</p>
                  <p>3. `URL.createObjectURL(file)` generates zero-latency live preview.</p>
                  <p>4. Wrapped inside `FormData.append('file', file)` for multipart POST.</p>
                </div>

                <div className="rounded-lg border p-3 bg-muted/30 space-y-2">
                  <span className="font-semibold text-foreground block">
                    Backend Pillow Integration:
                  </span>
                  <p>• Day 10 FastAPI router receives `UploadFile`.</p>
                  <p>• Pillow inspects magic bytes for malware protection.</p>
                  <p>• Aspect-ratio preserved resizing (LANCZOS) produces WebP thumbnails.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============================================================= */}
        {/* TAB 6: FORM ACCESSIBILITY (A11y) & DARK MODE */}
        {/* ============================================================= */}
        <TabsContent value="accessibility" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Keyboard className="h-5 w-5 text-primary" /> Accessibility (A11y) Compliance
                </CardTitle>
                <CardDescription>
                  WAI-ARIA form standards implemented across all FastStore inputs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Accessible Labels:</strong> Every input is
                      linked via explicit `htmlFor` and unique `id` pairs.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">aria-invalid:</strong> Automatically set
                      to `true` when Zod or React Hook Form flags an input error.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">aria-describedby:</strong> Connects inputs
                      to helper descriptions and error messages for screen readers.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">role="alert":</strong> Error paragraphs
                      announce instantly to assistive technologies when triggered.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Keyboard Traversal:</strong> High-contrast
                      `focus-visible:ring-2` focus rings ensure clear visual navigation.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" /> Dark Mode & Responsive Breakpoints
                </CardTitle>
                <CardDescription>
                  Utility-first responsive layouts with persistent CSS class strategy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="rounded-lg border p-4 bg-muted/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Current Active Theme:</span>
                    <Badge variant="outline" className="capitalize">
                      {theme}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={theme === "light" ? "default" : "outline"}
                      onClick={() => setTheme("light")}
                      className="flex-1"
                    >
                      <Sun className="h-3.5 w-3.5 mr-1" /> Light
                    </Button>
                    <Button
                      size="sm"
                      variant={theme === "dark" ? "default" : "outline"}
                      onClick={() => setTheme("dark")}
                      className="flex-1"
                    >
                      <Moon className="h-3.5 w-3.5 mr-1" /> Dark
                    </Button>
                    <Button
                      size="sm"
                      variant={theme === "system" ? "default" : "outline"}
                      onClick={() => setTheme("system")}
                      className="flex-1"
                    >
                      <Laptop className="h-3.5 w-3.5 mr-1" /> System
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-3 bg-muted/30 space-y-1.5 font-mono text-[11px]">
                  <p className="font-bold text-foreground">Tailwind Breakpoint Matrix:</p>
                  <p>• Mobile (&lt; 640px): 1-column layouts, touch-friendly touch targets</p>
                  <p>• sm (&gt;= 640px): 2-column forms & product grids</p>
                  <p>• md (&gt;= 768px): Full navigation bar & side-by-side forms</p>
                  <p>• lg (&gt;= 1024px): 3-column checkout & 4-column storefront catalog</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Day12LabPage;
