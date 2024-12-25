import Link from "next/link";
import { Button } from "./ui/button";

export default function Hero() {
    return (
        <section className="flex-1 flex items-center justify-center">
       <div className="container mx-auto px-4">
         <div className="max-w-3xl mx-auto text-center">
           <h1 className="text-4xl md:text-6xl font-bold mb-6">
             Buzz-worthy Deals at Your Fingertips 🍯
           </h1>
           <p className="text-xl text-muted-foreground mb-8">
             Create, manage, and share digital vouchers effortlessly. Join thousands of businesses 
             making their offers sweeter with OfferBee.
           </p>
           
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <Link href="/dashboard ">
             <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600">
               Start Creating Vouchers
             </Button>
             </Link>
             <Button size="lg" variant="outline">
               See How It Works
             </Button>
           </div>
         </div>
       </div>
     </section>
    )
}

