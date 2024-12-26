import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-yellow-500">🐝</span>
              <span className="text-sm text-muted-foreground">
                Made with ❤️.
              </span>
            </div>
            <div className="flex gap-4">
              <Link href="https://github.com/aayushbatham/offerbee-frontend" className="text-sm text-muted-foreground hover:underline">
                Github (frontend)
              </Link>
              <Link href="https://github.com/aayushbatham/offerbee-backend" className="text-sm text-muted-foreground hover:underline">
                Github (backend)
              </Link>
            </div>
          </div>
        </div>
      </footer>
    )
}          