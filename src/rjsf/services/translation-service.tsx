import type { RJSFSchema } from '@rjsf/utils';

import type { TFunction } from 'i18next';

import _ from 'lodash';

/**
 * Reference:
 * https://github.com/rjsf-team/react-jsonschema-form/issues/739#issuecomment-443921904
 * https://codepen.io/bjbrewster/pen/xQeRKR
 *
 */
const getDefaultTitle = (name?: string) => name && name.replace(/[_-]/g, ' ');
const getTypeScope = (typeName: string) => `types.${typeName}`;
const getPropScope = (scope: string, propName: string) =>
  // `${scope}.fields.${propName}`
  `${scope}.${propName}`;
// Recursively localises given json schema object. Original schema is not modified.
//   schema is json schema object
//   scope is path to root of form/type localised text in i18n object. eg 'forms.editUser'
//   i18n is object containing localised text for schema
//   name is default name for root property, leave undefined for root
function intlSchema(
  schema: any,
  scope: string,
  i18n: TFunction,
  name?: string
) {
  const newSchema = {
    ...schema,
    ..._.pickBy({
      // title:
      //   i18n(scope) ||
      //   i18n(`${scope}.title`) ||
      //   schema.title ||
      //   (!schema.$ref && getDefaultTitle(name)),
      // description: i18n(`${scope}.description`) || schema.description,
      // help: i18n(`${scope}.help`) || schema.help,
      title: schema.title
        ? i18n(scope) ||
          i18n(`${scope}.title`) ||
          schema.title ||
          (!schema.$ref && getDefaultTitle(name))
        : undefined,
      description: schema.description
        ? i18n(`${scope}.description`)
        : undefined,
      help: schema.help ? i18n(`${scope}.help`) : undefined,
    }),
  };

  if (schema.definitions) {
    newSchema.definitions = _.mapValues(
      schema.definitions,
      (typeSchema, typeName) =>
        intlSchema(
          typeSchema as RJSFSchema,
          getTypeScope(typeName),
          i18n,
          typeName
        )
    );
  }

  if (schema.type === 'object') {
    newSchema.properties = _.mapValues(
      schema.properties,
      (propSchema, propName) =>
        intlSchema(
          propSchema as RJSFSchema,
          getPropScope(scope, propName),
          i18n,
          propName
        )
    );
  }

  if (
    schema.enum &&
    (!schema.enumNames || _.isEqual(schema.enum, schema.enumNames))
  ) {
    newSchema.enumNames = schema.enum.map((option: any) =>
      _.defaultTo(i18n(`${scope}.options.${option}`), option)
    );
  }

  if (schema.items && schema.type === 'array') {
    if (schema.items.enum && !schema.items.enumNames) {
      newSchema.items = {
        ...newSchema.items,
        enumNames: schema.items.enum.map((option: any) =>
          _.defaultTo(i18n(`${scope}.options.${option}`), option)
        ),
      };
    } else if (schema.items.properties && schema.items.type === 'object') {
      newSchema.items = {
        ...newSchema.items,
        properties: _.mapValues(
          schema.items.properties,
          (propSchema, propName) =>
            intlSchema(
              propSchema,
              getPropScope(scope, propName),
              i18n,
              propName
            )
        ),
      };
    }
  }

  return newSchema;
}

export { intlSchema };
