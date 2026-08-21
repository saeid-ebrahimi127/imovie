import { appName } from '#/lib/my-utils.ts'
import { Link } from '@tanstack/react-router'
import { FilmIcon } from 'lucide-react'

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <FilmIcon className="text-primary size-5" />
      <span className="text-base font-medium">{appName()}</span>
    </Link>
  )
}
