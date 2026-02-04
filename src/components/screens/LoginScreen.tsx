"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";

export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      // O window.location garante que o Middleware receba o novo cookie
      window.location.href = "/";
    } else {
      alert("Credenciais inválidas!");
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen items-center justify-center bg-[#050511] text-white p-4">
      <form onSubmit={handleLogin} className="w-full max-w-md p-8 bg-[#0a0a1f] border border-blue-500/30 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-400">SoftPet</h1>
        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="E-mail" 
            className="w-full p-3 bg-[#050511] border border-gray-800 rounded-lg outline-none text-white"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Senha" 
            className="w-full p-3 bg-[#050511] border border-gray-800 rounded-lg outline-none text-white"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-bold disabled:opacity-50"
          >
            {loading ? "Autenticando..." : "Entrar"}
          </button>
          <p className="mt-4 text-center text-sm text-gray-400">
            Não tem uma conta? <a href="/register" className="text-blue-500 hover:underline">Cadastre-se</a>
          </p>
        </div>
      </form>
    </div>
  );
}