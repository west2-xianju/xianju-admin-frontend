<template>
  <div class="list-common-table">
    <t-row justify="space-between" class="form-basic-item">
      <div>
        <t-button theme="primary" @click="onRefreshList"
          ><template #icon><refresh-icon /></template>
          刷新列表
        </t-button>
      </div>
    </t-row>

    <div class="table-container">
      <t-table
        :selected-row-keys="selectedRowKeys"
        :data="tableData"
        :columns="COLUMNS"
        :row-key="rowKey"
        :vertical-align="verticalAlign"
        :filter-value="filterValue"
        :hover="hover"
        :sort="sortKey"
        :pagination="pagination"
        :loading="dataLoading"
        :header-affixed-top="headerAffixedTop"
        @select-change="rehandleSelectChange"
        @sort-change="rehandleSortChange"
        @page-change="rehandlePageChange"
        @filter-change="rehandleFilterChange"
        @change="rehandleChange"
      >
        <template #state="{ row }">
          <!-- ORDER_STATE_ENUM = ['pending', 'paid', 'delivered', 'completed', 'canceled', 'refunded', 'locked', 'closed'] -->
          <t-tag v-if="row.state === 'pending'" theme="primary" variant="light"> 待付款 </t-tag>
          <t-tag v-if="row.state === 'paid'" theme="primary" variant="light"> 待发货 </t-tag>
          <t-tag v-if="row.state === 'delivered'" theme="primary" variant="light"> 待收货 </t-tag>
          <t-tag v-if="row.state === 'completed'" theme="primary" variant="light"> 已完成 </t-tag>
          <t-tag v-if="row.state === 'canceled'" theme="primary" variant="light"> 已取消 </t-tag>
          <t-tag v-if="row.state === 'refunded'" theme="primary" variant="light"> 已退款 </t-tag>
          <t-tag v-if="row.state === 'locked'" theme="danger" variant="light"> 已锁定 </t-tag>
          <t-tag v-if="row.state === 'closed'" theme="danger" variant="light"> 已关闭 </t-tag>
        </template>
      </t-table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RefreshIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin, PageInfo, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { computed, onMounted, ref } from 'vue';

// import Trend from '@/components/trend/index.vue';
import { prefix } from '@/config/global';
import { useSettingStore } from '@/store';

const store = useSettingStore();
const rowKey = 'uid';
const verticalAlign = 'top' as const;
const hover = true;
const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
  },
  {
    title: '订单ID',
    // sorter: true,
    fixed: 'left',
    width: 70,
    ellipsis: true,
    filter: {
      type: 'input',
      resetValue: '',
      confirmEvents: ['onEnter'],
      props: {
        placeholder: '输入关键词过滤',
      },
      // 是否显示重置取消按钮，一般情况不需要显示
      showConfirmAndReset: true,
    },
    align: 'left',
    colKey: 'uid',
  },
  {
    title: '付款方ID',
    // sorter: true,
    width: 70,
    filter: {
      type: 'input',
      resetValue: '',
      confirmEvents: ['onEnter'],
      props: {
        placeholder: '输入关键词过滤',
      },
      // 是否显示重置取消按钮，一般情况不需要显示
      showConfirmAndReset: true,
    },
    ellipsis: true,
    align: 'left',
    colKey: 'from_id',
  },
  {
    title: '收款方ID',
    // sorter: true,
    width: 70,
    filter: {
      type: 'input',
      resetValue: '',
      confirmEvents: ['onEnter'],
      props: {
        placeholder: '输入关键词过滤',
      },
      // 是否显示重置取消按钮，一般情况不需要显示
      showConfirmAndReset: true,
    },
    ellipsis: true,
    align: 'left',
    colKey: 'to_id',
  },
  {
    title: '货物ID',
    // sorter: true,
    width: 70,
    filter: {
      type: 'input',
      resetValue: '',
      confirmEvents: ['onEnter'],
      props: {
        placeholder: '输入关键词过滤',
      },
      // 是否显示重置取消按钮，一般情况不需要显示
      showConfirmAndReset: true,
    },
    ellipsis: true,
    align: 'left',
    colKey: 'good_id',
  },
  {
    title: '状态',
    width: 80,
    colKey: 'state',
    align: 'center',
  },
  {
    title: '金额',
    width: 80,
    sorter: true,
    ellipsis: true,
    align: 'left',
    colKey: 'price',
  },
  {
    title: '创建时间',
    width: 150,
    sorter: true,
    ellipsis: true,
    align: 'left',
    colKey: 'create_time',
  },
  {
    title: '付款时间',
    width: 150,
    sorter: true,
    ellipsis: true,
    align: 'left',
    colKey: 'pay_time',
  },
  {
    title: '完成时间',
    width: 150,
    sorter: true,
    ellipsis: true,
    align: 'left',
    colKey: 'complete_time',
  },
];
const pagination = ref({
  defaultPageSize: 20,
  pageSizeOptions: [10, 20],
  defaultCurrent: 1,
  total: 0,
});
const sortKey = ref({
  sortBy: '',
  descending: false,
});
const sortValue = ref({
  order_by: '',
  order: '',
});
const selectedRowKeys = ref([]);
const pageValue = ref({ page: pagination.value.defaultCurrent, limit: pagination.value.defaultPageSize });

