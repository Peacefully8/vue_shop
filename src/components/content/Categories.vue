<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-button
        type="primary"
        @click="addCateDialog"
      >添加分类</el-button>
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        show-row-hover
      >
        <template v-slot:isOk="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted===false"
            style="color:lightgreen"
          ></i>
          <i
            class="el-icon-error"
            style="color:red"
            v-else
          ></i>
        </template>
        <template v-slot:order="scope">
          <el-tag
            type="primary"
            v-if="scope.row.cat_level==0"
          >一级</el-tag>
          <el-tag
            type="success"
            v-else-if="scope.row.cat_level==1"
          >二级</el-tag>
          <el-tag
            type="warning"
            v-else
          >三级</el-tag>
        </template>
        <template v-slot:edit="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCate(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类 -->
    <el-dialog
      title="提示"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="closeAddCateDialog"
    >
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        :rules="addCateFormRules"
        label-width="80px"
      >
        <el-form-item
          label="分类名称"
          prop="cat_name"
        >
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="pCateId"
            clearable
            :options="pCateList"
            :props="{ expandTrigger: 'hover',
            children: 'children',
            label:'cat_name',
            value:'cat_id',
            checkStrictly:'true' }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="putAddCateForm"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
    >
      <el-form
        ref="editCateRef"
        :model="editCateForm"
        label-width="80px"
      >
        <el-form-item label="分类名称">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="putEditCate"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: "Categories",
  data() {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'edit',
        }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      pCateId: [],
      pCateList: [],
      editCateDialogVisible: false,
      editCateForm: {
        cat_name: ''
      },
      editId: 0
    }
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      });
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error("获取分类数据失败");
      this.cateList = res.data.result;
      this.total = res.data.total;
      this.$message.success("获取分类列表如下")
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize;
      this.getCateList();
    },
    async addCateDialog() {
      const { data: res } = await this.$http.get("categories", {
        params: {
          type: 2
        }
      });
      // console.log(res);
      if (res.meta.status !== 200) return;
      this.pCateList = res.data;
      this.addCateDialogVisible = true;
    },
    closeAddCateDialog() {
      this.$refs.addCateFormRef.resetFields();
      this.pCateId = [];
      this.cat_pid = 0;
      this.cat_level = 0
    },
    handleChange() {
      if (!this.pCateId.length) return;
      this.addCateForm.cat_pid = this.pCateId[this.pCateId.length - 1];
      this.addCateForm.cat_level = this.pCateId.length;
    },
    putAddCateForm() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("categories", this.addCateForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败");
        }
        this.$message.success("添加分类成功");
        this.getCateList();
        this.addCateDialogVisible = false;
      })

    },
    deleteCate(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`categories/${id}`);
        if (res.meta.status !== 200) return;
        this.getCateList();
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });


    },
    async editCate(id) {
      const { data: res } = await this.$http.get(`categories/${id}`);
      if (res.meta.status !== 200) return;
      this.editId = res.data.cat_id;
      this.editCateForm.cat_name = res.data.cat_name;
      this.editCateDialogVisible = true;
    },
    async putEditCate() {
      const {data:res} = await this.$http.put(`categories/${this.editId}`,{
        cat_name:this.editCateForm.cat_name
      });
      if(res.meta.status!==200) return this.$message.error("修改名称失败");   
      this.$message.success("修改名称成功");
      this.getCateList();
      this.editCateDialogVisible = false;
    }
  }
}
</script>

<style scoped>
.zk-table {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>