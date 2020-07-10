<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-form
        ref="cateDataRef"
        label-width="110px"
      >
        <el-form-item label="选择商品分类：">
          <el-cascader
            v-model="selectCateId"
            :options="cateData"
            :props="{ expandTrigger: 'hover',
            value:'cat_id',
            children:'children',
            label:'cat_name' }"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <el-tabs
        v-model="activeName"
        @tab-click="changeParams"
      >
        <el-tab-pane
          label="动态参数"
          name="many"
        >
          <el-button
            type="primary"
            :disabled="isDisabled"
            size="mini"
            @click="addDynamicParams"
          >添加参数</el-button>
          <el-table
            :data="manyData"
            border
            stripe
            style="width: 100%"
          >
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  class="tag"
                  closable
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  @close="rmParam(i,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>

              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="#"
            >
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParam(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParam(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          label="静态参数"
          name="only"
        >
          <el-button
            type="primary"
            :disabled="isDisabled"
            size="mini"
            @click="addDynamicParams"
          >添加参数</el-button>
          <el-table
            :data="onlyData"
            border
            stripe
            style="width: 100%"
          >
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  class="tag"
                  closable
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  @close="rmParam(i,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>

              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="#"
            >
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParam(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParam(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加动态静态参数 -->
    <el-dialog
      :title="'添加'+dOrS"
      :visible.sync="addDynamicVisible"
      width="50%"
      @close="resetDynamicForm"
    >
      <el-form
        ref="addDynamicRef"
        :model="addDynamicForm"
        :rules="addDynamicRule"
        label-width="80px"
      >
        <el-form-item
          :label="dOrS"
          prop="attr_name"
        >
          <el-input v-model="addDynamicForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDynamicVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="putAddDynamicForm"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数 -->
    <el-dialog
      :title="'添加'+dOrS"
      :visible.sync="editDynamicVisible"
      width="50%"
      @close="resetEditDynamicForm"
    >
      <el-form
        ref="editDynamicRef"
        :model="editDynamicForm"
        :rules="editDynamicRule"
        label-width="80px"
      >
        <el-form-item
          :label="dOrS"
          prop="attr_name"
        >
          <el-input v-model="editDynamicForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDynamicVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="putEditDynamicForm"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      cateData: [],
      selectCateId: [],
      activeName: 'many',
      paramsId: 0,
      manyData: [],
      onlyData: [],
      isDisabled: true,
      addDynamicVisible: false,
      addDynamicForm: {
        attr_name: ''
      },
      addDynamicRule: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ]
      },
      editDynamicVisible: false,
      editDynamicForm: {
        attr_name: ''
      },
      editDynamicRule: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editId: '',
      inputVisible: false,
      inputValue: ''
    }
  },
  created() {
    this.getCateData();
  },
  methods: {
    async getCateData() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) return;
      this.cateData = res.data;
    },
    handleChange() {
      if (this.selectCateId.length !== 3) {
        this.selectCateId = [];
        this.isDisabled = true;
        this.manyData = [];
        this.onlyData = [];
        return this.$message.error("只能选择三级分类");
      }
      this.isDisabled = false;
      this.paramsId = this.selectCateId[2];
      this.getParamsData();
    },
    changeParams() {
      if (this.selectCateId.length !== 3) return this.$message.error("请先选择商品分类");
      this.getParamsData();

    },
    async getParamsData() {
      const { data: res } = await this.$http.get(`categories/${this.paramsId}/attributes`, {
        params: {
          sel: this.activeName
        }
      });
      if (res.meta.status !== 200) return this.$message.error("获取参数列表失败");
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals.length ? item.attr_vals.split(' ') : [];
        item.inputVisible = false;
        item.inputValue = '';
      })

      if (this.activeName === "many") {
        this.manyData = res.data;
        this.$message.success("获取动态参数列表成功");
      }
      if (this.activeName === "only") {
        this.onlyData = res.data;
        this.$message.success("获取静态参数列表成功");
      }
    },
    addDynamicParams() {
      this.addDynamicVisible = true;
    },
    resetDynamicForm() {
      this.$refs.addDynamicRef.resetFields();
    },
    putAddDynamicForm() {
      this.$refs.addDynamicRef.validate(async valid => {
        if (!valid) return this.$message.error("添加参数失败");
        const { data: res } = await this.$http.post(`categories/${this.paramsId}/attributes`, {
          attr_name: this.addDynamicForm.attr_name,
          attr_sel: this.activeName
        });
        if (res.meta.status !== 201) this.$message.error("添加参数失败");
        this.$message.success("添加参数成功");
        this.getParamsData();
      })
      this.addDynamicVisible = false;
    },
    removeParam(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`categories/${this.paramsId}/attributes/${id}`)
        if (res.meta.status !== 200) return;
        this.getParamsData();
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
    async editParam(id) {
      this.editId = id;
      const { data: res } = await this.$http.get(`categories/${this.paramsId}/attributes/${id}`, {
        params: {
          attr_sel: this.activeName
        }
      });
      if (res.meta.status !== 200) return;
      this.editDynamicForm.attr_name = res.data.attr_name;
      this.editDynamicVisible = true;
    },
    putEditDynamicForm() {
      this.$refs.editDynamicRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(`categories/${this.paramsId}/attributes/${this.editId}`, {
          attr_name: this.editDynamicForm.attr_name,
          attr_sel: this.activeName
        });
        if (res.meta.status !== 200) return this.$message.error("编辑参数失败");
        this.getParamsData();
        this.$message.success("编辑参数成功");
        this.editDynamicVisible = false;
      })

    },
    resetEditDynamicForm() {
      this.$refs.editDynamicRef.resetFields();
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = '';
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = '';
      row.inputVisible = false;
      this.saveAttrVals(row);
    },
    showInput(row) {
      // console.log(row);

      row.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async rmParam(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    },
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(`categories/${this.paramsId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(" ")
      });
      if (res.meta.status !== 200) return this.$message.error("修改参数项失败");
      this.$message.success("修改参数项成功");
    }
  },
  computed: {
    dOrS() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态参数'
      }
    }
  }
}
</script>

<style scoped>
.el-form {
  margin-top: 15px;
}
.el-cascader {
  width: 300px;
}
.button-new-tag,
.tag {
  margin-left: 10px;
}
.input-new-tag {
  width: 120px;
  margin-left: 10px;
}
</style>