<template>
  <div class="app-container">
    <el-row
      :gutter="10"
      style=""
    >
      <el-form
        ref="searchForm"
        :model="searchForm"
      >
        <el-col :span="3">
          <el-form-item prop="user">
            <el-select
              v-model="searchForm.user"
              placeholder="所属用户"
              filterable
            >
              <el-option
                v-for="(item, index) in userList"
                :key="index"
                :label="item.username"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="_id">
            <el-input
              v-model="searchForm._id"
              placeholder="动态编号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="createdAt">
            <el-date-picker
              v-model="searchForm.createdAt"
              :value-format="`yyyy-MM-dd`"
              type="date"
              placeholder="发布时间"
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
              v-if="checkPermission(['activity_add'])"
              type="primary"
              @click="handleAddTrends"
            >新建动态</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

    <el-table
      class="search-table"
      :data="trendsList"
      style="width: 100%;margin-top:30px;"
      border
    >
      <el-table-column
        align="center"
        label="所属用户"
      >
        <template slot-scope="scope">
          {{ scope.row.user && scope.row.user.username }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="动态编号"
      >
        <template slot-scope="scope">
          {{ scope.row._id }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="评论数"
      >
        <template slot-scope="scope">
          {{ scope.row.commentCount }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="点赞数"
      >
        <template slot-scope="scope">
          {{ scope.row.likesCount }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="发布时间"
      >
        <template slot-scope="scope">
          {{ scope.row.createdAt && parseTime(scope.row.createdAt, '{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="checkPermission(['activity_edit'])"
            type="primary"
            size="small"
            @click="handleEdit(scope)"
          >编辑</el-button>
          <el-button
            v-if="checkPermission(['activity_delete'])"
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
import { parseTime, clearNullValue } from '@/utils'

export default {
  data() {
    return {
      searchForm: {
        user: '',
        createdAt: '',
        _id: ''
      },
      userList: [],
      trendsList: [],
      newsList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  computed: {
    commentCount: function() {
      const trendsList = this.trendsList
      let count = 0
      for (let i = 0; i < trendsList.length; i++) {
        if (trendsList[i].operation) {
          for (let j = 0; j < trendsList[i].operation.length; j++) {
            if (trendsList[i].operation[j] && trendsList[i].operation[j].comment) {
              count++
            }
          }
        }
      }
      return count
    }
  },
  created() {
    this.init()
    this.dict()
  },
  methods: {
    checkPermission,
    parseTime,
    async init(searchForm = {}) {
      const form = clearNullValue(searchForm)
      const params = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        searchForm: form
      }
      const res = await getPageInfo('trends', params)
      const { list, total } = res.data
      for (let i = 0; i < list.length; i++) {
        list[i].commentCount = list[i].comments.length || 0
        list[i].likesCount = list[i].likes.length || 0
      }
      this.trendsList = list
      this.total = total
    },
    async dict() {
      let { data } = await getInfo('users')
      data = JSON.parse(JSON.stringify(data).replace(/_id/g, 'id'))
      this.userList = data
    },
    handleAddTrends() {
      this.$router.push({ path: '/trends/edit', query: { type: 'new',
        trends: JSON.stringify({
          user: '',
          comments: [],
          content: {
            text: '',
            images: []
          },
          likes: []
        })
      }})
    },
    handleEdit(scope) {
      scope.row.user = scope.row.user._id
      const trends = JSON.parse(JSON.stringify(scope.row).replace(/_id/g, 'id'))
      this.$router.push({ path: '/trends/edit', query: { type: 'edit', trends: JSON.stringify(trends) }})
    },
    handleDelete({ $index, row }) {
      this.$confirm(`确认删除该动态?`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteInfo('trends', row._id)
        this.trendsList.splice($index, 1)
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
