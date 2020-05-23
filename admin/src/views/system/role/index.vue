<template>
  <div class="app-container">
    <el-button
      v-if="checkPermission(['system_role_add'])"
      type="primary"
      @click="handleAddRole"
    >新建角色</el-button>

    <el-table
      :data="rolesList"
      style="width: 100%;margin-top:30px;"
      border
    >
      <el-table-column
        align="center"
        label="角色ID"
      >
        <template slot-scope="scope">
          {{ scope.row._id }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="角色名称"
      >
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="checkPermission(['system_role_edit'])"
            type="primary"
            size="small"
            @click="handleEdit(scope)"
          >编辑</el-button>
          <el-button
            v-if="checkPermission(['system_role_delete'])"
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
      :title="dialogType==='edit'?'编辑角色':'新建角色'"
      @close="closeDialog"
    >
      <el-form
        ref="roleForm"
        :rules="rules"
        :model="role"
        label-width="80px"
        label-position="left"
      >
        <el-form-item
          prop="name"
          label="角色名称"
        >
          <el-input
            v-model.trim="role.name"
            placeholder="角色名称"
          />
        </el-form-item>
        <el-form-item label="角色权限">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="authData"
            :props="defaultProps"
            :default-checked-keys="defaultCheckedKeys"
            :default-expanded-keys="defaultCheckedKeys"
            show-checkbox
            node-key="_id"
            class="permission-tree"
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
  </div>
</template>

<script>
import { getInfo, createInfo, updateInfo, deleteInfo } from '@/api/public'
import { getAuthMenu } from '@/api/auth'
import { getRoleAuth } from '@/api/role'
import checkPermission from '@/utils/permission'

const defaultRole = {
  id: '',
  name: '',
  authorities: []
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      authData: [],
      defaultCheckedKeys: [],
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  created() {
    this.init()
    this.dict()
  },
  methods: {
    checkPermission,
    async init() {
      const { data } = await getInfo('roles')
      this.rolesList = data
    },
    async dict() {
      const res = await getAuthMenu()
      this.authData = res.data
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    async handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.role = JSON.parse(JSON.stringify(scope.row).replace(/_id/g, 'id'))
      const { data } = await getRoleAuth({ id: scope.row._id })
      // 避免父选子必选
      this.checkStrictly = true
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(data, true)
        this.defaultCheckedKeys = data
        this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm(`确认删除“${row.name}”角色?`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteInfo('roles', row._id)
        this.rolesList.splice($index, 1)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(err => { console.error(err) })
    },
    async confirmRole() {
      this.$refs['roleForm'].validate(async(valid) => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'
          const checkedKeys = this.$refs['tree'].getCheckedKeys().concat(this.$refs['tree'].getHalfCheckedKeys())
          this.role.authorities = checkedKeys
          if (isEdit) {
            await updateInfo('roles', this.role)
          } else {
            await createInfo('roles', this.role)
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
    closeDialog() {
      this.defaultCheckedKeys = []
      this.$refs['roleForm'].clearValidate()
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
