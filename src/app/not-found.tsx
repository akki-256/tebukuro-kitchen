import Footer from "@/app/components/Footer";

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col bg-[#FFFBF4] text-gray-800">
      <div className="flex flex-grow items-center justify-center">
        <div className="flex items-center">
          <h1 className="mr-6 border-r border-black pr-5 text-2xl font-medium">
            404
          </h1>
          <p className="text-sm">This page could not be found.</p>
        </div>
      </div>
      <Footer pathName="" />
    </section>
  );
}
