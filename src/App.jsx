import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';

import Dashboard from './features/dashboard/Dashboard';
import Sales from './features/sales/Sales';

const drawerWidth = 240;

const NAVIGATION = [
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'sales',
    title: 'Sales',
    icon: <ShoppingCartIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function CustomRouterProvider({ children }) {
  const [pathname, setPathname] = React.useState('dashboard');

  const router = {
    pathname,
    navigate: (segment) => {
      const cleaned = segment.replace(/^\//, '').toLowerCase();
      setPathname(cleaned);
    },
    searchParams: new URLSearchParams(),
  };

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      branding={{
        logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
        title: 'Clen Cuts',
        homeUrl: 'dashboard',
      }}
      theme={demoTheme}
    >
      {children(router)}
    </AppProvider>
  );
}

function PageContent({ pathname }) {
  const route = pathname.replace(/^\//, '').toLowerCase();
  switch (route) {
    case 'dashboard':
      return <Dashboard />;
    case 'sales':
      return <Sales />;
    default:
      return <div>Page not found: {route}</div>;
  }
}

PageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function SidebarNavigation({ router }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <List>
        {NAVIGATION.map((item) => (
          <ListItemButton
            key={item.segment}
            selected={router.pathname === item.segment}
            onClick={() => router.navigate(item.segment)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}

SidebarNavigation.propTypes = {
  router: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

function DashboardLayoutBranding() {
  return (
    <CustomRouterProvider>
      {(router) => (
        <DashboardLayout sidebarContent={<SidebarNavigation router={router} />}>
          <PageContent pathname={router.pathname} />
        </DashboardLayout>
      )}
    </CustomRouterProvider>
  );
}

export default DashboardLayoutBranding;
