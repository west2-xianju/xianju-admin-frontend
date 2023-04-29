<template>
  <div class="list-common-table">
    <t-row justify="space-between" class="form-basic-item">
      <div>
        <t-button theme="primary" @click="onAddUser">
          <template #icon><add-icon /></template>
          新建货物
        </t-button>
        <t-button theme="default" variant="outline" @click="onRefreshList"
          ><template #icon><refresh-icon /></template>
          刷新列表
        </t-button>
      </div>
    </t-row>

    <div class="table-container">
      <t-table
        :data="tableData"
        :columns="COLUMNS"
        :row-key="rowKey"
        :vertical-align="verticalAlign"
        :filter-value="filterValue"
        :hover="hover"
        :sort="sort"
        :pagination="pagination"
        :loading="dataLoading"
        :header-affixed-top="headerAffixedTop"
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
import { AddIcon, CheckIcon, CloseIcon, RefreshIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin, PageInfo, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { computed, onMounted, ref } from 'vue';
// import Trend from '@/components/trend/index.vue';
import { useRouter } from 'vue-router';

import { prefix } from '@/config/global';
import { useSettingStore } from '@/store';

const store = useSettingStore();
const rowKey = 'uid';
const verticalAlign = 'top' as const;
const hover = true;

const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  {
    title: '货物ID',
    // sorter: true,
    fixed: 'left',
    width: 100,
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
    width: 100,
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
    width: 160,
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
    filter: {
      type: 'single',
      list: [{ label: '待审核', value: 'pending' }],
    },
    colKey: 'state',
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
const searchForm = {
  good_id: '',
  seller_id: '',
  state: 'pending',
  game: '',
  title: '',
  price: '',
  detail: '',
  page: pagination.value.defaultCurrent,
  limit: pagination.value.defaultPageSize,
};
const formData = ref({ ...searchForm });
const tableData = ref([]);

// define apis

import { censorGood, getGoodList } from '@/api/app/good';

const opItem = async (row, op) => {
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
  try {
    formData.value.state = 'pending';
    tableData.value = await getGoodList(formData.value).then((res) => {
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
  formData.value.page = pageInfo.current;
  formData.value.limit = pageInfo.pageSize;
  console.log(formData);
  fetchData();
  console.log('分页变化', pageInfo, newDataSource);
};
const rehandleChange = (changeParams, triggerAndData) => {
  console.log('统一Change', changeParams, triggerAndData);
};

const filterValue = ref({ register_time: [] });

const sort = ref({
  order_by: '',
  order: '',
});

const rehandleSortChange = (val) => {
  // console.log('sort change');
  sort.value.order_by = val.sortBy;
  sort.value.order = val.descending === true ? 'desc' : 'asc';
  formData.value = {
    ...formData.value,
    ...filterValue.value,
    ...sort.value,
  };
  console.log(formData);
  // request(filters);
  fetchData();
};

const rehandleFilterChange = async (filters) => {
  filterValue.value = {
    ...filters,
    createTime: filters.createTime || [],
  };

  formData.value = {
    ...formData.value,
    ...filterValue.value,
    ...sort.value,
    createTime: filters.createTime || [],
  };
  try {
    fetchData();
  } catch (e) {
    console.log(e);
  } finally {
    MessagePlugin.info('查询成功');
    formData.value = { ...searchForm.value };
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

const router = useRouter();
const onAddUser = () => {
  router.push('/app/user/create');
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
