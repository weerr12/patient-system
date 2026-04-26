"use client";

import { useEffect, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { generateSessionId } from "@/lib/utils";
import { EMPTY_FORM, GENDER_OPTIONS, LANGUAGE_OPTIONS } from "@/lib/type";
import { cn } from "@/lib/utils";
import {
  patientFormSchema,
  PatientFormSchemaType,
} from "@/lib/validations/patient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="hl-14px-500 text-basic-gray-90">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="hl-12px-400 text-red-500">{error}</p>}
    </div>
  );
}

const inputCls = cn(
  "w-full rounded-lg border border-basic-gray-40 bg-basic-base-white px-3 py-2",
  "hl-14px-400 text-basic-base-black placeholder:text-basic-gray-60",
  "focus:outline-none focus:ring-2 focus:ring-ci-primary focus:border-transparent",
  "transition-colors duration-150",
);

const selectTriggerCls = cn(
  "w-full rounded-lg border border-basic-gray-40 bg-basic-base-white px-3 py-2",
  "text-basic-base-black",
  "focus:outline-none focus:ring-2 focus:ring-ci-primary focus:border-transparent",
  "transition-colors duration-150",
);

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="hl-14px-600 text-basic-gray-80 border-b border-basic-gray-30 pb-2">
      {children}
    </h2>
  );
}

export default function PatientForm() {
  const sessionIdRef = useRef<string>("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    sessionIdRef.current =
      sessionStorage.getItem("patientSessionId") ?? generateSessionId();
    sessionStorage.setItem("patientSessionId", sessionIdRef.current);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormSchemaType>({
    resolver: zodResolver(patientFormSchema),
    mode: "onChange",
    defaultValues: EMPTY_FORM,
  });

  const syncToServer = useCallback(
    (
      data: Partial<PatientFormSchemaType>,
      status: "filling" | "idle" = "filling",
    ) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        try {
          await axios.post("/api/patients", {
            sessionId: sessionIdRef.current,
            status,
            data,
          });
        } catch (error) {
          console.error("Error syncing to server:", error);
        }
      }, 400);
    },
    [],
  );

  useEffect(() => {
    const subscription = watch((value) => {
      const hasName = value.firstName?.trim() || value.lastName?.trim();
      if (!hasName) return;
      syncToServer(value as Partial<PatientFormSchemaType>);
    });
    return () => subscription.unsubscribe();
  }, [watch, syncToServer]);

  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;
    const resetIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        axios
          .post("/api/patients", {
            sessionId: sessionIdRef.current,
            status: "idle",
            data: {},
          })
          .catch(() => {});
      }, 60_000);
    };
    window.addEventListener("keydown", resetIdle);
    window.addEventListener("click", resetIdle);
    resetIdle();
    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener("keydown", resetIdle);
      window.removeEventListener("click", resetIdle);
    };
  }, []);

  const onSubmit = async (values: PatientFormSchemaType) => {
    try {
      await axios.post("/api/patients", {
        sessionId: sessionIdRef.current,
        status: "submitted",
        data: values,
      });
      toast.success("Your information has been submitted successfully!");
      reset();
    } catch {
      toast.error("Submission failed. Please try again.");
    }
  };

  const onError = () => {
    toast.error("Please fill in all required fields correctly.");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="mx-auto w-full max-w-2xl space-y-6 rounded-2xl bg-basic-base-white p-6 shadow-lg sm:p-8"
      noValidate
    >
      <div>
        <h1 className="hl-24px-700 sm:hl-32px-700 text-basic-base-black">
          Patient Registration
        </h1>
        <p className="mt-1 hl-13px-400 sm:hl-14px-400 text-basic-gray-70">
          Please fill in your details. Fields marked with{" "}
          <span className="text-red-500">*</span> are required.
        </p>
      </div>

      <section className="space-y-4">
        <SectionHeading>Personal Details</SectionHeading>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="First Name" required error={errors.firstName?.message}>
            <Input
              {...register("firstName")}
              placeholder="Enter your first name"
              className={inputCls}
            />
          </Field>
          <Field label="Middle Name" error={errors.middleName?.message}>
            <Input
              {...register("middleName")}
              placeholder="Enter your middle name"
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Last Name" required error={errors.lastName?.message}>
          <Input
            {...register("lastName")}
            placeholder="Enter your last name"
            className={inputCls}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Date of Birth"
            required
            error={errors.dateOfBirth?.message}
          >
            <div className="relative w-full">
              <input
                {...register("dateOfBirth")}
                type="date"
                className={cn(
                  inputCls,
                  "w-full appearance-none",
                  "[&::-webkit-date-and-time-value]:text-left",
                  "[&::-webkit-calendar-picker-indicator]:absolute",
                  "[&::-webkit-calendar-picker-indicator]:right-3",
                  "[&::-webkit-calendar-picker-indicator]:top-1/2",
                  "[&::-webkit-calendar-picker-indicator]:-translate-y-1/2",
                  "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
                  "[&::-webkit-calendar-picker-indicator]:opacity-50",
                  "[&::-webkit-calendar-picker-indicator]:hover:opacity-100",
                )}
              />
            </div>
          </Field>
          <Field label="Gender" required error={errors.gender?.message}>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value as string}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent
                    className="w-[--radix-select-trigger-width]"
                    position="popper"
                    sideOffset={4}
                  >
                    {GENDER_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="pl-3"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading>Contact Information</SectionHeading>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Phone Number"
            required
            error={errors.phoneNumber?.message}
          >
            <Input
              {...register("phoneNumber")}
              type="tel"
              placeholder="Enter your phone number"
              className={inputCls}
            />
          </Field>
          <Field label="Email" required error={errors.email?.message}>
            <Input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Address" required error={errors.address?.message}>
          <textarea
            {...register("address")}
            placeholder="Enter your address"
            rows={3}
            className={cn(inputCls, "resize-none")}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <SectionHeading>Additional Details</SectionHeading>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Preferred Language"
            required
            error={errors.preferredLanguage?.message}
          >
            <Controller
              name="preferredLanguage"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value as string}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent
                    className="w-[--radix-select-trigger-width]"
                    position="popper"
                    sideOffset={4}
                  >
                    {LANGUAGE_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="pl-3"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field
            label="Nationality"
            required
            error={errors.nationality?.message}
          >
            <Input
              {...register("nationality")}
              placeholder="Enter your nationality"
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Religion" error={errors.religion?.message}>
          <Input
            {...register("religion")}
            placeholder="Enter your religion"
            className={inputCls}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <SectionHeading>Emergency Contact</SectionHeading>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Contact Name"
            error={errors.emergencyContactName?.message}
          >
            <Input
              {...register("emergencyContactName")}
              placeholder="Enter contact name"
              className={inputCls}
            />
          </Field>
          <Field
            label="Relationship"
            error={errors.emergencyContactRelationship?.message}
          >
            <Input
              {...register("emergencyContactRelationship")}
              placeholder="Enter relationship"
              className={inputCls}
            />
          </Field>
        </div>
      </section>

      <Button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full rounded-full px-6 py-5 hl-16px-600",
          "bg-ci-primary text-basic-base-white",
          "hover:bg-ci-neutral",
          "focus:outline-none focus:ring-2 focus:ring-ci-primary focus:ring-offset-2",
          "transition-colors duration-150",
          "disabled:opacity-60 disabled:cursor-not-allowed",
        )}
      >
        {isSubmitting ? "Submitting…" : "Submit Registration"}
      </Button>
    </form>
  );
}
