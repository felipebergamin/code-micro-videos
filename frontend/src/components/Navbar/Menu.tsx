import { useState } from 'react';
import { IconButton, Menu as MuiMenu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';

import routes from '../../routes';

const listRoutes = ['dashboard', 'categories.list', 'cast_members.list'];
const menuRoutes = routes.filter((route) => listRoutes.includes(route.name));

const Menu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = !!anchorEl;

  const handleOpen = (event: any) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  return (
    <>
      <IconButton
        color="inherit"
        edge="start"
        aria-label="open drawer"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpen}
      >
        <MenuIcon />
      </IconButton>

      <MuiMenu
        id="menu-appbar"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        getContentAnchorEl={null}
      >
        {listRoutes.map((routeName) => {
          const route = menuRoutes.find(({ name }) => name === routeName);
          if (!route) return null;
          return (
            <MenuItem
              key={route.name}
              component={Link}
              to={route?.path as string}
              onClick={handleClose}
            >
              {route.label}
            </MenuItem>
          );
        })}
      </MuiMenu>
    </>
  );
};

export default Menu;
