import { Fragment, forwardRef, useState } from 'react';

import {
  Grid,
  Stack,
  Paper,
  TextField,
  TextareaAutosize,
  // TextFieldProps,
  // TextareaAutosizeProps,
  Box,
  FormControl,
} from '@mui/material';
import type {
  TextFieldProps,
  TextareaAutosizeProps,
} from '@mui/material';

type FormTextareaProps = {
  maxLength?: number;
  // onFocus?: (evt: React.FocusEvent) => void;
  // onChange?: (evt: React.ChangeEvent) => void;
} & TextFieldProps; // TextareaAutosizeProps

/**
 * Reference:
 * https://github.com/mui/material-ui/issues/12913#issuecomment-1439983117
 */
const FormTextarea = forwardRef<HTMLInputElement, FormTextareaProps>(
  (props: FormTextareaProps, ref) => {
    // const textareaAutosizeRef = useRef<null | HTMLTextAreaElement>(null);
    const minRows = props.minRows ? props.minRows : 5;
    // const maxLength = props.maxLength;

    const [value, setValue] = useState<string>(() => {
      const str = props.value ? props.value.toString() : '';
      return str;
    });
    let currentLength = value ? value.toString().length : 0;

    // console.debug('FormTextarea - value: [' + value + ']');

    // const value = props.value;
    // const handleFormFocus = props.onFocus;
    // const handleTextFieldChange = props.onChange;
    const handleTextFieldChange = (
      evt: React.ChangeEvent<HTMLInputElement>
    ) => {
      setValue(evt.target.value);
      if (props.onChange) {
        props.onChange(evt);
      }
    };

    return (
      <>
        {/* <Grid container>
        <Grid item xs={12}>
          <TextareaAutosize ref={textareaAutosizeRef} minRows={5} style={{ width: '100%' }} {...props} />
        </Grid>
        <Grid item xs={12}>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="baseline"
            spacing={2}
          >
            <Paper elevation={0} >
              {textareaAutosizeRef.current?.value.length}
              {maxLength && <Fragment> / {maxLength}</Fragment>}
            </Paper>
          </Stack>
        </Grid>
      </Grid> */}
        {/* <FormControl defaultValue="" required>
        <label>Name</label>
        <Box>
          <TextareaAutosize
            ref={textareaAutosizeRef}
            minRows={5}
            style={{ width: '100%' }}
            {...props}
          />
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="baseline"
            spacing={2}
          >
            <Paper elevation={0}>
              {textareaAutosizeRef.current?.value.length}
              {maxLength && <Fragment> / {maxLength}</Fragment>}
            </Paper>
          </Stack>
        </Box>
      </FormControl> */}
        <TextField
          ref={ref}
          multiline
          minRows={minRows}
          {...props}
          // onFocus={handleFormFocus}
          onChange={handleTextFieldChange}
          helperText={
            <Box
              component="span"
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <span>{props.helperText}</span>
              {props.maxLength && (
                // <span>
                //   {`${(props.value as string).length} / ${
                //     props.maxLength
                //   }`}
                // </span>
                <span>{currentLength} / {props.maxLength}</span>
              )}
            </Box>
          }
        />
      </>
    );
  }
);

export default FormTextarea;
