import { BaseSyntheticEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useHistory } from 'react-router';
import {
  Checkbox,
  TextField,
  Box,
  Button,
  ButtonProps,
  makeStyles,
  Theme,
} from '@material-ui/core';

import categoryHttp from '../../utils/http/category-http';

const buttonProps: ButtonProps = {
  variant: 'outlined',
};

const useStyles = makeStyles((theme: Theme) => ({
  submit: {
    margin: theme.spacing(1),
  },
}));

const Form: React.FC = () => {
  const { goBack } = useHistory();
  const { control, register, handleSubmit, getValues } = useForm();
  const styles = useStyles();

  const onSubmit = async (formData: any, event?: BaseSyntheticEvent) => {
    await categoryHttp.create(formData);
    if (!event) goBack();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register('name')}
        name="name"
        label="Nome"
        margin="normal"
        variant="outlined"
        fullWidth
      />
      <TextField
        {...register('description')}
        name="description"
        label="Descrição"
        variant="outlined"
        margin="normal"
        rows={4}
        multiline
        fullWidth
      />
      <Controller
        name="is_active"
        control={control}
        defaultValue
        render={({ field }) => (
          <Checkbox
            onChange={(e) => field.onChange(e.target.checked)}
            checked={field.value}
          />
        )}
      />
      <Box dir="rtl">
        <Button className={styles.submit} {...buttonProps} type="submit">
          Salvar e continuar editando
        </Button>
        <Button
          className={styles.submit}
          {...buttonProps}
          onClick={() => onSubmit(getValues())}
        >
          Salvar
        </Button>
      </Box>
    </form>
  );
};

export default Form;
