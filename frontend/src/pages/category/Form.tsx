import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Checkbox,
  TextField,
  Box,
  Button,
  ButtonProps,
  makeStyles,
  Theme,
} from '@material-ui/core';

import * as yup from '../../utils/vendor/yup';
import categoryHttp, { Category } from '../../utils/http/category-http';

export interface FormParams {
  id: string | undefined;
}

const buttonProps: ButtonProps = {
  variant: 'outlined',
};

const useStyles = makeStyles((theme: Theme) => ({
  submit: {
    margin: theme.spacing(1),
  },
}));

const Constants = {
  InputLabelProps: { shrink: true },
  defaultValues: {
    name: '',
    description: '',
    is_active: true,
  },
};

const validationSchema = yup.object().shape({
  name: yup.string().label('Nome').max(255).required(),
});

const Form: React.FC = () => {
  const { goBack } = useHistory();
  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: Constants.defaultValues,
    resolver: yupResolver(validationSchema),
  });
  const { id } = useParams<FormParams>();
  const [category, setCategory] = useState<Category | null>(null);
  const styles = useStyles();

  const onSubmit = async (formData: any, event?: BaseSyntheticEvent) => {
    if (category) await categoryHttp.update(category.id, formData);
    else await categoryHttp.create(formData);
    if (!event) goBack();
  };

  useEffect(() => {
    if (!id) return;

    categoryHttp.get(id).then(({ data: { data } }) => {
      setCategory(data);
      reset(data);
    });
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <TextField
            {...field}
            label="Nome"
            margin="normal"
            variant="outlined"
            InputLabelProps={Constants.InputLabelProps}
            error={(errors as any).name !== undefined}
            helperText={(errors as any).name && (errors as any).name.message}
            fullWidth
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <TextField
            {...field}
            value={field.value || Constants.defaultValues.description}
            label="Descrição"
            variant="outlined"
            margin="normal"
            InputLabelProps={Constants.InputLabelProps}
            rows={4}
            multiline
            fullWidth
          />
        )}
      />
      <Controller
        name="is_active"
        control={control}
        defaultValue
        render={({ field }) => (
          <Checkbox
            {...field}
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
