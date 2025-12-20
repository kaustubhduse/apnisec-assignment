'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Registration failed');
      router.push('/login');
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Name"
          className="border p-2"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
          disabled={isLoading}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Creating account...</span>
            </>
          ) : (
            'Register'
          )}
        </button>
      </form>
      </div>
    </div>
  );
}
