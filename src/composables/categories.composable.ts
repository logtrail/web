import { ref, onMounted } from 'vue';
import { services } from 'src/services';

/**
 * Composable to use any places
 */
export function useCategories() {
  /**
   * States local
   */
  const categoriesOptions = ref<never[]>([]);
  const searchMoreCategories = ref<boolean>(false);
  const categoriesPagination = ref({ page: 1, perPage: 15, total: 0 });

  /**
   * Get categories
   */
  const getCategories = async () => {
    const {
      items: categoriesData,
      pagination,
    } = await services.categories.find(categoriesPagination.value);

    const items = categoriesData.map((category: any) => ({
      label: category.name,
      value: category._id,
      logTypeId: category.logTypeId,
    })) as never[];

    return { items, pagination };
  };

  /**
   * Get more categories by scroll
   */
  const getCategoriesByNextPage = async (params: any) => {
    const { index } = params as any;
    const lastIndex = categoriesOptions.value.length - 1;
    const { total } = categoriesPagination.value;

    if (
      index === lastIndex
      && categoriesPagination.value.page <= total
    ) {
      searchMoreCategories.value = true;

      const { items } = await getCategories();
      categoriesOptions.value = [...categoriesOptions.value, ...items];

      categoriesPagination.value.page += 1;
      searchMoreCategories.value = false;
      return;
    }

    searchMoreCategories.value = false;
  };

  /**
   * Life cycle
   */
  onMounted(async () => {
    const { items, pagination: paginationInfo } = await getCategories();

    categoriesOptions.value = items;
    categoriesPagination.value.total = paginationInfo.total;
  });

  return {
    categoriesOptions,
    categoriesPagination,
    searchMoreCategories,
    getCategoriesByNextPage,
  };
}
