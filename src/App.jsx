import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ChiSiamo from './components/ChiSiamo'
import Atmosfera from './components/Atmosfera'
import DoppiaAnima from './components/DoppiaAnima'
import Menu from './components/Menu'
import Sedi from './components/Sedi'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ChiSiamo />
        <Atmosfera />
        <DoppiaAnima />
        <Menu />
        <Sedi />
      </main>
      <Footer />
    </>
  )
}
