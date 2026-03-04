import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import Treatments from "@/components/Treatments";
import Differentials from "@/components/Differentials";
import About from "@/components/About";
import Location from "@/components/Location";
import ContactForm from "@/components/ContactForm";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const Index = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Testimonials />
      <Treatments />
      <Differentials />
      <About />
      <Location />
      <ContactForm />
      <FinalCTA />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
};

export default Index;
