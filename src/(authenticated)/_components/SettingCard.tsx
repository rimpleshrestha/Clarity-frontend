import { type ReactNode } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
const SettingCard = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) => {
  return (
    <Card className="w-full bg-primary">
      <CardHeader>
        <CardTitle className="flex flex-col ">{title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
        <CardFooter className="px-0">{children}</CardFooter>
      </CardHeader>
    </Card>
  );
};

export default SettingCard;
