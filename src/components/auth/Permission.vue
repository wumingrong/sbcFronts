<template>
  <div style="margin-top: 20px;">
    <el-row style="margin-bottom: 10px">
      <el-col :span="24">
        <el-button type="primary" icon="el-icon-plus" @click="openAddDialog">添加</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="pageData.list"
          border
          style="width: 100%"
          v-loading="loading">
          <el-table-column
            prop="name"
            label="name">
          </el-table-column>
          <el-table-column
            prop="url"
            label="url">
          </el-table-column>
          <el-table-column
            prop="path"
            label="path">
          </el-table-column>
          <el-table-column
            prop="component"
            label="component">
          </el-table-column>
          <el-table-column
            prop="icon"
            label="icon">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
              <el-button type="text" size="small" @click="remove(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageData.pageNum"
          :page-sizes="[10, 100, 300, 400]"
          :page-size="pageData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageData.total">
        </el-pagination>
      </el-col>
    </el-row>
    <el-dialog
      title="菜单信息"
      :visible.sync="dialogSaveVisible">
      <el-form ref="permissionForm" :model="permission" label-width="80px" v-if="permission">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称"
                          prop="name"
                          :rules="[{ required: true, message: '请填写名称', trigger: 'blur' }]">
              <el-input v-model="permission.name" placeholder="请填写名称"></el-input>
            </el-form-item>
            <el-form-item label="类型"
                          prop="type"
                          :rules="[{ required: true, message: '请填写类型', trigger: 'blur' }]">
              <el-input v-model="permission.type" placeholder="请填写类型"></el-input>
            </el-form-item>
            <el-form-item label="图标"
                          prop="icon"
                          :rules="[{ required: true, message: '请填写名称', trigger: 'blur' }]">
              <el-input v-model="permission.icon" placeholder="请填写名称"></el-input>
            </el-form-item>
            <el-form-item label="模块名称"
                          prop="component"
                          :rules="[{ required: true, message: '请填写模块名称', trigger: 'blur' }]">
              <el-input v-model="permission.component" placeholder="请填写模块名称"></el-input>
            </el-form-item>
            <el-form-item label="匹配规则"
                          prop="url"
                          :rules="[{ required: true, message: '请填写匹配规则', trigger: 'blur' }]">
              <el-input v-model="permission.url" placeholder="请填写匹配规则"></el-input>
            </el-form-item>
            <el-form-item label="路径"
                          prop="path"
                          :rules="[{ required: true, message: '请填写路径', trigger: 'blur' }]">
              <el-input v-model="permission.path" placeholder="请填写路径"></el-input>
            </el-form-item>
            <el-form-item label="排序号"
                          prop="orderId"
                          :rules="[{ required: true, message: '请填写排序号', trigger: 'blur' }]">
              <el-input v-model="permission.orderId" placeholder="请填写排序号"></el-input>
            </el-form-item>
            <el-form-item label="keepAlive">
              <el-select v-model="permission.keepAlive" placeholder="请填写keepAlive" v-if="encodeMap">
                <el-option
                  v-for="item in encodeMap.YN"
                  :key="item.id"
                  :label="item.encodeName"
                  :value="item.encode">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="requireAuth">
              <el-select v-model="permission.requireAuth" placeholder="请填写requireAuth" v-if="encodeMap">
                <el-option
                  v-for="item in encodeMap.YN"
                  :key="item.id"
                  :label="item.encodeName"
                  :value="item.encode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父级"
                          prop="parentName"
                          :rules="[{ required: true, message: '请选择父级菜单', trigger: 'blur' }]">
              <el-input v-model="permission.parentName" placeholder="请选择父级菜单" readonly></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-tree ref="permissionTree"
                       node-key="id"
                       :data="permissions"
                       :props="defaultProps"
                       default-expand-all
                       @node-click="handleNodeClick"></el-tree>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitForm('permissionForm')">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PermissionView',
  data () {
    return {
      isCollapse: false,
      loading: false,
      pageData: {
        pageNum: 1,
        pageSize: 10,
        list: [],
        total: 0
      },
      dialogSaveVisible: false,
      permission: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      permissions: [],
      encodeMap: null
    }
  },
  mounted () {
    this.getTableData()
    this.initPermission()
    this.getEncode('YN')
  },
  methods: {
    initPermission () {
      this.permission = {
        id: '',
        name: null,
        type: null,
        icon: null,
        component: null,
        url: null,
        path: null,
        orderId: null,
        parentId: null,
        parentName: null,
        keepAlive: null,
        requireAuth: null
      }
    },
    getTableData () {
      const ths = this
      ths.loading = true
      this.getRequestParams('/auth/permission/selectPage', {
        pageNum: ths.pageData.pageNum,
        pageSize: ths.pageData.pageSize
      }).then(resp => {
        ths.pageData = resp
        ths.loading = false
      })
    },
    getAllPermission () {
      const ths = this
      this.getRequestParams('/auth/permission/selectAllPermissionToTree?hasRoot=1').then(resp => {
        ths.permissions = resp
      })
    },
    getEncode (kind) {
      const ths = this
      this.getRequestParams('/sys/encode/selectByKind?kind=' + kind).then(resp => {
        ths.encodeMap = resp
      })
    },
    handleSizeChange (val) {
      this.pageData.pageSize = val
      this.getTableData()
    },
    handleCurrentChange (val) {
      this.pageData.pageNum = val
      this.getTableData()
    },
    edit (row) {
      const _this = this
      _this.getRequest('/auth/permission/selectById?id=' + row.id).then(resp => {
        if (resp != null) {
          _this.permission = resp
          _this.permission.requireAuth = _this.permission.requireAuth + ''
          _this.permission.keepAlive = _this.permission.keepAlive + ''
          _this.getAllPermission()
          _this.dialogSaveVisible = true
          setTimeout(function () {
            _this.$set(_this.permission, 'parentName', _this.$refs.permissionTree.getNode(_this.permission.parentId).data.name)
          }, 500)
        }
      })
    },
    remove (row) {
      const _this = this
      _this.$confirm('确定要删除此条记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.getRequest('/auth/permission/delete?id=' + row.id).then(resp => {
          if (resp.status === 0) {
            _this.$message({
              type: 'success',
              message: resp.msg
            })
            _this.getTableData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    openAddDialog () {
      this.initPermission()
      this.getAllPermission()
      this.dialogSaveVisible = true
    },
    handleNodeClick (data) {
      this.permission.parentId = data.id
      this.$set(this.permission, 'parentName', data.name)
    },
    closeDialog () {
      this.initPermission()
      this.dialogSaveVisible = false
    },
    submitForm (formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.$confirm('确定要保存页面所填数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            _this.postJsonRequest('/auth/permission/save', JSON.stringify(_this.permission)).then(resp => {
              if (resp.status === 0) {
                _this.$message({
                  type: 'success',
                  message: resp.msg
                })
                _this.dialogSaveVisible = false
                _this.initPermission()
                _this.getTableData()
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消保存'
            })
          })
        } else {
          _this.$message({
            type: 'error',
            message: '页面数据校验失败!'
          })
          return false
        }
      })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
