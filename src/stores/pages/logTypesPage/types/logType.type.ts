import LogTypeField from './logTypeField.type';

export type LogType = {
  name: '',
  fields: LogTypeField[];

  _id?: string;
  created?: string;
  modified?: string;
};

export default LogType;
