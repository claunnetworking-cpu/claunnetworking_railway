import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-16">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <p className="text-2xl font-bold text-gray-800 mb-4">Página não encontrada</p>
          <p className="text-gray-600 mb-8">
            Desculpe, a página que você está procurando não existe.
          </p>
          <Link href="/" className="inline-block">
            <button className="bg-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-primary/90 transition-colors">
              Voltar para Home
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
