'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to Web3 Wallet</h1>
      <p>Click below to connect your Ethereum wallet:</p>
      <Link href="/wallet">
        <button style={{ marginTop: 10 }}>Go to Wallet Page</button>
      </Link>
    </div>
  );
}
