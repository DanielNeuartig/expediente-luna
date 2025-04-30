"use client";

import { useForm, useFieldArray } from "react-hook-form";

type FormData = {
  nombre: string;
  telefonos: { numero: string }[];
};

export default function NuevoPropietario() {
  const { register, handleSubmit, control } = useForm<FormData>({
    defaultValues: {
      nombre: "",
      telefonos: [{ numero: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "telefonos",
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/propietarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Error al guardar el propietario");
      }
  
      const nuevoPropietario = await response.json();
      console.log("Guardado correctamente:", nuevoPropietario);
      alert("Propietario registrado correctamente");
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al registrar el propietario");
    }
  };
  

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Registrar nuevo propietario</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <label className="block mb-1">Nombre:</label>
          <input
            type="text"
            {...register("nombre", { required: true })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Teléfonos:</label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex space-x-2 mb-2">
              <input
                type="text"
                {...register(`telefonos.${index}.numero` as const, { required: true })}
                className="flex-1 border p-2 rounded"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="px-2 bg-red-500 text-white rounded"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ numero: "" })}
            className="text-sm text-blue-600"
          >
            + Agregar teléfono
          </button>
        </div>

        <button
          type="submit"
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Guardar propietario
        </button>
      </form>
    </div>
  );
}
