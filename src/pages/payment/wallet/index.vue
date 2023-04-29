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
        <t-button theme="primary" variant="outline" @click="onBunchOperation(changeWalletState, 'normal')">
          <template #icon><lock-off-icon /></template>
          批量解锁
        </t-button>
        <t-button theme="danger" variant="outline" @click="onBunchOperation(changeWalletState, 'locked')">
          <template #icon><lock-on-icon /></template>
          批量锁定
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
          <t-tag v-if="row.state === 'normal'" theme="primary" variant="light"> 正常 </t-tag>
          <t-tag v-if="row.state === 'locked'" theme="danger" variant="light"> 已锁定 </t-tag>
        </template>

        <template #op="{ row }">
          <t-popconfirm theme="default" @confirm="onModifyWalletBalance(row, chargeWallet)">
            <template #content>
              <p class="title" style="margin-bottom: 5px">请输入要进行操作的金额</p>
              <t-input v-model="inputAmount" label="金额: " suffix="元" />
              <!-- <p class="describe">带描述的气泡确认框在主要说明之外增加了操作相关的详细描述</p> -->
            </template>
            <t-button shape="rectangle" variant="outline" theme="primary">
              <template #icon> <check-icon />充值</template>
            </t-button>
          </t-popconfirm>
          <t-popconfirm theme="default" @confirm="onModifyWalletBalance(row, withdrawWallet)">
            <template #content>
              <p class="title" style="margin-bottom: 5px">请输入要进行操作的金额</p>
              <t-input v-model="inputAmount" label="金额: " suffix="元" />
              <!-- <p class="describe">带描述的气泡确认框在主要说明之外增加了操作相关的详细描述</p> -->
            </template>
            <t-button shape="rectangle" variant="outline" theme="danger">
              <template #icon> <close-icon />提现</template>
            </t-button>
          </t-popconfirm>

          <!-- <t-button shape="rectangle" variant="base" theme="warning" @click="opItem(row, 'reject')">
            <template #icon> <lock-on-icon />锁定</template>
          </t-button> -->

          <!-- dynamic change button code -->

          <t-button
            v-if="row.state === 'locked'"
            shape="rectangle"
            variant="base"
            theme="primary"
            @click="onChangeWalletState(row, 'normal')"
          >
            <template #icon> <lock-off-icon />解锁</template>
          </t-button>
          <t-button v-else shape="rectangle" variant="base" theme="danger" @click="onChangeWalletState(row, 'locked')">
            <template #icon> <lock-on-icon />锁定</template>
          </t-button>
        </template>
      </t-table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { CheckIcon, CloseIcon, LockOffIcon, LockOnIcon, RefreshIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin, PageInfo, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { computed, onMounted, ref } from 'vue';

// import Trend from '@/components/trend/index.vue';
import { prefix } from '@/config/global';
import { useSettingStore } from '@/store';

const store = useSettingStore();
const rowKey = 'uid';
const verticalAlign = 'top' as const;
const hover = true;
const inputAmount = ref();
const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
  },
  {
    title: '钱包ID',
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
    title: '用户ID',
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
    colKey: 'user_id',
  },
  {
    title: '状态',
    width: 80,
    colKey: 'state',
    align: 'center',
  },
  {
    title: '钱包余额',
    width: 80,
    sorter: true,
    ellipsis: true,
    align: 'left',
    colKey: 'balance',
  },
  {
    align: 'center',
    fixed: 'left',
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

const sortValue = ref({
  order_by: '',
  order: '',
});
const selectedRowKeys = ref([]);
const pageValue = ref({ page: pagination.value.defaultCurrent, limit: pagination.value.defaultPageSize });

const filterValue = ref({ register_time: [] });
const tableData = ref([]);
// define apis

import { changeWalletState, chargeWallet, getWalletList, withdrawWallet } from '@/api/app/wallet';

const onModifyWalletBalance = async (row, opFunction) => {
  // console.log(row);

  try {
    await opFunction(row.uid, inputAmount.value).then((res) => {
      console.log(res);
    });
    fetchData();
  } catch (e) {
    console.log(e);
  } finally {
    MessagePlugin.info('修改钱包金额成功');
  }
};

const onChangeWalletState = async (row, op: string) => {
  // console.log(row.state, op);
  try {
    await changeWalletState(row.uid, op).then((res) => {
      console.log(res);
    });
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
    tableData.value = await getWalletList(queryValue).then((res) => {
      pagination.value = {
        ...pagination.value,
        total: res.count,
      };
      return res.wallets;
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

const onBunchOperation = async (opFunction, arg) => {
  try {
    selectedRowKeys.value.forEach(async (item) => {
      await opFunction(item, arg);
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
