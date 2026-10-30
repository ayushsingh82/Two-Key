import { Faq, Footer, Hero, Navbar, Preview, Sections } from "@/components/site/landing";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Sections />
        <Preview />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
