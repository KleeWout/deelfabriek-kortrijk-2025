"use client";
import React from "react";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ItemPage({
  params,
}: {
  params: Promise<{ itemid: string }>;
}) {
  const unwrappedParams = React.use(params);
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`http://localhost:5000/items/lockers/${unwrappedParams.itemid}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setItem(data))
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [unwrappedParams.itemid]);

  if (loading) return <div className="text-center mt-12">Laden...</div>;
  if (!item) return notFound();

  const handleReserve = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          item_id: item.itemid,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Reservering gelukt! Code: " + data.code);
      } else {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          router.push("/login");
        }
      }
    } catch (error) {
      alert("Er is een fout opgetreden bij het reserveren.");
    }
  };

  return (
    <main className="flex flex-col items-center px-4 py-12 min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full flex flex-col items-center">
        <img
          src={item.img}
          alt={item.itemname}
          width={300}
          height={200}
          className="rounded-lg shadow mb-6"
          style={{ objectFit: "cover" }}
        />
        <h1 className="text-3xl font-bold mb-2">{item.itemname}</h1>
        <p className="text-gray-600 mb-4">{item.description}</p>
        <div className="flex flex-col gap-2 w-full mb-6">
          <div>
            <span className="font-semibold">Prijs:</span> {item.price} euro
          </div>
          <div>
            <span className="font-semibold">Locker ID:</span> {item.idLocker}
          </div>
          <div>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                item.availability === 1
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {item.availability === 1 ? "beschikbaar" : "bezet"}
            </span>
          </div>
        </div>
        <button
          className={`w-full py-3 rounded font-bold transition ${
            item.availability === 1
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
          disabled={item.availability !== 1}
          onClick={handleReserve}
        >
          Reserveren
        </button>
      </div>
    </main>
  );
}
