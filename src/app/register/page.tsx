"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // O 404 acontece se este caminho não bater com a pasta da API
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      alert("Falha no cadastro. Verifique se a API existe.");
    }
  };

  return (
    <main className="flex h-screen items-center justify-center bg-[#050511] text-white">
      <form onSubmit={handleSubmit} className="p-8 bg-[#0a0a1f] border border-gray-800 rounded-xl space-y-4">
        <h1 className="text-2xl font-bold">Criar Conta SoftPet</h1>
        <input className="w-full p-2 bg-black border border-gray-700 rounded" placeholder="Nome" onChange={e => setFormData({...formData, name: e.target.value})} required />
        <input className="w-full p-2 bg-black border border-gray-700 rounded" placeholder="E-mail" type="email" onChange={e => setFormData({...formData, email: e.target.value})} required />
        <input className="w-full p-2 bg-black border border-gray-700 rounded" placeholder="Senha" type="password" onChange={e => setFormData({...formData, password: e.target.value})} required />
        <button type="submit" className="w-full bg-blue-600 p-2 rounded font-bold">Cadastrar</button>
        <p className="text-center text-sm"><a href="/login" className="text-blue-400">Voltar para Login</a></p>
      </form>
    </main>
  );
}