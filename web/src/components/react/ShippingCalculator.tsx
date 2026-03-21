import { useState, useCallback, type FormEvent } from "react";

interface ShippingCalculatorProps {
  /** Product weight in kg */
  weight: number;
  /** Product height in cm */
  height: number;
  /** Product width in cm */
  width: number;
  /** Product length in cm */
  length: number;
  /** Product price in BRL cents (for insurance value) */
  price: number;
  /** Origin CEP (seller's ZIP code) */
  originCep?: string;
}

interface ShippingQuote {
  id: number;
  name: string;
  price: string;
  company: { name: string; picture: string };
  delivery_time: number;
  error?: string;
}

type Status = "idle" | "loading" | "success" | "error";

const WORKER_URL = import.meta.env.PUBLIC_SHIPPING_WORKER_URL ?? "";

function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 5) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return digits;
}

function formatCurrency(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
}

export default function ShippingCalculator({
  weight,
  height,
  width,
  length,
  price,
  originCep = "01001000",
}: ShippingCalculatorProps) {
  const [cep, setCep] = useState("");
  const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const rawCep = cep.replace(/\D/g, "");
      if (rawCep.length !== 8) {
        setErrorMsg("Digite um CEP válido com 8 dígitos.");
        setStatus("error");
        return;
      }

      if (!WORKER_URL) {
        setErrorMsg("URL do serviço de frete não configurada.");
        setStatus("error");
        return;
      }

      setStatus("loading");
      setQuotes([]);
      setErrorMsg("");

      try {
        const body = {
          from: { postal_code: originCep.replace(/\D/g, "") },
          to: { postal_code: rawCep },
          products: [
            {
              id: "1",
              width,
              height,
              length,
              weight,
              insurance_value: price / 100,
              quantity: 1,
            },
          ],
        };

        const res = await fetch(WORKER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          throw new Error(`Erro na API (${res.status})`);
        }

        const data: ShippingQuote[] = await res.json();
        const validQuotes = data.filter((q) => !q.error && parseFloat(q.price) > 0);

        if (validQuotes.length === 0) {
          setErrorMsg("Nenhuma opção de frete encontrada para este CEP.");
          setStatus("error");
          return;
        }

        // Sort by price ascending
        validQuotes.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        setQuotes(validQuotes);
        setStatus("success");
      } catch (err) {
        setErrorMsg(
          err instanceof Error
            ? err.message
            : "Erro ao calcular o frete. Tente novamente."
        );
        setStatus("error");
      }
    },
    [cep, weight, height, width, length, price, originCep]
  );

  return (
    <div className="space-y-4">
      <h3 className="text-[#2c5f34] text-base font-display flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
        Calcular frete
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          placeholder="Digite seu CEP"
          value={cep}
          onChange={(e) => setCep(formatCep(e.target.value))}
          className="flex-1 px-4 py-3 rounded-xl border border-[#bec1ac] bg-white/60 
                     text-[#633b21] placeholder:text-[#633b21]/40 text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#2c5f34]/30 focus:border-[#2c5f34]
                     transition-all"
          maxLength={9}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-5 py-3 rounded-xl bg-[#2c5f34] text-[#f9f5e9] text-sm font-medium
                     hover:bg-[#633b21] transition-colors duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center gap-2"
        >
          {status === "loading" ? (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            "Calcular"
          )}
        </button>
      </form>

      <a
        href="https://buscacepinter.correios.com.br/app/endereco/index.php"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#043a5f] text-xs hover:underline inline-block"
      >
        Não sei meu CEP →
      </a>

      {status === "error" && errorMsg && (
        <div className="text-[#910d16] text-sm bg-[#910d16]/5 px-4 py-3 rounded-xl">
          {errorMsg}
        </div>
      )}

      {status === "success" && quotes.length > 0 && (
        <ul className="space-y-2">
          {quotes.map((quote) => (
            <li
              key={quote.id}
              className="flex items-center justify-between gap-3 px-4 py-3 
                         rounded-xl bg-white/40 border border-[#bec1ac]/40"
            >
              <div className="flex items-center gap-3 min-w-0">
                {quote.company.picture && (
                  <img
                    src={quote.company.picture}
                    alt={quote.company.name}
                    className="w-8 h-8 object-contain flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-[#633b21] text-sm font-medium truncate">
                    {quote.name}
                  </p>
                  <p className="text-[#633b21]/50 text-xs">
                    {quote.delivery_time === 1
                      ? "1 dia útil"
                      : `${quote.delivery_time} dias úteis`}
                  </p>
                </div>
              </div>
              <span className="text-[#2c5f34] font-medium text-sm whitespace-nowrap">
                {formatCurrency(quote.price)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
