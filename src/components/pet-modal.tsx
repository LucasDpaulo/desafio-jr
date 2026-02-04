"use client";

import { useState } from "react";
import { Plus, Loader2, Edit2, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createPet, updatePet } from "@/app/actions/pet-actions";

interface PetModalProps {
  pet?: any; // Se houver pet, entra em modo edição
  onSuccess: () => void;
}

export function PetModal({ pet, onSuccess }: PetModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [species, setSpecies] = useState(pet?.species || "Cachorro");
  const [date, setDate] = useState<Date | undefined>(pet?.birthDate ? new Date(pet.birthDate) : undefined);

  const isEditing = !!pet;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!date) return alert("Selecione a data.");
    
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      species,
      ownerName: formData.get("ownerName"),
      breed: formData.get("breed"),
      ownerContact: formData.get("ownerContact"),
      birthDate: date.toISOString(),
    };

    const result = isEditing 
      ? await updatePet(pet.id, data) 
      : await createPet(data);

    if (result.success) {
      setOpen(false);
      onSuccess();
    } else {
      alert(result.error);
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <button className="flex-1 bg-white text-black py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition">
            <Edit2 size={14} /> Editar
          </button>
        ) : (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl font-semibold gap-2 shadow-lg shadow-blue-500/20">
            <Plus size={20} /> Cadastrar
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="bg-[#0a0a1f] border-blue-500/30 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-full">
              {isEditing ? <Edit2 size={16} /> : <Plus size={16} />}
            </div>
            {isEditing ? "Editar Pet" : "Cadastrar"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" defaultValue={pet?.name} className="bg-[#050511] border-gray-800" required />
            </div>
            <div className="space-y-2">
              <Label>Animal</Label>
              <div className="flex gap-2">
                {["Cachorro", "Gato"].map((type) => (
                  <Button 
                    key={type}
                    type="button" 
                    variant={species === type ? "default" : "outline"} 
                    className={cn("flex-1", species === type ? "bg-blue-600" : "border-gray-800")}
                    onClick={() => setSpecies(type)}
                  >{type}</Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerName">Dono</Label>
              <Input id="ownerName" name="ownerName" defaultValue={pet?.ownerName} className="bg-[#050511] border-gray-800" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="breed">Raça</Label>
              <Input id="breed" name="breed" defaultValue={pet?.breed} className="bg-[#050511] border-gray-800" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerContact">Telefone</Label>
              <Input id="ownerContact" name="ownerContact" defaultValue={pet?.ownerContact} className="bg-[#050511] border-gray-800" required />
            </div>
            
            <div className="space-y-2 flex flex-col">
              <Label>Nascimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal bg-[#050511] border-gray-800", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                    {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : <span>00/00/0000</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#0a0a1f] border-blue-500/30">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={ptBR} className="bg-[#0a0a1f] text-white" />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="flex-1 text-white hover:bg-white/10">Voltar</Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {loading ? <Loader2 className="animate-spin" size={18} /> : (isEditing ? "Salvar Alterações" : "Cadastrar")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}