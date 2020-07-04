<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table
        :data="rightsList"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column
          label="#"
          width="48"
          type="index"
        >
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
          width="350"
        >
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径"
          width="350"
        >
        </el-table-column>
        <el-table-column
          prop="level"
          label="权限等级"
        >
          <template v-slot="scope">
            <el-tag v-if="+scope.row.level === 0">一级权限</el-tag>
            <el-tag type="success" v-else-if="+scope.row.level === 1">二级权限</el-tag>
            <el-tag type="warning" v-else>三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data() {
    return {
      //权限列表数组
      rightsList: []
    }
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list")
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("获取权限列表失败");
      this.rightsList = res.data;
      this.$message.success(res.meta.msg)
    }
  }

}

</script>

<style scoped>
</style>