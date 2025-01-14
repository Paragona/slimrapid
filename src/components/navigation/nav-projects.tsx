import { NavigationLink } from '@/types'
import { NavLink } from '@/components/ui/nav-link'

interface NavProjectsProps {
  projects: NavigationLink[]
}

export function NavProjects({ projects }: NavProjectsProps) {
  return (
    <nav className="space-y-1">
      {projects.map((project) => (
        <NavLink
          key={project.href}
          href={project.href}
          icon={project.icon}
          label={project.label}
        />
      ))}
    </nav>
  )
}
