"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRememberStore } from "@/lib/useRememberStore";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { remember, setRemember } = useRememberStore();

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
    <main className='flex h-screen items-center justify-center bg-gray-100'>
      <form
        onSubmit={handleLogin}
        className='bg-white p-8 rounded shadow-md w-96 space-y-4'
      >
        <div className='flex justify-center'>
          <Image src='https://flowbite.com/docs/images/logo.svg' alt='Logo' width={50} height={50} />
        </div>

        <h2 className='text-2xl font-semibold text-center'>Giriş Yap</h2>

        <input
          type='email'
          placeholder='E-posta'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full border border-gray-300 rounded px-3 py-2'
        />

        {/* Şifre Alanı */}
        <div className='relative'>
          <input
            type={showPassword ? "text" : "password"}
            placeholder='Şifre'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full border border-gray-300 rounded px-3 py-2 pr-10' // pr-10 eklendi
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

        <div className='flex items-center justify-between'>
          <label className='flex items-center text-sm'>
            <input
              type='checkbox'
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className='mr-2'
            />
            Beni hatırla
          </label>
        </div>

        {error && <p className='text-red-600 text-sm'>{error}</p>}

        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700'
        >
          Giriş Yap
        </button>
      </form>
    </main>
  );
}
