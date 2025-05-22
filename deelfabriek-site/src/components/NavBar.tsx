"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext"; // <-- import AuthContext

export default function NavBar() {
  const auth = useAuth(); // <-- use AuthContext

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        background: "#f5f5f5",
        borderBottom: "1px solid #e0e0e0",
        marginBottom: "2rem",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "2rem", color: "#2d3748" }}>
        Deelfabriek backend test
      </h1>
      <ul
        style={{
          display: "flex",
          gap: "2rem",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        <li>
          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: "#2d3748",
              fontWeight: 500,
            }}
          >
            Home
          </Link>
        </li>
        {!auth.user && (
          <>
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
          </>
        )}
        {auth.user && (
          <li>
            <Link
              href="/account"
              style={{
                textDecoration: "none",
                color: "#2d3748",
                fontWeight: 500,
              }}
            >
              Profiel
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
