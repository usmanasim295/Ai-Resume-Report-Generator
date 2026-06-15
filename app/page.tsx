import UploadPdf from '@/components/UploadPdf';

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6 flex  items-center justify-center font-serif">
        AI PDF Chat
      </h1>

      <UploadPdf />
    </main>
  );
}
