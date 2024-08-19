<template>
  <div class="flex rounded-xl bg-transparent">
    <div
      class="flex h-[92vh] flex-1 flex-col overflow-auto rounded-xl dark:text-white"
    >
      <div class="card rounded-xl bg-transparent">
        <Toolbar class="toolbar flex flex-1">
          <template #start>
            <h1 class="ml-2 text-xl font-extrabold dark:text-white">
              DashBoard💾
            </h1>
          </template>
          <template #end>
            <Button
              class="mr-2 text-black dark:text-white"
              icon="pi pi-plus"
              severity="secondary"
              text
              size="small"
              @click="isShow = true"
            />
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText v-model="searchContent" placeholder="Search" />
            </IconField>
          </template>
        </Toolbar>

        <!-- <DataTable
          ref="dt"
          :value="articleList"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        >
          <template #header>
            <div class="flex flex-wrap items-center justify-between gap-2">
              <h4 class="m-0">文章列表</h4>
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Search..."
                />
              </IconField>
            </div>
          </template>

          <Column field="id" header="Id" style="min-width: 12rem"></Column>
          <Column field="title" header="标题" style="min-width: 16rem"></Column>
          <Column
            field="authorId"
            header="作者ID"
            style="min-width: 8rem"
          ></Column>
          <Column
            field="category"
            header="标签"
            sortable
            style="min-width: 10rem"
          >
            <template #body="slotProps">
              <Tag
                :value="slotProps.data.inventoryStatus"
                :severity="'success'"
              /> </template
          ></Column>
          <Column style="min-width: 12rem">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                outlined
                rounded
                class="mr-2"
                @click="editProduct(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                outlined
                rounded
                severity="danger"
                @click="confirmDeleteProduct(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable> -->
      </div>

      <Dialog v-model:visible="isShow" modal class="w-1/2">
        <template #header>
          <h1 class="text-lg font-semibold">编辑信息</h1>
        </template>
        <div class="flex flex-col">
          <div id="title" class="mb-2 flex flex-col">
            <label for="title" class="mb-1 text-sm font-semibold"
              >标题 (title)🍔:</label
            >
            <InputText
              class="flex-1 p-1 text-sm"
              v-model="infoTitle"
              type="text"
              size="small"
            />
          </div>
          <div id="content" class="mb-2 flex flex-col">
            <label for="title" class="mb-1 text-sm font-semibold"
              >简介 (content)🍟:</label
            >
            <Textarea v-model="infoContent" rows="3" cols="30" />
          </div>
          <div id="category" class="mb-2 flex flex-col">
            <label for="title" class="mb-1 text-sm font-semibold"
              >分类 (category)🥤:</label
            >
            <MultiSelect
              v-model="selectedTags"
              display="chip"
              :options="tags"
              optionLabel="name"
              filter
              placeholder="Select Categories"
              :maxSelectedLabels="3"
              :invalid="selectedTags.length === 0"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <Button
            type="button"
            label="Cancel"
            severity="secondary"
            @click="isShow = false"
          ></Button>
          <Button type="button" label="Save" @click="isShow = false"></Button>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});
import { ref, onMounted } from "vue";
import { FilterMatchMode } from "@primevue/core/api";
import { useToast } from "primevue/usetoast";
import type { ArticleInfo } from "~/api/model/BlogInfo";

const toast = useToast();

// 定义表格所需变量
const articleList: ArticleInfo[] = [];
const isShow = ref(false);
const searchContent = ref("");

// Dialog 变量
const infoTitle = ref("");
const infoContent = ref("");
const selectedTags: any = ref([]);
const tags = ref([
  { name: "New York", code: "NY" },
  { name: "Rome", code: "RM" },
  { name: "London", code: "LDN" },
  { name: "Istanbul", code: "IST" },
  { name: "Paris", code: "PRS" },
]);
/* 辅助方法 */

