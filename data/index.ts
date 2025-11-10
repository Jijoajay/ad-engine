import * as Icons from "@/assets/icons";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Settings, Target } from "lucide-react";
import { FaAdversal } from "react-icons/fa";

export const NAV_DATA = [
  {
    // label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [],
        label: "dashboard",
        url:"/dashboard"
      },
      {
        title: "Project",
        url: "/dashboard/project",
        icon: Icons.Calendar,
        label: "project",
        items: [],
      },
      {
        title: "Device",
        url: "/dashboard/device",
        icon: Icons.Calendar,
        label: "device",
        items: [],
      },
      {
        title: "Device Type",
        url: "/dashboard/device-type",
        icon: Icons.Calendar,
        label: "device-type",
        items: [],
      },
      {
        title: "Media Detail",
        url: "/dashboard/media-detail",
        icon: Icons.Calendar,
        label: "media-detail",
        items: [],
      },
      {
        title: "Media Type",
        url: "/dashboard/media-type",
        icon: Icons.Calendar,
        label: "media-type",
        items: [],
      },
      {
        title: "Project Pages",
        url: "/dashboard/project-page",
        icon: Icons.Calendar,
        label: "project-page",
        items: [],
      },
      {
        title: "Target Types",
        url: "/dashboard/target-type",
        label: "target-type",
        icon: Target,
        items: [],
      },
      {
        title: "AD Settings",
        url: "/dashboard/ad-setting",
        icon: Settings,
        label: "ad-setting",
        items: [],
      },
      {
        title: "Manage AD",
        url: "/dashboard/manage-ad",
        icon: FaAdversal,
        label: "ad-upload",
        items: [],
      },
      // {
      //   title: "Profile",
      //   url: "/profile",
      //   icon: Icons.User,
      //   items: [],
      // },
      // {
      //   title: "Forms",
      //   icon: Icons.Alphabet,
      //   items: [
      //     {
      //       title: "Form Elements",
      //       url: "/forms/form-elements",
      //     },
      //     {
      //       title: "Form Layout",
      //       url: "/forms/form-layout",
      //     },
      //   ],
      // },
      // {
      //   title: "Tables",
      //   url: "/tables",
      //   icon: Icons.Table,
      //   items: [
      //     {
      //       title: "Tables",
      //       url: "/tables",
      //     },
      //   ],
      // },
      // {
      //   title: "Pages",
      //   icon: Icons.Alphabet,
      //   items: [
      //     {
      //       title: "Settings",
      //       url: "/pages/settings",
      //     },
      //   ],
      // },
    ],
  },
  // {
  //   label: "OTHERS",
  //   items: [
  //     {
  //       title: "Charts",
  //       icon: Icons.PieChart,
  //       items: [
  //         {
  //           title: "Basic Chart",
  //           url: "/charts/basic-chart",
  //         },
  //       ],
  //     },
  //     {
  //       title: "UI Elements",
  //       icon: Icons.FourCircle,
  //       items: [
  //         {
  //           title: "Alerts",
  //           url: "/ui-elements/alerts",
  //         },
  //         {
  //           title: "Buttons",
  //           url: "/ui-elements/buttons",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Authentication",
  //       icon: Icons.Authentication,
  //       items: [
  //         {
  //           title: "Sign In",
  //           url: "/auth/sign-in",
  //         },
  //       ],
  //     },
  //   ],
  // },
];
