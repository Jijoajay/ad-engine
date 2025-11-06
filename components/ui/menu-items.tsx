import { useSidebarContext } from "@/context/SidebarProvider";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Link from "next/link";

const menuItemBaseStyles = cva(
  "rounded-lg px-3.5 font-medium text-gray-300 transition-all duration-200 flex items-center gap-3 py-3",
  {
    variants: {
      isActive: {
        true: "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md hover:opacity-90",
        false: "bg-transparent hover:bg-gray-800 hover:text-white",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
);

export function MenuItem(
  props: {
    className?: string;
    children: React.ReactNode;
    isActive: boolean;
  } & ({ as?: "button"; onClick: () => void } | { as: "link"; href: string }),
) {
  const { toggleSidebar, isMobile } = useSidebarContext();

  if (props.as === "link") {
    return (
      <Link
        href={props.href}
        onClick={() => isMobile && toggleSidebar()}
        className={cn(
          menuItemBaseStyles({
            isActive: props.isActive,
          }),
          props.className
        )}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      onClick={props.onClick}
      aria-expanded={props.isActive}
      className={cn(
        menuItemBaseStyles({
          isActive: props.isActive,
        }),
        props.className
      )}
    >
      {props.children}
    </button>
  );
}
