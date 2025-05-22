"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/items/lockers")
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setItems(json);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <main className="px-24 py-12 flex flex-col items-center gap-12">
        <h1 className="text-4xl">Welcome bij de deelfabriek</h1>
        <p>Dit zijn al onze items die je kan lenen.</p>
        <div>
          <ul className="flex justify-between flex-wrap gap-8 p-0">
            {items.map((item, idx) => (
              <Link
                key={idx}
                href={`/item/${item.itemid}`}
                className="flex flex-col items-center border rounded-lg p-4 shadow-md relative no-underline text-inherit"
                style={{ listStyle: "none" }}
              >
                <li>
                  <div className="relative">
                    <span
                      className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${
                        item.availability === 1
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                      style={{ zIndex: 2 }}
                    >
                      {item.availability === 1 ? "beschikbaar" : "uitgeleend"}
                    </span>
                    <Image
                      src={item.img}
                      alt={item.itemname}
                      width={150}
                      height={150}
                      className="rounded"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{item.itemname}</h3>
                  <p className="mt-2">Prijs: {item.price} euro</p>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
