import { Button } from  "./button"

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Namaco</h1>

        <div className="flex items-center gap-3">
          <Button variant="ghost">Login</Button>
          <Button>Write</Button>
        </div>
      </div>
    </nav>
  )
}

