import { ref, onMounted } from 'vue';
import { services } from 'src/services';

/**
 * Composable to use any places
 */
export function useNotifications() {
  /**
   * States local
   */
  const notificationsOptions = ref<never[]>([]);
  const searchMoreNotifications = ref<boolean>(false);
  const notificationsPagination = ref({ page: 1, perPage: 10, total: 0 });

  /**
   * Get notifications
   */
  const getNotifications = async () => {
    const {
      items: notificationsData,
      pagination,
    } = await services.notifications.find(notificationsPagination.value);

    const items = notificationsData.map((scheme: any) => ({
      label: scheme.name,
      value: scheme._id,
    })) as never[];

    return { items, pagination };
  };

  /**
   * Get more notifications by scroll
   */
  const getNotificationsByNextPage = async (params: any) => {
    const { index } = params as any;
    const lastIndex = notificationsOptions.value.length - 1;
    const { total } = notificationsPagination.value;

    if (
      index === lastIndex
      && notificationsPagination.value.page <= total
    ) {
      searchMoreNotifications.value = true;

      const { items } = await getNotifications();
      notificationsOptions.value = [...notificationsOptions.value, ...items];

      notificationsPagination.value.page += 1;
      searchMoreNotifications.value = false;
      return;
    }

    searchMoreNotifications.value = false;
  };

  /**
   * Life cycle
   */
  onMounted(async () => {
    const { items, pagination: paginationInfo } = await getNotifications();

    notificationsOptions.value = items;
    notificationsPagination.value.total = paginationInfo.total;
  });

  return {
    notificationsOptions,
    notificationsPagination,
    searchMoreNotifications,
    getNotificationsByNextPage,
  };
}
