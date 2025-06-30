"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRememberStore } from "@/lib/useRememberStore";
import { Eye, EyeOff } from "lucide-react";
import { useThemeStore } from "@/lib/themeStore";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { remember, setRemember } = useRememberStore();
  const { theme } = useThemeStore(); 

  const logoSrc =
    theme === "dark" ? "/secil-logo-lightt.png" : "/secil-store-seeklogo.png";

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRemember(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      username: email,
      password: password,
    });

    if (res?.ok) {
      if (remember) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      router.push("/collections");
    } else {
      setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
  };

  return (
    <main
      className='flex h-screen items-center justify-center transition-colors'
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <form
        onSubmit={handleLogin}
        className='w-96 p-8 rounded shadow-md space-y-4'
        style={{
          backgroundColor: "var(--table-bg)",
          color: "var(--foreground)",
          border: "1px solid var(--table-border)",
        }}
      >
        <div className='flex justify-center'>
          <Image
            src={logoSrc}
            alt='Logo'
            width={150}
            height={150}
            className='object-contain'
            priority
          />
        </div>

        <h2 className='text-l font-semibold text-center'>Giriş Yap</h2>

        <input
          type='email'
          placeholder='E-posta'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full px-3 py-2 rounded border'
          style={{
            backgroundColor: "var(--table-bg)",
            color: "var(--foreground)",
            borderColor: "var(--table-border)",
          }}
        />

        <div className='relative'>
          <input
            type={showPassword ? "text" : "password"}
            placeholder='Şifre'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-3 py-2 pr-10 rounded border'
            style={{
              backgroundColor: "var(--table-bg)",
              color: "var(--foreground)",
              borderColor: "var(--table-border)",
            }}
          />
          <button
            type='button'
            onClick={() => setShowPassword((prev) => !prev)}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600'
            title={showPassword ? "Şifreyi Gizle" : "Şifreyi Göster"}
          >
            {showPassword ? (
              <EyeOff className='w-5 h-5' />
            ) : (
              <Eye className='w-5 h-5' />
            )}
          </button>
        </div>

        <div className='flex items-center justify-between text-sm'>
          <label className='flex items-center'>
            <input
              type='checkbox'
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className='mr-2'
            />
            Beni hatırla
          </label>
        </div>

        {error && <p className='text-red-500 text-sm'>{error}</p>}

        <button
          type='submit'
          className='w-full py-2 rounded font-medium'
          style={{
            backgroundColor: "#2563eb",
            color: "white",
          }}
        >
          Giriş Yap
        </button>
      </form>
    </main>
  );
}
