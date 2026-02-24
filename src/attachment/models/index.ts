import { UUID } from 'uuidv7';

interface Attachment {
  id?: UUID;
  fileName: string;
  contentType: string;
  fileSize?: number;
  fileContent?: Blob;
  targetFile?: File;
  isUploaded?: boolean;
  uploadErr?: any;
}

export type { Attachment };
