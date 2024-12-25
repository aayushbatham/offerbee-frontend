import NavHeader from "@/components/nav-header"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  PlusCircle, 
  TicketIcon, 
  Settings 
} from "lucide-react"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Navbar */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <NavHeader />
      </div>

      <div className="flex flex-1">
        {/* Fixed Sidebar */}
        <aside className="w-64 fixed left-0 top-[65px] bottom-0 border-r bg-background">
          <nav className="space-y-2 p-4">
          <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                <TicketIcon className="mr-2 h-4 w-4" />
                My Vouchers
              </Button>
            </Link>
            <Link href="/dashboard/create">
              <Button variant="ghost" className="w-full justify-start">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Voucher
              </Button>
            </Link>
            {/*<Link href="/dashboard/settings">*/}
            {/*  <Button variant="ghost" className="w-full justify-start">*/}
            {/*    <Settings className="mr-2 h-4 w-4" />*/}
            {/*    Settings*/}
            {/*  </Button>*/}
            {/*</Link>*/}
          </nav>
        </aside>

        {/* Scrollable Main Content */}
        <main className="flex-1 ml-64 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
} 