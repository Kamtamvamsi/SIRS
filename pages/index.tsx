// frontend/pages/index.js
import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) return <p>Loading...</p>;

  if (!user) {
    return (
      <div>
        <a href="/api/auth/login">Login</a>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome, {user.name}</h1>
      <button onClick={() => router.push('/storage-vault')}>Storage Vault</button>
      <button onClick={() => router.push('/access-vault')} style={{ marginLeft: '10px' }}>
        Access Vault
      </button>
    </div>
  );
}
