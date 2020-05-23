<template>
  <div class="app-container">
    <el-button
      v-if="checkPermission(['user_add'])"
      type="primary"
      @click="handleAddUser"
    >新建用户</el-button>

    <el-table
      :data="userList"
      style="width: 100%;margin-top:30px;"
      border
    >
      <el-table-column
        align="center"
        label="用户名"
      >
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="角色"
      >
        <template slot-scope="scope">
          {{ scope.row.role && scope.row.role.name }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="头像"
      >
        <template slot-scope="scope">
          <img
            :src="scope.row.avatar"
            style="height:3rem;"
          >
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="电话"
      >
        <template slot-scope="scope">
          {{ scope.row.telephone }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="邮箱"
      >
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="checkPermission(['user_edit'])"
            type="primary"
            size="small"
            @click="handleEdit(scope)"
          >编辑</el-button>
          <el-button
            v-if="checkPermission(['user_delete'])"
            type="danger"
            size="small"
            @click="handleDelete(scope)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      width="40rem"
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'编辑用户':'新建用户'"
      @close="closeDialog"
    >
      <el-form
        ref="userForm"
        :model="user"
        :rules="rules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="user.username"
            placeholder="用户名"
          />
        </el-form-item>
        <el-form-item label="密码" :prop="dialogType!=='edit' ? 'password' : 'any'">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="user.password"
            :type="passwordType"
            placeholder="密码"
          >
            <span slot="suffix" class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select
            v-model="user.role"
            placeholder="角色"
            :filterable="true"
          >
            <el-option
              v-for="item in roleList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="headers"
            :show-file-list="false"
            :on-success="res => $set(user, 'avatar', res.url)"
          >
            <img
              v-if="user.avatar"
              :src="user.avatar"
              class="avatar"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="手机号" prop="telephone">
          <el-input
            v-model="user.telephone"
            placeholder="手机号"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="user.email"
            placeholder="邮箱"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button
          type="danger"
          @click="dialogVisible=false"
        >取消</el-button>
        <el-button
          type="primary"
          @click="confirmRole"
        >确定</el-button>
      </div>
    </el-dialog>

    <el-pagination
      style="margin-top:10px"
      :current-page="currentPage"
      :page-sizes="[10, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getPageInfo, getInfo, createInfo, updateInfo, deleteInfo } from '@/api/public'
import { clearNullValue } from '@/utils'
import { getAuthHeaders } from '@/utils/auth'
import checkPermission from '@/utils/permission'

const defaultUser = {
  username: '',
  password: '',
  role: '',
  telephone: '',
  email: '',
  avatar: ''
}

export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      if (value) {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
      callback()
    }
    return {
      userList: [],
      user: Object.assign({}, defaultUser),
      passwordType: 'password',
      roleList: [],
      dialogVisible: false,
      dialogType: 'new',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      defaultRole: '',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择用户角色', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        telephone: [
          { validator: checkPhone, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
  },
  created() {
    this.headers = getAuthHeaders()
    this.init()
    this.dict()
  },
  methods: {
    checkPermission,
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    async init() {
      const params = {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }
      const res = await getPageInfo('users', params)
      const { list, total } = res.data
      this.userList = list
      this.total = total
    },
    async dict() {
      const { data } = await getInfo('roles')
      this.roleList = data
    },
    handleAddUser() {
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.user = JSON.parse(JSON.stringify(scope.row).replace(/_id/g, 'id'))
      this.user.role = this.user.role.id
    },
    handleDelete({ $index, row }) {
      this.$confirm(`确认删除“${row.username}”用户?`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteInfo('users', row._id)
        this.userList.splice($index, 1)
        this.total--
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(err => { console.error(err) })
    },
    async confirmRole() {
      this.$refs['userForm'].validate(async(valid) => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'
          if (isEdit) {
            await updateInfo('users', clearNullValue(this.user))
          } else {
            await createInfo('users', clearNullValue(this.user))
          }
          this.dialogVisible = false
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.init()
        } else {
          return false
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.init()
    },
    closeDialog() {
      this.$refs['userForm'].resetFields()
      this.user = Object.assign({}, defaultUser)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
