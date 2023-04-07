import Assistant from "@/components/Assistant";
import Head from "@/components/Head";

export default function Home() {
  return (
    <>
      <Head />
      <main className="my-8 mx-auto max-w-[800px]">
        <h1 className="text-4xl font-bold text-center text-blue-300">GPTinker</h1>
        <h2 className="text-2xl font-normal text-center text-gray-300 mb-8">
          AI junior developer
        </h2>

        <Assistant />
      </main>
    </>
  );
}
