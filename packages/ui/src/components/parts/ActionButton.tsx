import { FC } from "react";
import { Button } from "../ui/button";
import { cn } from "@ui/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const ActionButton: FC<Props> = ({ children, className }) => {
  return <Button className={cn(className)}>{children}</Button>;
};
export default ActionButton;
