import { useAuth } from '@/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { LogOut, User as UserIcon } from 'lucide-react'

export function NavUser() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          <UserIcon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium">{user.email}</p>
          <p className="text-xs text-muted-foreground">
            {user.name || 'User'}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={logout}
        className="h-8 w-8"
        aria-label="Logout"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
