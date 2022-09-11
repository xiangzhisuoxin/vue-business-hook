<template>
  <div id="app">
    <h1>HelloWorld</h1>
    <el-button type="primary" @click="eventHandler.onAdd">新增</el-button>
    <el-button type="primary" @click="api.getData">获取表格数据</el-button>
    <el-button type="primary" @click="resetDB">重置</el-button>

    <el-table :data="list" style="width: 100%" v-loading="ui.isLoading">
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
      <el-table-column prop="action" label="操作">
        <template slot-scope="{ row }">
          <el-button type="primary" @click="eventHandler.onView(row)"
            >查看</el-button
          >
          <el-button type="primary" @click="eventHandler.onEdit(row)"
            >编辑</el-button
          >
          <el-button type="danger" @click="eventHandler.onDelete(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="page.pageSizeChange"
      @current-change="page.pageNoChange"
      :current-page="page.pageNo"
      :page-sizes="[5, 10, 20, 30, 40]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    >
    </el-pagination>

    <el-dialog title="收货地址" :visible.sync="ui.isShowDialog">
      <el-form :model="form" :disabled="ui.disableForm" ref="formRef">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="区域" prop="address">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="eventHandler.onCancel">取 消</el-button>
        <el-button
          v-show="!ui.disableForm"
          type="primary"
          @click="eventHandler.onSave"
          :loading="ui.isSaving"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { nextTick, onMounted, reactive, ref } from "vue";
import { useBTable } from "./scripts/table.hook";
import { editData, getData, removeData, addData } from "./scripts/api";
import { resetDB } from "./scripts/db";
import { to } from "./scripts/tool";
import { MessageBox } from "element-ui";

export default {
  name: "App",
  setup() {
    const list = ref([]);

    const form = reactive({
      id: "",
      name: "",
      address: "",
    });
    const query = reactive({
      name: "",
      address: "",
    });
    const formRef = ref(null);

    const { eventHandler, ui, api, page } = useBTable({
      list,
      form,
      isDebug: true,
      event: {
        onDeleteConfirm() {
          return MessageBox.confirm("此操作将删除该数据, 是否继续?", "提示");
        },
      },
      api: {
        async getData(page) {
          const param = { pageNo: page.pageNo - 1, size: page.size, ...query };
          console.log("param", param);
          const res = await getData(param);
          page.total = res.total;
          return res.data;
        },
        addData,
        editData,
        removeData,
      },
      pageConfig: {
        size: 5,
      },
      formConfig: {
        ref: formRef,
        validate() {
          return formRef.value.validate();
        },
        reset() {
          nextTick(() => {
            formRef.value.resetFields();
          });
        },
      },
    });

    return {
      list,
      page,
      form,
      eventHandler,
      formRef,
      ui,
      resetDB,
      api,
    };
  },
  components: {},
};
</script>

<style>
</style>
