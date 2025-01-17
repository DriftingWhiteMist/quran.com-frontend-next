import classNames from 'classnames';
import { Controller, useForm } from 'react-hook-form';

import Button, { ButtonProps } from '../dls/Button/Button';
import Input from '../dls/Forms/Input';
import TextArea from '../dls/Forms/TextArea';

import buildReactHookFormRules from './buildReactHookFormRules';
import styles from './FormBuilder.module.scss';
import { FormBuilderFormField } from './FormBuilderTypes';

import { FormFieldType } from '@/types/FormField';

export type SubmissionResult<T> = Promise<void | { errors: { [key in keyof T]: string } }>;
type FormBuilderProps<T> = {
  formFields: FormBuilderFormField[];
  onSubmit: (data: T) => void | SubmissionResult<T>;
  isSubmitting?: boolean;
  actionText?: string;
  actionProps?: ButtonProps;
  renderAction?: (props: ButtonProps) => React.ReactNode;
};

const FormBuilder = <T,>({
  formFields,
  onSubmit,
  actionText,
  actionProps = {},
  isSubmitting,
  renderAction,
}: FormBuilderProps<T>) => {
  const { handleSubmit, control, setError } = useForm({ mode: 'onBlur' });

  const internalOnSubmit = (data: T) => {
    const onSubmitPromise = onSubmit(data);
    if (onSubmitPromise) {
      onSubmitPromise.then((errorData) => {
        if (errorData && errorData?.errors) {
          Object.entries(errorData.errors).forEach(([field, errorMessage]) => {
            setError(field, { type: 'manual', message: errorMessage as string });
          });
        }
      });
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit(internalOnSubmit)}>
      {formFields?.map((formField) => {
        return (
          <Controller
            key={formField.field}
            control={control}
            defaultValue={formField.defaultValue}
            rules={buildReactHookFormRules(formField)}
            name={formField.field}
            render={({ field, fieldState: { error } }) => {
              const commonProps = {
                key: formField.field,
                value: field.value,
                id: formField.field,
                name: formField.field,
                containerClassName: styles.input,
                placeholder: formField.label,
                onChange: (val) => {
                  field.onChange(val);
                  if (formField?.onChange) {
                    formField.onChange(val);
                  }
                },
              };
              return (
                <div className={classNames(styles.inputContainer, formField.containerClassName)}>
                  {formField.type === FormFieldType.TextArea ? (
                    <TextArea {...commonProps} />
                  ) : (
                    <Input {...commonProps} htmlType={formField.type} fixedWidth={false} />
                  )}
                  {error && <span className={styles.errorText}>{error.message}</span>}
                </div>
              );
            }}
          />
        );
      })}
      {renderAction ? (
        renderAction({
          htmlType: 'submit',
          isLoading: isSubmitting,
          onClick: (e) => {
            e.stopPropagation();
          },
        })
      ) : (
        <Button
          {...actionProps}
          htmlType="submit"
          isLoading={isSubmitting}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={classNames(styles.submitButton, actionProps.className)}
        >
          {actionText}
        </Button>
      )}
    </form>
  );
};

export default FormBuilder;
