import { FC } from "react";
import { Button } from "../ui/button";
interface Props {
  children: React.ReactNode;
}
const ActionButton: FC<Props> = ({ children }) => {
  return <Button className="bg-red-400">{children}</Button>;
};
export default ActionButton;
