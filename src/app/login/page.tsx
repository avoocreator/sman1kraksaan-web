"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, GraduationCap, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-surface-alt/40 px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm rounded-3xl border border-border bg-surface p-8 shadow-lg shadow-ink/5"
      >
        <div className="flex flex-col items-center text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange text-white">
            <GraduationCap className="h-5 w-5" />
          </span>
          <h1 className="mt-4 text-xl font-bold text-ink">Masuk ke Dashboard</h1>
          <p className="mt-1 text-sm text-ink-soft">Khusus untuk admin SMAN 1 Kraksaan</p>
        </div>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-soft" htmlFor="email">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input id="email" type="email" required placeholder="admin@sman1kraksaan.sch.id"
                className="h-11 w-full rounded-xl border border-border bg-bg pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-orange/40" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-soft" htmlFor="password">Kata Sandi</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input id="password" type={showPassword ? "text" : "password"} required placeholder="••••••••"
                className="h-11 w-full rounded-xl border border-border bg-bg pl-10 pr-10 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-orange/40" />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink-soft">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-ink-soft">
              <input type="checkbox" className="h-3.5 w-3.5 rounded border-border accent-orange" /> Ingat saya
            </label>
            <a href="#" className="font-medium text-blue hover:underline">Lupa kata sandi?</a>
          </div>

          <Button type="submit" className="w-full" size="md">Masuk</Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          Bukan admin? <Link href="/" className="font-medium text-orange hover:underline">Kembali ke beranda</Link>
        </p>
      </motion.div>
    </div>
  );
}
