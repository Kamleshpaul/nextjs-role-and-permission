import Link from "next/link"
import {
  CircleUser,
  Coffee,
  Home,
  Menu,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Logout from "./logout"
import Guard from "@/components/server/Guard"
import { permissionList } from "@/utils/constants"


const Nav = () =>
  <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
    <Link
      href="/"
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
    >
      <Home className="h-4 w-4" />
      Dashboard
    </Link>

    <Guard
      permission={permissionList.POST_SHOW}
    >
      <Link
        href="/users"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
      >
        <Users className="h-4 w-4" />
        Users
      </Link>
    </Guard>
  </nav>

export default async function DashboardLayout(
  { children }:
    Readonly<{
      children: React.ReactNode;
    }>) {

  const session = await auth();
  if (!session) {
    redirect('/login')
  }
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Coffee className="h-6 w-6" />
              <span className="">Coding Tricks</span>
            </Link>
          </div>
          <div className="flex-1">
            <Nav />
          </div>

        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="flex flex-col">
              <div className="mt-10">
                <Nav />
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">

          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{session.user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Logout />
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        {children}
      </div>
    </div>
  )
}
