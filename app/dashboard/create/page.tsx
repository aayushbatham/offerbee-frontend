"use client"

import React, { useState } from "react"
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
  const [includeEligibilityCriteria, setIncludeEligibilityCriteria] = useState(false);
  const [criteria, setCriteria] = useState({
    gender: false,
    ageRange: false,
    userType: false,
  });


  const generateRandomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const length = 8
    let result = ""
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    setVoucherCode(result)
  }

  const handleDiscountValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (discountType === "percentage") {
      if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
        setDiscountValue(value)
      }
    } else {
      if (value === "" || Number(value) >= 0) {
        setDiscountValue(value)
      }
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const token = localStorage.getItem("token")
    const eligibilityCriteria = includeEligibilityCriteria
        ? {
          ...(criteria.gender && { gender: formData.get("gender") || undefined }),
          ...(criteria.ageRange && {
            ageRange: [
              Number(formData.get("ageRangeStart")) || undefined,
              Number(formData.get("ageRangeEnd")) || undefined,
            ],
          }),
          ...(criteria.userType && { userType: formData.get("userType") || undefined }),
        }
        : undefined;

    try {
      const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/voucher/create-voucher`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: formData.get("name"),
              voucherCode: formData.get("voucherCode"),
              discountType: formData.get("discountType"),
              discountValue: Number(formData.get("discountValue")),
              minCartValue: Number(formData.get("minCartValue")) || undefined,
              maxDiscount: Number(formData.get("maxDiscount")) || discountValue,
              activationDate: new Date(formData.get("activationDate") as string),
              expiryDate: new Date(formData.get("expiryDate") as string),
              usageLimit: Number(formData.get("usageLimit")) || undefined,
              reusable: reusable,
              eligibilityCriteria
            }),
          }
      )

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

  const todayDate = new Date().toISOString().slice(0, 16)

  return (
      <div className="max-w-2xl mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Voucher</CardTitle>
            <CardDescription>
              Fill in the details below to create a new voucher.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Voucher Name</Label>
                <Input
                    id="name"
                    name="name"
                    required
                    disabled={isLoading}
                    placeholder="Summer Sale 2024"
                />
                <CardDescription>Provide a descriptive name for the voucher.</CardDescription>
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
                <CardDescription>
                  Enter a unique code for the voucher or generate one automatically.
                </CardDescription>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type</Label>
                <Select
                    name="discountType"
                    required
                    onValueChange={(value) => {
                      setDiscountType(value)
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
                <CardDescription>
                  Choose whether the discount is a percentage or a fixed amount.
                </CardDescription>
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
                <CardDescription>
                  Specify the discount value in percentage or a fixed amount.
                </CardDescription>
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
                <CardDescription>
                  Define a minimum cart value for the voucher to be applicable.
                </CardDescription>
              </div>

              {discountType !== "fixed" && (
                  <div className="space-y-2">
                    <Label htmlFor="maxDiscount">Maximum Discount (Optional)</Label>
                    <Input
                        id="maxDiscount"
                        name="maxDiscount"
                        type="number"
                        disabled={isLoading}
                        placeholder="50"
                    />
                    <CardDescription>
                      Set a maximum cap on the discount amount for percentage-based discounts.
                    </CardDescription>
                  </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="activationDate">Activation Date</Label>
                <Input
                    id="activationDate"
                    name="activationDate"
                    type="datetime-local"
                    required
                    disabled={isLoading}
                    defaultValue={todayDate}
                />
                <CardDescription>
                  Select the start date and time for the voucher's activation.
                </CardDescription>
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
                <CardDescription>
                  Select the expiry date and time for the voucher.
                </CardDescription>
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
                <CardDescription>
                  Specify the maximum number of times this voucher can be used.
                </CardDescription>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                    id="reusable"
                    checked={reusable}
                    onCheckedChange={(checked: boolean) => setReusable(checked)}
                    disabled={isLoading}
                />
                <Label htmlFor="reusable">Reusable</Label>
                <CardDescription>
                  Check if the voucher can be reused multiple times by the same user.
                </CardDescription>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                      id="includeEligibilityCriteria"
                      checked={includeEligibilityCriteria}
                      onCheckedChange={(checked: boolean) => setIncludeEligibilityCriteria(checked)}
                      disabled={isLoading}
                  />
                  <Label htmlFor="includeEligibilityCriteria">Include Eligibility Criteria</Label>
                </div>
              </div>

              {includeEligibilityCriteria && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                            id="gender"
                            checked={criteria.gender}
                            onCheckedChange={(checked: boolean) =>
                                setCriteria((prev) => ({ ...prev, gender: checked }))
                            }
                            disabled={isLoading}
                        />
                        <Label htmlFor="gender">Gender</Label>
                      </div>
                      {criteria.gender && (
                          <Select name="gender" disabled={isLoading}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                            id="ageRange"
                            checked={criteria.ageRange}
                            onCheckedChange={(checked: boolean) =>
                                setCriteria((prev) => ({ ...prev, ageRange: checked }))
                            }
                            disabled={isLoading}
                        />
                        <Label htmlFor="ageRange">Age Range</Label>
                      </div>
                      {criteria.ageRange && (
                          <div className="flex space-x-2">
                            <Input
                                id="ageRangeStart"
                                name="ageRangeStart"
                                type="number"
                                placeholder="Min Age"
                                disabled={isLoading}
                            />
                            <Input
                                id="ageRangeEnd"
                                name="ageRangeEnd"
                                type="number"
                                placeholder="Max Age"
                                disabled={isLoading}
                            />
                          </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                            id="userType"
                            checked={criteria.userType}
                            onCheckedChange={(checked: boolean) =>
                                setCriteria((prev) => ({ ...prev, userType: checked }))
                            }
                            disabled={isLoading}
                        />
                        <Label htmlFor="userType">User Type</Label>
                      </div>
                      {criteria.userType && (
                          <Select name="userType" disabled={isLoading}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select user type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="old">Old</SelectItem>
                            </SelectContent>
                          </Select>
                      )}
                    </div>
                  </div>
              )}

              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Voucher"}
              </Button>
            </form>
          </CardContent>

        </Card>

      </div>
  )
}
