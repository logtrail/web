import LogType from './logType.type';

export type LogTypesState = {
  addingLogType: boolean;
  editingLogType: boolean;

  newLogType: LogType;
  logTypesList: LogType[];
};

export default LogTypesState;
