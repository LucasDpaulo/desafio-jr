"use client";

import { signOut, useSession } from "next-auth/react";
import { Search, LogOut, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { PetCard } from "@/components/pet-card"; 
import { getPets } from "@/app/actions/pet-actions";
import { PetModal } from "@/components/pet-modal";

export function HomeScreen() {
  const { data: session, status } = useSession();
  const [search, setSearch] = useState("");
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadPets = async () => {
    setLoading(true);
    try {
      const result = await getPets(search);
      if (result.pets) {
        setPets(result.pets);
      }
    } catch (error) {
      console.error("Erro ao carregar pets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      const delayDebounceFn = setTimeout(() => {
        loadPets();
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [search, mounted]);

  // Enquanto carrega ou monta, mostra um estado neutro para evitar erro de hidratação
  if (!mounted || status === "loading") {
    return (
      <div className="h-screen bg-[#050511] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050511] text-white p-4 md:p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          SoftPet
        </h1>
        <div className="flex items-center gap-4 bg-[#0a0a1f] p-2 px-4 rounded-full border border-gray-800">
          <span className="text-xs text-gray-400">{session?.user?.email || "Usuário"}</span>
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })} 
            className="text-gray-400 hover:text-red-400 transition-colors"
            title="Sair"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <section className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text"
            placeholder="Pesquise pelo nome do animal ou do dono..."
            className="w-full bg-[#0a0a1f] border border-gray-800 rounded-xl py-3 pl-12 pr-4 focus:border-blue-500 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Botão de cadastro agora chama o Modal que criamos */}
        <PetModal onSuccess={loadPets} />
      </section>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pets.length > 0 ? (
            pets.map((pet) => (
              <PetCard 
                key={pet.id} 
                pet={pet} 
                // Valida se o pet pertence ao ID do usuário na sessão
                canEdit={pet.userId === session?.user?.id} 
              />
            ))
          ) : (
            <div className="col-span-full border-2 border-dashed border-gray-900 rounded-2xl h-64 flex flex-col items-center justify-center text-gray-500">
               <p>Nenhum animal cadastrado ainda.</p>
            </div>
          )}
        </section>
      )}
    </main>
  );
}