import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar.tsx'
import { cn } from '#/lib/utils.ts'

export const UserAvatar = ({
  user: { name, image },
  avatarClassName,
  avatarFallbackClassName,
}: {
  user: { name: string; image?: string }
  avatarClassName?: string
  avatarFallbackClassName?: string
}) => {
  return (
    <Avatar className={avatarClassName}>
      <AvatarImage src={image} alt={`عکس کاربری ${name}`} />
      <AvatarFallback
        className={cn(
          'bg-primary text-white capitalize',
          avatarFallbackClassName,
        )}
      >
        {name[0]}
      </AvatarFallback>
    </Avatar>
  )
}
