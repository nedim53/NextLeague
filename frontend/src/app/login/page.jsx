'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUser } from '../../lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await loginUser(email, password);
      console.log('Login successful:', data);

      // npr. redirectuj na dashboard ili home
      location.assign('/homepage');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#031716] px-4">
  <div className="w-full max-w-md bg-[#032f30]/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-[#0c969c]/10">
    <h1 className="text-4xl font-bold text-white text-center mb-8">Login</h1>

    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="block text-sm text-[#6ba3be] mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          autoComplete="email"
          className="w-full px-4 py-3 bg-[#031716] border border-[#0c969c]/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c969c] transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm text-[#6ba3be] mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          autoComplete="current-password"
          className="w-full px-4 py-3 bg-[#031716] border border-[#0c969c]/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c969c] transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full py-3 bg-[#0c969c] text-white rounded-lg font-semibold hover:bg-[#0a7075] transition-all duration-200 shadow-md hover:scale-[1.02]"
      >
        Log In
      </button>
    </form>

    <p className="text-[#6ba3be] text-center text-sm mt-6">
      Don&apos;t have an account?{' '}
      <Link href="/register" className="text-[#0c969c] hover:underline font-medium">
        Register
      </Link>
    </p>
  </div>
</div>

  );
}
