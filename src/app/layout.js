// app/layout.js or app/layout.tsx
import './globals.css'; // Make sure Tailwind base styles are imported

export const metadata = {
  title: '🦊 Web3 Wallet',
  description: 'A simple Web3 wallet connection demo with Ethers.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen font-sans bg-gray-50 text-gray-800">
        
        {/* Header */}
        <header className="bg-gray-900 text-white p-4 shadow">
          <div className="container mx-auto">
            <h1 className="text-xl font-bold">🦊 Web3 Wallet</h1>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 container mx-auto p-4">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-200 text-center py-4 text-sm text-gray-600">
          © {new Date().getFullYear()} Web3 Wallet Demo — Built with ❤️ using Next.js & Ethers.js
        </footer>

      </body>
    </html>
  );
}
