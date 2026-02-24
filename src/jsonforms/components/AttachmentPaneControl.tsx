import { useState } from 'react';

import { Hidden } from '@mui/material';

import type { ControlProps, OwnPropsOfEnum } from '@jsonforms/core';

import AttachmentPane from '../../attachment/components/AttachmentPane';
import type { Attachment } from '../../attachment/models';

type AttachmentPaneControlProps = {};

const AttachmentPaneControl = (
  props: ControlProps & AttachmentPaneControlProps
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
    config,
    label,
    required,
    visible,
  } = props;

  const isReadOnly = !enabled;

  const [values, setValues] = useState<undefined | Attachment[]>(() => {
    return data;
  });

  const handleAttachmentListChange = (
    attachmentList: Attachment[],
    isUploading: boolean
  ) => {
    if (!isUploading) {
      handleChange(path, attachmentList);
    }
  };

  return (
    <>
      <Hidden xsUp={!visible}>
        <AttachmentPane
          readOnly={isReadOnly}
          attachmentList={values}
          onAttachmentListChange={handleAttachmentListChange}
        />
      </Hidden>
    </>
  );
};

export default AttachmentPaneControl;
