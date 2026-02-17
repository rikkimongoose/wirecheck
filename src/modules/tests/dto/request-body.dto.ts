import { HeaderEntryDto } from './header-entry.dto';

export enum RequestBodyType {
  JSON = 'json',
  FORM_URLENCODED = 'form-urlencoded',
  MULTIPART = 'multipart',
  RAW = 'raw',
  BINARY = 'binary',
}

export interface BaseRequestBody {
  type: RequestBodyType;
  description?: string;
}

export interface JsonRequestBody extends BaseRequestBody {
  type: RequestBodyType.JSON;
  value: unknown;
}

export interface FormUrlEncodedRequestBody extends BaseRequestBody {
  type: RequestBodyType.FORM_URLENCODED;
  fields: HeaderEntryDto[];
}

export interface MultipartField {
  name: string;
  value?: string;
  fileName?: string;
  contentType?: string;
  description?: string;
}

export interface MultipartRequestBody extends BaseRequestBody {
  type: RequestBodyType.MULTIPART;
  fields: MultipartField[];
}

export interface RawRequestBody extends BaseRequestBody {
  type: RequestBodyType.RAW;
  contentType: string;
  value: string;
}

export interface BinaryRequestBody extends BaseRequestBody {
  type: RequestBodyType.BINARY;
  fileName?: string;
  contentType?: string;
}

export type RequestBody =
  | JsonRequestBody
  | FormUrlEncodedRequestBody
  | MultipartRequestBody
  | RawRequestBody
  | BinaryRequestBody;
