import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { Checkbox, TextField } from '@material-ui/core';

import * as yup from '../../utils/vendor/yup';
import categoryHttp, { Category } from '../../utils/http/category-http';
import SubmitActions from '../../components/SubmitActions';
import DefaultForm from '../../components/DefaultForm';

export interface FormParams {
  id: string | undefined;
}

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
  const snackbar = useSnackbar();
  const [loading, setLoading] = useState(false);
  const { goBack } = useHistory();
  const {
    control,
    handleSubmit,
    getValues,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: Constants.defaultValues,
    resolver: yupResolver(validationSchema),
  });
  const { id } = useParams<FormParams>();
  const [category, setCategory] = useState<Category | null>(null);

  const onSubmit = async (formData: any, event?: BaseSyntheticEvent) => {
    setLoading(true);
    try {
      if (category) await categoryHttp.update(category.id, formData);
      else await categoryHttp.create(formData);
      snackbar.enqueueSnackbar('Salvo com sucesso!', {
        variant: 'success',
      });
    } catch (e) {
      snackbar.enqueueSnackbar('Houve um erro ao salvar', {
        variant: 'error',
      });
    }
    setLoading(false);
    if (!event) goBack();
  };

  useEffect(() => {
    if (!id) return;

    const loadCategoryInfo = async () => {
      setLoading(true);
      try {
        const {
          data: { data },
        } = await categoryHttp.get(id);
        setCategory(data);
        reset(data);
      } catch (e) {
        snackbar.enqueueSnackbar('Houve um erro ao carregar as informações', {
          variant: 'error',
        });
      }
      setLoading(false);
    };
    loadCategoryInfo();
  }, []);

  return (
    <DefaultForm
      GridItemProps={{ xs: 12, md: 6 }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <TextField
            {...field}
            label="Nome"
            margin="normal"
            variant="outlined"
            disabled={loading}
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
            disabled={loading}
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
      <SubmitActions
        disabledButtons={loading}
        handleSave={() =>
          trigger().then((isValid) => {
            if (isValid) onSubmit(getValues());
          })
        }
      />
    </DefaultForm>
  );
};

export default Form;
