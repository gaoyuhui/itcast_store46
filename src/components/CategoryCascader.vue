<template>
    <el-cascader
      expand-trigger="hover"
      :options="options"
      :props="{
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      }"
      @change="handleChange"
      :change-on-select="true"
      v-model="selectedOptions">
    </el-cascader>
</template>

<script>
export default {
  data () {
    return {
      options: [],
      selectedOptions: []
    }
  },
  props: ['type'],
  async created () {
    const res = await this.$http.get(`/categories`, {
      params: {
        type: this.type
      }
    })
    this.options = res.data.data
  },
  methods: {
    async handleChange () {
      this.$emit('gaibianle', this.selectedOptions)
    }
  }
}
</script>

<style>

</style>
