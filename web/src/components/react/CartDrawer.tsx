import { CartProvider, useCart } from "./CartProvider";
import { formatPrice } from "../../data/products";

function CartDrawerInner() {
  const { items, isOpen, totalItems, totalPrice, removeItem, updateQuantity, closeCart } =
    useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#f9f5e9] z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#bec1ac]/30">
          <h2 className="font-display text-[#2c5f34] text-xl">
            Sua sacola {totalItems > 0 && <span className="text-sm font-sans">({totalItems})</span>}
          </h2>
          <button
            onClick={closeCart}
            className="p-2 text-[#633b21] hover:text-[#2c5f34] transition-colors"
            aria-label="Fechar carrinho"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <p className="text-4xl">🍄</p>
              <p className="text-[#633b21]/60">
                Sua sacola está vazia.<br />
                Que tal explorar nossos produtos?
              </p>
              <a
                href={`${import.meta.env.BASE_URL}produtos`}
                onClick={closeCart}
                className="inline-block bg-[#2c5f34] text-[#f9f5e9] px-6 py-3 rounded-xl font-medium hover:bg-[#633b21] transition-colors no-underline"
              >
                Ver produtos
              </a>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li
                  key={item.slug}
                  className="flex gap-4 pb-6 border-b border-[#bec1ac]/30 last:border-0"
                >
                  {/* Item image */}
                  <div className="w-20 h-20 rounded-xl bg-[#bec1ac]/20 overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Item details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <h3 className="font-display text-[#2c5f34] text-sm">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeItem(item.slug)}
                        className="text-[#633b21]/40 hover:text-[#910d16] transition-colors"
                        aria-label={`Remover ${item.name}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>

                    <p className="text-[#2c5f34] font-medium text-sm">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.slug, item.quantity - 1)
                        }
                        className="w-7 h-7 rounded-full border border-[#bec1ac] text-[#633b21] flex items-center justify-center hover:bg-[#bec1ac]/30 transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="text-sm text-[#633b21] w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.slug, item.quantity + 1)
                        }
                        className="w-7 h-7 rounded-full border border-[#bec1ac] text-[#633b21] flex items-center justify-center hover:bg-[#bec1ac]/30 transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#bec1ac]/30 p-6 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-[#633b21] font-medium">Subtotal</span>
              <span className="font-display text-[#2c5f34] text-xl">
                {formatPrice(totalPrice)}
              </span>
            </div>

            {/* Em breve checkout */}
            <button
              disabled
              className="w-full bg-[#bec1ac]/50 text-[#633b21]/60 px-6 py-4 rounded-xl font-medium cursor-not-allowed"
            >
              🍄 Em breve
            </button>
            <p className="text-center text-[#633b21]/50 text-xs">
              Estamos preparando tudo com carinho.<br />
              Siga nosso{" "}
              <a
                href="https://instagram.com/cogupaper"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2c5f34] underline"
              >
                Instagram
              </a>{" "}
              para novidades ♡
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default function CartDrawer() {
  return (
    <CartProvider>
      <CartDrawerInner />
    </CartProvider>
  );
}
