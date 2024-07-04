import { useState } from "react";
import Swal from "sweetalert2";
import { BASE_URL } from "utils";

const useMutation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const mutation = async (path, options) => {
    try {
      const url = options?.BASE_URL || BASE_URL;
      setIsLoading(true);
      const method = options?.method || "POST";
      const body = options?.body
        ? options?.isFormData
          ? options?.body
          : JSON.stringify(options.body)
        : `{}`;
      const headers = options?.isFormData
        ? {}
        : { "Content-Type": "application/json" };
      const response = await fetch(`${url}/${path}`, {
        method,
        headers,
        body,
      });

      const status = response.status;
      const results = await response.json();

      if (options?.isAlert && !results?.success)
        Swal.fire("Error", results?.error?.message, "error");

      if (options?.isAlert && results?.success)
        Swal.fire("Success", results?.message, "success");

      setIsLoading(false);
      return { results, status };
    } catch (error) {
      setIsLoading(false);
      Swal.fire(
        "Error",
        error instanceof Error ? error.message : "Something went wrong",
        "error"
      );
    }
  };

  return { mutation, isLoading };
};

export default useMutation;
