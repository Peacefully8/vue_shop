<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input
            placeholder="请输入搜索姓名"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="addUserFormVisible = true"
          >添加用户</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="userlist"
        stripe
        style="width: 100%"
        border
      >
        <el-table-column
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
        >
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色"
        >
        </el-table-column>
        <el-table-column
          prop="mg_state"
          label="状态"
        >
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @click.native="changeStatus(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200px"
        >
          <template v-slot="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editUser(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteDialog(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              :enterable="false"
              placement="top"
            >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-s-tools"
              ></el-button>
            </el-tooltip>
          </template>

        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserFormVisible"
      @close="closeAddUserDialog"
    >
      <el-form
        :model="addForm"
        :rules="addUserFormRules"
        label-width="70px"
        ref="addUserFormRef"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          type="password"
        >
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="手机号"
          prop="mobile"
        >
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addUserFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="putAddUserForm"
        >确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户信息对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="eidtUserFormVisible"
      width="50%"
      @close="closeeditUserDialog"
    >
      <el-form
        :model="editForm"
        :rules="editUserFormRules"
        label-width="70px"
        ref="editUserFormRef"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="editForm.username"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="手机号"
          prop="mobile"
        >
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="eidtUserFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="putEditUserForm"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    let checkEmail = (rule, value, callback) => {
      let regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (regEmail.test(value)) {
        callback();
      }
      callback(new Error("请输入合法的邮箱"))
    }
    let checkMobile = (rule, value, callback) => {
      let regMobile = /^[1]+\d{10}$/;
      if (regMobile.test(value)) {
        callback();
      }
      callback(new Error("请输入合法的手机号码"))
    }
    return {
      //获取用户列表的参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      userlist: [],
      count: 0,
      addUserFormVisible: false,
      addForm: {
        username: '',
        mobile: '',
        email: '',
        password: ''
      },
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在3到10之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 15, message: '用户名的长度在6到15之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      eidtUserFormVisible: false,
      editForm: {
        username: '',
        mobile: '',
        email: ''
      },
      editUserFormRules: {
        mobile: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
    }

  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", { params: this.queryInfo });
      //   console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.$message.success("获取用户列表如下");
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagenum = newSize;
      this.getUserList();

    },
    async changeStatus(row) {
      const { data: res } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      // console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error("更新用户状态失败!");
        row.mg_state = !row.mg_state;
      }
      this.$message.success(res.meta.msg)

    },
    closeAddUserDialog() {
      this.$refs.addUserFormRef.resetFields();
    },
    putAddUserForm() {
      this.$refs.addUserFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("添加用户失败");
        const { data: res } = await this.$http.post("users", this.addForm)
        if (res.meta.status !== 201) this.$message.error("添加用户失败");
        this.$message.success("添加用户成功")
        this.addUserFormVisible = false;
        this.getUserList();
      })
    },
    closeeditUserDialog() {
      this.$refs.editUserFormRef.resetFields();
    },
    putEditUserForm() {
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile,
        });
        if (res.meta.status !== 200) return this.$message.error("更新数据失败");
        this.eidtUserFormVisible = false;
        this.getUserList();
        this.$message.success(res.meta.msg);
      })
    },
    async editUser(id) {
      const { data: res } = await this.$http.get(`users/${id}`);
      if (res.meta.status !== 200) return this.$message.error("查询用户信息失败!");
      this.editForm = res.data;
      this.eidtUserFormVisible = true;
    },
    deleteDialog(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        // console.log(id);
        const { data:res } = await this.$http.delete(`users/${id}`)
        if(res.meta.status!==200) return;
        this.getUserList();
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
    }
  }
}
</script>

<style scoped>
.box-card {
  margin-top: 10px;
}
.el-table {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 20px;
}
</style>