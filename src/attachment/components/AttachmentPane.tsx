import { Fragment, useEffect, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import type { Attachment } from '../models';
import { styled } from '@mui/material/styles';
import {
  deleteAttachment,
  downloadAttachment,
  uploadAttachmentList,
} from '../services/AttachmentService';
import {
  Box,
  Button,
  Link,
  List,
  ListItem,
  ListItemIcon,
  Typography,
} from '@mui/material';
import { IconComponent } from '../../ui';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

type AttachmentPaneProps = {
  readOnly?: boolean;
  attachmentList?: Attachment[];
  onAttachmentListChange: (
    attachmentList: Attachment[],
    isUploading: boolean
  ) => void;
};

const AttachmentPane: React.FC<AttachmentPaneProps> = ({
  readOnly,
  attachmentList,
  onAttachmentListChange,
}) => {
  const { t } = useTranslation();

  const fileInputRef = useRef<HTMLInputElement>(null); // null is required for the VisuallyHiddenInput's ref
  const [valueList, setValueList] = useState<Attachment[]>(() => {
    let list: Attachment[] = [];
    list = attachmentList
      ? attachmentList.map((attachment, idx) => {
          return {
            ...attachment,
            isUploaded:
              attachment.isUploaded != null
                ? attachment.isUploaded
                : true,
          } as Attachment;
        })
      : [];
    return list;
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(() => {
    return readOnly != null ? readOnly : false;
  });
  const [valueErr, setValueErr] = useState<any>();

  useEffect(() => {
    let filteredList = valueList.filter(
      (attachment) => attachment.isUploaded === false
    );
    // console.debug(
    //   `AttachmentPane - useEffect - 1 - filteredList.length: [${filteredList.length}], valueList: `,
    //   valueList
    // );
    if (filteredList.length > 0) {
      // console.debug(
      //   `AttachmentPane - useEffect - 2 - filteredList.length: [${filteredList.length}], valueList: `,
      //   valueList
      // );

      // upload
      const uploadAttachment = async () => {
        // console.debug(
        //   `AttachmentPane - useEffect - 3 - valueList: `,
        //   valueList
        // );
        const updatedList = await uploadAttachmentList(valueList);
        // console.debug(
        //   `AttachmentPane - useEffect - 4 - updatedList: `,
        //   updatedList
        // );
        setValueList(updatedList);
        setIsUploading(false);
        if (fileInputRef.current && fileInputRef.current.value) {
          fileInputRef.current.value = '';
        }
      };
      uploadAttachment();
    } else {
      setIsUploading(false);
    }
    // console.debug(
    //   `AttachmentPane - useEffect - 5 - filteredList.length: [${filteredList.length}], valueList: `,
    //   valueList
    // );
    onAttachmentListChange(valueList, filteredList.length > 0);
  }, [valueList, isUploading]);

  const handleAttachmentChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const targetFiles = evt.target.files ? evt.target.files : [];
    // console.debug(
    //   `AttachmentPane - handleAttachmentChange - targetFiles: `,
    //   targetFiles
    // );
    setValueList((prevState) => {
      let valueList = prevState;
      const valueMap: any = valueList
        ? valueList.reduce(
            (accumulator, attachment, idx) => ({
              ...accumulator,
              [attachment.fileName]: attachment.fileName,
            }),
            {}
          )
        : {};
      // console.debug(
      //   `AttachmentPane - handleAttachmentChange - valueMap: `,
      //   valueMap
      // );
      for (let ccc = 0; ccc < targetFiles.length; ccc++) {
        const targetFile = targetFiles[ccc];
        const valueMapTargetFile = valueMap[targetFile.name];
        // console.debug(
        //   `AttachmentPane - handleAttachmentChange - valueMapTargetFile is null: [${
        //     valueMapTargetFile == null
        //   }], targetFile: `,
        //   targetFile
        // );
        if (targetFile && valueMap[targetFile.name] == null) {
          valueList.push({
            fileName: targetFile.name,
            fileSize: targetFile.size,
            id: undefined,
            isUploaded: false,
            targetFile,
          } as Attachment);
        }
      }
      return valueList;
    });
    setIsUploading(true);
  };

  const handleAttachmentDownload = (
    attachment: Attachment,
    idx: number
  ) => {
    const downloadFile = async (attachment: Attachment) => {
      try {
        await downloadAttachment(attachment);
      } catch (err) {
        setValueErr(err);
      }
    };
    if (attachment.isUploaded && attachment.uploadErr == null) {
      downloadFile(attachment);
    }
  };

  const handleAttachmentDelete = (
    attachment: Attachment,
    idx: number
  ) => {
    const attachmentToDelete = valueList[idx];
    const clearFile = (idx: number) => {
      setValueList((prevState) => {
        let valueListPrev = prevState;
        valueListPrev.splice(idx, 1);
        let valueListNew: Attachment[] = [];
        for (let ccc = 0; ccc < valueListPrev.length; ccc++) {
          valueListNew.push(valueListPrev[ccc]);
        }
        return valueListNew;
      });
    };
    // console.debug(
    //   `AttachmentPane - handleAttachmentDelete - idx: [${idx}], attachment: `,
    //   attachment
    // );
    if (attachment.isUploaded && !attachment.uploadErr) {
      const deleteFile = async (attachment: Attachment) => {
        const { data } = await deleteAttachment(attachment);
        return data;
      };
      deleteFile(attachment).then((retData) => clearFile(idx));
    } else {
      clearFile(idx);
    }
  };

  return (
    <>
      <Box>
        <Typography variant="body1">{t('upload.title')}</Typography>
      </Box>
      <List>
        {valueList.map((attachment: Attachment, idx: number) => {
          // console.debug(
          //   `AttachmentPane - return - idx: [${idx}], attachment: `,
          //   attachment
          // );
          return (
            <Fragment key={`key-attachment-${idx}`}>
              <ListItem sx={{ pl: 0 }}>
                {attachment.isUploaded && (
                  <Link
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleAttachmentDownload(attachment, idx)}
                  >
                    {attachment.fileName}
                  </Link>
                )}
                {!attachment.isUploaded && (
                  <Typography variant="body1">
                    {attachment.fileName}...
                  </Typography>
                )}
                {!isReadOnly && !isUploading && attachment.isUploaded && (
                  <ListItemIcon
                    sx={{ minWidth: 'auto', pl: 0.5, cursor: 'pointer' }}
                    onClick={() => handleAttachmentDelete(attachment, idx)}
                  >
                    <IconComponent name="DeleteOutline" />
                  </ListItemIcon>
                )}
                {!isReadOnly &&
                  attachment.isUploaded &&
                  attachment.uploadErr && (
                    <ListItemIcon
                      sx={{ minWidth: 'auto', pl: 0.5, cursor: 'pointer' }}
                      title={attachment.uploadErr}
                    >
                      <IconComponent name="ErrorOutline" />
                    </ListItemIcon>
                  )}
              </ListItem>
            </Fragment>
          );
        })}
      </List>
      <Button component="label" disabled={isUploading || isReadOnly}>
        <IconComponent name="UploadFile" sx={{ pr: 0.5 }} />
        <Typography variant="body1">{t('button.upload')}</Typography>
        <VisuallyHiddenInput
          type="file"
          onChange={handleAttachmentChange}
          ref={fileInputRef}
          multiple
        />
      </Button>
    </>
  );
};

export default AttachmentPane;
