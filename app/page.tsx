import Hero from "@/components/hero"
import Footer from "@/components/footer"
import NavHeader from "@/components/nav-header"

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavHeader />
      <Hero />
      <Footer />
    </div>
  )
}