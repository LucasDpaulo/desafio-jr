"use client";

import { useState } from "react";
import { Dog, Cat, ChevronDown, ChevronUp, Phone, Calendar, Hash, Trash2 } from "lucide-react";
import { deletePet } from "@/app/actions/pet-actions";
import { PetModal } from "./pet-modal";

interface PetCardProps {
  pet: {
    id: string;
    name: string;
    species: string;
    breed: string;
    ownerName: string;
    ownerContact: string;
    birthDate: Date | string;
  };
  canEdit: boolean;
}

export function PetCard({ pet, canEdit }: PetCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
    
  const formattedDate = new Date(pet.birthDate).toLocaleDateString("pt-BR");

  const handleDelete = async () => {
    if (confirm(`Tem certeza que deseja remover ${pet.name}?`)) {
      const result = await deletePet(pet.id);
      if (result.error) {
        alert(result.error);
      }
    }
  };

  return (
    <div 
      className={`
        bg-[#0a0a1f] border transition-all duration-300 rounded-2xl overflow-hidden
        ${isExpanded ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-gray-800 hover:border-blue-500/50'}
      `}
    >
      {/* Header do Card */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            {pet.species === "Cachorro" ? <Dog size={24} /> : <Cat size={24} />}
          </div>
          <div>
            <h3 className="font-bold text-white">{pet.name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
               <span className="w-2 h-2 bg-gray-600 rounded-full"></span> {pet.ownerName}
            </p>
          </div>
        </div>
        <button className="text-gray-500">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Detalhes Expandidos */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-800/50 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Hash size={14} className="text-blue-500" />
              <span>Raça: {pet.breed}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Phone size={14} className="text-blue-500" />
              <span>{pet.ownerContact}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 col-span-2">
              <Calendar size={14} className="text-blue-500" />
              <span>Idade: {formattedDate}</span>
            </div>
          </div>

          {/* Botões de Ação */}
          {canEdit && (
            <div className="flex gap-2 pt-2">
              {/* O PetModal aqui já funciona como o botão de Editar */}
              <PetModal pet={pet} onSuccess={() => setIsExpanded(false)} /> 
              
              <button 
                onClick={handleDelete}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
              >
                <Trash2 size={14} /> Remover
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}