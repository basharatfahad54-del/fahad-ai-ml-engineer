import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TrustStrip from './components/TrustStrip'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Services from './components/Services'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CursorGlow from './components/CursorGlow'
import RobotWorld from './components/robot/RobotWorld'

function App() {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-20%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-30%] right-[-10%] h-[520px] w-[520px] rounded-full bg-violet/10 blur-3xl" />
      </div>
      <CursorGlow />
      <RobotWorld />
      <Navbar />
      <div className="relative z-10">
        <main>
          <Hero />
          <TrustStrip />
          <About />
          <Skills />
          <Projects />
          <Services />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App