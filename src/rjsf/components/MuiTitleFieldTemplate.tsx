import { useTranslation } from 'react-i18next';

import type { TitleFieldProps } from '@rjsf/utils';

const MuiTitleFieldTemplate = (props: TitleFieldProps) => {
  const { t } = useTranslation();

  // console.debug(`MuiTitleFieldTemplate - props: `, props);

  return <>{props.title}</>;
};

export default MuiTitleFieldTemplate;
