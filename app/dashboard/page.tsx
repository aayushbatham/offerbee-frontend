"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {Button} from "@/components/ui/button";

interface Voucher {
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
  totalUsageCount: number
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:8080/voucher/my-vouchers', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch vouchers')
        }

        const data = await response.json()
        setVouchers(data)
      } catch (error) {
        toast.error('Failed to load vouchers')
      } finally {
        setIsLoading(false)
      }
    }

    fetchVouchers()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const deleteVoucher = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/voucher/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete voucher')
      }

      toast.success('Voucher deleted successfully')
      setVouchers((prev) => prev.filter((voucher) => voucher._id !== id))
    } catch (error) {
      toast.error('Failed to delete voucher')
    }
  }

  const getVoucherStatus = (voucher: Voucher) => {
    const now = new Date()
    const activationDate = new Date(voucher.activationDate)
    const expiryDate = new Date(voucher.expiryDate)

    if (!voucher.isActive) {
      return { label: 'Inactive', variant: 'destructive' as const }
    }
    if (now < activationDate) {
      return { label: 'Scheduled', variant: 'secondary' as const }
    }
    if (now > expiryDate) {
      return { label: 'Expired', variant: 'destructive' as const }
    }
    if (voucher.usageCount >= voucher.usageLimit) {
      return { label: 'Exhausted', variant: 'destructive' as const }
    }
    return { label: 'Active', variant: 'default' as const }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Vouchers</h1>
          <Badge variant="outline">
            Total: {vouchers.length}
          </Badge>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vouchers.map((voucher) => (
                  <TableRow key={voucher._id}>
                    <TableCell className="font-medium">{voucher.name}</TableCell>
                    <TableCell>
                      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                        {voucher.voucherCode}
                      </code>
                    </TableCell>
                    <TableCell>
                      {voucher.discountValue}
                      {voucher.discountType === 'percentage' ? '%' : ' USD'}
                      {voucher.maxDiscount && (
                          <span className="text-xs text-muted-foreground">
                      {' '}(max: ${voucher.maxDiscount})
                    </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {voucher.totalUsageCount}/{voucher.usageLimit}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(voucher.activationDate)}</div>
                        <div className="text-muted-foreground">to</div>
                        <div>{formatDate(voucher.expiryDate)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getVoucherStatus(voucher).variant}>
                        {getVoucherStatus(voucher).label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteVoucher(voucher._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
  )
}