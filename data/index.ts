import * as Icons from "@/assets/icons";
import { Settings, Target } from "lucide-react";
import { FaAdversal } from "react-icons/fa";

export const NAV_DATA = [
  {
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Icons.HomeIcon,
        items: [],
      },
      {
        title: "Project",
        url: "/dashboard/project",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Device",
        url: "/dashboard/device",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Device Type",
        url: "/dashboard/device-type",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Media Detail",
        url: "/dashboard/media-detail",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Media Type",
        url: "/dashboard/media-type",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Project Pages",
        url: "/dashboard/project-page",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Target Types",
        url: "/dashboard/target-type",
        icon: Target,
        items: [],
      },
      {
        title: "AD Settings",
        url: "/dashboard/ad-setting",
        icon: Settings,
        items: [],
      },
      {
        title: "Manage AD",
        url: "/dashboard/manage-ad",
        icon: FaAdversal,
        items: [],
      },
      {
        title: "AD Location",
        url: "/dashboard/ad-location",
        icon: FaAdversal,
        items: [],
      },
      {
        title: "AD Area Category",
        url: "/dashboard/ad-area-category",
        icon: FaAdversal,
        items: [],
      },
    ],
  },
];
