<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-button
        type="primary"
        @click="addRolesDialog = true"
      >添加角色</el-button>
      <el-table
        :data="rolesInfo"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              v-for="(items,i) in scope.row.children"
              :key="items.id"
              :class="['bdbottom',i===0?'bdtop':'','vcenter']"
            >
              <el-col :span="6">
                <el-tag
                  closable
                  @close="deleteRight(items.id,scope.row)"
                >{{items.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-row
                  v-for="(subItems,ii) in items.children"
                  :key="subItems.id"
                  :class="[ii===0?'':'bdtop','vcenter']"
                >
                  <el-col :span="8">
                    <el-tag
                      type="success"
                      closable
                      @close="deleteRight(subItems.id,scope.row)"
                    >{{subItems.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <el-tag
                      v-for="item in subItems.children"
                      :key="item.id"
                      closable
                      type="warning"
                      @close="deleteRight(item.id,scope.row)"
                    >{{item.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column
          type="index"
          label="#"
        >
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
        >
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="300"
        >
          <template v-slot="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editRole(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteRole(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-s-tools"
              @click="assignRights(scope.row)"
            >权限分配</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialog"
      width="50%"
      @close="cancelAddRoles"
    >
      <el-form
        ref="addRolesFormRef"
        :model="addRolesForm"
        :rules="addRolesFormRules"
        label-width="80px"
      >
        <el-form-item
          label="角色人称"
          prop="roleName"
        >
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addRolesDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="putRolesForm"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 角色分配对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignRightsDialog"
      width="50%"
      @close="setRightColse"
    >
      <el-tree
        :data="rightList"
        :props="assignRightsProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="checkedArr"
        ref="rightRef"
      ></el-tree>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="assignRightsDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="allotRight"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="editRolesDialog"
      width="50%"
      @close="cancelEditRoles"
    >
      <el-form
        ref="editRolesFormRef"
        :model="editRolesForm"
        :rules="editRolesFormRules"
        label-width="80px"
      >
        <el-form-item
          label="角色人称"
          prop="roleName"
        >
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editRolesDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="putEditRoles"
        >确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>


<script>
export default {
  name: "Roles",
  data() {
    return {
      rolesInfo: [],
      addRolesDialog: false,
      addRolesForm: {
        roleDesc: '',
        roleName: ''
      },
      addRolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, message: "请输入角色名称" }
        ]
      },
      assignRightsDialog: false,
      assignRightsProps: {
        children: 'children',
        label: 'authName'
      },
      rightList: [],
      checkedArr: [],
      roleId: 0,
      editRoleId: 0,
      editRolesDialog: false,
      editRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      editRolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, message: "请输入角色名称" }
        ]
      }
    }
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      // console.log(res);
      this.rolesInfo = res.data;
      if (res.meta.status !== 200) return this.$message.error("获取角色权限列表失败");
      this.$message.success("获取角色权限列表成功");
    },
    deleteRight(rightId, role) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error("刪除角色权限失败");
        role.children = res.data;
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        console.log(item);
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    cancelAddRoles() {
      this.$refs.addRolesFormRef.resetFields()
    },
    putRolesForm() {
      this.$refs.addRolesFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addRolesForm);
        // console.log(res);
        if (res.meta.status !== 201) return this.$message.error("添加角色失败");
        this.$message.success("添加角色成功");
        this.getRolesList();
        this.addRolesDialog = false;
      })
    },
    async deleteRole(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${id}`);
        this.getRolesList();
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
    async assignRights(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get("rights/tree");
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error("获取权限列表成功");
      this.rightList = res.data;
      this.getAllThirdNode(role, this.checkedArr);
      this.assignRightsDialog = true;
    },
    getAllThirdNode(node, arr) {
      if (!node.children) return arr.push(node.id);
      node.children.forEach(item => {
        this.getAllThirdNode(item, arr)
      })
    },
    setRightColse() {
      this.checkedArr = [];
    },
    async allotRight() {
      let keys = [
        ...this.$refs.rightRef.getCheckedKeys(),
        ...this.$refs.rightRef.getHalfCheckedKeys()
      ];
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: keys.join(',')
      });
      // console.log(res);
      if (res.meta.status !== 200) this.$$message.error("更新权限失败");
      this.$message.success("更新权限成功");
      this.getRolesList();

      this.assignRightsDialog = false;
    },
    async editRole(id) {
      const { data: res } = await this.$http.get(`roles/${id}`);
      this.editRoleId = id;
      if (res.meta.status !== 200) return;
      this.editRolesForm.roleName = res.data.roleName;
      this.editRolesForm.roleDesc = res.data.roleDesc;
      this.editRolesDialog = true;
    },
    cancelEditRoles() {
      this.$refs.editRolesFormRef.resetFields()
    },
    putEditRoles() {
      this.$refs.editRolesFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(`roles/${this.editRoleId}`, this.editRolesForm);
        if (res.meta.status !== 200) return this.$message.error("编辑角色失败");
        this.$message.success("编辑角色成功");
        this.getRolesList();
      })
      this.editRolesDialog = false;
    }
  },


}
</script>

<style scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>