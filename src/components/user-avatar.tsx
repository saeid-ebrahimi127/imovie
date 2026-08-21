import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar.tsx'

export const UserAvatar = ({
  user: { name, image },
}: {
  user: { name: string; image?: string }
}) => {
  return (
    <Avatar>
      <AvatarImage src={image} alt={`آواتار ${name}`} />
      <AvatarFallback className="bg-primary text-white capitalize">
        {name[0]}
      </AvatarFallback>
    </Avatar>
  )
}
