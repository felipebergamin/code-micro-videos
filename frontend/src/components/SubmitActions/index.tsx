import * as React from 'react';
import { Box, Button, makeStyles, Theme } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1),
    },
  };
});

interface SubmitActionsProps {
  disabledButtons?: boolean;
  handleSave: () => void;
}

const SubmitActions: React.FC<SubmitActionsProps> = ({
  disabledButtons,
  handleSave,
}) => {
  const classes = useStyles();

  const buttonProps: ButtonProps = {
    className: classes.submit,
    color: 'secondary',
    variant: 'contained',
    disabled: disabledButtons === undefined ? false : disabledButtons,
  };
  return (
    <Box dir="rtl">
      <Button color="primary" {...buttonProps} onClick={handleSave}>
        Salvar
      </Button>
      <Button {...buttonProps} type="submit">
        Salvar e continuar editando
      </Button>
    </Box>
  );
};

export default SubmitActions;