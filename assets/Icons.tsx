import { AntDesign, Feather } from "@expo/vector-icons";
import { ComponentProps } from "react";

export type RouteNames = "home" | "notes";

export const icons: Record<
  RouteNames,
  (props: { color?: string; size?: number }) => JSX.Element
> = {
  home: (props) => <AntDesign name="home" size={26} {...props} />,
  notes: (props) => <Feather name="compass" size={26} {...props} />,
};