// onMounted(() => {
//   // ProductService.getProducts().then((data) => (products.value = data));
// });

// const dt = ref();
// const products = ref();
// const productDialog = ref(false);
// const deleteProductDialog = ref(false);
// const deleteProductsDialog = ref(false);
// const product = ref({});
// const selectedProducts = ref();
// const filters = ref({
//   global: { value: null, matchMode: FilterMatchMode.CONTAINS },
// });
// const submitted = ref(false);
// const statuses = ref([
//   { label: "INSTOCK", value: "instock" },
//   { label: "LOWSTOCK", value: "lowstock" },
//   { label: "OUTOFSTOCK", value: "outofstock" },
// ]);

// const formatCurrency = (value) => {
//   if (value)
//     return value.toLocaleString("en-US", {
//       style: "currency",
//       currency: "USD",
//     });
//   return;
// };

// // 创建新
// const openNew = () => {
//   product.value = {};
//   submitted.value = false;
//   productDialog.value = true;
// };
// const hideDialog = () => {
//   productDialog.value = false;
//   submitted.value = false;
// };
// const saveProduct = () => {
//   submitted.value = true;

//   if (product?.value.name?.trim()) {
//     if (product.value.id) {
//       product.value.inventoryStatus = product.value.inventoryStatus.value
//         ? product.value.inventoryStatus.value
//         : product.value.inventoryStatus;
//       products.value[findIndexById(product.value.id)] = product.value;
//       toast.add({
//         severity: "success",
//         summary: "Successful",
//         detail: "Product Updated",
//         life: 3000,
//       });
//     } else {
//       product.value.id = createId();
//       product.value.code = createId();
//       product.value.image = "product-placeholder.svg";
//       product.value.inventoryStatus = product.value.inventoryStatus
//         ? product.value.inventoryStatus.value
//         : "INSTOCK";
//       products.value.push(product.value);
//       toast.add({
//         severity: "success",
//         summary: "Successful",
//         detail: "Product Created",
//         life: 3000,
//       });
//     }

//     productDialog.value = false;
//     product.value = {};
//   }
// };
// const editProduct = (prod) => {
//   product.value = { ...prod };
//   productDialog.value = true;
// };
// const confirmDeleteProduct = (prod) => {
//   product.value = prod;
//   deleteProductDialog.value = true;
// };
// const deleteProduct = () => {
//   products.value = products.value.filter((val) => val.id !== product.value.id);
//   deleteProductDialog.value = false;
//   product.value = {};
//   toast.add({
//     severity: "success",
//     summary: "Successful",
//     detail: "Product Deleted",
//     life: 3000,
//   });
// };
// const findIndexById = (id) => {
//   let index = -1;
//   for (let i = 0; i < products.value.length; i++) {
//     if (products.value[i].id === id) {
//       index = i;
//       break;
//     }
//   }

//   return index;
// };
// const createId = () => {
//   let id = "";
//   var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   for (var i = 0; i < 5; i++) {
//     id += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return id;
// };

// const deleteSelectedProducts = () => {
//   products.value = products.value.filter(
//     (val) => !selectedProducts.value.includes(val),
//   );
//   deleteProductsDialog.value = false;
//   selectedProducts.value = null;
//   toast.add({
//     severity: "success",
//     summary: "Successful",
//     detail: "Products Deleted",
//     life: 3000,
//   });
// };

// const getStatusLabel = (status) => {
//   switch (status) {
//     case "INSTOCK":
//       return "success";

//     case "LOWSTOCK":
//       return "warn";

//     case "OUTOFSTOCK":
//       return "danger";

//     default:
//       return null;
//   }
// };
</script>

<style scoped>
.toolbar {
  @apply p-1 border-0 bg-transparent;
}

:deep(.p-multiselect-label) {
  @apply text-sm px-2 py-1;
}

:deep(.p-multiselect-overlay) {
  @apply text-sm;
}
</style>
