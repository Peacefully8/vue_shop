<template>
  <el-container class="container">
    <!-- 头部区域 -->
    <el-header class="header">
      <div>
        <img
          src="../../assets/imgs/logo.png"
          class="logo"
          alt=""
        >
        <span>商城后台管理系统</span>
      </div>
      <el-button
        type="info"
        @click="logout"
        class="logout"
      >退出</el-button>
    </el-header>
    <!-- 页面主体   -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside
        :width="isCollapse?'64px':'200px'"
        class="aside"
      >
        <!-- 侧边栏菜单 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="rgb(102, 204, 255)"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          class="menu"
          router
          :default-active="activePath"
        >
          <div class="toggle" @click="collapse">|||</div>
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="icon[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState"
            >
              <template slot="title">
                <i class="el-icon-s-operation"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-tools"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="2-1">
              <template slot="title">
                <i class="el-icon-s-operation"></i>
                <span>角色列表</span>
              </template></el-menu-item>
            <el-menu-item index="2-2">
              <template slot="title">
                <i class="el-icon-s-operation"></i>
                <span>权限列表</span>
              </template></el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-goods"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="3-1">
              <template slot="title">
                <i class="el-icon-s-operation"></i>
                <span>商品列表</span>
              </template></el-menu-item>
            <el-menu-item index="3-2">
              <template slot="title">
                <i class="el-icon-s-operation"></i>
                <span>分类参数</span>
              </template></el-menu-item>
            <el-menu-item index="3-3">
              <template slot="title">
                <i class="el-icon-s-operation"></i>
                <span>商品分类</span>
              </template></el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="4-1">
              <template slot="title">
                <i class="el-icon-s-operation"></i>
                <span>用户列表</span>
              </template></el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-s-marketing"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="5-1">
              <template slot="title">
                <i class="el-icon-s-operation"></i>
                <span>数据报表</span>
              </template></el-menu-item>
          </el-submenu> -->

        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main class="main">
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      //左侧菜单数据
      menuList: [],
      //左侧菜单图标
      icon: {
        "125": "el-icon-user-solid",
        "103": "el-icon-s-tools",
        "101": "el-icon-s-goods",
        "102": "el-icon-s-order",
        "145": "el-icon-s-marketing",
      },
      isCollapse:false,
      activePath:""
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login")
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      // console.log(res);
      if (!res.meta.status) this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    collapse() {
        this.isCollapse = !this.isCollapse;
    },
    saveNavState() {
      window.sessionStorage.setItem("path",this.$route.path)
      this.activePath = this.$route.path
    }
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("path")
  }


}
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;
}

.header {
  background-color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header .logo {
  width: 60px;
  height: 60px;
  vertical-align: middle;
}
.header span {
  font-size: 16px;
  color: #fff;
  margin-left: 15px;
}

.logout {
  width: 70px;
  height: 40px;
}

.aside {
  background-color: #333744;
}

.menu {
    border-right: 0;
}

.toggle {
  background-color: #999;
  color: #fff;
  line-height: 24px;
  font-size: 10px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.main {
  background-color: #eaedf1;
}
</style>