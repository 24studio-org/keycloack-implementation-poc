"use client";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authApi, AssignRoleResponse } from "@/lib/api";

const CLIENT_OPTIONS = [
  { value: "ecommerce-spa", label: "E-commerce SPA" },
  { value: "admin-spa", label: "Admin SPA" },
  { value: "api-service", label: "API Service" },
];

export function AssignRoleForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [assignmentResult, setAssignmentResult] =
    useState<AssignRoleResponse | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);

    const data = {
      username: formData.get("username") as string,
      roleName: formData.get("roleName") as string,
      clientId: formData.get("clientId") as string,
    };

    try {
      const response = await authApi.assignRole(data);
      console.log("Role assigned successfully:", response);
      setAssignmentResult(response);
      setSuccess(true);

      // Reset form
      event.currentTarget.reset();
    } catch (err) {
      console.error("Assign role error:", err);
      setError(err instanceof Error ? err.message : "Failed to assign role");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignAnother = () => {
    setSuccess(false);
    setAssignmentResult(null);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Assign Role</CardTitle>
          <CardDescription>
            Assign a client role to a user in Keycloak
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && assignmentResult ? (
            <div className="space-y-4">
              <div className="bg-green-50 text-green-600 p-4 rounded-md">
                <p className="text-lg font-semibold">
                  ✓ Role assigned successfully!
                </p>
                <div className="mt-3 text-sm space-y-1">
                  <p>
                    <span className="font-medium">Username:</span>{" "}
                    {assignmentResult.username}
                  </p>
                  <p>
                    <span className="font-medium">User ID:</span>{" "}
                    {assignmentResult.userId}
                  </p>
                  <p>
                    <span className="font-medium">Role:</span>{" "}
                    {assignmentResult.role.name}
                  </p>
                  <p>
                    <span className="font-medium">Client:</span>{" "}
                    {assignmentResult.role.client}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                onClick={handleAssignAnother}
                className="w-full"
              >
                Assign Another Role
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    id="username"
                    placeholder="Enter username (e.g., admin, cashier)"
                    name="username"
                    required
                    disabled={isLoading}
                  />
                  <FieldDescription>
                    The username of the user to assign the role to
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="clientId">Client</FieldLabel>
                  <select
                    id="clientId"
                    name="clientId"
                    required
                    disabled={isLoading}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="">Select a client</option>
                    {CLIENT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FieldDescription>
                    Select the client that owns the role
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="roleName">Role Name</FieldLabel>
                  <Input
                    id="roleName"
                    placeholder="Enter role name (e.g., editor, viewer)"
                    name="roleName"
                    required
                    disabled={isLoading}
                  />
                  <FieldDescription>
                    The name of the client role to assign
                  </FieldDescription>
                </Field>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Assigning..." : "Assign Role"}
                </Button>
              </FieldGroup>
            </form>
          )}
          <div className="mt-4 text-center text-sm">
            <Link href="/" className="underline underline-offset-4">
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
