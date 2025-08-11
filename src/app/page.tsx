import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Stories from "@/components/Stories";
import Work from "@/components/Work";

export default function HomePage() {
  return (
    <>
      <Navbar/>
      <Hero />
      <Work/>
      <Stories/>
      <FAQ/>
      <Footer/>
      {/* More sections later */}
    </>
  );
}