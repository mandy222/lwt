<template>
  <el-card class="box-card">
    <div
      slot="header"
      class="clearfix"
    >
      <el-page-header
        :content="dialogType==='edit'?'编辑动态':'新建动态'"
        @back="$router.back(-1)"
      />
    </div>
    <div class="text item">
      <el-form
        ref="trendsForm"
        :model="trends"
        :rules="rules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item
          label="所属用户"
          prop="user"
        >
          <el-select
            v-model="trends.user"
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
        <el-form-item
          label="动态内容"
          prop="content"
        >
          <el-input
            v-if="trends.content"
            v-model="trends.content.text"
            placeholder="动态文字"
            type="textarea"
          />
          <el-button
            size="small"
            style="marginTop: 1rem "
            @click="handleAddInfo('img')"
          >
            <i class="el-icon-plus" />添加动态图片
          </el-button>
          <el-row
            v-if="trends.content"
            type="flex"
            style="flex-wrap:wrap"
            :gutter="20"
          >
            <el-col
              v-for="(item, i) in trends.content.images"
              :key="i"
              :md="4"
            >
              <el-upload
                style="marginTop: .5rem"
                class="avatar-uploader"
                :action="uploadUrl"
                :headers="getAuthHeaders()"
                :show-file-list="false"
                :on-success="res => $set(item, 'url', res.url)"
              >
                <img
                  v-if="item.url"
                  :src="item.url"
                  class="avatar"
                >
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              <el-button
                size="small"
                type="danger"
                @click="trends.content.images.splice(i, 1)"
              >删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="点赞用户" prop="likes">
          <el-select
            v-model="trends.likes"
            placeholder="点赞用户"
            filterable
            multiple
            collapse-tags
          >
            <el-option
              v-for="(item, index) in userList"
              :key="index"
              :label="item.username"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="评论">
          <el-button
            size="small"
            style="marginBottom: 10px"
            @click="handleAddInfo('operation')"
          >
            <i class="el-icon-plus" />添加评论
          </el-button>
          <el-row
            type="flex"
            style="flex-wrap:wrap"
            :gutter="20"
          >
            <el-col
              v-for="(item, i) in trends.comments"
              :key="i"
              :md="12"
            >
              <el-select
                v-model="item.user"
                placeholder="所属用户"
                filterable
              >
                <el-option
                  v-for="(item2, index) in userList"
                  :key="index"
                  :label="item2.username"
                  :value="item2.id"
                />
              </el-select>
              <el-input
                v-model="item.content"
                placeholder="评论"
                type="textarea"
                style="marginTop: .5rem"
              />
              <el-button
                size="small"
                type="danger"
                style="marginBottom: 2rem; marginTop: .5rem "
                @click="trends.comments.splice(i, 1)"
              >删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button
          type="danger"
          @click="$router.back(-1)"
        >取消</el-button>
        <el-button
          type="primary"
          @click="confirmActivity"
        >确定</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { getInfo, createInfo, updateInfo } from '@/api/public'
import { clearNullValue } from '@/utils'
import { getAuthHeaders } from '@/utils/auth'

const defaultTrends = {
  user: '',
  comments: [],
  content: {
    text: '',
    images: []
  },
  likes: []
}

export default {
  data() {
    return {
      trends: Object.assign({}, defaultTrends),
      userList: [],
      dialogType: 'new',
      rules: {
        user: [
          { required: true, message: '请选择所属用户', trigger: ['blur', 'change'] }
        ],
        content: [
          { required: true, message: '请输入动态内容', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
  },
  created() {
    this.dialogType = this.$route.query.type
    this.trends = Object.assign({}, JSON.parse(this.$route.query.trends))
    this.dict()
  },
  methods: {
    getAuthHeaders,
    async dict() {
      let { data } = await getInfo('users')
      data = JSON.parse(JSON.stringify(data).replace(/_id/g, 'id'))
      this.userList = data
      console.log('this.trends', this.trends)
    },
    async confirmActivity() {
      this.$refs['trendsForm'].validate(async(valid) => {
        if (valid) {
          const isEdit = this.$route.query.type === 'edit'
          if (isEdit) {
            console.log('object', this.trends)
            await updateInfo('trends', this.trends)
          } else {
            await createInfo('trends', clearNullValue(this.trends))
          }
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$router.push('/trends/index')
        } else {
          return false
        }
      })
    },
    handleAddInfo(param) {
      if (param === 'img') {
        if (this.trends.content.images.length >= 9) {
          this.$message({
            message: '最多只能保存9张动态图片',
            type: 'error'
          })
        } else {
          this.trends.content.images.push({})
        }
      } else {
        this.trends.comments.push({
          commentsTime: new Date()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item__content {
  line-height: 30px;
}
.avatar-uploader-icon,
.avatar {
  min-width: 10rem;
  height: 7rem;
  line-height: 7rem;
}
</style>
