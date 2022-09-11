// import { Message, MessageBox } from "element-ui";
import { nextTick, onMounted, reactive, ref } from "vue";
import { to } from "./tool";
const consts = {
  ADD: "ADD",
  EDIT: "EDIT",
  VIEW: "VIEW",
};

const getLogger = (isDebug) => {
  const debug = isDebug ? console.debug.bind(null, "useBTable:") : () => {};
  const log = isDebug ? console.log.bind(null, "useBTable:") : () => {};
  const error = console.error;

  return { debug, log, error };
};

export const usePage = ({ callback }) => {
  const page = reactive({
    total: 0,
    size: 10,
    pageNo: 0,
    pageNoChanage(no) {
      page.pageNo = no - 1;
      callback && callback();
    },
    pageSizeChange(size) {
      page.size = size;
      callback && callback();
    },
  });

  return { page };
};

export const useBTable = ({
  list,
  form,
  api,
  event,
  isDebug,
  formConfig,
  pageConfig,
} = {}) => {
  const { debug, error, log } = getLogger(isDebug);

  const commonForm = reactive({
    mode: consts.ADD,
  });
  const ui = reactive({
    isShowDialog: false,
    isLoading: false,
    isSaving: false,
    isRemoving: false,
    isQuering: false,
    disableForm: false,
  });

  const page = reactive({
    total: 0,
    size: pageConfig?.size ?? 10,
    pageNo: 1,
    pageNoChange(no) {
      console.log("no", no);
      page.pageNo = no;
      api.getData();
    },
    pageSizeChange(size) {
      page.size = size;
      api.getData();
    },
  });

  const temp = api.getData;
  api.getData = async () => {
    ui.isLoading = true;
    let [err, res] = await to(temp(page));
    ui.isLoading = false;
    if (res) {
      debug("get table data", res);
      list.value = res;
    }
  };

  const eventHandler = {
    onView(row) {
      commonForm.mode = consts.VIEW;
      ui.disableForm = true;
      ui.isShowDialog = true;
      Object.assign(form, row);
    },
    onAdd() {
      ui.isShowDialog = true;
      formConfig?.reset?.();
    },
    onEdit(row) {
      commonForm.mode = consts.EDIT;
      ui.isShowDialog = true;
      Object.assign(form, row);
    },
    async onDelete(row) {
      const id = row.id;
      let err, res;
      if (event.onDeleteConfirm) {
        [err, res] = await to(event.onDeleteConfirm());
        console.log("err, res", err, res);
        if (err) {
          return;
        }
      }

      log("remove data, id:", id);
      ui.isRemoving = true;
      [err, res] = await to(api.removeData(id));
      ui.isRemoving = false;
      if (err) return;
      api.getData();
    },
    onSave: async function () {
      if (formConfig?.validate) {
        const isPass = await formConfig?.validate?.();
        if (!isPass) return;
      }

      let fn, tip;
      switch (commonForm.mode) {
        case consts.ADD:
          log("addData, param", form);
          fn = api.addData;
          tip = "新增成功";
          break;
        case consts.EDIT:
          log("editData, param", form);
          fn = api.editData;
          tip = "编辑成功";
          break;
      }
      ui.isSaving = true;
      let [err, res] = await to(fn(form));
      ui.isSaving = false;

      if (err) return error("save err", err);
      // Message.success(tip);
      ui.isShowDialog = false;
      api.getData();
    },
    onCancel() {
      ui.isShowDialog = false;
      ui.disableForm = false;
      formConfig?.reset?.();
    },
    async onQuery() {
      page.pageNo = 1;
      ui.isQuering = true;
      api.getData(page).finnal(() => {
        ui.isQuering = false;
      });
    },
  };

  onMounted(async () => {
    log("init table data");
    api.getData(page);
  });

  return { eventHandler, ui, api, page };
};
