import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/app/(marketing)/page";

export default function RootPage() {
  return (
    <>
      <Navbar />
      <main>
        <HomePage />
      </main>
      <Footer />
    </>
  );
}
