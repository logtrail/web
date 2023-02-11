import { ref, onMounted } from 'vue';
import { services } from 'src/services';

/**
 * Composable to use any places
 */
export function useSearchScheme() {
  /**
   * States local
   */
  const searchSchemesOptions = ref<never[]>([]);
  const searchMoreSearchScheme = ref<boolean>(false);
  const searchSchemesPagination = ref({ page: 1, perPage: 10, total: 0 });

  /**
   * Get searchSchemes
   */
  const getSearchScheme = async () => {
    const {
      items: searchSchemesData,
      pagination,
    } = await services.searchSchemas.find(searchSchemesPagination.value);

    const items = searchSchemesData.map((scheme: any) => ({
      label: scheme.name,
      value: scheme._id,
      fields: scheme.fields,
    })) as never[];

    return { items, pagination };
  };

  /**
   * Get more searchSchemes by scroll
   */
  const getSearchSchemeByNextPage = async (params: any) => {
    const { index } = params as any;
    const lastIndex = searchSchemesOptions.value.length - 1;
    const { total } = searchSchemesPagination.value;

    if (
      index === lastIndex
      && searchSchemesPagination.value.page <= total
    ) {
      searchMoreSearchScheme.value = true;

      const { items } = await getSearchScheme();
      searchSchemesOptions.value = [...searchSchemesOptions.value, ...items];

      searchSchemesPagination.value.page += 1;
      searchMoreSearchScheme.value = false;
      return;
    }

    searchMoreSearchScheme.value = false;
  };

  /**
   * Life cycle
   */
  onMounted(async () => {
    const { items, pagination: paginationInfo } = await getSearchScheme();

    searchSchemesOptions.value = items;
    searchSchemesPagination.value.total = paginationInfo.total;
  });

  return {
    searchSchemesOptions,
    searchSchemesPagination,
    searchMoreSearchScheme,
    getSearchSchemeByNextPage,
  };
}
