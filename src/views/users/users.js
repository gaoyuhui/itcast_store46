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
      username: ''
    }
  },
  created() {
    const token = sessionStorage.getItem('token')
    this.$http.defaults.headers.common['Authorization'] = token
    this.loadData()
  },
  methods: {
    //   搜索
    async fn (row) {
      this.option = true
      const res = await this.$http.get('users/' + row.id)
      this.username = res.data.data.username
    },
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
    async handleAdd() {
      this.$refs.myform.validate(async (valid) => {
        if (valid) {
          const res = await this.$http.post('users', this.form)
          const {data} = res
          const {meta: {msg, status}} = data
          if (status === 201) {
            this.$message.success(msg)
            this.dialogFormVisible = false
            for (let key in this.form) {
              this.form[key] = ''
            }
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
      this.formData = row
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