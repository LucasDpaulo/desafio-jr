"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/");
      router.refresh();
    } else {
      alert("Credenciais inválidas!");
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#050511] text-white p-4">
      <form onSubmit={handleLogin} className="w-full max-w-md p-8 bg-[#0a0a1f] border border-blue-500/30 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center text-blue-400">SoftPet</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">Entre para gerenciar seus pets</p>
        
        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="E-mail" 
            className="w-full p-3 bg-[#050511] border border-gray-800 rounded-lg focus:border-blue-500 outline-none transition"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Senha" 
            className="w-full p-3 bg-[#050511] border border-gray-800 rounded-lg focus:border-blue-500 outline-none transition"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-bold transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Carregando..." : "Acessar Dashboard"}
          </button>
        </div>
        
        <p className="mt-6 text-center text-sm text-gray-400">
          Ainda não tem conta? <a href="/register" className="text-blue-400 hover:underline">Cadastre-se aqui</a>
        </p>
      </form>
    </div>
  );
}
export default function Page() {
  return <LoginScreen />;
}