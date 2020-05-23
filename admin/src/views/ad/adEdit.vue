<template>
  <el-card class="box-card">
    <div
      slot="header"
      class="clearfix"
    >
      <el-page-header
        :content="dialogType==='edit'?'编辑广告位':'新建广告位'"
        @back="$router.back(-1)"
      />
    </div>
    <div class="text item">
      <el-form
        ref="adForm"
        :model="ad"
        :rules="rules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item
          label="名称"
          prop="name"
        >
          <el-input
            v-model="ad.name"
            placeholder="名称"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            style="marginBottom: 10px"
            @click="handleAddInfo"
          >
            <i class="el-icon-plus" />添加广告位
          </el-button>
          <el-row
            type="flex"
            style="flex-wrap:wrap"
            :gutter="20"
          >
            <el-col
              v-for="(item, i) in ad.items"
              :key="i"
              :md="12"
            >
              <el-input v-model="item.url" placeholder="跳转链接" style="marginTop: .5rem">
                <template slot="prepend">Http://</template>
              </el-input>
              <el-form-item>
                <el-upload
                  style="marginTop: 1rem"
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :headers="getAuthHeaders()"
                  :show-file-list="false"
                  :on-success="res => $set(item, 'image', res.url)"
                >
                  <img
                    v-if="item.image"
                    :src="item.image"
                    class="avatar"
                  >
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
              </el-form-item>
              <el-button
                size="small"
                type="danger"
                style="marginBottom: 2rem; marginTop: .5rem "
                @click="ad.items.splice(i, 1)"
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
          @click="handleConfirm"
        >确定</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { createInfo, updateInfo } from '@/api/public'
import { clearNullValue } from '@/utils'
import { getAuthHeaders } from '@/utils/auth'

const defaultAd = {
  name: '',
  items: []
}

export default {
  data() {
    return {
      ad: defaultAd,
      userList: [],
      dialogType: 'new',
      rules: {
        name: [
          { required: true, message: '请输入广告位名称', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
  },
  created() {
    this.ad = Object.assign(this.ad, this.$route.query.ad) || defaultAd
    this.dialogType = this.$route.query.type
  },
  methods: {
    getAuthHeaders,
    async handleConfirm() {
      this.$refs['adForm'].validate(async(valid) => {
        if (valid) {
          const isEdit = this.$route.query.type === 'edit'
          if (isEdit) {
            await updateInfo('ads', this.ad)
          } else {
            await createInfo('ads', clearNullValue(this.ad))
          }
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$router.push('/ad/index')
        } else {
          return false
        }
        this.$refs['adForm'].resetFields()
        this.ad.items = []
      })
    },
    handleAddInfo() {
      this.ad.items.push({})
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader-icon,
.avatar {
  min-width: 20rem;
  height: 12rem;
  line-height: 12rem;
}
</style>
