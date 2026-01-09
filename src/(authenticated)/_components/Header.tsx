import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../dashboard/profile/user-api";
import { useNavigate } from "react-router";

const Header = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const user = data?.user;
  const navigate = useNavigate();
  return (
    <header className="fixed z-9999 w-fit top-2 right-6">
      {isLoading || !user ? (
        <Skeleton className="h-12 w-12 rounded-full" />
      ) : (
        <Avatar
          onClick={() => {
            navigate("/dashboard/profile");
          }}
          className="h-12 w-12 border-2 border-slate-100"
        >
          {user.profile_picture ? (
            <AvatarImage src={user.profile_picture} alt={user.name} />
          ) : (
            <AvatarFallback>
              {(user.email ?? user.name ?? "U").charAt(0)}
            </AvatarFallback>
          )}
        </Avatar>
      )}
    </header>
  );
};
export default Header;