const filterValue = ref({});
const tableData = ref([]);
// define apis

import { getOrderList } from '@/api/app/order';

const dataLoading = ref(false);
const fetchData = async () => {
  dataLoading.value = true;
  const queryValue = {
    ...filterValue.value,
    ...pageValue.value,
    ...sortValue.value,
    state: 'pending',
  };
  try {
    tableData.value = await getOrderList(queryValue).then((res) => {
      pagination.value = {
        ...pagination.value,
        total: res.count,
      };
      return res.orders;
    });
    // console.log(data);
  } catch (e) {
    console.log(e);
  } finally {
    dataLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const rehandlePageChange = (pageInfo: PageInfo, newDataSource: TableRowData[]) => {
  pageValue.value.page = pageInfo.current;
  pageValue.value.limit = pageInfo.pageSize;
  fetchData();
  console.log('分页变化', pageInfo, newDataSource);
};
const rehandleChange = (changeParams, triggerAndData) => {
  console.log('统一Change', changeParams, triggerAndData);
};

const rehandleSortChange = (val) => {
  sortValue.value.order_by = val.sortBy;
  sortValue.value.order = val.descending === true ? 'desc' : 'asc';

  fetchData();
};
const rehandleSelectChange = (row) => {
  selectedRowKeys.value = row;
  console.log('统一Select', row);
};
const rehandleFilterChange = async (filters) => {
  filterValue.value = {
    ...filters,
    ...sortValue.value,
    createTime: filters.createTime || [],
  };

  try {
    fetchData();
  } catch (e) {
    console.log(e);
  } finally {
    MessagePlugin.info('查询成功');
  }
};

const onRefreshList = () => {
  try {
    fetchData();
  } catch (e) {
    console.log(e);
  } finally {
    MessagePlugin.success('刷新成功');
  }
};
const headerAffixedTop = computed(
  () =>
    ({
      offsetTop: store.isUseTabsRouter ? 48 : 0,
      container: `.${prefix}-layout`,
    } as any), // TO BE FIXED
);
</script>

<style lang="less" scoped>
.list-common-table {
  background-color: var(--td-bg-color-container);
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);
  border-radius: var(--td-radius-medium);

  .table-container {
    margin-top: var(--td-comp-margin-xxl);
  }
}

.form-item-content {
  width: 100%;
}

.operation-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .expand {
    .t-button__text {
      display: flex;
      align-items: center;
    }
  }
}

.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: var(--td-comp-margin-s);
  }
}
</style>
