interface CargoCardProps {
  nome: string;
  posicoes: number;
}

export default function CargoCard({ nome, posicoes }: CargoCardProps) {
  return (
    <button className="bg-primary text-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-dashed border-white/30 text-center">
      <p className="font-bold text-base md:text-lg mb-3">{nome}</p>
      <p className="text-3xl md:text-4xl font-bold mb-2">{posicoes}</p>
      <p className="text-white/80 text-sm">posições</p>
    </button>
  );
}
