"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

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
      <nav></nav>
      <main>
        <h1>Welcome bij de deelfabriek</h1>
        <p>Dit zijn al onze items die je kan lenen.</p>
        <div>
          <h2>Items</h2>
          <ul>
            {items.map((item, idx) => (
              <div key={idx}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <p
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      margin: 0,
                      background: "rgba(255,255,255,0.7)",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "0.9em",
                      zIndex: 1,
                    }}
                  >
                    {item.availability === 1 ? "beschikbaar" : "bezet"}
                  </p>
                  <Image src={item.img} alt={item.itemname} width={150} height={150} />
                </div>
                <h3>{item.itemname}</h3>
                <p>{item.description}</p>
                <p>Prijs: {item.price} euro</p>
              </div>
            ))}
          </ul>
        </div>
      </main>
      <footer></footer>
    </>
  );
}
