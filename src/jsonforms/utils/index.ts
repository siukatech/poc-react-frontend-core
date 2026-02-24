const convertMetadataListToOptionList = (
  metadataList: undefined | any[],
  valueKey: string,
  labelKey: string
) => {
  const optionList = metadataList
    ? metadataList.map((metadata, idx) => ({
        key: idx,
        const: metadata[valueKey],
        title: metadata[labelKey],
      }))
    : [
        {
          key: 0,
          const: '',
          title: '',
        },
      ];
};

export { convertMetadataListToOptionList };
