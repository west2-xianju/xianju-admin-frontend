<template>
  <div class="list-common-table">
    <t-row justify="space-between" class="form-basic-item">
      <div>
        <t-button theme="primary" @click="onRefreshList"
          ><template #icon><refresh-icon /></template>
          刷新列表
        </t-button>
      </div>
      <div>
        <t-button theme="danger" variant="outline" @click="onBunchOperation(censorGood, 'allow')">
          <template #icon><check-icon /></template>
          批量通过
        </t-button>
        <t-button theme="warning" variant="outline" @click="onBunchOperation(censorGood, 'reject')"
          ><template #icon><close-icon /></template>
          批量拒绝
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
          <t-tag v-if="row.state === 'pending'" theme="primary" variant="light"> 待审核 </t-tag>
          <t-tag v-if="row.state === 'released'" theme="success" variant="light"> 已发布 </t-tag>
          <t-tag v-if="row.state === 'locked'" theme="danger" variant="light"> 已锁定 </t-tag>
          <t-tag v-if="row.state === 'sold'" theme="warning" variant="light"> 已售出 </t-tag>
          <t-tag v-if="row.state === 'canceled'" theme="default" variant="light"> 已取消 </t-tag>
        </template>

        <template #op="{ row }">
          <t-button shape="rectangle" variant="base" theme="primary" @click="opItem(row, 'allow')">
            <template #icon> <check-icon />通过</template>
          </t-button>

          <t-button shape="rectangle" variant="base" theme="danger" @click="opItem(row, 'reject')">
            <template #icon> <close-icon />拒绝</template>
          </t-button>

          <!-- dynamic change button code -->

          <!-- <t-button v-if="row.blocked" shape="rectangle" variant="base" theme="danger" @click="onUnblockItem(row)"
            ><swap-icon slot="icon"
          /></t-button>
          <t-button v-else shape="rectangle" variant="base" theme="primary" @click="onBlockItem(row)">
            <swap-icon slot="icon"></swap-icon>
          </t-button> -->

          <!-- <t-button shape="rectangle" theme="primary">
            <template #icon> <cloud-download-icon /></template>
          </t-button> -->
        </template>
      </t-table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { CheckIcon, CloseIcon, RefreshIcon } from 'tdesign-icons-vue-next';
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
    title: '货物ID',
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
    title: '卖家ID',
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
    colKey: 'seller_id',
  },
  {
    title: '标题',
    width: 200,
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
    colKey: 'title',
  },
  {
    title: '状态',
    width: 80,
    colKey: 'state',
    align: 'center',
  },
  {
    title: '游戏',
    width: 80,
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
    colKey: 'game',
  },

  {
    title: '详细内容',
    width: 200,
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
    colKey: 'detail',
  },
  {
    title: '价格',
    width: 80,
    sorter: true,
    ellipsis: true,
    align: 'left',
    colKey: 'price',
  },
  {
    align: 'center',
    fixed: 'right',
    width: 150,
    colKey: 'op',
    title: '操作',
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

const filterValue = ref({ register_time: [] });
const tableData = ref([]);
// define apis

import { censorGood, getGoodList } from '@/api/app/good';

const opItem = async (row, op: string) => {
  try {
    await censorGood(row.uid, op);
    fetchData();
    // console.log(data);
  } catch (e) {
    console.log(e);
  } finally {
    MessagePlugin.info('审核货物成功');
  }
};

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
    tableData.value = await getGoodList(queryValue).then((res) => {
      pagination.value = {
        ...pagination.value,
        total: res.count,
      };
      return res.goods;
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

const onBunchOperation = async (opFunction, args) => {
  try {
    selectedRowKeys.value.forEach(async (item) => {
      await opFunction(item, args);
    });
    fetchData();
    // console.log(data);
  } catch (e) {
    console.log(e);
  } finally {
    MessagePlugin.info('批量操作成功');
    selectedRowKeys.value = [];
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
