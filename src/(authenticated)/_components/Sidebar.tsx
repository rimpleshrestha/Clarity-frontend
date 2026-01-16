import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavLink, useLocation, useNavigate } from "react-router";
import { StreakCard } from "./StreakCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe } from "../dashboard/profile/user-api";
import {
  Book,
  DoorOpen,
  Lightbulb,
  Pen,
  Settings,
  Star,
  Users,
} from "lucide-react";
const navlinks = [
  {
    name: "Entries",
    link: "/dashboard/entries",
    icon: <Book className="size-4" />,
  },
  {
    name: "Prompts",
    link: "/dashboard/prompts/",
    icon: <Lightbulb className="size-4" />,
  },
  {
    name: "Community",
    link: "/dashboard/community/",
    icon: <Users className="size-4" />,
  },
  {
    name: "Favorites",
    link: "/dashboard/favorites",
    icon: <Star className="size-4" />,
  },
  {
    name: "Settings",
    link: "/dashboard/settings",
    icon: <Settings className="size-4" />,
  },
];
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    initialData: () => queryClient.getQueryData(["me"]),
  });

  return (
    <div className="w-full flex flex-col gap-2 justify-between  bg-sidebar rounded-r-2xl  h-full py-20">
      <div>
        <div className="flex px-5 gap-2 items-center">
          <img src="/logo.png" className="size-[60px]" />{" "}
          <span className="font-semibold text-3xl bg-linear-to-b from-[#A875DF] to-[#8BAADE] bg-clip-text text-transparent">
            Clarity
          </span>
        </div>

        <StreakCard days={user?.data?.streak?.currentCount} />

        <div className="px-5">
          {" "}
          <NavLink
            to={"/dashboard"}
            className={buttonVariants({
              className: "mt-10 px-5  w-full",
            })}
          >
            <Pen /> New Entry
          </NavLink>
        </div>
        <nav>
          <ul>
            {navlinks.map((item) => (
              <NavLink to={item.link}>
                <li
                  className={cn(
                    "py-4 px-4 mt-3 flex items-center  gap-2 rounded-md",
                    location.pathname == item.link && "bg-primary"
                  )}
                >
                  {item.icon} {item.name}
                </li>
              </NavLink>
            ))}
          </ul>
        </nav>
      </div>
      <div className="w-full px-5">
        <Button
          className="w-full"
          onClick={() => {
            localStorage.removeItem("access_token");
            localStorage.clear();
            sessionStorage.clear();
            navigate("/login",{replace: true});
          }}
        >
          <DoorOpen /> Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
