import { useState } from 'react';
import type { MutableRefObject } from 'react';

import { useTranslation } from 'react-i18next';

import {
  OutlinedInput,
  InputAdornment,
  IconButton,
  TextField,
  Input,
} from '@mui/material';

import { VisibilityOff, Visibility } from '@mui/icons-material';

type FormPasswordProps = {
  inputId: string;
  formLabel: string;
  className: string;
  inputRef: MutableRefObject<null | HTMLInputElement>, 
  onFocus: () => void;
  defaultValue: string;
}

const FormPassword = ({ inputId, formLabel, className, inputRef, onFocus, defaultValue }: FormPasswordProps) => {
  const { t, i18n } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordShow = (evt: React.MouseEvent<HTMLElement>) => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <OutlinedInput
        type={showPassword ? 'text' : 'password'}
        id={inputId}
        label={formLabel}
        inputRef={inputRef}
        onFocus={onFocus}
        className={className}
        defaultValue={defaultValue}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handlePasswordShow}
              onMouseDown={handlePasswordShow}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
    </>
  );
};

export default FormPassword;
