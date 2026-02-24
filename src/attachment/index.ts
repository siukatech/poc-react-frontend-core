
import AttachmentPane from './components/AttachmentPane';

import type { Attachment } from './models';

import {
  uploadAttachment,
  uploadAttachmentList,
  getAttachment,
  downloadAttachment,
  deleteAttachment,
} from './services/AttachmentService';

export type {
  Attachment
}
export {
  AttachmentPane,
  uploadAttachment,
  uploadAttachmentList,
  getAttachment,
  downloadAttachment,
  deleteAttachment,
}
