"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginAccount() {
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [melding, setMelding] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("http://192.168.129.59:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        wachtwoord: wachtwoord,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push("/account");
      } else {
        setMelding("Login gelukt, maar geen token ontvangen.");
      }
    } else {
      setMelding("Login mislukt. Controleer je gegevens.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Login</h1>
      <form
        className="flex flex-col items-center gap-4 mt-8 w-full max-w-xs"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
          placeholder="Voer je e-mailadres in"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
          placeholder="Voer je wachtwoord in"
          value={wachtwoord}
          onChange={(e) => setWachtwoord(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Inloggen
        </button>
        {melding && <div className="text-red-500">{melding}</div>}
      </form>
    </main>
  );
}
