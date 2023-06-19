import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import { CoreContext } from '../contexts/CoreContext';
import { useContext } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSettingsPage = location.pathname === '/settings';
  const iconBtn = isSettingsPage ? <HomeIcon /> : <SettingsIcon />;
  const { coreContext, setCoreContext } = useContext(CoreContext);

  return (
    <>
      <AppBar color="primary" position="fixed">
        <Toolbar variant="dense" sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6">B&H Site Tools</Typography>
            {coreContext.isPageLoaded ? null : (
              <CircularProgress
                sx={{ marginLeft: '10px' }}
                color="inherit"
                size="23px"
              />
            )}
          </Box>
          <IconButton
            size="large"
            onClick={() =>
              isSettingsPage ? navigate('/') : navigate('/settings')
            }
          >
            {iconBtn}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
}

export default Layout;
