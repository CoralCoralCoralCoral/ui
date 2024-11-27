import { Home, Hospital, LockIcon, MedalIcon, Microscope, RadiationIcon, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Contact Tracing",
    url: "#",
    icon: Settings,
  },
  {
    title: "Lockdown",
    url: "#",
    icon: LockIcon,
  },
  {
    title: "Mask Mandate",
    url: "#",
    icon: MedalIcon,
  },
  {
    title: "Quarantine",
    url: "#",
    icon: RadiationIcon,
  },
  {
    title: "Research",
    url: "#",
    icon: Microscope,
  },
  {
    title: "Testing in Hospitals",
    url: "#",
    icon: Hospital,
  },
  {
    title: "Work From Home",
    url: "#",
    icon: Home,
  },
]

export function AppSidebar() {
  return (
    
    <div className="relative flex">
    <SidebarTrigger className="sidebar-trigger">
        Open Sidebar
      </SidebarTrigger>

    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    
    </div>
  )
}

