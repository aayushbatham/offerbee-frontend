"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"

export default function CreateVoucherPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [voucherCode, setVoucherCode] = useState("")
  const [discountType, setDiscountType] = useState<string>("")
  const [discountValue, setDiscountValue] = useState<string>("")
  const [reusable, setReusable] = useState<boolean>(false)

  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const length = 8
    let result = ''
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    setVoucherCode(result)
  }

  const handleDiscountValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (discountType === "percentage") {
      // Only update if the value is empty or between 0 and 100
      if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
        setDiscountValue(value)
      }
    } else {
      // For fixed amount, allow any positive number
      if (value === "" || Number(value) >= 0) {
        setDiscountValue(value)
      }
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch("http://localhost:8080/voucher/create-voucher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.get("name"),
          voucherCode: formData.get("voucherCode"),
          discountType: formData.get("discountType"),
          discountValue: Number(formData.get("discountValue")),
          minCartValue: Number(formData.get("minCartValue")) || undefined,
          maxDiscount: Number(formData.get("maxDiscount")) || undefined,
          activationDate: new Date(formData.get("activationDate") as string),
          expiryDate: new Date(formData.get("expiryDate") as string),
          usageLimit: Number(formData.get("usageLimit")) || undefined,
          reusable: reusable
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create voucher")
      }

      toast.success("Voucher created successfully!")
      router.push("/dashboard")
    } catch (error) {
      toast.error("Failed to create voucher")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Voucher</CardTitle>
          <CardDescription>
            Fill in the details below to create a new voucher
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Voucher Name</Label>
              <Input
                  id="name"
                  name="name"
                  required
                  disabled={isLoading}
                  placeholder="Summer Sale 2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="voucherCode">Voucher Code</Label>
              <div className="flex gap-2">
                <Input
                    id="voucherCode"
                    name="voucherCode"
                    required
                    disabled={isLoading}
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="SUMMER24"
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={generateRandomCode}
                    disabled={isLoading}
                >
                  Generate
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <Select
                  name="discountType"
                  required
                  onValueChange={(value) => {
                    setDiscountType(value)
                    // Reset discount value when changing type
                    setDiscountValue("")
                  }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select discount type"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountValue">
                Discount Value {discountType === "percentage" ? "(0-100%)" : ""}
              </Label>
              <Input
                  id="discountValue"
                  name="discountValue"
                  type="number"
                  required
                  disabled={isLoading}
                  placeholder={discountType === "percentage" ? "0-100" : "Amount"}
                  value={discountValue}
                  onChange={handleDiscountValueChange}
                  min={0}
                  max={discountType === "percentage" ? 100 : undefined}
                  step="any"
              />
              {discountType === "percentage" && Number(discountValue) > 100 && (
                  <p className="text-sm text-red-500">
                    Percentage discount cannot exceed 100%
                  </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="minCartValue">Minimum Cart Value (Optional)</Label>
              <Input
                  id="minCartValue"
                  name="minCartValue"
                  type="number"
                  disabled={isLoading}
                  placeholder="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxDiscount">Maximum Discount (Optional)</Label>
              <Input
                  id="maxDiscount"
                  name="maxDiscount"
                  type="number"
                  disabled={isLoading}
                  placeholder="50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activationDate">Activation Date</Label>
              <Input
                  id="activationDate"
                  name="activationDate"
                  type="datetime-local"
                  required
                  disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="datetime-local"
                  required
                  disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usageLimit">Usage Limit (Optional)</Label>
              <Input
                  id="usageLimit"
                  name="usageLimit"
                  type="number"
                  disabled={isLoading}
                  placeholder="100"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                  id="reusable"
                  checked={reusable}
                  onCheckedChange={(checked: boolean) => setReusable(checked)}
                  disabled={isLoading}
              />
              <Label htmlFor="reusable">Reusable</Label>
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Voucher"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}