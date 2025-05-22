"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "3rem",
        padding: "2rem 0",
        background: "#f5f5f5",
        borderTop: "1px solid #e0e0e0",
        textAlign: "center",
      }}
    >
      <p style={{ margin: 0, fontWeight: 500, color: "#2d3748" }}>Deelfabriek &copy; 2025</p>
      <ul
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          listStyle: "none",
          margin: "1rem 0 0 0",
          padding: 0,
        }}
      >
        <li>
          <Link
            href="/login"
            style={{
              textDecoration: "none",
              color: "#2d3748",
              fontWeight: 500,
            }}
          >
            Login
          </Link>
        </li>
        <li>
          <Link
            href="/register"
            style={{
              textDecoration: "none",
              color: "#2d3748",
              fontWeight: 500,
            }}
          >
            Registreer
          </Link>
        </li>
      </ul>
    </footer>
  );
}
