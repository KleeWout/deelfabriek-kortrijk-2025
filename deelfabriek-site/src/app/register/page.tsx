"use client";
import { useState, useRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function RegistreerAccount() {
  const [form, setForm] = useState({
    voornaam: "",
    achternaam: "",
    email: "",
    wachtwoord: "",
    bevestigWachtwoord: "",
  });

  const [captchaToken, setCaptchaToken] = useState("");
  const [melding, setMelding] = useState("");
  const hcaptchaRef = useRef<any>(null);
  const router = useRouter();
  const auth = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.wachtwoord !== form.bevestigWachtwoord) {
      setMelding("Wachtwoorden komen niet overeen.");
      return;
    }

    if (!captchaToken) {
      setMelding("Bevestig de captcha.");
      return;
    }

    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        voornaam: form.voornaam,
        achternaam: form.achternaam,
        email: form.email,
        wachtwoord: form.wachtwoord,
        captcha: captchaToken,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      if (data.token) {
        // Use the Auth Context instead of localStorage directly
        auth.login(data.userId, data.token);
        router.push("/account");
      } else {
        setMelding("Registratie gelukt, maar geen token ontvangen.");
      }
    } else {
      setMelding("Registratie mislukt.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Registratie</h1>
      <form className="flex flex-col items-center gap-4 mt-8 w-full max-w-xs" onSubmit={handleSubmit}>
        <input type="text" name="voornaam" className="w-full px-4 py-2 border rounded-lg" placeholder="Voornaam" value={form.voornaam} onChange={handleChange} />
        <input type="text" name="achternaam" className="w-full px-4 py-2 border rounded-lg" placeholder="Achternaam" value={form.achternaam} onChange={handleChange} />
        <input type="email" name="email" className="w-full px-4 py-2 border rounded-lg" placeholder="E-mailadres" value={form.email} onChange={handleChange} />
        <input type="password" name="wachtwoord" className="w-full px-4 py-2 border rounded-lg" placeholder="Wachtwoord" value={form.wachtwoord} onChange={handleChange} />
        <input type="password" name="bevestigWachtwoord" className="w-full px-4 py-2 border rounded-lg" placeholder="Bevestig wachtwoord" value={form.bevestigWachtwoord} onChange={handleChange} />

        <HCaptcha sitekey="81d80556-306e-4ac4-a932-74289cfcc3e4" onVerify={setCaptchaToken} ref={hcaptchaRef} />

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors">
          Registreren
        </button>
        {melding && <div className="text-red-500">{melding}</div>}
      </form>
    </main>
  );
}
