<template>
  <div class="app-container">
    <el-row :gutter="10" style="">
      <el-form ref="searchForm" :model="searchForm">
        <el-col :span="3">
          <el-form-item prop="name">
            <el-input
              v-model="searchForm.name"
              placeholder="权限名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="code">
            <el-input
              v-model="searchForm.code"
              placeholder="权限编码"
            />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="parent">
            <el-select
              v-model="searchForm.parent"
              placeholder="上级权限"
              :filterable="true"
            >
              <el-option
                v-for="item in parents"
                :key="item._id"
                :label="item.name + '(' +item.code + ')'"
                :value="item._id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button type="primary" @click="handleResetSearch">重置</el-button>
            <el-button
              v-if="checkPermission(['system_authority_add'])"
              class="operation-btn"
              type="primary"
              @click="handleAddAuth"
            >新建权限</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-table
      class="search-table"
      :data="authesList"
      style="width: 100%;margin-top:30px;"
      border
    >
      <el-table-column
        align="center"
        label="权限名称"
      >
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="权限编码"
      >
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="上级权限"
      >
        <template slot-scope="scope">
          {{ scope.row.parent && `${scope.row.parent.name}(${scope.row.parent.code})` }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <!-- <i
            v-if="checkPermission(['system_authority_edit'])"
            type="primary"
            size="small"
            class="el-icon-edit"
            @click="handleEdit(scope)"
          /> -->
          <el-button
            v-if="checkPermission(['system_authority_edit'])"
            type="primary"
            size="small"
            @click="handleEdit(scope)"
          >编辑</el-button>
          <!-- <i
            v-if="checkPermission(['system_authority_delete'])"
            type="danger"
            size="small"
            class="el-icon-delete"
            style="marginLeft:10px"
            @click="handleDelete(scope)"
          /> -->
          <el-button
            v-if="checkPermission(['system_authority_delete'])"
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
      :title="dialogType==='edit'?'编辑权限':'新建权限'"
      @close="closeDialog"
    >
      <el-form
        ref="authForm"
        :rules="rules"
        :model="auth"
        label-width="80px"
        label-position="left"
      >
        <el-form-item
          label="权限名称"
          prop="name"
        >
          <el-input
            v-model.trim="auth.name"
            placeholder="权限名称"
          />
        </el-form-item>
        <el-form-item
          label="权限编码"
          prop="code"
        >
          <el-input
            v-model.trim="auth.code"
            placeholder="权限编码"
          />
        </el-form-item>
        <el-form-item label="上级权限">
          <el-select
            v-model="auth.parent"
            placeholder="上级权限"
            :filterable="true"
          >
            <el-option
              v-for="item in parents"
              :key="item._id"
              :label="item.name + '(' +item.code + ')'"
              :value="item._id"
            />
          </el-select>
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
import { createInfo, updateInfo, deleteInfo } from '@/api/public'
import { getAuthList } from '@/api/auth'
import { clearNullValue } from '@/utils/index.js'
import checkPermission from '@/utils/permission'

const defaultAuth = {
  code: '',
  name: '',
  parent: ''
}

export default {
  data() {
    return {
      searchForm: {
        name: '',
        code: '',
        parent: ''
      },
      authesList: [],
      auth: Object.assign({}, defaultAuth),
      parents: [],
      dialogVisible: false,
      dialogType: 'new',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      rules: {
        name: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入权限编码', trigger: 'blur' }
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
    async init(searchForm = {}) {
      const form = clearNullValue(searchForm)
      const params = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        searchForm: form
      }
      const res = await getAuthList(params)
      const { list, total } = res.data
      this.authesList = list
      this.total = total
    },
    async dict() {
      const { data } = await getAuthList()
      this.parents = data.list
    },
    handleAddAuth() {
      this.auth = Object.assign({}, defaultAuth)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.auth = JSON.parse(JSON.stringify(scope.row).replace(/_id/g, 'id'))
      this.auth.parent = this.auth.parent.id
    },
    handleDelete({ $index, row }) {
      this.$confirm(`确认删除“${row.name}”权限?`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteInfo('authorities', row._id)
        this.authesList.splice($index, 1)
        this.total--
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(err => { console.error(err) })
    },
    async confirmRole() {
      this.$refs['authForm'].validate(async(valid) => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'
          if (isEdit) {
            await updateInfo('authorities', clearNullValue(this.auth))
          } else {
            await createInfo('authorities', clearNullValue(this.auth))
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
      this.init(this.searchForm)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.init(this.searchForm)
    },
    handleSearch() {
      this.init(this.searchForm)
    },
    handleResetSearch() {
      this.$refs['searchForm'].resetFields()
      this.init()
    },
    closeDialog() {
      this.$refs['authForm'].clearValidate()
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
