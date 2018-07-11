export default {
  data() {
    return {
      list: [],
      loading: true,
      formLabelWidth: '90px',
      dialogFormVisible: false,
      dialogVisible: false,
      str: '',
      compile: false,
      value: '',
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        
      },
      formData: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      // 分页相关数据
      currentPage1: 0,
      currentPage2: 1,
      pagesize: 5,
      option: false,
      roles: '',
      currentRoleId: -1,
      username: '',
      userId: -1
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async fn (row) {
      this.username = row.username
      this.userId = row.id
      const res = await this.$http.get('roles')
      this.roles = res.data.data
      const res1 = await this.$http.get('users/' + row.id)
      this.currentRoleId = res1.data.data.rid
      this.option = true
    },
    async optionCompile () {
      const res = await this.$http.put(`users/${this.userId}/role`, {
        rid: this.currentRoleId
      })
      const data = res.data
      if (data.meta.status === 200) {
        this.option = false
        this.$message.success(data.meta.msg)
      } else {
        this.$message.error(data.meta.msg)
      }
    },
    // async fn (row) {
    //   this.userId = row.id
    //   this.username = row.username
    //   const res = await this.$http.get('roles')
    //   this.roles = res.data.data
    //   const res1 = await this.$http.get('users/' + row.id)
    //   this.currentRoleId = res1.data.data.rid
    //   this.option = true
    // },
    // async optionCompile () {
    //   const res = await this.$http.put(`users/${this.userId}/role`, {
    //     rid: this.currentRoleId
    //   })
    //   const data = res.data
    //   if (data.meta.status === 200) {
    //     this.option = false
    //     this.$message.success(data.meta.msg)
    //     this.roles = ''
    //     this.currentRoleId = -1
    //   } else {
    //     this.$message.error(data.meta.msg)
    //   }
    // },
    async loadData() {
      this.loading = true
      const res = await this.$http.get('users?pagenum=' + this.currentPage2 + '&pagesize=' + this.pagesize + '&query=' + this.value)
      this.loading = false
      const data = res.data
      const {meta: {msg, status}} = data
      if (status === 200) {
        const {data: {users, total}} = data
        this.currentPage1 = total
        this.list = users
        if (this.list.length === 0) {
          this.currentPage2 -= 1
          this.loadData()
        }
      } else {
        this.$message.error(msg)
      }
    },
    async fandleDelete (id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(async () => {
          const res = await this.$http.delete('users/' + id)
          const data = res.data
          const {meta: {msg, status}} = data
          if (status === 200) {
            this.$message({
              type: 'success',
              message: msg
            })
            this.loadData()
          } else {
            this.$message({
              type: 'error',
              message: msg
            })
          }
         
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    dialogFormVisibleAdd () {
      this.dialogFormVisible = true
      for (let key in this.form) {
        this.form[key] = ''
      }
    },
    async handleAdd() {
      this.$refs.myform.validate(async (valid) => {
        if (valid) {
          const res = await this.$http.post('users', this.form)
          const {data} = res
          const {meta: {msg, status}} = data
          if (status === 201) {
            this.$message.success(msg)
            this.dialogFormVisible = false
            this.loadData()
          } else {
            this.$message.error(msg)
          }
        } else {
          this.$message.error('请输入内容')
        }
      })
    },
    async AddCopmile (row) {
      this.compile = true
      this.formData.mobile = row.mobile
      this.formData.username = row.username
      this.formData.id = row.id
      this.formData.email = row.email
    },
    async handleCompile () {
      const res = await this.$http.put('users/' + this.formData.id, this.formData)
      const {data: {meta: {msg, status}}} = res
      if (status === 200) {
        this.$message.success(msg)
        this.compile = false
        this.loadData()
      } else {
        this.$message.error(msg)
      }
    },
    async handleState (row) {
      const res = await this.$http.put('users/' + row.id + '/state/' + row.mg_state)
      const {data: {meta: {msg, status}}} = res
      if (status === 200) {
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
    },
    async handelSearch() {
      this.loadData()
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.loadData()
    },
    handleCurrentChange(val) {
      this.currentPage2 = val
      this.loadData()
    }
  }
}
