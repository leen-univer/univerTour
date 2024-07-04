import FirstContent from "./components/FirstContent";
import Navbar from "./components/Navbar";
import { Container } from "@mui/material";
import "./style/index.css";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";
import FeatureSection from "./components/FeatureSection";
import FeatureSectionHeading from "./components/FeatureSectionHeading";

function Home() {
  return (
    <div>
      <Navbar />

      <Container maxWidth="lg">
        <FirstContent />
      </Container>

      <div className="bg_alice">
        <FeatureSectionHeading />
      </div>
      {[].map((item) => (
        <FeatureSection
          key={item.title}
          title={item.title}
          descripton={item.descripton}
          img={item.img}
          isReversed={item.isReversed}
        />
      ))}

      <ContactUs />

      <Footer />
    </div>
  );
}

export default Home;
