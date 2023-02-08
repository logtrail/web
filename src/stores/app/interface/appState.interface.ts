export interface DrawerMenuItem {
  id: string;
  label: string;
  route?: string;
  icon?: string;
}

export interface AppState {
  drawerMenu: DrawerMenuItem[];
}
