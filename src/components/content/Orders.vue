<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-input
        placeholder="请输入内容"
        v-model="queryInfo.query"
        class="input-with-select"
      >

        <el-button
          @click="searchOrder"
          slot="append"
          icon="el-icon-search"
        ></el-button>
      </el-input>

      <el-table
        :data="orderList"
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
          prop="order_number"
          label="订单编号"
          width="455"
        >
        </el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="pay_status"
          label="是否付款"
          width="80"
        >
          <template v-slot="scope">
            <el-tag
              type="success"
              v-if="scope.row.pay_status==1"
            >已付款</el-tag>
            <el-tag
              type="danger"
              v-else
            >未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="80"
        >
        </el-table-column>
        <el-table-column
          label="下单时间"
          prop="create_time"
        >
          <template v-slot="scope">
            {{scope.row.create_time | changeForm}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="eidtAdress"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="checkProcess(scope.row.order_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

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

    <el-dialog
      title="修改地址"
      :visible.sync="editVisible"
      width="50%"
    >
      <el-form
        :model="editForm"
        :rules="editFormRule"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item
          label="省市区/县"
          prop="address1"
        >
          <el-cascader
            v-model="editForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' ,
            label:'label',
            children:'children',
            value:'value'}"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="详细地址"
          prop="address2"
        >
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="物流信息"
      :visible.sync="processVisible"
      width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in processInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>

    </el-dialog>

  </div>
</template>

<script>
import { formatDate } from '../../../common/dataFormat.js'
import cityData from '../../../common/city.js'
export default {
  name: 'Orders',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      orderList: [],
      total: 0,
      editVisible: false,
      editForm: {
        address1: [],
        address2: ''
      },
      editFormRule: {
        address1: [
          { required: true, message: '请选择地址', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ]
      },
      cityData: [],
      processVisible: false,
      processInfo: []
    }
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) return this.$message.error("获取订单列表失败");
      this.orderList = res.data.goods;
      this.total = res.data.total;
      this.$message.success("获取订单列表如下");
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getOrderList();
    },
    handleCurrentChange(newsize) {
      this.queryInfo.pagenum = newsize;
      this.getOrderList();
    },
    searchOrder() {
      this.getOrderList();
    },
    eidtAdress() {
      this.cityData = cityData;
      console.log(this.cityData);

      this.editVisible = true;
    },
    handleChange() {
    },
    async checkProcess(id) {
      const { data: res } = await this.$http.get(`/kuaidi/1106975712662`);
      if (res.meta.status !== 200) return this.$message.error("获取物流信息失败");
      this.$message.success(res.meta.message);
      this.processInfo = res.data;
      this.processVisible = true;
    }
  },
  filters: {
    changeForm(time) {
      return formatDate(time, "yyyy-MM-dd hh:mm:ss");
    }
  }
}
</script>

<style scoped>
.input-with-select {
  width: 304px;
}
.el-cascader {
  width: 100%;
}
</style>