<template>
  <div class="list-common-table">
    <t-row justify="space-between" class="form-basic-item">
      <div>
        <t-button theme="primary" @click="onAddUser">
          <template #icon><add-icon /></template>
          新建用户
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
        <template #blocked="{ row }">
          <t-tag v-if="row.blocked === true" theme="danger" variant="light"> 已冻结 </t-tag>
          <t-tag v-if="row.blocked === false" theme="success" variant="light"> 正常 </t-tag>
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

          <t-button shape="rectangle" variant="base" theme="danger" @click="swapBlockedStatus(row)">
            <template #icon> <swap-icon /></template>
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
import { AddIcon, DeleteIcon, EditIcon, RefreshIcon, SwapIcon } from 'tdesign-icons-vue-next';
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
    title: '用户ID',
    sorter: true,
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
    align: 'center',
    colKey: 'uid',
  },
  {
    title: '用户名',
    sorter: true,
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
    colKey: 'username',
  },
  // {
  //   title: '头像',
  //   width: 280,
  //   ellipsis: true,
  //   align: 'left',
  //   colKey: 'profile',
  // },
  {
    title: '状态',
    width: 100,
    filter: {
      type: 'single',
      list: [
        { label: '已冻结', value: true },
        { label: '正常', value: false },
      ],
    },
    colKey: 'blocked',
  },
  {
    title: '昵称',
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
    colKey: 'nickname',
  },
  {
    title: '邮箱',
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
    colKey: 'email',
  },
  {
    title: '真实姓名',
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
    colKey: 'realname',
  },
  {
    title: '身份证号',
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
    colKey: 'id_number',
  },
  {
    title: '注册时间',
    colKey: 'register_time',
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
const searchForm = {
  user_id: '',
  username: '',
  nickname: '',
  email: '',
  blocked: '',
  realname: '',
  id_number: '',
  page: pagination.value.defaultCurrent,
  limit: pagination.value.defaultPageSize,
};
const formData = ref({ ...searchForm });
const tableData = ref([]);

// define apis

import { blockUser, deleteUser, getUserList } from '@/api/app/user';

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

const swapBlockedStatus = async (row) => {
  try {
    await blockUser(row.uid, !row.blocked);
    fetchData();
    // console.log(data);
  } catch (e) {
    console.log(e);
  } finally {
    MessagePlugin.info('切换封禁状态成功');
  }
};

const deleteItem = async (row) => {
  try {
    await deleteUser(row.uid);
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
    tableData.value = await getUserList(queryValue).then((res) => {
      pagination.value = {
        ...pagination.value,
        total: res.count,
      };
      return res.users;
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

// const onReset = (val) => {
//   console.log(formData.value);
//   console.log(val);
// };

// const onSubmit = async ({ validateResult, firstError }) => {
//   console.log(formData);
//   MessagePlugin.info('查询中...');

//   tableData.value = await getUserList(formData.value).then((res) => {
//     pagination.value = {
//       ...pagination.value,
//       total: res.count,
//     };
//     return res.users;
//   });
//   if (validateResult === true) {
//     MessagePlugin.success('查询成功');
//   } else {
//     console.log('Validate Errors: ', firstError, validateResult);
//     MessagePlugin.warning(firstError);
//   }
// };

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

const sortValue = ref({
  order_by: '',
  order: '',
});

const pageValue = ref({ page: pagination.value.defaultCurrent, limit: pagination.value.defaultPageSize });

const rehandleSortChange = (val) => {
  // console.log('sort change');
  sortValue.value.order_by = val.sortBy;
  sortValue.value.order = val.descending === true ? 'desc' : 'asc';

  console.log(formData);
  // request(filters);
  fetchData();
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
