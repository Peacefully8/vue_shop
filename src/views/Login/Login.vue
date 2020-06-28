<template>
  <div>
    <div class="login_box">
      <div class="avater">
        <img
          src="../../assets/imgs/logo.png"
          alt=""
        >
      </div>
      <el-form
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
            prop="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button 
            type="primary"
            @click="login"  
          >登录</el-button>
          <el-button
            type="info"
            @click="resetLoginForm"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入名字', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }

        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if(!valid) return;  
        const {data:res} = await this.$http.post("login",this.loginForm)   
        console.log(res);
           
        if(res.meta.status !== 200) return this.$message.error("登陆失败")
        this.$message.success("登陆成功")
        //1.登陆成功之后要保存服务器返回的token在本地的sessionStroge中
            // 1.1项目中只有登陆了才能访问部分网页sessionStroge中
            //1.2token只因在当前窗口有效，所以保存在
        //2.然后导航式跳转主页到/home
        window.sessionStorage.setItem("token",res.data.token);
        this.$router.push("/home")
        
        
      })
    }
  }

}
</script>

<style scoped>
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

.login_box .avater {
  background-color: #fff;
  padding: 10px;
  border: 1px solid #eee;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}

.login_box img {
  width: 130px;
  height: 130px;
  background-color: #eee;
  border-radius: 50%;
}

.login_box .login_form {
  padding: 10px;
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
}

.login_box .btn {
  display: flex;
  justify-content: flex-end;
}
</style>