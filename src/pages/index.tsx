import Assistant from "@/components/assistant";
import Head from "@/components/head";

export default function Home() {
  return (
    <>
      <Head />
      <main className="my-8 mx-auto max-w-[800px]">
        <h1 className="text-4xl font-bold text-center text-yellow-500">GPT-Dev</h1>
        <h2 className="text-2xl font-normal text-center text-gray-500 mb-8">
          AI junior developer
        </h2>

        <Assistant />
      </main>
    </>
  );
}
