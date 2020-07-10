<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-input
        placeholder="请输入内容"
        v-model="goodsInfo.query"
        class="serchInput"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="serachGoods"
        ></el-button>
      </el-input>
      <el-button
        type="primary"
        class="addBtn"
        @click="AddGoods"
      >添加商品</el-button>

      <el-table
        :data="goodList"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="#"
        >
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="580"
        >
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="95"
        >
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="70"
        >
        </el-table-column>
        <el-table-column
          label="创建时间"
          width="160"
        >
          <template v-slot="scope">
            {{scope.row.add_time|changeForm}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="130"
        >
          <template v-slot="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeGood(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="goodsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>

</template>

<script>
import { formatDate } from '../../../common/dataFormat.js';


export default {
  name: "Goods",
  data() {
    return {
      goodsInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      goodList: [],
      total: 0
    }
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.goodsInfo
      });
      if (res.meta.status !== 200) return this.$message.error("获取商品列表失败");
      this.goodList = res.data.goods;
      this.total = res.data.total;
      this.$message.success("获取商品列表如下");
    },
    handleSizeChange(newSize) {
      this.goodsInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newSize) {
      this.goodsInfo.pagenum = newSize;
      this.getGoodsList();
    },
    serachGoods() {
      this.getGoodsList();
    },
    AddGoods() {
      this.$router.push("/goods/add");
    },
    removeGood(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`goods/${id}`);
        if (res.meta.status !== 200) return;
        this.getGoodsList();
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
  },
  filters: {
    changeForm(time) {
      return formatDate(time, 'yyyy-MM-dd hh:mm:ss');
    }
  }
}
</script>

<style scoped>
.serchInput {
  width: 320px;
  height: 40px;
}
.addBtn {
  margin-left: 20px;
}
</style>