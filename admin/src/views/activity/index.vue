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
          <el-form-item prop="name">
            <el-input
              v-model="searchForm.name"
              placeholder="活动名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="categories">
            <el-select
              v-model="searchForm.categories"
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
          <el-form-item prop="leader">
            <el-input
              v-model="searchForm.leader"
              placeholder="活动发起人"
            />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="status">
            <el-select
              v-model="searchForm.status"
              placeholder="活动状态"
              filterable
            >
              <el-option
                v-for="(item, index) in activityStatus"
                :key="index"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="time">
            <el-date-picker
              v-model="searchForm.time"
              :value-format="`yyyy-MM-dd`"
              type="date"
              placeholder="活动时间"
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
              @click="handleAddActivity"
            >新建活动</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

    <el-table
      class="search-table"
      :data="activityList"
      style="width: 100%;margin-top:30px;"
      border
    >
      <el-table-column
        align="center"
        label="活动名称"
      >
        <template slot-scope="scope">
          <span
            class="ellipsis-1"
            :title="scope.row.name"
          >
            {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="封面"
      >
        <template slot-scope="scope">
          <img
            :src="scope.row.cover"
            style="height:3rem;"
          >
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="关键字"
      >
        <template slot-scope="scope">
          <span
            v-for="(item, index) in scope.row.keyWords"
            :key="item + index"
          >
            {{ index!==0 ? `、${item}` : item }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="所属分类"
      >
        <template slot-scope="scope">
          <span
            v-for="(item, index) in scope.row.categories"
            :key="item + index"
          >
            {{ index!==0 ? `、${item.name}` : item.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="发起人"
      >
        <template slot-scope="scope">
          {{ scope.row.leader }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="状态"
      >
        <template slot-scope="scope">
          {{ scope.row.status===true? '有效' : '无效' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="活动时间"
      >
        <template slot-scope="scope">
          {{ scope.row.time && parseTime(scope.row.time, '{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="活动地址"
      >
        <template slot-scope="scope">
          {{ scope.row.address }}
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
import { getChildrenList } from '@/api/category'
import checkPermission from '@/utils/permission'
import { parseTime, handleGetId, clearNullValue } from '@/utils'

export default {
  data() {
    return {
      searchForm: {
        name: '',
        leader: '',
        status: '',
        time: '',
        categories: ''
      },
      categorityList: [],
      userList: [],
      activityList: [],
      newsList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      activityStatus: [
        {
          key: '有效',
          value: true
        },
        {
          key: '无效',
          value: false
        }
      ]
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
      const res = await getPageInfo('activities', params)
      const { list, total } = res.data
      this.activityList = list
      this.total = total
    },
    async dict() {
      let { data } = await getInfo('users')
      data = JSON.parse(JSON.stringify(data).replace(/_id/g, 'id'))
      this.userList = data
      const categorityList = await getChildrenList({ name: '活动分类' })
      this.categorityList = categorityList.data
    },
    handleAddActivity() {
      this.$router.push({ path: '/activity/edit', query: { type: 'new', categorityList: this.categorityList } })
    },
    handleEdit(scope) {
      scope.row.participants = handleGetId(scope.row.participants)
      scope.row.collectedUsers = handleGetId(scope.row.collectedUsers)
      scope.row.categories = handleGetId(scope.row.categories)
      const activity = JSON.parse(JSON.stringify(scope.row).replace(/_id/g, 'id'))
      activity.keyWords = activity.keyWords.join('，')
      this.$router.push({ path: '/activity/edit', query: { type: 'edit', activity: activity, categorityList: this.categorityList } })
    },
    handleDelete({ $index, row }) {
      this.$confirm(`确认删除“${row.name}”活动?`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteInfo('activity', row._id)
        this.activityList.splice($index, 1)
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
    handleSearch(e) {
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
