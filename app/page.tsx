import Products from "./components/Products";

export default async function Home() {

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] w-full">
      <Products />
    </div>
  );
}
