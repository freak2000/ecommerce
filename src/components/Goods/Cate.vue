<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-button type="primary" @click="getParentsList">添加商品分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <zk-table :data="cateList" :columns="columns" ref="table" :selection-type="false" :expand-type="false" show-index index-text="妈的傻逼" border>
        <template v-slot:isok="scope">
          <i class="el-icon-circle-check" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
          <i class="el-icon-circle-close" v-else style="color: red"></i>
        </template>
        <template v-slot:sort="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template v-slot:opt="scope">
          <el-button type="primary" icon="el-icon-edit" v-if="scope.row.cat_level < 4" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" v-if="scope.row.cat_level < 4" size="mini">删除</el-button>
        </template>
      </zk-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加商品对话框 -->
    <el-dialog
    title="提示"
    :visible.sync="AddCateDialogVisible"
    width="30%"
    @close="addCatchDialogClose">
      <!-- 表单验证 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="cat_pid">
          <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascarderProps" @change="changCascarder" clearable="" change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品分类列表
      cateList: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      // 表格列的配置
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        }, {
          label: '是否有效',
          type: 'template',
          // 当前模板的名称
          template: 'isok'
        }, {
          label: '排序',
          type: 'template',
          // 当前模板的名称
          template: 'sort'
        }, {
          label: '操作',
          type: 'template',
          // 当前模板的名称
          template: 'opt'
        }
      ],
      // 显示添加商品对话框
      AddCateDialogVisible: false,
      // 表单验证的项目
      addCateForm: {
        cat_id: '',
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 表单验证的规则
      addCateFormRules: {
        cat_id: [{ required: true, message: '请输入商品号', trigger: 'blur' },
          { min: 6, max: 6, message: '长度在 6 个字符', trigger: 'blur' }],
        cat_name: [{ required: true, message: '请输入商品名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascarderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表错误')
      }
      this.cateList = res.data.result
      this.total = res.data.total
      console.log(this.cateList)
      return this.$message.success('获取分类列表成功')
    },
    handleSizeChange (newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    async getParentsList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级列表失败')
      }
      this.$message.success('获取父级列表成功')
      this.AddCateDialogVisible = true
      this.parentCateList = res.data
    },
    changCascarder () {
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      }
    },
    // 点击按钮，添加新的分类
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品分类失败')
        }
        this.$message.success('添加商品分类成功')
        this.getParentsList()
        this.addCatchDialogClose = false
      })
    },
    // 添加对话框的关闭事件，重置表单
    addCatchDialogClose () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style Lang="less" scoped>

</style>
