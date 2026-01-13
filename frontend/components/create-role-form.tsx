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
import { authApi, CreateRoleResponse } from "@/lib/api";

const CLIENT_OPTIONS = [
  { value: "ecommerce-spa", label: "E-commerce SPA" },
  { value: "admin-spa", label: "Admin SPA" },
  { value: "api-service", label: "API Service" },
];

export function CreateRoleForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdRole, setCreatedRole] = useState<CreateRoleResponse | null>(
    null
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);

    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      clientId: formData.get("clientId") as string,
    };

    try {
      const response = await authApi.createRole(data);
      console.log("Role created successfully:", response);
      setCreatedRole(response);
      setSuccess(true);

      // Reset form
      event.currentTarget.reset();
    } catch (err) {
      console.error("Create role error:", err);
      setError(err instanceof Error ? err.message : "Failed to create role");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAnother = () => {
    setSuccess(false);
    setCreatedRole(null);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Role</CardTitle>
          <CardDescription>
            Create a new client role in Keycloak
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && createdRole ? (
            <div className="space-y-4">
              <div className="bg-green-50 text-green-600 p-4 rounded-md">
                <p className="text-lg font-semibold">
                  ✓ Role created successfully!
                </p>
                <div className="mt-3 text-sm space-y-1">
                  <p>
                    <span className="font-medium">Role Name:</span>{" "}
                    {createdRole.role.name}
                  </p>
                  <p>
                    <span className="font-medium">Role ID:</span>{" "}
                    {createdRole.role.id}
                  </p>
                  {createdRole.role.description && (
                    <p>
                      <span className="font-medium">Description:</span>{" "}
                      {createdRole.role.description}
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="button"
                onClick={handleCreateAnother}
                className="w-full"
              >
                Create Another Role
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
                    Select the client to add the role to
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="name">Role Name</FieldLabel>
                  <Input
                    id="name"
                    placeholder="editor"
                    name="name"
                    required
                    disabled={isLoading}
                    pattern="^[a-zA-Z][a-zA-Z0-9_:-]*$"
                    title="Role name must start with a letter and can contain letters, numbers, underscores, colons, and hyphens"
                  />
                  <FieldDescription>
                    A unique identifier for this role (e.g., editor, viewer,
                    manager)
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">
                    Description (optional)
                  </FieldLabel>
                  <Input
                    id="description"
                    placeholder="Editor role for managing content"
                    name="description"
                    disabled={isLoading}
                  />
                  <FieldDescription>
                    A brief description of what this role can do
                  </FieldDescription>
                </Field>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Role"}
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
