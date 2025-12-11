import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Products from './components/Products';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
    return (
        <div className="bg-tm-navy min-h-screen text-tm-slate font-sans selection:bg-tm-green selection:text-tm-navy">
            <Navbar />
            <main>
                <Hero />
                <About />
                <Products />
                <Contact />
            </main>
            <Footer />
        </div>
    );
}

export default App;
