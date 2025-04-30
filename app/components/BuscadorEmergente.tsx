"use client"

import { useEffect, useState } from "react"
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function BuscadorEmergente({
  abierto,
  setAbierto,
}: {
  abierto: boolean
  setAbierto: (v: boolean) => void
}) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) return
      const res = await fetch(`/api/buscar?query=${query}`)
      const data = await res.json()
      setResults(data)
    }

    fetchResults()
  }, [query])

  return (
    <div
      className={cn(
        "absolute top-6 left-20 z-50 transition-all duration-300 ease-in-out",
        abierto ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      )}
    >
      <Popover open={abierto} onOpenChange={setAbierto}>
        <PopoverTrigger className="hidden" />
        <PopoverContent
          className="p-0 w-[400px] shadow-xl border border-slate-200 rounded-2xl bg-white animate-in fade-in slide-in-from-top-2"
          align="start"
        >
          <Command>
            <CommandInput
              placeholder="Buscar mascota o propietario..."
              onValueChange={setQuery}
              className="placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400"
            />
            <CommandList>
              {results.length > 0 ? (
                results.map((item, i) => (
                  <CommandItem key={i} onSelect={() => setAbierto(false)}>
                    {item.nombre}
                  </CommandItem>
                ))
              ) : (
                <CommandItem disabled>Sin resultados</CommandItem>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
