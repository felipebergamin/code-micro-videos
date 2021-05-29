import { BaseSyntheticEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useHistory } from 'react-router';
import {
  TextField,
  Box,
  Button,
  ButtonProps,
  makeStyles,
  Theme,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';

import castMemberHttp from '../../utils/http/cast-member-http';

const buttonProps: ButtonProps = {
  variant: 'outlined',
};

const useStyles = makeStyles((theme: Theme) => ({
  submit: {
    margin: theme.spacing(1),
  },
}));

const Constants = {
  memberTypes: [
    ['Diretor', '1'],
    ['Ator', '2'],
  ],
};

const Form: React.FC = () => {
  const { goBack } = useHistory();
  const { control, register, handleSubmit, getValues } = useForm();
  const styles = useStyles();

  const onSubmit = async (formData: any, event?: BaseSyntheticEvent) => {
    await castMemberHttp.create(formData);
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
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <FormControl margin="normal" component="fieldset" {...field}>
            <FormLabel component="legend">Tipo</FormLabel>
            <RadioGroup aria-label="gender">
              {Constants.memberTypes.map(([label, value]) => (
                <FormControlLabel
                  key={label}
                  value={value}
                  control={<Radio />}
                  label={label}
                />
              ))}
            </RadioGroup>
          </FormControl>
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
