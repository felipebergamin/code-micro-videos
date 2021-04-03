import {
  AppBar,
  Button,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';

import logo from '../../static/img/logo.png';

import Menu from './Menu';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    backgroundColor: '#000000',
  },
  title: {
    flexGrow: 1,
    textAlign: 'center',
  },
  logo: {
    width: 100,
    [theme.breakpoints.up('sm')]: {
      width: 170,
    },
  },
}));

const Navbar: React.FC = () => {
  const styles = useStyles();

  return (
    <AppBar>
      <Toolbar className={styles.toolbar}>
        <Menu />
        <Typography className={styles.title}>
          <img src={logo} alt="CodeFlix" className={styles.logo} />
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
