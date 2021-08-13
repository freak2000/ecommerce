<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div class="logo">
        <img class="tubiao" src="../assets/space.png" alt="" />
        <span style="margin-left = 15px">后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409bff" unique-opened="" :collapse="isCollapse" :collapse-transition="false" router :default-active="this.$route.path"
        >
        <!-- 一级菜单 -->
          <el-submenu :index="item.id +'' " v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.console.error(res.meta.data)
      this.menulist = res.data
      console.log(res)
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style Lang="less" scoped>
.el-header {
  background-color: #373d43;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #eaedf1;
  font-size: 20px;
}
.el-aside {
  background-color: #343745;
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  height: 100%;
}
.tubiao {
  height: 62px;
}
.logo {
  display: flex;
  align-items: center;
}
.iconfont {
  margin-right: 10px;
}
.el-menu{
  border-right: none;
}
.toggle-button{
  background-color: #3a5063;
  font-size: 10px;
  line-height: 24px;
  color: #eaedf1;
  letter-spacing: 0.2em;
  cursor: pointer;
  text-align: center;
}
</style>
