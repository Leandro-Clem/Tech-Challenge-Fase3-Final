import { useState } from 'react';
import {
  Button,
  Field,
  FieldError,
  Form,
  Hint,
  Input,
  Label,
  Notice,
  Row,
  TextArea,
} from './ui';
import { CheckIcon, CloseIcon } from './icons';

const empty = { title: '', content: '', author: '' };

function validate(values) {
  const errors = {};
  if (values.title.trim().length < 3) errors.title = 'O título precisa de pelo menos 3 caracteres.';
  if (values.content.trim().length < 10)
    errors.content = 'Escreva um conteúdo com pelo menos 10 caracteres.';
  if (!values.author.trim()) errors.author = 'Informe quem assina a publicação.';
  return errors;
}

/**
 * Formulário usado tanto para criar quanto para editar.
 *
 * O campo de autor aparece sempre em modo leitura: a API define a autoria
 * pelo usuário do token na criação e a mantém imutável na edição, porque é
 * ela que decide quem pode alterar a publicação depois.
 */
export default function PostForm({
  initialValues = empty,
  onSubmit,
  onCancel,
  submitLabel = 'Publicar',
  authorLocked = true,
  busy = false,
  serverError = null,
}) {
  const [values, setValues] = useState({ ...empty, ...initialValues });
  const [errors, setErrors] = useState({});

  function change(field) {
    return (event) => {
      const { value } = event.target;
      setValues((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
    };
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit({
      title: values.title.trim(),
      content: values.content.trim(),
      author: values.author.trim(),
    });
  }

  return (
    <Form onSubmit={handleSubmit} noValidate>
      {serverError && <Notice>{serverError}</Notice>}

      <Field>
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={values.title}
          onChange={change('title')}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'title-error' : undefined}
          placeholder="Fotossíntese explicada com o que tem na janela da sala"
          maxLength={160}
        />
        {errors.title && <FieldError id="title-error">{errors.title}</FieldError>}
      </Field>

      <Field>
        <Label htmlFor="author">Autor</Label>
        <Input
          id="author"
          value={values.author}
          onChange={change('author')}
          readOnly={authorLocked}
          aria-invalid={Boolean(errors.author)}
          aria-describedby={authorLocked ? 'author-hint' : errors.author ? 'author-error' : undefined}
        />
        {authorLocked && (
          <Hint id="author-hint">
            A publicação é assinada por quem a criou, e essa assinatura não muda: é ela que
            define quem pode editar ou excluir a aula mais tarde.
          </Hint>
        )}
        {!authorLocked && errors.author && <FieldError id="author-error">{errors.author}</FieldError>}
      </Field>

      <Field>
        <Label htmlFor="content">Conteúdo</Label>
        <TextArea
          id="content"
          value={values.content}
          onChange={change('content')}
          aria-invalid={Boolean(errors.content)}
          aria-describedby={errors.content ? 'content-error' : 'content-hint'}
          placeholder="Escreva a aula. Separe os parágrafos com uma linha em branco."
        />
        <Hint id="content-hint">
          {values.content.trim().split(/\s+/).filter(Boolean).length} palavras
        </Hint>
        {errors.content && <FieldError id="content-error">{errors.content}</FieldError>}
      </Field>

      <Row>
        <Button type="submit" disabled={busy}>
          <CheckIcon size={16} />
          {busy ? 'Salvando…' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" $variant="quiet" onClick={onCancel} disabled={busy}>
            <CloseIcon size={15} />
            Cancelar
          </Button>
        )}
      </Row>
    </Form>
  );
}
