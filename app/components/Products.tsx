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
      <div className="border-gray-500 w-full max-w-2xl mx-auto mb-4">
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
        className="flex flex-col gap-6 px-4 max-w-7xl mx-auto w-full"
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
              className="flex flex-col md:flex-row bg-white rounded-2xl shadow-md p-5 gap-6 items-center"
            >
              <div className="flex flex-col items-center md:w-64">
                <img
                  src={produto.image}
                  alt={produto.name}
                  className="w-48 h-48 object-contain"
                />

                <h2 className="mt-4 text-xl font-bold text-center text-black">
                  {produto.model}
                </h2>
              </div>

              <div className="hidden md:block w-1 self-stretch bg-black"></div>

              <div className="flex-1 w-full">

                <h1 className="text-2xl font-bold text-black mb-6">
                  {produto.name}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

                  <div>
                    <p className="text-lg text-gray-400">Durabilidade</p>
                    <strong className="text-xl font-bold text-black">{produto.treadwear}</strong>
                  </div>

                  <div>
                    <p className="text-lg text-gray-400">Tração</p>
                    <strong className="text-xl font-bold text-black">{produto.traction}</strong>
                  </div>

                  <div>
                    <p className="text-lg text-gray-400">Temperatura</p>
                    <strong className="text-xl font-bold text-black">{produto.temperature}</strong>
                  </div>

                  <div>
                    <p className="text-lg text-gray-400">Índice de velocidade</p>
                    <strong className="text-xl font-bold text-black">{produto.speedRating}</strong>
                  </div>

                  <div>
                    <p className="text-lg text-gray-400">Capacidade de carga</p>
                    <strong className="text-xl font-bold text-black">{produto.loadIndex}</strong>
                  </div>

                  <div>
                    <p className="text-lg text-gray-400">Desenho</p>
                    <strong className="text-xl font-bold text-black">{produto.pattern.charAt(0) + produto.pattern.slice(1).toLowerCase()}</strong>
                  </div>

                </div>

              </div>

            </div>
          ))
        )}
      </div>
    </div>
  )
}