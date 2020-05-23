<template>
  <div class="app-container">
    <el-row
      :gutter="10"
      style=""
    >
      <el-form ref="searchForm" :model="searchForm">
        <el-col :span="3">
          <el-form-item prop="categories">
            <el-select
              v-model="searchForm.categories"
              placeholder="所属分类"
              :filterable="true"
            >
              <el-option
                v-for="item in categorityList"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="title">
            <el-input
              v-model="searchForm.title"
              placeholder="资讯标题"
            />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="publisher">
            <el-input
              v-model="searchForm.publisher"
              placeholder="发表人"
            />
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
            <el-button
              v-if="checkPermission(['news_add'])"
              type="primary"
              @click="handleAddNews"
            >新建资讯</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

    <el-table
      class="search-table"
      :data="newsList"
      style="width: 100%;margin-top:30px;"
      border
    >
      <el-table-column
        align="center"
        label="所属分类"
      >
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.categories" :key="item + index">
            {{ index!==0 ? `、${item.name}` : item.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="标题"
      >
        <template slot-scope="scope">
          <span class="ellipsis-1" :title="scope.row.title">
            {{ scope.row.title }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="发表人"
      >
        <template slot-scope="scope">
          {{ scope.row.publisher }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="收藏人数"
      >
        <template slot-scope="scope">
          {{ scope.row.collectedUsers.length }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="checkPermission(['news_edit'])"
            type="primary"
            size="small"
            @click="handleEdit(scope)"
          >编辑</el-button>
          <el-button
            v-if="checkPermission(['news_delete'])"
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
import { getPageInfo, deleteInfo } from '@/api/public'
import { getChildrenList } from '@/api/category'
import checkPermission from '@/utils/permission'
import { clearNullValue } from '@/utils'

export default {
  data() {
    return {
      searchForm: {
        categories: '',
        title: '',
        publisher: ''
      },
      categorityList: [],
      newsList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
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
      const res = await getPageInfo('news', params)
      const { list, total } = res.data
      this.newsList = list
      this.total = total
    },
    async dict() {
      const { data } = await getChildrenList({ name: '资讯分类' })
      this.categorityList = data
    },
    handleAddNews() {
      this.$router.push({ path: '/news/edit', query: { type: 'new', categorityList: this.categorityList }})
    },
    handleEdit(scope) {
      const news = JSON.parse(JSON.stringify(scope.row).replace(/_id/g, 'id'))
      console.log('news', news)
      const categories = []
      for (let index = 0; index < news.categories.length; index++) {
        categories.push(news.categories[index].id)
      }
      news.categories = categories
      this.$router.push({ path: '/news/edit', query: { type: 'edit', news: news, categorityList: this.categorityList, coverType: news.cover.length }})
      console.log('news', news)
    },
    handleDelete({ $index, row }) {
      this.$confirm(`确认删除“${row.title}”资讯?`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteInfo('news', row._id)
        this.newsList.splice($index, 1)
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
