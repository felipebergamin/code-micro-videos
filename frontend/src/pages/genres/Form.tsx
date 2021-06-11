import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
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
import categoryHttp from '../../utils/http/category-http';
import * as yup from '../../utils/vendor/yup';
import DefaultForm from '../../components/DefaultForm';
import { Category, Genre } from '../../utils/models';

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

const validationSchema = yup.object().shape({
  name: yup.string().label('Nome').required().max(255),
  categories_id: yup.array().label('Categorias').required(),
});

/* eslint-disable camelcase */
interface FormFields {
  categories_id: string[];
  name: string;
  is_active: boolean;
}
/* eslint-enable camelcase */

const Form: React.FC = () => {
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const snackbar = useSnackbar();
  const history = useHistory();
  const { id: genreToEditId } = useParams<{ id?: string }>();
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const { control, handleSubmit, getValues, reset } = useForm<FormFields>({
    defaultValues: {
      categories_id: [],
      name: '',
      is_active: true,
    },
    resolver: yupResolver(validationSchema),
  });
  const styles = useStyles();

  useEffect(() => {
    setLoading(false);
    const promises = [
      categoryHttp.list().then(({ data }) => {
        setCategoriesList(data.data);
      }),
    ];
    if (genreToEditId) {
      promises.push(
        genresHttp.get(genreToEditId).then(({ data: { data } }) => {
          setEditingGenre(data);
          const parsedObj = {
            ...data,
            categories_id: data.categories?.map((c) => c.id) || [],
          };
          reset(parsedObj);
        }),
      );
    }
    Promise.all(promises).finally(() => setLoading(false));
  }, []);

  const onSubmit = async (formData: any, event?: BaseSyntheticEvent) => {
    setLoading(true);
    await genresHttp.create(formData);

    try {
      const {
        data: { data },
      } = await (!editingGenre
        ? genresHttp.create(formData)
        : genresHttp.update(editingGenre.id, formData));
      snackbar.enqueueSnackbar('Gênero salvo com sucesso', {
        variant: 'success',
      });

      setLoading(false);

      if (event) {
        if (genreToEditId) history.replace(`/genres/${data.id}/edit`);
        else history.push(`/genres/${data.id}/edit`);
        return;
      }
      history.push('/genres/list');
    } catch (err) {
      snackbar.enqueueSnackbar('Erro ao salvar', {
        variant: 'error',
      });
    }
  };

  return (
    <DefaultForm
      GridItemProps={{ xs: 12, md: 6 }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            disabled={loading}
            label="Nome"
            margin="normal"
            variant="outlined"
            fullWidth
          />
        )}
      />
      <Controller
        name="categories_id"
        control={control}
        render={({ field }) => (
          <FormControl disabled={loading} fullWidth margin="normal">
            <InputLabel id="categories-select-label">
              Selecione categorias
            </InputLabel>
            <Select
              {...field}
              value={field.value || []}
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
            disabled={loading}
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
    </DefaultForm>
  );
};

export default Form;
