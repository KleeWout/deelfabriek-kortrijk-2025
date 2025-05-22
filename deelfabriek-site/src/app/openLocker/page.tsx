"use client";
import { FormEvent } from "react";

export default function Home() {
  const controlCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.querySelector(
      "input[type='text']"
    ) as HTMLInputElement | null;
    const code = input?.value || "";
    const response = await fetch("http://192.168.129.59:5000/lockers");
    const lockers = await response.json();
    const locker = lockers.find((locker: any) => locker.code === code);
    if (locker) {
      //await fetch("http://172.30.82.165:5000/open_locker", {
      //method: "POST",
      //headers: { "Content-Type": "application/json" },
      //body: JSON.stringify({ relay: locker.idLocker }),
      //});
      console.log("Locker opened");
    } else {
      console.log("Locker not found");
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Enter locker code</h1>
      <form
        onSubmit={controlCode}
        className="flex flex-col items-center gap-4 mt-8 w-full max-w-xs"
      >
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
          placeholder="Voer je locker code in"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Controleer code
        </button>
      </form>
    </main>
  );
}
