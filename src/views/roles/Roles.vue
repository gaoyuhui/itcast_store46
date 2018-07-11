<template>
  <el-card class="box-card">
    <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>
    <el-button class="btn" @click="handleAdd">添加角色</el-button>
      <!-- 添加 -->
      <el-dialog title="添加角色" :visible.sync="dialogFormVisible">
        <el-form :rules="rules" :model="form">
          <el-form-item label="角色名称" prop="rolename" :label-width="formLabelWidth">
            <el-input v-model="form.roleName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roledesc" :label-width="formLabelWidth">
            <el-input v-model="form.roleDesc" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handelAddAxios">确 定</el-button>
        </div>
      </el-dialog>
    <el-table
    v-loading="loading"
    border
    stripe
    :data="list"
    style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="scope">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-row
            v-for="item1 in scope.row.children"
            class="level1"
            :key="item1.id">
            <el-col :span="3">
              <el-tag @close="handleClose(scope.row, item1.id)"  closable >{{ item1.authName }}</el-tag>
            </el-col>
            <el-col :span="21">
              <el-row v-for="item2 in item1.children" :key="item2.id">
                <el-col :span="4">
                   <el-tag @close="handleClose(scope.row, item2.id)"  closable type="success">{{ item2.authName }}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-row class="level4" v-for="item3 in item2.children" :key="item3.id">
                    <el-col :span="24">
                      <el-tag  @close="handleClose(scope.row, item3.id)" class="level3" closable type="warning">{{ item3.authName }}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">没有权限</el-col>
          </el-row>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      type="index">
    </el-table-column>
    <el-table-column
      label="角色名称"
      prop="roleName">
    </el-table-column>
    <el-table-column
      label="角色是描述"
      prop="roleDesc">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button @click="handleSelect(scope.row)" plain size="mini" type="primary" icon="el-icon-edit" ></el-button>
        <el-button @click="handleShowRigtsDialog(scope.row)" plain size="mini" type="success" icon="el-icon-check" ></el-button>
        <el-button @click="handleDelete(scope.row.id)" plain size="mini" type="danger" icon="el-icon-delete" ></el-button>
        <!-- 编辑 -->
        <el-dialog title="编辑角色" :visible.sync="dialogFormVisibleSelect">
        <el-form :model="form">
          <el-form-item label="角色名称" :label-width="formLabelWidth">
            <el-input v-model="form.roleName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" :label-width="formLabelWidth">
            <el-input v-model="form.roleDesc" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleSelect = false">取 消</el-button>
          <el-button type="primary" @click="handelSelectAxios">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分配权限 -->
      <el-dialog
        v-loading="loadingTree"
        @open="handleOpen"
        title="分配权限"
        :visible.sync="dialogVisible">
        <el-tree
          ref="tree"
          node-key="id"
          :default-checked-keys="checkedList"
          v-loading="loadingTree"
          show-checkbox
          default-expand-all
          :data="treeData"
          :props="defaultProps">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSetRights">确 定</el-button>
        </span>
      </el-dialog>
      </template>
    </el-table-column>
  </el-table>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      list: [
      ],
      checkedList: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'

      },
      currentRoleId: -1,
      loading: true,
      loadingTree: true,
      dialogFormVisible: false,
      formLabelWidth: '100px',
      dialogVisible: false,
      form: {
        roleDesc: '',
        roleName: ''
      },
      dialogFormVisibleSelect: false,
      roleId: '',
      rules: {
        rolename: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        roledesc: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    async handleSetRights () {
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      const newArray = [...checkedKeys, ...halfCheckedKeys]
      const {data: resData} = await this.$http.post(`roles/${this.currentRoleId}/rights`, {
        rids: newArray.join(',')
      })
      const {meta: {msg, status}} = resData
      if (status === 200) {
        this.$message.success(msg)
        this.dialogVisible = false
        this.loadData()
      } else {
        this.$message.error(msg)
      }
    },
    handleShowRigtsDialog (row) {
      this.dialogVisible = true
      this.currentRoleId = row.id
      const arr = []
      row.children.forEach((item1) => {
        // arr.push(item1.id)
        item1.children.forEach((item2) => {
          // arr.push(item2.id)
          item2.children.forEach((item3) => {
            arr.push(item3.id)
          })
        })
      })
      this.checkedList = arr
    },
    async handleOpen () {
      this.loadingTree = true
      const {data: resData} = await this.$http.get('rights/tree')
      this.loadingTree = false
      const {data} = resData
      this.treeData = data
    },
    async handleClose (role, rightId) {
      const {data: resData} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      const {data, meta: {status, msg}} = resData
      if (status === 200) {
        this.$message.success(msg)
        role.children = data
      } else {
        this.$message.error(msg)
      }
    },
    async loadData () {
      this.loading = true
      const {data: resData} = await this.$http.get('roles')
      this.loading = false
      const data = resData.data
      const status = resData.meta.status
      const msg = resData.meta.msg
      if (status === 200) {
        this.list = data
        console.log(this.list)
      } else {
        this.$http.error(msg)
      }
    },
    // 添加
    handleAdd () {
      this.form = {roleDesc: '', roleName: ''}
      this.dialogFormVisible = true
    },
    async handelAddAxios () {
      const res = await this.$http.post('roles', this.form)
      const data = res.data
      const {meta: {msg, status}} = data
      if (status === 201) {
        this.$message.success(msg)
        this.loadData()
        this.dialogFormVisible = false
      } else {
        this.$message.error(msg)
      }
    },
    // 删除
    async handleDelete(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete('roles/' + id)
        const data = res.data
        const {meta: {msg, status}} = data
        if (status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadData()
        } else {
          this.$message.error(msg)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 编辑
    handleSelect (row) {
      this.form.roleDesc = row.roleDesc
      this.form.roleName = row.roleName
      this.roleId = row.id
      this.dialogFormVisibleSelect = true
    },
    async handelSelectAxios () {
      const res = await this.$http.put(`roles/${this.roleId}`, this.form)
      const data = res.data
      const {meta: {msg, status}} = data
      if (status === 200) {
        this.$message.success(msg)
        this.loadData()
        this.dialogFormVisibleSelect = false
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style>
.btn {
  margin-top: 15px;
  margin-bottom: 15px;
}
.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .level3 {
    margin-right: 5px;
    margin-bottom: 5px;
  }
  .level4 {
    display: inline-block;
  }
  .level1 {
    margin-bottom: 10px;
  }
</style>
