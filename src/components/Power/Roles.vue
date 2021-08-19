<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-button type="primary">
             添加角色
            </el-button>
          </el-col>
        </el-row>
      </el-card>
      <el-table :data="roleList" stripe border>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row :class="['bdbottom','vcenter', i1 === 0 ? 'bdtop':'']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="6">
                <el-tag type="success" closable @close="removeRight(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <!-- 渲染二级权限 -->
                <el-row v-for="(item2, i2) in item1.children" :class="['vcenter',i2 === 0 ? '':'bdtop']" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="primary" closable @close="removeRight(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 渲染三级权限 -->
                    <el-tag type="warning" v-for="(item3, i3) in item2.children" :class="[i3 === 0 ? '':'bdtop']" :key="item3.id" closable @close="removeRight(scope.row, item3.id)">{{item2.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" prop="level">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
             <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRight(scope.row)">权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限 -->
      <el-dialog title="提示" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClose">
        <!-- 树形控件 -->
        <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allowRights">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      // 控制分配权限对话框的显示与否
      setRightDialogVisible: false,
      // 权限数据
      rightsList: [],
      // 树形控件的绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中节点的id值
      defKeys: [],
      // 即将分配权限的id
      roleId: ''
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表错误')
      this.$message.success('获取角色列表成功')
      this.roleList = res.data
    },
    async removeRight (role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      role.children = res.data
      return this.$message.success('删除权限成功')
    },
    // 展示分配权限的对话框
    async showSetRight (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
      console.log(this.rightsList)
    },
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    setRightDialogClose () {
      this.defKeys = []
    },
    async allowRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style Lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
