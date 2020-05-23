<template>
  <div class="app-container">
    <el-row
      :gutter="10"
      style=""
    >
      <el-form ref="searchForm" :model="searchForm">
        <el-col :span="3">
          <el-form-item prop="recipient">
            <el-select
              v-model="searchForm.recipient"
              placeholder="接收人"
              filterable
            >
              <el-option
                v-for="item in userList"
                :key="item._id"
                :label="item.username"
                :value="item._id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="sender">
            <el-select
              v-model="searchForm.sender"
              placeholder="发送人"
              filterable
            >
              <el-option
                v-for="item in userList"
                :key="item._id"
                :label="item.username"
                :value="item._id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="category">
            <el-select
              v-model="searchForm.category"
              placeholder="所属分类"
              filterable
            >
              <el-option
                v-for="item in categorityList"
                :key="item._id "
                :label="item.name"
                :value="item._id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="read">
            <el-select
              v-model="searchForm.read"
              placeholder="消息状态"
              filterable
            >
              <el-option
                v-for="item in infoState"
                :key="item.value "
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item>
            <el-button
              type="primary"
              @click="handleSearch"
            >搜索</el-button>
            <el-button
              type="primary"
              @click="handleResetSearch"
            >重置</el-button>
            <!-- <el-button
              v-if="checkPermission(['information_add'])"
              class="operation-btn"
              type="primary"
              @click="handleAdd"
            >新建消息</el-button> -->
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-table
      class="search-table"
      :data="infoList"
      style="width: 100%;margin-top:30px;"
      border
    >
      <!-- <el-table-column
        align="center"
        type="selection"
        width="55"
        :reserve-selection="true"
      /> -->
      <el-table-column
        align="center"
        label="接收人"
      >
        <template slot-scope="scope">
          {{ scope.row.recipient.username }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="发送人"
      >
        <template slot-scope="scope">
          {{ scope.row.sender.username }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="所属分类"
      >
        <template slot-scope="scope">
          {{ scope.row.category.name }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="动态编号"
      >
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="消息状态"
      >
        <template slot-scope="scope">
          {{ scope.row.read === true ? '已读' : '未读' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="checkPermission(['information_edit'])"
            type="primary"
            size="small"
            @click="handleEdit(scope)"
          >编辑</el-button>
          <el-button
            v-if="checkPermission(['information_delete'])"
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
      :title="dialogType==='edit'?'编辑消息':'新建消息'"
      @close="closeDialog"
    >
      <el-form
        ref="infoForm"
        :model="info"
        :rules="rules"
        label-width="80px"
        label-position="left"
      >
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item
              label="接收人"
              prop="recipient"
            >
              <el-select
                v-model="info.recipient"
                placeholder="接收人"
                disabled
              >
                <el-option
                  v-for="item in userList"
                  :key="item._id"
                  :label="item.username"
                  :value="item._id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="发送人"
              prop="sender"
            >
              <el-select
                v-model="info.sender"
                placeholder="发送人"
                disabled
              >
                <el-option
                  v-for="item in userList"
                  :key="item._id"
                  :label="item.username"
                  :value="item._id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item
              label="所属分类"
              prop="category"
            >
              <el-select
                v-model="info.category"
                placeholder="所属分类"
                disabled
              >
                <el-option
                  v-for="item in categorityList"
                  :key="item._id "
                  :label="item.name"
                  :value="item._id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="消息状态"
              prop="read"
            >
              <el-select
                v-model="info.read"
                placeholder="消息状态"
                filterable
              >
                <el-option
                  v-for="item in infoState"
                  :key="item.value "
                  :label="item.key"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          label="动态编号"
          prop="content"
        >
          <el-input
            v-model="info.content"
            placeholder="动态编号"
            disabled
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
import { createInfo, updateInfo, deleteInfo, getInfo, getPageInfo } from '@/api/public'
import { getAuthList } from '@/api/auth'
import { getChildrenList } from '@/api/category'
import { clearNullValue } from '@/utils/index.js'
import checkPermission from '@/utils/permission'

const defaultInfo = {
  code: '',
  name: '',
  parent: ''
}

export default {
  data() {
    return {
      categorityList: [],
      userList: [],
      searchForm: {
        recipient: '',
        sender: '',
        read: '',
        category: ''
      },
      infoState: [
        { key: '已读', value: true },
        { key: '未读', value: false }
      ],
      infoList: [],
      info: Object.assign({}, defaultInfo),
      parents: [],
      dialogVisible: false,
      dialogType: 'new',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      rules: {
        read: [
          { required: true, message: '请选择消息状态', trigger: 'blur' }
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
      const res = await getPageInfo('information', params)
      const { list, total } = res.data
      this.infoList = list
      this.total = total
    },
    async dict() {
      const { data } = await getAuthList()
      this.parents = data.list

      const userList = await getInfo('users')
      this.userList = userList.data

      const categorityList = await getChildrenList({ name: '消息分类' })
      this.categorityList = categorityList.data
    },
    handleAdd() {
      this.info = Object.assign({}, defaultInfo)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.info = JSON.parse(JSON.stringify(scope.row).replace(/_id/g, 'id'))
      this.info.content = this.info.content
      this.info.recipient = this.info.recipient.id
      this.info.sender = this.info.sender.id
      console.log('this.info', this.info)
    },
    handleDelete({ $index, row }) {
      console.log('row', row)
      this.$confirm(`确认删除该${row.category.name}?`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteInfo('information', row._id)
        this.infoList.splice($index, 1)
        this.total--
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(err => { console.error(err) })
    },
    async confirmRole() {
      this.$refs['infoForm'].validate(async(valid) => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'
          if (isEdit) {
            console.log('this.info', this.info)
            const info = { read: this.info.read, id: this.info.id }
            await updateInfo('informations', info)
          } else {
            await createInfo('informations', clearNullValue(this.info))
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
      this.$refs['infoForm'].clearValidate()
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
