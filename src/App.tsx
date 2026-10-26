import React, { useEffect, useState } from "react";
import "./styles.css";
import { ProductModel } from "./product.types";

const PRODUCTS: ProductModel[] = [
  {
    id: 1,
    name: "Studio Headphones",
    category: "Audio",
    price: 199,
    description: "Wireless headphones for everyday listening.",
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    category: "Accessories",
    price: 149,
    description: "Compact mechanical keyboard with tactile switches.",
  },
  {
    id: 3,
    name: "4K Monitor",
    category: "Displays",
    price: 499,
    description: "27-inch monitor designed for creative work.",
  },
  {
    id: 4,
    name: "USB-C Hub",
    category: "Accessories",
    price: 89,
    description: "Multi-port hub for laptops and tablets.",
  },
  {
    id: 5,
    name: "Desktop Speakers",
    category: "Audio",
    price: 129,
    description: "Compact speakers for desktop setups.",
  },
  {
    id: 6,
    name: "Portable Monitor",
    category: "Displays",
    price: 299,
    description: "Lightweight secondary display for mobile setups.",
  },
];

function fetchProducts(): Promise<ProductModel[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(PRODUCTS);
    }, 700);
  });
}

function App() {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        setErrorMsg("Fecht Data Error");
      });
  }, []);

  const visibleProducts = products
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((product) => {
      if (category === "All") {
        return true;
      }

      return product.category === category;
    })
    .filter((product) => {
      if (search.length > 1) {
        return product?.name?.toLowerCase().includes(search?.toLowerCase());
      } else {
        return true;
      }
    });

  function toggleFavorite(productId: number) {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter((id) => id !== productId));
      return;
    }

    setFavorites([...favorites, productId]);
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <h1>Product Explorer</h1>
          <p>Browse our available products.</p>
        </div>
      </header>

      <section className="toolbar">
        <input
          type="text"
          placeholder="Search products"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="All">All categories</option>
          <option value="Audio">Audio</option>
          <option value="Accessories">Accessories</option>
          <option value="Displays">Displays</option>
        </select>
      </section>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <section className="productGrid">
          {errorMsg !== "" && <div>{`${errorMsg}`}</div>}
          {visibleProducts.map((product) => (
            <article className="productCard" key={product.id}>
              <div className="productHeader">
                <span className="category">{product.category}</span>

                <div
                  aria-label="favorite"
                  role="button"
                  tabIndex={0}
                  className="favorite"
                  onClick={() => toggleFavorite(product.id)}
                >
                  {favorites.includes(product.id) ? "★" : "☆"}
                </div>
              </div>

              <h2>{product.name}</h2>

              <p>{product.description}</p>

              <strong>${product.price}</strong>
            </article>
          ))}
          {search !== "" && visibleProducts.length === 0 && (
            <div>
              Not product found for <strong>{`${search}`}</strong>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default App;
