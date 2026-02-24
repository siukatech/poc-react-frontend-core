import { useEffect, useState } from 'react';

import { Autocomplete, Chip, TextField, Hidden, ListItem } from '@mui/material';

// import { withJsonFormsControlProps } from '@jsonforms/react';

import {
  isDescriptionHidden,
} from '@jsonforms/core';
import type {
  JsonSchema,
  ControlProps,
  OwnPropsOfEnum,
  WithClassname,
  EnumOption,
} from '@jsonforms/core';

// import { useFocus } from '@jsonforms/material-renderers';
// import type { WithOptionLabel } from '@jsonforms/material-renderers';

// enum DISPLAY_STYLE {
//   TITLE = 'title',
//   CONST = 'const',
//   TITLE_WITH_CONST = 'titleWithConst',
// }
const DISPLAY_STYLE = {
  TITLE: 'title',
  CONST: 'const',
  TITLE_WITH_CONST: 'titleWithConst',
} as const;
type DISPLAY_STYLE = typeof DISPLAY_STYLE[keyof typeof DISPLAY_STYLE];

type MuiAutocompleteControlProps = {
  placeholder: string;
};

/**
 * Reference:
 * https://jsonforms.discourse.group/t/mui-autocomplete-add-clear-button/1562
 * https://jsonforms.discourse.group/t/mui-autocomplete-multi-select/1105/2
 *
 * https://mui.com/material-ui/react-autocomplete/
 *
 *
 * @param props
 * @returns
 */
const MuiAutocompleteControl = (
  props: ControlProps & OwnPropsOfEnum & MuiAutocompleteControlProps
) => {
  const {
    rootSchema: dataSchema,
    schema: propertySchema,
    uischema: propertyUischema,
    data,
    id,
    enabled,
    path,
    handleChange,
    options: optionsOri,
    config,
    label,
    required,
    visible,

    placeholder,
  } = props;
  // const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const options: any[] = propertySchema.items
    ? propertySchema.oneOf
    : (propertySchema.items as any).oneOf;
  const { display, format, multiple } = propertyUischema.options as any;
  const isMultiple = multiple === true;
  const fixedOptions: any[] = [];

  const optionMap = options
    ? options.reduce(
        (accumulator, option, idx) => ({
          ...accumulator,
          [option.const]: option,
        }),
        {}
      )
    : {};

  const [values, setValues] = useState(() => {
    // const list = data
    //   ? Array.isArray(data)
    //     ? data.map((d) => optionMap[d])
    //     : optionMap[data]
    //   : [];
    // return list;
    return [];  // values for Autocomplete cannot be null!!!
  });

  useEffect(() => {
    const list = data
      ? Array.isArray(data)
        ? data.map((d) => optionMap[d])
        : optionMap[data]
      : [];
    setValues(list);
  }, [options, optionMap, setValues]);

  const handleControlChange = (evt: React.SyntheticEvent, newValues: any) => {
    if (newValues) {
      setValues(newValues);
      handleChange(
        path,
        Array.isArray(newValues)
          ? newValues.map((newValue) => newValue.const)
          : newValues?.const
      );
    }
  };

  const resolveOptionLabel = (option: any) => {
    let optionLabel = '';
    switch (display) {
      case DISPLAY_STYLE.TITLE:
        optionLabel = `${option?.title}`;
        break;
      case DISPLAY_STYLE.TITLE_WITH_CONST:
        optionLabel = `${option?.title} (${option.const})`;
        break;
      default:
        optionLabel = `${option?.const}`;
        break;
    }
    return optionLabel;
  };

  return (
    <>
      <Hidden xsUp={!visible}>
        <Autocomplete
          id={id}
          multiple={isMultiple}
          disabled={!enabled}
          value={values}
          onChange={handleControlChange}
          // onInputChange={(event, value) => handleChangeExtended(event, value)}
          freeSolo
          selectOnFocus
          clearOnBlur
          fullWidth
          options={options}
          // style={{ marginTop: 16 }}
          // renderOption={renderOption}
          // filterOptions={filterOptions}
          getOptionLabel={(option) => {
            // the renderer of selected option display
            return resolveOptionLabel(option);
          }}
          isOptionEqualToValue={(option, value) => {
            let result = option?.const === value?.const;
            return result;
          }}
          renderOption={(props, option, state) => {
            // the renderer of option list
            const { inputValue, index: idx, selected } = state;
            const optionLabel = resolveOptionLabel(option);
            return (
              <ListItem {...props} key={`key-option-${idx}`}>
                {optionLabel}
              </ListItem>
            );
          }}
          renderTags={(tagValues, getTabProps) => {
            return tagValues.map((option, idx) => {
              const optionLabel = resolveOptionLabel(option);
              return (
                <Chip
                  {...getTabProps({ index: idx })}
                  label={optionLabel}
                  key={`key-chip-${idx}`}
                  disabled={fixedOptions.indexOf(option?.const) !== -1}
                />
              );
            });
          }}
          renderInput={(params) => (
            // <Input
            //   style={{ width: '100%' }}
            //   type="text"
            //   inputProps={params.inputProps}
            //   inputRef={params.InputProps.ref}
            //   autoFocus={appliedUiSchemaOptions.focus}
            //   disabled={!enabled}
            // />
            <TextField
              {...params}
              required={required}
              label={label}
              placeholder={placeholder}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />
      </Hidden>
    </>
  );
};

export default MuiAutocompleteControl;
export { DISPLAY_STYLE };
