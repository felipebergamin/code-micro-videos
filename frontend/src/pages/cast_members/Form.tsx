import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import {
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from '@material-ui/core';

import SubmitActions from '../../components/SubmitActions';
import DefaultForm from '../../components/DefaultForm';
import castMemberHttp from '../../utils/http/cast-member-http';
import * as yup from '../../utils/vendor/yup';
import { CastMember } from '../../utils/models';

const Constants = {
  memberTypes: [
    ['Diretor', 1],
    ['Ator', 2],
  ],
};

const validationSchema = yup.object().shape({
  name: yup.string().label('Nome').required().max(255),
  type: yup.number().label('Tipo').required(),
});

interface FormProps {
  name: string;
  type: number;
}

const Form: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [castMember, setCastMember] = useState<CastMember | null>(null);
  const { id } = useParams<{ id?: string }>();
  const snackbar = useSnackbar();
  const {
    control,
    handleSubmit,
    getValues,
    reset,
    trigger,
    formState: { errors },
  } = useForm<FormProps>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      type: 0,
    },
  });

  useEffect(() => {
    async function getCastMember() {
      if (!id) {
        return;
      }
      setLoading(true);
      try {
        const {
          data: { data },
        } = await castMemberHttp.get(id);
        setCastMember(data);
        reset(data);
      } catch (error) {
        snackbar.enqueueSnackbar('Não foi possível carregar as informações', {
          variant: 'error',
        });
      } finally {
        setLoading(false);
      }
    }
    getCastMember();
  }, []);

  async function onSubmit(formData: any, event?: BaseSyntheticEvent) {
    setLoading(true);
    try {
      const { data } = await (!castMember
        ? castMemberHttp.create(formData)
        : castMemberHttp.update(castMember.id, formData));
      snackbar.enqueueSnackbar('Membro de elenco salvo com sucesso', {
        variant: 'success',
      });
      if (event) {
        if (id) history.replace(`/cast_members/${data.data.id}/edit`);
        else history.push(`/cast_members/${data.data.id}/edit`);
      } else {
        history.push('/cast_members/list');
      }
    } catch (error) {
      snackbar.enqueueSnackbar('Não foi possível salvar o membro de elenco', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

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
            error={(errors as any).name !== undefined}
            helperText={(errors as any).name && (errors as any).name.message}
            fullWidth
          />
        )}
      />
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <FormControl margin="normal" disabled={loading} component="fieldset">
            <FormLabel component="legend">Tipo</FormLabel>
            <RadioGroup
              aria-label="gender"
              {...field}
              value={Number(field.value)}
            >
              {Constants.memberTypes.map(([label, value]) => (
                <FormControlLabel
                  key={label}
                  value={value}
                  control={<Radio />}
                  label={label}
                />
              ))}
            </RadioGroup>
            {errors.type && (
              <FormHelperText id="type-helper-text">
                {errors.type.message}
              </FormHelperText>
            )}
          </FormControl>
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
