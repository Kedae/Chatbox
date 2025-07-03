import { FileUpload, IAction } from '@/components/Bot';
import { sendRequest } from '@/utils/index';

export type IncomingInput = {
  question?: string;
  form?: Record<string, unknown>;
  uploads?: FileUpload[];
  overrideConfig?: Record<string, unknown>;
  socketIOClientId?: string;
  chatId?: string;
  fileName?: string; // Only for assistant
  leadEmail?: string;
  action?: IAction;
  humanInput?: Record<string, unknown>;
};

type BaseRequest = {
  apiHost?: string;
  onRequest?: (request: RequestInit) => Promise<void>;
};

export type MessageRequest = BaseRequest & {
  chatflowid?: string;
  body?: IncomingInput;
};

export type UpsertRequest = BaseRequest & {
  chatflowid: string;
  apiHost?: string;
  formData: FormData;
};

export type LeadCaptureInput = {
  chatflowid: string;
  chatId: string;
  name?: string;
  email?: string;
  phone?: string;
};

export type LeadCaptureRequest = BaseRequest & {
  body: Partial<LeadCaptureInput>;
};

/** First call to get some configuration about what we can do with the service
 * Response: {
 *   flowData: JSON stringified definition of the service
 *   upload: {
 *     "isSpeechToTextEnabled": boolean,
 *     "isImageUploadAllowed": boolean,
 *     "isRAGFileUploadAllowed": boolean,
 *     "imgUploadSizeAndTypes": array,
 *     "fileUploadSizeAndTypes": array
 *  }
 * }
 * @param chatflowid
 * @param apiHost
 * @param onRequest
 */
export const getChatbotConfig = ({ chatflowid, apiHost = 'http://localhost:3000', onRequest }: MessageRequest) =>
  sendRequest<any>({
    method: 'GET',
    url: `${apiHost}/api/v1/public-chatbotConfig/${chatflowid}`,
    onRequest: onRequest,
  });

/** Health check, is the service alive ?
 * Response : { isStreaming: true  }
 * @param chatflowid
 * @param apiHost
 * @param onRequest
 */
export const isStreamAvailableQuery = ({ chatflowid, apiHost = 'http://localhost:3000', onRequest }: MessageRequest) =>
  sendRequest<any>({
    method: 'GET',
    url: `${apiHost}/api/v1/chatflows-streaming/${chatflowid}`,
    onRequest: onRequest,
  });

/* DEPRECATED SECTION */

export const createAttachmentWithFormData = ({ chatflowid, apiHost = 'http://localhost:3000', formData, onRequest }: UpsertRequest) =>
  sendRequest({
    method: 'POST',
    url: `${apiHost}/api/v1/attachments/${chatflowid}/${formData.get('chatId')}`,
    formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onRequest: onRequest,
  });

export const sendFileDownloadQuery = ({ apiHost = 'http://localhost:3000', body, onRequest }: MessageRequest) =>
  sendRequest<any>({
    method: 'POST',
    url: `${apiHost}/api/v1/openai-assistants-file/download`,
    body,
    type: 'blob',
    onRequest: onRequest,
  });

export const addLeadQuery = ({ apiHost = 'http://localhost:3000', body, onRequest }: LeadCaptureRequest) =>
  sendRequest<any>({
    method: 'POST',
    url: `${apiHost}/api/v1/leads/`,
    body,
    onRequest: onRequest,
  });
