// src/components/RestaurantForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { LuLoaderCircle } from "react-icons/lu";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setRestaurant } from "../redux/slices/restaurantSlice";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const createRestaurantSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  image: z
    .any()
    .refine(
      (file) => file instanceof FileList && file.length > 0,
      "Image is required"
    ),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
});

const editRestaurantSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  image: z
    .any()
    .optional()
    .refine(
      (file) =>
        file === undefined || // field not touched
        file === null || // no file selected
        (file instanceof FileList && file.length === 0) || // empty file input
        (file instanceof FileList && file.length > 0), // valid file list
      "Invalid file"
    ),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .optional(),
  city: z.string().min(2, "City must be at least 2 characters").optional(),
  state: z.string().min(2, "State must be at least 2 characters").optional(),
});

type RestaurantFormProps = {
  mode: "create" | "edit";
  defaultValues?: Partial<z.infer<typeof createRestaurantSchema>> & {
    _id?: string;
  };
  onSuccess?: (data: any) => void;
};

export default function RestaurantForm({
  mode,
  defaultValues,
  onSuccess,
}: RestaurantFormProps) {
  const schema =
    mode === "create" ? createRestaurantSchema : editRestaurantSchema;

  const { location } = useAppSelector((state) => state.user);

  if (mode === "create" && location) {
    defaultValues = {
      ...defaultValues,
      city: location?.city,
      state: location?.state,
      address: location?.address,
    };
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    (defaultValues?.image as string) || null
  );
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setError(null);
      setLoading(true);

      const formData = new FormData();
      if (values.name) formData.append("name", values.name);
      if (values.address) formData.append("address", values.address);
      if (values.city) formData.append("city", values.city);
      if (values.state) formData.append("state", values.state);
      if (values.image instanceof FileList && values.image.length > 0) {
        formData.append("image", values.image[0]);
      }

      if (mode === "edit" && !defaultValues?._id) {
        setError("Missing restaurant id for edit");
        setLoading(false);
        return;
      }

      const url =
        mode === "create"
          ? `${import.meta.env.VITE_SERVER_URL}/restaurants/create`
          : `${import.meta.env.VITE_SERVER_URL}/restaurants/edit/${
              defaultValues?._id
            }`;

      const method = mode === "create" ? "post" : "put";

      const { data } = await axios[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      dispatch(setRestaurant(data.data));
      if (onSuccess) onSuccess(data);

      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 shadow-lg rounded-2xl bg-white border border-orange-100">
      <div className="p-6 space-y-6">
        <div className="flex flex-col items-center justify-between">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <FaUtensils className="text-primary size-14" />
          </div>
          <h2 className="text-xl font-bold">
            {mode === "create"
              ? "Add Restaurant Details"
              : "Edit Restaurant Details"}
          </h2>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Name"
              {...register("name")}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <input
              type="text"
              placeholder="Address"
              {...register("address")}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          {/* City */}
          <div>
            <input
              type="text"
              placeholder="City"
              {...register("city")}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city.message}</p>
            )}
          </div>

          {/* State */}
          <div>
            <input
              type="text"
              placeholder="State"
              {...register("state")}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.state && (
              <p className="text-red-500 text-sm">{errors.state.message}</p>
            )}
          </div>

          {/* Image */}
          <div>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) setPreview(URL.createObjectURL(file));
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0 file:text-sm file:font-semibold
              file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {errors.image && (
              <p className="text-red-500 text-sm">
                {errors.image.message?.toString()}
              </p>
            )}
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-full h-40 object-cover rounded-lg"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg flex justify-center items-center font-semibold hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading && (
              <LuLoaderCircle className="animate-spin mr-2 h-4 w-4" />
            )}
            {mode === "create"
              ? loading
                ? "Adding..."
                : "Add Details"
              : loading
              ? "Updating..."
              : "Update Details"}
          </button>
        </form>
      </div>
    </div>
  );
}
