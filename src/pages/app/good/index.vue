<template>
  <div>selectedRowKeys: {{ selectedRowKeys }}</div>
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
      <div>
        <t-button theme="danger" variant="outline" @click="onBunchOperation(deleteGood)">
          <template #icon><delete-icon /></template>
          批量删除
        </t-button>
        <t-button theme="warning" variant="outline" @click="onBunchOperation(hideGood)"
          ><template #icon><lock-on-icon /></template>
          批量锁定
        </t-button>
      </div>
    </t-row>

    <div class="table-container">
      <t-table
        :selected-row-keys="selectedRowKeys"
        select-on-row-click
        :data="tableData"
        :columns="COLUMNS"
        :row-key="rowKey"
        :vertical-align="verticalAlign"
        :filter-value="filterValue"
        :hover="hover"
        :sort="sortValue"
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
          <t-button shape="circle" variant="text" @click="onEditItem(row)">
            <template #icon> <edit-icon /></template>
          </t-button>

          <t-popconfirm
            destroy-on-close
            show-arrow
            placement="right"
            theme="danger"
            content="确认删除吗"
            @confirm="deleteItem(row)"
          >
            <t-button shape="circle" variant="text"
              ><template #icon> <delete-icon /></template
            ></t-button>
          </t-popconfirm>

          <t-button shape="rectangle" variant="base" theme="danger" @click="hideItem(row)">
            <template #icon> <lock-on-icon /></template>
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
import { AddIcon, DeleteIcon, EditIcon, LockOnIcon, RefreshIcon } from 'tdesign-icons-vue-next';
import { DateRangePickerPanel, MessagePlugin, PageInfo, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
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
    colKey: 'row-select',
    type: 'multiple',
    // 禁用行选中方式一：使用 disabled 禁用行（示例代码有效，勿删）。disabled 参数：{row: RowData; rowIndex: number })
    // 这种方式禁用行选中，当前行会添加行类名 t-table__row--disabled，禁用行文字变灰
    // disabled: ({ rowIndex }) => rowIndex === 1 || rowIndex === 3,

    // 禁用行选中方式二：使用 checkProps 禁用行（示例代码有效，勿删）
    // 这种方式禁用行选中，行文本不会变灰
    // checkProps: ({ rowIndex }) => ({ disabled: rowIndex % 2 !== 0 }),
    width: 50,
  },
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
    width: 100,
    filter: {
      type: 'single',
      list: [{ label: '待审核', value: 'pending' }],
    },
    colKey: 'state',
  },
  {
    title: '游戏',
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
    colKey: 'game',
  },

  {
    title: '详细内容',
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
    colKey: 'detail',
  },
  {
    title: '价格',
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
    align: 'center',
    colKey: 'price',
  },
  {
    title: '发布时间',
    colKey: 'publish_time',
    // width: 160,
    sorter: true,
    filter: {
      type: 'custom',
      component: DateRangePickerPanel,
      props: {
        firstDayOfWeek: 7,
      },
      showConfirmAndReset: true,
      resetValue: [],
    },
    ellipsis: true,
    align: 'left',
  },
  {
    align: 'left',
    fixed: 'right',
    width: 160,
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

const sortValue = ref({
  order_by: '',
  order: '',
});
const selectedRowKeys = ref([]);
const pageValue = ref({ page: pagination.value.defaultCurrent, limit: pagination.value.defaultPageSize });

const filterValue = ref({ register_time: [] });
// const searchForm = {
//   good_id: '',
//   seller_id: '',
//   state: '',
//   game: '',
//   title: '',
//   price: '',
//   detail: '',
//   page: pagination.value.defaultCurrent,
//   limit: pagination.value.defaultPageSize,
// };
// const formData = ref({ ...searchForm });
const tableData = ref([]);

// define apis

import { deleteGood, getGoodList, hideGood } from '@/api/app/good';

// const onBlockItem = async (row) => {
//   try {
//     await blockUser(row.uid, true);
//     MessagePlugin.info('call ban');
//     fetchData();
//     // console.log(data);
//   } catch (e) {
//     console.log(e);
//   }
// };

const hideItem = async (row) => {
  try {
    await hideGood(row.uid);
    fetchData();
    // console.log(data);
  } catch (e) {
    console.log(e);
  } finally {
    MessagePlugin.info('锁定货物成功');
  }
};

const deleteItem = async (row) => {
  try {
    await deleteGood(row.uid);
    fetchData();
    // console.log(data);
  } catch (e) {
    console.log(e);
  } finally {
    MessagePlugin.success('成功删除用户', row.uid);
  }
};

const dataLoading = ref(false);
const fetchData = async () => {
  dataLoading.value = true;
  const queryValue = {
    ...filterValue.value,
    ...pageValue.value,
    ...sortValue.value,
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
  // console.log(formData);
  fetchData();
  console.log('分页变化', pageInfo, newDataSource);
};
const rehandleChange = (changeParams, triggerAndData) => {
  console.log('统一Change', changeParams, triggerAndData);
};

const rehandleSortChange = (val) => {
  sortValue.value.order_by = val.sortBy;
  sortValue.value.order = val.descending === true ? 'desc' : 'asc';
  console.log(formData);

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

// const onBunchDelete = async () => {
//   try {
//     selectedRowKeys.value.forEach(async (item) => {
//       await deleteGood(item);
//     });
//     // await deleteGood(selectedRowKeys.value);
//     fetchData();
//     // console.log(data);
//   } catch (e) {
//     console.log(e);
//   } finally {
//     MessagePlugin.success('成功删除用户', selectedRowKeys.value);
//   }
// };

// const onBunchHide = async () => {
//   try {
//     selectedRowKeys.value.forEach(async (item) => {
//       await hideGood(item);
//     });
//     // await hideGood(selectedRowKeys.value);
//     fetchData();
//     // console.log(data);
//   } catch (e) {
//     console.log(e);
//   } finally {
//     MessagePlugin.info('锁定货物成功');
//   }
// };

const onBunchOperation = async (opFunction) => {
  try {
    selectedRowKeys.value.forEach(async (item) => {
      await opFunction(item);
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

const onEditItem = async (row) => {
  MessagePlugin.info(`call Edit${row}`);
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
