import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ChiSiamo from './components/ChiSiamo'
import Atmosfera from './components/Atmosfera'
import DoppiaAnima from './components/DoppiaAnima'
import Sedi from './components/Sedi'
import Footer from './components/Footer'
import MenuPage from './pages/MenuPage'

function HomePage() {
  return (
    <>
      <Hero />
      <ChiSiamo />
      <Atmosfera />
      <DoppiaAnima />
      <Sedi />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
