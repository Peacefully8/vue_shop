<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/goods">商品列表</a></el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-steps
        :active="active - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品照片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addGoodsForm"
        :rules="addGoodsFormRule"
        ref="addGoodsFormRef"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          style="margin-top: 20px"
          v-model="active"
          :before-leave="beforeLeave"
        >
          <el-tab-pane
            label="基本信息"
            name="0"
          >
            <el-form-item
              label="商品名称"
              prop="goods_name"
            >
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item
              label="商品价格"
              prop="goods_price"
            >
              <el-input
                v-model="addGoodsForm.goods_price"
                type="Number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品重量"
              prop="goods_weight"
            >
              <el-input
                v-model="addGoodsForm.goods_weight"
                type="Number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品数量"
              prop="goods_number"
            >
              <el-input
                type="Number"
                v-model="addGoodsForm.goods_number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品分类"
              prop="goods_cat"
            >
              <span>请选择商品分类: </span>
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="cateList"
                :props="{ expandTrigger: 'hover',
                children:'children',
                value:'cat_id',
                label:'cat_name' }"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane
            label="商品参数"
            name="1"
          >
            <el-form-item
              :label="item.attr_name"
              v-for="item in paramsList"
              :key="item.attr_id"
            >
              <el-checkbox-group
                v-model="item.attr_vals"
                v-for="(it,i) in item.attr_vals"
                :key="i"
              >
                <el-checkbox
                  border
                  :label="it"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品属性"
            name="2"
          >
            <el-form-item
              :label="item.attr_name"
              v-for="item in paramsList1"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品照片"
            name="3"
          >
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="imgHeaders"
              :on-success="handleSuccess"
            >
              <el-button
                size="small"
                type="primary"
              >点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane
            label="商品内容"
            name="4"
          >
            <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
            <el-button
              type="primary"
              class="addBtn"
              @click="add"
            >添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog
      title="图片预览"
      :visible.sync="imgVisible"
      width="50%"
    >
      <img
        :src="previewImg"
        class="img"
      >
    </el-dialog>

  </div>
</template>

<script>
import _ from "lodash"
export default {
  name: "Add",
  data() {
    return {
      active: '0',
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addGoodsFormRule: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }

        ]
      },
      cateList: [],
      paramsList: [],
      paramsList1: [],
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      imgHeaders: {
        Authorization: window.sessionStorage.getItem("token")
      },
      previewImg: '',
      imgVisible: false
    }
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) return;
      this.cateList = res.data;
    },
    handleChange() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = [];
        this.$message.error("只能选择三级分类");

      }
    },
    beforeLeave(activeName, oldName) {
      if (oldName == 0 && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
      if (activeName == 1 || activeName == 4) {
        this.getDynamicParm();
      } else if (activeName == 2 || activeName == 4) {
        this.getStaticParma()
      }

    },
    async getDynamicParm() {
      const { data: res } = await this.$http.get(`categories/${this.addGoodsForm.goods_cat[2]}/attributes`, {
        params: {
          sel: "many"
        }
      });
      if (res.meta.status !== 200) return;
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ');
      });
      this.paramsList = res.data;
    },
    async getStaticParma() {
      const { data: res } = await this.$http.get(`categories/${this.addGoodsForm.goods_cat[2]}/attributes`, {
        params: {
          sel: "only"
        }
      });
      if (res.meta.status !== 200) return;
      this.paramsList1 = res.data;
    },
    handlePreview(file) {
      this.previewImg = file.response.data.url;
      this.imgVisible = true;
    },
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const i = this.addGoodsForm.pics.findIndex(item => {
        item.pic = filePath
      })
      this.addGoodsForm.pics.splice(i, 1);
    },
    handleSuccess(res) {
      const picInfo = {
        pic: res.data.tmp_path
      };
      this.addGoodsForm.pics.push(picInfo);
    },
    add() {
      this.$refs.addGoodsFormRef.validate(async valid => {
        if (!valid) return this.$message.error("请先填写必要的信息");
        const form = _.cloneDeep(this.addGoodsForm);
        form.goods_cat = form.goods_cat.join(',');
        this.paramsList.forEach(item => {
          const obj = {
            "attr_id": item.attr_id,
            "attr_value": item.attr_value
          };
          this.addGoodsForm.attrs.push(obj);
        });
        this.paramsList1.forEach(item => {
          const obj = {
            "attr_id": item.attr_id,
            "attr_value": item.attr_value
          };
          this.addGoodsForm.attrs.push(obj);
        });
        form.attrs = this.addGoodsForm.attrs;
        const {data:res} = await this.$http.post("goods",form);
        if(res.meta.status!==201) return this.$message.error(res.meta.msg);
        this.$router.push("/goods");
        this.$message.success(res.meta.msg);
      })
    }
  }
}
</script>

<style scoped>
.el-alert {
  margin-bottom: 20px;
}
.el-cascader {
  width: 300px;
}
.el-checkbox-group {
  display: inline-block;
  margin: 0 5px 0 0;
}
.img {
  width: 100%;
  height: 100%;
}

.addBtn {
  margin-top: 15px;
}
</style>