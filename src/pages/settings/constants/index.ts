export const MIN_VERSION_TO_EDIT_INFO = 6;

export const FIELDS_ABLE_TO_EDIT = [
  'maxSize',
];

export const TRANSFORM_FIELDS = {
  versionDb: (value: string) => {
    const canEditThisField = FIELDS_ABLE_TO_EDIT.includes('versionDb');

    return {
      key: 'versionDb',
      label: 'Database version',
      value,
      canEdit: canEditThisField,
      props: {},
    };
  },
  totalDocs: (value: string) => {
    const valueConverted = Number(value);
    const canEditThisField = FIELDS_ABLE_TO_EDIT.includes('totalDocs');

    return {
      key: 'totalDocs',
      label: 'Document count',
      value: `${valueConverted} document${valueConverted > 1 ? 's' : ''}`,
      canEdit: canEditThisField,
      props: {},
    };
  },
  avgDocSize: (value: string) => {
    const canEditThisField = FIELDS_ABLE_TO_EDIT.includes('avgDocSize');

    return {
      key: 'avgDocSize',
      label: 'Document size Average',
      value,
      canEdit: canEditThisField,
      props: {},
    };
  },
  storageSize: (value: string) => {
    const canEditThisField = FIELDS_ABLE_TO_EDIT.includes('storageSize');

    return {
      key: 'storageSize',
      label: 'Documents storage size',
      value,
      canEdit: canEditThisField,
      props: {},
    };
  },
  maxSize: (value: string, allFields: any) => {
    const canEditThisField = FIELDS_ABLE_TO_EDIT.includes('maxSize');

    const { versionDb = '' } = allFields;

    let [majorVersionFromDb] = versionDb.split('.');
    majorVersionFromDb = Number(majorVersionFromDb);

    if (majorVersionFromDb > MIN_VERSION_TO_EDIT_INFO) {
      value = value.replace(/[^0-9]/g, '');
    }

    return {
      key: 'maxSize',
      label: 'Max document size',
      value: `${value} <span class="text-caption">(To edit this value, you need to have installed the mongodb 6 or higher)</span>`,
      canEdit: canEditThisField && majorVersionFromDb > MIN_VERSION_TO_EDIT_INFO,
      props: {
        component: 'input',
        label: 'Max document size(in MB)',
        type: 'number',
      },
    };
  },
};
