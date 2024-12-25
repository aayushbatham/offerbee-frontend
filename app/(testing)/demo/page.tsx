"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import Image from "next/image"
import SuccessAnimation from "@/components/success-animation"
import { useRouter } from "next/navigation"

interface Product {
  id: number
  name: string
  price: number
  image: string
}

const products: Product[] = [
  {
    id: 1,
    name: "RK 64 Mechanical Keyboard",
    price: 149.99,
    image: "/keyboard.jpg"
  },
  {
    id: 2,
    name: "Razer Viper Ultimate",
    price: 79.99,
    image: "/mouse.jpg"
  },
  {
    id: 3,
    name: "Razer BlackShark V2 Pro",
    price: 199.99,
    image: "/headset.jpg"
  },
]

// Add these interfaces for type safety
interface VoucherResponse {
  voucher: {
    _id: string
    name: string
    voucherCode: string
    discountType: 'percentage' | 'fixed'
    discountValue: number
    minCartValue: number | null
    maxDiscount: number | null
    activationDate: string
    expiryDate: string
    usageCount: number
    usageLimit: number
    isActive: boolean
  }
  discountAmount: number
  finalPrice: number
  message: string
}

export default function ShopPage() {
  const router = useRouter()
  const [cart, setCart] = useState<(Product & { quantity: number })[]>([])
  const [voucherCode, setVoucherCode] = useState("")
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  const applyVoucher = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/voucher/apply-voucher`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          voucherCode: voucherCode,
          cartValue: subtotal,
        }),
      })
  
      const data: VoucherResponse = await response.json()
      
      if (response.ok) {
        setAppliedVoucher(data)
        toast.success(`Voucher "${data.voucher.name}" applied successfully!`)
      } else {
        toast.error(data.message || "Invalid voucher code")
        setAppliedVoucher(null)
      }
    } catch (error) {
      toast.error("Failed to apply voucher")
      setAppliedVoucher(null)
    } finally {
      setIsLoading(false)
    }
  }

  const useVoucher = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/voucher/use-voucher`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          voucherCode: voucherCode,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        toast.success(`Voucher "${data.voucher.name}" used successfully!`)
      } else {
        toast.error(data.message || "Failed to use voucher")
      }
    } catch (error) {
      toast.error("Failed to use voucher")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateDiscount = () => {
    if (!appliedVoucher) return 0
    return appliedVoucher.discountAmount
  }

  const total = appliedVoucher ? appliedVoucher.finalPrice : subtotal

  const handleCheckout = async () => {
    if (!cart.length) return

    setIsCheckingOut(true)
    try {
      if (appliedVoucher) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/voucher/use-voucher`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            voucherCode: voucherCode,
            cartValue: subtotal,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to apply voucher during checkout')
        }

        const data = await response.json()
        // Handle successful voucher usage
      }

      // Show success animation
      setShowSuccess(true)
      
      // Clear cart and voucher after 2 seconds
      setTimeout(() => {
        setCart([])
        setVoucherCode("")
        setAppliedVoucher(null)
        setShowSuccess(false)
        router.push('/dashboard') // or wherever you want to redirect
      }, 2000)

    } catch (error) {
      toast.error("Checkout failed. Please try again.")
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <>
      <SuccessAnimation 
        isVisible={showSuccess} 
        onAnimationComplete={() => {
          // Optional: Add any additional cleanup or navigation here
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Products List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Products</h2>
            <div className="grid gap-6">
              {products.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="relative w-24 h-24">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
                  </div>
                  <Button onClick={() => addToCart(product)}>Add to Cart</Button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Cart Summary</h2>
            <div className="border rounded-lg p-4 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  Your cart is empty
                </p>
              )}

              {cart.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter voucher code"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      onClick={applyVoucher}
                      disabled={!voucherCode || isLoading}
                    >
                      {isLoading ? "Applying..." : "Apply"}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {appliedVoucher && (
                      <>
                        <div className="flex justify-between text-green-600">
                          <span>
                            Discount ({appliedVoucher.voucher.name})
                            {appliedVoucher.voucher.discountType === 'percentage' && 
                              ` - ${appliedVoucher.voucher.discountValue}%`}
                          </span>
                          <span>-${appliedVoucher.discountAmount.toFixed(2)}</span>
                        </div>
                        {appliedVoucher.voucher.minCartValue && (
                          <div className="text-sm text-muted-foreground">
                            Minimum cart value: ${appliedVoucher.voucher.minCartValue.toFixed(2)}
                          </div>
                        )}
                        {appliedVoucher.voucher.maxDiscount && (
                          <div className="text-sm text-muted-foreground">
                            Maximum discount: ${appliedVoucher.voucher.maxDiscount.toFixed(2)}
                          </div>
                        )}
                      </>
                    )}
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleCheckout}>Checkout</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}