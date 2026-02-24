import { Fragment } from 'react';

import { useTranslation } from 'react-i18next';

import type {
  ObjectFieldTemplateProps,
} from '@rjsf/utils';

import { Grid, Typography } from '@mui/material';

const MuiGridObjectFieldTemplate = (props: ObjectFieldTemplateProps) => {
  const { t, i18n } = useTranslation();

  const uiSchema = props.uiSchema;
  const uiGrid = uiSchema?.['ui:grid'] == null ? [] : uiSchema?.['ui:grid'];

  return (
    <>
      <Grid container>
        {uiGrid.map((gridConfig: any, idx1: number) => {
          // console.debug(
          //   `MuiGridObjectFieldTemplate - idx1: [${idx1}], gridConfig: `,
          //   gridConfig
          // );
          return Object.keys(gridConfig).map((elementName, idx2) => {
            const elementWidth = gridConfig[elementName];
            const elements = props.properties.filter(
              (element) => element.name === elementName
            );
            const element = elements.length > 0 ? elements[0] : undefined;
            // console.debug(
            //   `MuiGridObjectFieldTemplate - idx1: [${idx1}], idx2: [${idx2}], elementName: [${elementName}], elementWidth: [${elementWidth}]`
            // );
            return (
              <Fragment key={`mui-object-field-key-${idx1}-${idx2}`}>
                <Grid item md={elementWidth}>
                  {/* <Typography variant="subtitle1">{elementName}</Typography> */}
                  {element && <Fragment>{element.content}</Fragment>}
                  {!element && <Fragment>&nbsp;&nbsp;</Fragment>}
                </Grid>
              </Fragment>
            );
          });
        })}
      </Grid>
    </>
  );
};

export default MuiGridObjectFieldTemplate;
