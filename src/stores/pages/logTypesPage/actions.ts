import { defineStore } from 'pinia';
import { uid } from 'quasar';
import { services } from 'src/services';

import { useState } from './state';
import LogType from './types/logType.type';

export const useActions = defineStore('logTypes.actions', () => {
  const state = useState();

  function setAddingLogType(isAdding: boolean): void {
    state.addingLogType = isAdding;
  }

  function setEditingLogType(isEditing: boolean): void {
    state.editingLogType = isEditing;
  }

  function clearNewLogType() {
    setAddingLogType(false);
    setEditingLogType(false);
    state.newLogType = {
      name: '',
      fields: [
        {
          from: '',
          to: '',
          type: '',
        },
      ],
    };
  }

  function setSearchScheme(searSchemeList: any[]) {
    state.logTypesList = searSchemeList;
  }

  async function createLogType(): Promise<boolean> {
    const id = uid();
    const created = '';
    const modified = '';

    const { newLogType } = state;
    try {
      const searchSchemeAdded = await services.searchSchemas.create(newLogType);
      state.logTypesList.push(searchSchemeAdded);

      clearNewLogType();
      return true;
    } catch (ex) {
      // console.error(ex);
      return false;
    }
  }

  function readLogType(logTypeId: string): LogType | any {
    try {
      const { logTypesList = [] } = state;

      const logTypeIndexToBeRead = logTypesList
        .findIndex((logType: LogType): boolean => {
          const { _id: logTypeIndex } = logType;
          return logTypeIndex === logTypeId;
        });

      if (logTypeIndexToBeRead !== -1) {
        return logTypesList[logTypeIndexToBeRead];
      }

      return {};
    } catch (ex) {
      // console.error(ex);
      return {};
    }
  }

  async function updateLogType(): Promise<boolean> {
    const { newLogType } = state;
    const { _id: logTypeId } = newLogType;

    try {
      // call API to update logType on DB
      const { logTypesList = [] } = state;

      const logTypeIndexToBeUpdated = logTypesList
        .findIndex((logType: LogType): boolean => {
          const { _id: logTypeIndex } = logType;
          return logTypeIndex === logTypeId;
        });

      if (logTypeIndexToBeUpdated !== -1) {
        if (logTypeId != null) {
          await services.searchSchemas.updateById(logTypeId, newLogType);
        }

        state.logTypesList[logTypeIndexToBeUpdated] = {
          ...state.logTypesList[logTypeIndexToBeUpdated],
          ...newLogType,
        };
        clearNewLogType();
      }

      return true;
    } catch (ex) {
      console.error(ex);
      return false;
    }
  }

  async function deleteLogType(logTypeId: string): Promise<boolean> {
    try {
      // call API to remove logType from DB
      const { logTypesList = [] } = state;

      const logTypeIndexToBeRemoved = logTypesList
        .findIndex((logType: LogType): boolean => {
          const { _id: LogTypeIndex } = logType;
          return LogTypeIndex === logTypeId;
        });

      if (logTypeIndexToBeRemoved !== -1) {
        state.logTypesList.splice(logTypeIndexToBeRemoved, 1);
      }

      return true;
    } catch (ex) {
      // console.error(ex);
      return false;
    }
  }

  function clearData(): void {
    state.$reset();
  }

  return {
    clearData,
    clearNewLogType,
    setSearchScheme,
    setAddingLogType,
    setEditingLogType,

    // CRUD
    createLogType,
    readLogType,
    updateLogType,
    deleteLogType,
  };
});
