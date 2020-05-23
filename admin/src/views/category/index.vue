<template>
  <div class="app-container">
    <el-row :gutter="10" style="">
      <el-form ref="searchForm" :model="searchForm">
        <el-col :span="3">
          <el-form-item prop="name">
            <el-input
              v-model="searchForm.name"
              placeholder="分类名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="parent">
            <el-select
              v-model="searchForm.parent"
              placeholder="上级分类"
              :filterable="true"
            >
              <el-option
                v-for="item in parents"
                :key="item._id"
                :label="item.name"
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
              @click="handleAdd"
            >新建分类</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-table
      class="search-table"
      :data="categoryList"
      style="width: 100%;margin-top:30px;"
      border
    >
      <el-table-column
        align="center"
        label="分类名称"
      >
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="上级分类"
      >
        <template slot-scope="scope">
          {{ scope.row.parent && scope.row.parent.name }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="checkPermission(['system_authority_edit'])"
            type="primary"
            size="small"
            @click="handleEdit(scope)"
          >编辑</el-button>
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
      :title="dialogType==='edit'?'编辑分类':'新建分类'"
      @close="closeDialog"
    >
      <el-form
        ref="categoryForm"
        :rules="rules"
        :model="category"
        label-width="80px"
        label-position="left"
      >
        <el-form-item
          label="分类名称"
          prop="name"
        >
          <el-input
            v-model.trim="category.name"
            placeholder="分类名称"
          />
        </el-form-item>
        <el-form-item label="上级分类">
          <el-select
            v-model="category.parent"
            placeholder="上级分类"
            :filterable="true"
          >
            <el-option
              v-for="item in parents"
              :key="item._id"
              :label="item.name"
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
import { createInfo, updateInfo, deleteInfo, getPageInfo, getInfo } from '@/api/public'
import { clearNullValue } from '@/utils'
import checkPermission from '@/utils/permission'

const defaultCategory = {
  name: '',
  parent: ''
}

export default {
  data() {
    return {
      searchForm: {
        name: '',
        parent: ''
      },
      categoryList: [],
      category: Object.assign({}, defaultCategory),
      parents: [],
      dialogVisible: false,
      dialogType: 'new',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
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
      const res = await getPageInfo('categories', params)
      const { list, total } = res.data
      this.categoryList = list
      this.total = total
    },
    async dict() {
      const { data } = await getInfo('categories')
      this.parents = data
    },
    handleAdd() {
      this.category = Object.assign({}, defaultCategory)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.category = JSON.parse(JSON.stringify(scope.row).replace(/_id/g, 'id'))
      this.category.parent = this.category.parent && this.category.parent.id
    },
    handleDelete({ $index, row }) {
      this.$confirm(`确认删除“${row.name}”分类?`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteInfo('categories', row._id)
        this.categoryList.splice($index, 1)
        this.total--
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(err => { console.error(err) })
    },
    async confirmRole() {
      this.$refs['categoryForm'].validate(async(valid) => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'
          if (isEdit) {
            await updateInfo('categories', clearNullValue(this.category))
          } else {
            await createInfo('categories', clearNullValue(this.category))
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
      this.$refs['categoryForm'].clearValidate()
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
