import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export default function PaymentCheckout() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get query parameters
  const params = new URLSearchParams(window.location.search);
  const checkoutUrl = params.get("checkoutUrl");

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        // Se houver URL de checkout, redirecionar
        if (checkoutUrl) {
          // Simular delay para mostrar mensagem
          setTimeout(() => {
            window.location.href = checkoutUrl;
          }, 1000);
        } else {
          setError("URL de checkout não fornecida");
          setLoading(false);
        }
      } catch (err) {
        setError("Erro ao processar pagamento. Tente novamente.");
        console.error(err);
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [checkoutUrl]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {error && <AlertCircle className="w-5 h-5 text-red-500" />}
            {!loading && !error && <CheckCircle className="w-5 h-5 text-green-500" />}
            Processando Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && (
            <div className="text-center">
              <p className="text-slate-600">Redirecionando para o checkout...</p>
              <p className="text-sm text-slate-500 mt-2">Aguarde um momento</p>
            </div>
          )}

          {error && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <Button
                onClick={() => window.history.back()}
                className="w-full"
              >
                Voltar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
