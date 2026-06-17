'use client';

import { useEffect, useMemo, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { ProductType } from "../api/products/route";

export default function Products() {
const [produtos, setProdutos] = useState<ProductType[]>([]);
const [pesquisa, setPesquisa] = useState("");

useEffect(() => {
  const buscarProdutos = async () => {
    try {
      const resposta = await fetch("/api/products");
        if (!resposta.ok) {
          throw new Error("Erro ao buscar produtos");
        }
        const dados: ProductType[] = await resposta.json();

      setProdutos(dados);
    } catch (erro) {
      console.error("Erro ao buscar produtos:", erro);
    }
  };

  buscarProdutos();
}, []);

  const produtosFiltrados = useMemo(() => {
    if (!pesquisa.trim()) {
      return produtos;
    }

    const termos = pesquisa
      .toLowerCase()
      .trim()
      .split(/\s+/);

    return produtos.filter((produto) => {
      const textoPesquisavel = [
        produto.name,
        produto.model,
        ...produto.cars,
      ]
        .join(" ")
        .toLowerCase();

      return termos.every((termo) => textoPesquisavel.includes(termo));
    });
  }, [produtos, pesquisa]);

  return (
    <div className="w-full flex justify-center flex-col h-full">
      <div className="border-gray-500 w-1/2 mx-auto mb-4">
        <label htmlFor="search" className="block text-sm/6 font-medium text-gray-900">
          Pesquisa
        </label>
        <div className="mt-2 grid grid-cols-1">
          <input
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            id="search"
            name="search"
            type="search"
            placeholder="Pesquisar produtos"
            className="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-9 sm:text-sm/6"
          />
          <MagnifyingGlassIcon
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 sm:size-4"
          />
        </div>
      </div>

      <div className="mb-4 border-b border-1"></div>
      <div
  data-testid="products"
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4"
>
  {produtosFiltrados.length === 0 ? (
  <p className="text-center text-gray-500">
    Nenhum produto encontrado
  </p>
) : (
  produtosFiltrados.map((produto) => (
    <div
      key={produto.name}
      data-testid="product"
      className="border rounded-lg p-4 shadow-sm"
    >
      <img
        src={produto.image}
        alt={produto.name}
        className="w-full h-48 object-contain mb-4"
      />

      <h2 className="font-semibold text-sm">
        {produto.name}
      </h2>

      <p className="text-gray-500">
        {produto.model}
      </p>
    </div>
  ))
)}
</div>
    </div>
  )
}