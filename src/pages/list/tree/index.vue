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
