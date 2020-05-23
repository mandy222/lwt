<template>
  <el-card class="box-card">
    <div
      slot="header"
      class="clearfix"
    >
      <el-page-header
        :content="dialogType==='edit'?'编辑活动':'新建活动'"
        @back="$router.back(-1)"
      />
    </div>
    <div class="text item">
      <el-form
        ref="activityForm"
        :model="activity"
        :rules="rules"
        label-width="80px"
        label-position="left"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="发起人"
              prop="leader"
            >
              <el-input
                v-model="activity.leader"
                placeholder="活动发起人"
              />
              <!-- <el-select
                v-model="activity.leader"
                placeholder="发起人"
                filterable
              >
                <el-option
                  v-for="(item, index) in userList"
                  :key="index"
                  :label="item.username"
                  :value="item.id"
                />
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="参与者"
              prop="participants"
            >
              <el-select
                v-model="activity.participants"
                placeholder="参与者"
                :filterable="true"
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
          <el-col :span="8">
            <el-form-item
              label="收藏人"
              prop="collectedUsers"
            >
              <el-select
                v-model="activity.collectedUsers"
                placeholder="收藏人"
                :filterable="true"
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
          <el-col :span="8">
            <el-form-item label="活动状态" prop="status">
              <el-radio-group v-model="activity.status">
                <el-radio :label="true">有效</el-radio>
                <el-radio :label="false">无效</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="时间"
              prop="time"
            >
              <el-date-picker
                v-model="activity.time"
                type="datetime"
                placeholder="选择活动时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="所属分类"
              prop="categories"
            >
              <el-select
                v-model="activity.categories"
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
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="活动名称"
              prop="name"
            >
              <el-input
                v-model="activity.name"
                placeholder="活动名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="地址"
              prop="address"
            >
              <el-input
                v-model="activity.address"
                placeholder="地址"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="关键字"
              prop="keyWords"
            >
              <el-input
                v-model="activity.keyWords"
                placeholder="关键字(逗号隔开)"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="封面" prop="cover">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="getAuthHeaders()"
            :show-file-list="false"
            :on-success="res => $set(activity, 'cover', res.url)"
          >
            <img
              v-if="activity.cover"
              :src="activity.cover"
              class="avatar"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item
          label="活动内容"
          prop="content"
        >
          <vue-editor
            v-model="activity.content"
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
          @click="confirmActivity"
        >确定</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { getInfo, createInfo, updateInfo, upload } from '@/api/public'
import { clearNullValue } from '@/utils'
import { getAuthHeaders } from '@/utils/auth'
import { VueEditor } from 'vue2-editor'

const defaultActivity = {
  name: '',
  cover: '',
  content: '',
  keyWords: '',
  categories: [],
  leader: '',
  participants: [],
  collectedUsers: [],
  status: true,
  time: '',
  address: ''
}

export default {
  components: {
    VueEditor
  },
  data() {
    return {
      activity: Object.assign({}, defaultActivity),
      categorityList: [],
      userList: [],
      dialogType: 'new',
      rules: {
        time: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入活动名称', trigger: ['blur', 'change'] }
        ],
        content: [
          { required: true, message: '请输入活动内容', trigger: ['blur', 'change'] }
        ],
        address: [
          { required: true, message: '请输入活动地址', trigger: ['blur', 'change'] }
        ],
        leader: [
          { required: true, message: '请输入发起人', trigger: ['blur', 'change'] }
        ],
        categories: [
          { required: true, message: '请选择所属分类', trigger: ['blur', 'change'] }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: ['blur', 'change'] }
        ],
        cover: [
          { required: true, message: '请上传活动封面', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
  },
  created() {
    this.activity = Object.assign(this.activity, this.$route.query.activity) || defaultActivity
    this.dialogType = this.$route.query.type
    this.categorityList = this.$route.query.categorityList
    this.dict()
  },
  methods: {
    getAuthHeaders,
    async dict() {
      let { data } = await getInfo('users')
      data = JSON.parse(JSON.stringify(data).replace(/_id/g, 'id'))
      this.userList = data
    },
    async confirmActivity() {
      this.$refs['activityForm'].validate(async(valid) => {
        if (valid) {
          const isEdit = this.$route.query.type === 'edit'
          const activity = Object.assign({}, this.activity)
          activity.keyWords = activity.keyWords.split('，')
          if (isEdit) {
            await updateInfo('activities', activity)
          } else {
            await createInfo('activities', clearNullValue(activity))
          }
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.activity = Object.assign({}, defaultActivity)
          this.$refs['activityForm'].resetFields()
          this.$router.push('/activity/index')
        } else {
          return false
        }
      })
    },
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData()
      formData.append('file', file)
      const res = await upload(formData)
      Editor.insertEmbed(cursorLocation, 'image', res.data.url)
      resetUploader()
    },
    handleUpload(res) {
      this.news.cover.push(res.url)
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader-icon,
.avatar {
  min-width: 12rem;
  height: 8rem;
  line-height: 8rem;
}
</style>
