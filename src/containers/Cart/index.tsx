import {
  useState,
  memo,
  useCallback,
  useMemo,
  type FormEvent,
  type ChangeEvent,
} from "react";
import "./index.scss";

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

const initialCart: CartItem[] = [
  { id: 1, name: "Item A", price: 100, qty: 1 },
  { id: 2, name: "Item B", price: 200, qty: 2 },
];

interface CartRowProps {
  item: CartItem;
  increment: (id: number) => void;
  decrement: (id: number) => void;
  remove: (id: number) => void;
}

const CartRow = memo(function CartRow({
  item,
  increment,
  decrement,
  remove,
}: CartRowProps) {
  return (
    <div className="cart-row">
      <p className="cart-row__name">{item.name}</p>
      <p className="cart-row__price">${item.price}</p>

      <div className="qty-control">
        <button
          className="btn btn--icon"
          onClick={() => decrement(item.id)}
          disabled={item.qty <= 1}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="qty-control__value">{item.qty}</span>
        <button
          className="btn btn--icon"
          onClick={() => increment(item.id)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <p className="cart-row__line-total">${item.price * item.qty}</p>

      <button className="btn btn--remove" onClick={() => remove(item.id)}>
        Remove
      </button>
    </div>
  );
});

interface AddItemFormProps {
  // The form holds price as a string (controlled <input type="number">);
  // the parent converts it to a number.
  onAdd: (name: string, price: string) => void;
}

const AddItemForm = ({ onAdd }: AddItemFormProps) => {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!name.trim()) {
        setError("Please enter item name");
        return;
      }
      if (!price) {
        setError("Enter item price");
        return;
      }
      onAdd(name, price);
      setName("");
      setPrice("");
      setError("");
    },
    [name, price, onAdd],
  );

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        className="add-form__input"
        name="Name"
        type="text"
        placeholder="Enter item name"
        value={name}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
      />
      <input
        className="add-form__input add-form__input--price"
        name="Price"
        type="number"
        min="0"
        placeholder="Price"
        value={price}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setPrice(e.target.value)
        }
      />
      <button type="submit" className="btn btn--add">
        Add item
      </button>
      {error && <p className="form-error">{error}</p>}
    </form>
  );
};

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>(initialCart);

  const handleAdd = useCallback((name: string, price: string) => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), name, price: Number(price), qty: 1 },
    ]);
  }, []);

  const handleIncrement = useCallback((id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item,
      ),
    );
  }, []);

  const handleDecrement = useCallback((id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty - 1) } : item,
      ),
    );
  }, []);

  const handleRemove = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const total = useMemo<number>(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items],
  );

  return (
    <div className="cart-page">
      <h1 className="cart-page__title">Your Cart</h1>

      <AddItemForm onAdd={handleAdd} />

      <div className="cart">
        {items.length === 0 ? (
          <p className="cart__empty">Your cart is empty.</p>
        ) : (
          items.map((item) => (
            <CartRow
              key={item.id}
              item={item}
              increment={handleIncrement}
              decrement={handleDecrement}
              remove={handleRemove}
            />
          ))
        )}
      </div>

      <div className="summary">
        <span className="summary__label">Total</span>
        <p className="summary__total">${total}</p>
      </div>
    </div>
  );
};

export default Cart;
