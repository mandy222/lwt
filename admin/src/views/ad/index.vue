<template>
  <div class="app-container">
    <el-row
      :gutter="10"
      style=""
    >
      <el-form ref="searchForm" :model="searchForm">
        <el-col :span="3">
          <el-form-item prop="name">
            <el-input
              v-model="searchForm.name"
              placeholder="广告位名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button
              type="primary"
              @click="handleSearch"
            >搜索</el-button>
            <el-button
              type="primary"
              @click="handleResetSearch"
            >重置</el-button>
            <el-button
              v-if="checkPermission(['ad_add'])"
              type="primary"
              @click="handleAddAd"
            >新建广告位</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

    <el-table
      class="search-table"
      :data="adList"
      style="width: 100%;margin-top:30px;"
      border
    >
      <el-table-column
        align="center"
        label="广告位名称"
      >
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="广告数"
      >
        <template slot-scope="scope">
          {{ scope.row.items.length }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="checkPermission(['ad_edit'])"
            type="primary"
            size="small"
            @click="handleEdit(scope)"
          >编辑</el-button>
          <el-button
            v-if="checkPermission(['ad_delete'])"
            type="danger"
            size="small"
            @click="handleDelete(scope)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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
import { getPageInfo, deleteInfo, getInfo } from '@/api/public'
import checkPermission from '@/utils/permission'
import { clearNullValue } from '@/utils'

export default {
  data() {
    return {
      searchForm: {
        name: ''
      },
      userList: [],
      adList: [],
      newsList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
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
      const res = await getPageInfo('ads', params)
      const { list, total } = res.data
      this.adList = list
      this.total = total
    },
    async dict() {
      let { data } = await getInfo('users')
      data = JSON.parse(JSON.stringify(data).replace(/_id/g, 'id'))
      this.userList = data
    },
    handleAddAd() {
      this.$router.push({ path: '/ad/edit', query: { type: 'new', ad: {
        name: '',
        items: []
      }
      }})
    },
    handleEdit(scope) {
      // scope.row.user = scope.row.user._id
      const ad = JSON.parse(JSON.stringify(scope.row).replace(/_id/g, 'id'))
      this.$router.push({ path: '/ad/edit', query: { type: 'edit', ad: ad }})
    },
    handleDelete({ $index, row }) {
      this.$confirm(`确认删除“${row.name}”动态?`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteInfo('ads', row._id)
        this.adList.splice($index, 1)
        this.total--
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(err => { console.error(err) })
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
