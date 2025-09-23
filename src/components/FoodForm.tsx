import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { LuLoaderCircle } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";

const priceSchema = z
  .number()
  .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  })
  .transform((val) => Number(val));

const createFoodItemSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  image: z
    .any()
    .refine(
      (file) => file instanceof FileList && file.length > 0,
      "Image is required"
    ),
  category: z.string().min(2, "Category is required"),
  price: priceSchema,
  description: z.string().optional(),
  type: z.enum(["veg", "non-veg"]),
});

const editFoodItemSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  image: z.union([z.string().optional(), z.instanceof(FileList)]).optional(),
  category: z.string().min(2, "Category is required").optional(),
  price: priceSchema.optional(),
  description: z.string().optional(),
  type: z.enum(["veg", "non-veg"]).optional(),
});

type FoodItemFormProps = {
  mode: "create" | "edit";
  restaurantId: string;
  defaultValues?: Partial<z.infer<typeof createFoodItemSchema>> & {
    _id?: string;
  };
  onSuccess?: (data: any) => void;
};

type CreateFoodItemFormValues = z.infer<typeof createFoodItemSchema>;
type EditFoodItemFormValues = z.infer<typeof editFoodItemSchema>;

type FoodItemFormValues = CreateFoodItemFormValues | EditFoodItemFormValues;

export default function FoodItemForm({
  mode,
  restaurantId,
  defaultValues,
  onSuccess,
}: FoodItemFormProps) {
  const schema = mode === "create" ? createFoodItemSchema : editFoodItemSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FoodItemFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    (defaultValues?.image as string) || null
  );
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const onSubmit = async (values: FoodItemFormValues) => {
    try {
      setError(null);
      setLoading(true);

      const formData = new FormData();
      if (values.name) formData.append("name", values.name);
      if (values.category) formData.append("category", values.category);
      if (values.price) formData.append("price", values.price.toString());
      if (values.description)
        formData.append("description", values.description);
      if (values.type) formData.append("type", values.type);
      if (values.image instanceof FileList && values.image.length > 0) {
        formData.append("image", values.image[0]);
      }

      const url =
        mode === "create"
          ? `${import.meta.env.VITE_SERVER_URL}/items/create/${restaurantId}`
          : `${import.meta.env.VITE_SERVER_URL}/items/edit/${restaurantId}/${
              defaultValues?._id
            }`;

      const method = mode === "create" ? "post" : "put";

      const { data } = await axios[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      console.log(data);

      if (onSuccess) onSuccess(data);
      navigate(`/`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden">
      <div className="p-8 space-y-8">
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-tr from-primary/10 to-orange-100 p-6 rounded-full shadow mb-4">
            <FaUtensils className="text-primary size-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
            {mode === "create" ? "Add Food Item" : "Edit Food Item"}
          </h2>
        </div>

        {error && (
          <div className="px-4 py-2 rounded bg-rose-50 text-rose-600 font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block font-semibold text-gray-700 ">
              Food Name
            </label>
            <input
              type="text"
              placeholder="e.g. Margherita Pizza"
              {...register("name")}
              className="w-full px-4 py-2 text-lg border border-gray-200 rounded-xl outline-none transition focus:ring-2 focus:ring-primary bg-gray-50"
            />
            {errors.name && (
              <span className="text-rose-600 text-xs mt-1 block">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold text-gray-700 ">
              Category
            </label>
            <input
              type="text"
              placeholder="e.g. Pizza"
              {...register("category")}
              className="w-full px-4 py-2 text-lg border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary bg-gray-50"
            />
            {errors.category && (
              <span className="text-rose-600 text-xs mt-1 block">
                {errors.category.message}
              </span>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block font-semibold text-gray-700 ">Price</label>
            <input
              type="number"
              step="0.01"
              placeholder="e.g. 199"
              {...register("price", { valueAsNumber: true })}
              className="w-full px-4 py-2 text-lg border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary bg-gray-50"
            />
            {errors.price && (
              <span className="text-rose-600 text-xs mt-1 block">
                {errors.price.message}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-gray-700 ">
              Description
            </label>
            <textarea
              placeholder="Describe the food (optional)"
              {...register("description")}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block font-semibold text-gray-700 ">Type</label>
            <div className="flex gap-6 mt-1">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="veg"
                  {...register("type")}
                  className="accent-green-600 h-4 w-4"
                />
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  Veg
                </span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="non-veg"
                  {...register("type")}
                  className="accent-rose-600 h-4 w-4"
                />
                <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm">
                  Non Veg
                </span>
              </label>
            </div>
            {errors.type && (
              <span className="text-rose-600 text-xs mt-1 block">
                {errors.type.message}
              </span>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) setPreview(URL.createObjectURL(file));
              }}
              className="block w-full bg-primary/20 text-primary rounded-lg border-none file:bg-primary/20 file:text-primary file:px-4 file:py-2 file:rounded-lg mt-1 transition file:hover:bg-primary/40"
            />
            {errors.image && (
              <span className="text-rose-600 text-xs mt-1 block">
                {errors.image.message?.toString()}
              </span>
            )}
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 mx-auto h-72 object-cover rounded-lg shadow aspect-square w-[60%]"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-bold bg-gradient-to-tr from-primary to-orange-400 shadow-md hover:scale-[1.02] hover:from-primary/80 hover:to-orange-400/80 transition-all flex justify-center items-center gap-2 disabled:opacity-60`}
          >
            {loading && (
              <LuLoaderCircle className="animate-spin h-5 w-5 mr-2" />
            )}
            {mode === "create"
              ? loading
                ? "Adding..."
                : "Add Food Item"
              : loading
              ? "Updating..."
              : "Update Food Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
