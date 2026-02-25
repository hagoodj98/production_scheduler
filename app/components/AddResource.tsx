"use client";

import React, { FormEvent, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useRouter } from "next/navigation";
import { useResourcesContext } from "../context";

interface AllPossibleResource {
  id: number;
  resource_name: string;
}

const AddResource: React.FC = () => {
  const router = useRouter();
  const { setResourceData } = useResourcesContext();
  const [resourceName, setResourceName] = useState("");
  const [allPossibleResources, setAllPossibleResources] = useState<
    AllPossibleResource[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!resourceName || resourceName.trim().length < 2) {
      setSnack({
        open: true,
        message: "Please enter a valid resource name",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/add-resource", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resource_name: resourceName.trim() }),
      });
      const data = await response.json();
      // Optimistically update UI
      const newResource = data.resource || {
        id: Date.now(),
        resource_name: resourceName.trim(),
      };

      setResourceData((prev) => [newResource, ...prev]);

      setSnack({
        open: true,
        message: "Resource added. Redirecting...",
        severity: "success",
      });
      setTimeout(() => {
        router.push("/");
      }, 3000);
      setResourceName("");
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setSnack({
        open: true,
        message: "Could not add resource",
        severity: "error",
      });
    }
  };
  useEffect(() => {
    if (!resourceName || resourceName.trim().length === 0) {
      return;
    }
    try {
      const searchResources = async () => {
        const response = await fetch(
          `/api/search-resources?name=${encodeURIComponent(resourceName)}`,
        );
        const data = await response.json();
        setAllPossibleResources(data.resources);
      };
      searchResources();
    } catch (error) {
      console.error(error);
    }
  }, [resourceName]);

  return (
    <div className="my-auto max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Add a Resource</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <TextField
          label="Resource name"
          value={resourceName}
          onChange={(e) => {
            const value = e.target.value;
            setResourceName(value);
            if (!value || value.trim().length === 0) {
              setAllPossibleResources([]);
            }
          }}
          fullWidth
          size="small"
        />

        <Divider className="my-4" />
        <List dense>
          {allPossibleResources.length > 0 ? (
            allPossibleResources.map((r) => (
              <ListItem key={r.id} className="justify-between">
                <button
                  className="text-sm text-left w-full hover:underline"
                  type="button"
                  onClick={() => setResourceName(r.resource_name)}
                >
                  {r.resource_name}
                </button>
                <small className="text-xs text-gray-400">#{r.id}</small>
              </ListItem>
            ))
          ) : (
            <p className="text-sm text-gray-500">No matching resources</p>
          )}
        </List>

        <div className="flex gap-3">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Adding…" : "Add Resource"}
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => router.push("/")}
          >
            Back
          </Button>
        </div>
      </form>

      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddResource;
/*
   <Divider className="my-4" />
 <List dense>
        {allPossibleResources.map((r) => (
          <ListItem key={r.id} className="justify-between">
            <span className="text-sm">{r.resource_name}</span>
            <small className="text-xs text-gray-400">#{r.id}</small>
          </ListItem>
        ))}
      </List>
      */
