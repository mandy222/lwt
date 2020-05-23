<template>
  <el-card class="box-card">
    <div
      slot="header"
      class="clearfix"
    >
      <el-page-header
        :content="dialogType==='edit'?'编辑资讯':'新建资讯'"
        @back="$router.back(-1)"
      />
    </div>
    <div class="text item">
      <el-form
        ref="newsForm"
        :model="news"
        :rules="rules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item
          label="资讯封面"
          prop="cover"
        >
          <el-radio-group
            v-model="coverType"
            @change="handleChangeCoverType"
          >
            <el-radio :label="0">无封面</el-radio>
            <el-radio :label="1">封面一</el-radio>
            <el-radio :label="3">封面三</el-radio>
          </el-radio-group>
          <el-upload
            v-show="coverType===1"
            style="marginTop: 1rem"
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="getAuthHeaders()"
            :show-file-list="false"
            :on-success="handleUpload"
          >
            <img
              v-if="news.cover[0]"
              :src="news.cover[0]"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            />
          </el-upload>
          <el-row :span="20">
            <el-col
              v-for="(item, index) in 3"
              v-show="coverType===3"
              :key="index"
              :span="6"
            >
              <el-upload
                style="marginTop: 1rem"
                class="avatar-uploader"
                :action="uploadUrl"
                :headers="getAuthHeaders()"
                :show-file-list="false"
                :on-success="handleUpload"
              >
                <img
                  v-if="news.cover[index]"
                  :src="news.cover[index]"
                  class="avatar"
                >
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                />
              </el-upload>
            </el-col>
          </el-row>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="所属分类"
              prop="categories"
            >
              <el-select
                v-model="news.categories"
                placeholder="所属分类"
                :filterable="true"
                multiple
                collapse-tags
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
          <el-col :span="12">
            <el-form-item
              label="收藏人"
              prop="collectedUsers"
            >
              <el-select
                v-model="news.collectedUsers"
                placeholder="收藏人"
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
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="发表人"
              prop="publisher"
            >
              <el-input
                v-model="news.publisher"
                placeholder="发表人"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="标题"
              prop="title"
            >
              <el-input
                v-model="news.title"
                placeholder="标题"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="详情"
          prop="content"
        >
          <vue-editor
            v-model="news.content"
            class="m-vue-editor"
            useCustomImageHandler
            @image-added="handleImageAdded"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button
          type="danger"
          @click="$router.back(-1)"
        >取消</el-button>
        <el-button
          type="primary"
          @click="confirmRole"
        >确定</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import { createInfo, updateInfo, upload, getInfo } from '@/api/public'
import { clearNullValue } from '@/utils'
import { getAuthHeaders } from '@/utils/auth'

const defaultNews = {
  categories: [],
  title: '',
  content: '',
  collectedUsers: [],
  publisher: '',
  cover: []
}

export default {
  components: {
    VueEditor
  },
  data() {
    return {
      coverType: 0,
      userList: [],
      news: Object.assign({}, defaultNews),
      categorityList: [],
      dialogType: 'new',
      rules: {
        categories: [
          { required: true, message: '请选择所属分类', trigger: ['blur', 'change'] }
        ],
        title: [
          { required: true, message: '请输入资讯标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入资讯详情', trigger: ['blur', 'change'] }
        ],
        publisher: [
          { required: true, message: '请输入发表人', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
  },
  created() {
    this.news = this.$route.query.news || defaultNews
    this.dialogType = this.$route.query.type
    this.categorityList = this.$route.query.categorityList
    this.coverType = this.$route.query.coverType || 0
    this.dict()
  },
  methods: {
    getAuthHeaders,
    async confirmRole() {
      this.$refs['newsForm'].validate(async (valid) => {
        if (valid) {
          const isEdit = this.$route.query.type === 'edit'
          if (isEdit) {
            await updateInfo('news', clearNullValue(this.news))
          } else {
            await createInfo('news', clearNullValue(this.news))
          }
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$router.push('/news/index')
        } else {
          return false
        }
        this.$refs['newsForm'].resetFields()
      })
    },
    async dict() {
      let { data } = await getInfo('users')
      data = JSON.parse(JSON.stringify(data).replace(/_id/g, 'id'))
      this.userList = data
    },
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData()
      formData.append('file', file)
      const res = await upload(formData)
      Editor.insertEmbed(cursorLocation, 'image', res.data.url)
      resetUploader()
    },
    handleUpload(res) {
      console.log('res', res)
      this.news.cover.push(res.url)
    },
    handleChangeCoverType() {
      this.news.cover = []
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader-icon,
.avatar {
  min-width: 18rem;
  height: 11rem;
  line-height: 11rem;
}
</style>
