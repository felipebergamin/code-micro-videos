import { BaseSyntheticEvent, useEffect, useState } from 'react';
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
  MenuItem,
  FormControl,
  Select,
  FormControlLabel,
  InputLabel,
} from '@material-ui/core';

import genresHttp from '../../utils/http/genres-http';
import categoryHttp, { Category } from '../../utils/http/category-http';

const buttonProps: ButtonProps = {
  variant: 'outlined',
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const Constants = {
  MenuProps: {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  },
};

const useStyles = makeStyles((theme: Theme) => ({
  submit: {
    margin: theme.spacing(1),
  },
}));

const Form: React.FC = () => {
  const { goBack } = useHistory();
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const { control, register, handleSubmit, getValues } = useForm({
    defaultValues: {
      categories_id: [],
      name: '',
      is_active: true,
    },
  });
  const styles = useStyles();

  useEffect(() => {
    categoryHttp.list().then(({ data }) => {
      setCategoriesList(data.data);
    });
  }, []);

  const onSubmit = async (formData: any, event?: BaseSyntheticEvent) => {
    await genresHttp.create(formData);
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
        name="categories_id"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth margin="normal">
            <InputLabel id="categories-select-label">
              Selecione categorias
            </InputLabel>
            <Select
              {...field}
              multiple
              MenuProps={Constants.MenuProps}
              labelId="categories-select-label"
            >
              {categoriesList.map(({ id, name }) => (
                <MenuItem key={name} value={id}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
      <Controller
        name="is_active"
        control={control}
        defaultValue
        render={({ field }) => (
          <FormControlLabel
            {...field}
            checked={field.value}
            label="Ativo"
            control={<Checkbox />}
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
