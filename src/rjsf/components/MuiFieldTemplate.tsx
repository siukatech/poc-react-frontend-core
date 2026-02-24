import { useTranslation } from "react-i18next";

import type {
  FieldTemplateProps,
} from '@rjsf/utils';



const MuiFieldTemplate = (props: FieldTemplateProps) => {
  const { t } = useTranslation();

  // console.debug(`MuiFieldTemplate - props: `, props);

  return (<>
  {props.children}
  </>);
}

export default MuiFieldTemplate;

