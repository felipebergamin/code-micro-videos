import React, { useRef } from 'react';
import {
  SnackbarProvider as NotistackProvider,
  SnackbarProviderProps,
} from 'notistack';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const SnackbarProvider: React.FC = ({ children, ...rest }) => {
  const snackbarProviderRef = useRef<NotistackProvider | null>(null);
  const defaultProps: SnackbarProviderProps = {
    children,
    autoHideDuration: 3000,
    maxSnack: 3,
    anchorOrigin: {
      horizontal: 'right',
      vertical: 'top',
    },
    preventDuplicate: true,
    ref: (el) => {
      snackbarProviderRef.current = el;
    },
    action: function ActionButton(key) {
      return (
        <IconButton
          color="inherit"
          style={{ fontSize: 20 }}
          onClick={() => snackbarProviderRef.current?.closeSnackbar(key)}
        >
          <CloseIcon />
        </IconButton>
      );
    },
  };

  const newProps = { ...defaultProps, ...rest };

  return <NotistackProvider {...newProps}>{children}</NotistackProvider>;
};

export default SnackbarProvider;
