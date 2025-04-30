"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";

type FormData = {
  nombre: string;
  telefonos: { numero: string }[];
};

export default function NuevoPropietario() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      nombre: "",
      telefonos: [{ numero: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "telefonos",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/propietarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error al guardar el propietario");

      alert("Propietario registrado correctamente");
      reset();
    } catch (error) {
      alert("Ocurrió un error al registrar el propietario");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-white px-4">
      <div className="w-full max-w-xl bg-gray-50 rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-semibold text-blue-900 mb-2">
          Registrar nuevo propietario
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Ingresa el nombre y número(s) de contacto del propietario.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo *
            </label>
            <input
              type="text"
              {...register("nombre", { required: "El nombre es obligatorio" })}
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
            )}
          </div>

          {/* Teléfonos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfonos *
            </label>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ej. 5544332211"
                    {...register(`telefonos.${index}.numero` as const, {
                      required: "El número es obligatorio",
                      pattern: {
                        value: /^[0-9]{7,15}$/,
                        message: "Número inválido",
                      },
                    })}
                    className="flex-1 bg-white text-gray-900 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 text-sm hover:text-red-400"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => append({ numero: "" })}
                className="text-sm text-blue-600 hover:underline"
              >
                + Agregar otro teléfono
              </button>
              {errors.telefonos?.[0]?.numero && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.telefonos[0].numero.message}
                </p>
              )}
            </div>
          </div>

          {/* Botón */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-md transition disabled:opacity-50 shadow-md"
            >
              {isSubmitting ? "Guardando..." : "Guardar propietario"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
