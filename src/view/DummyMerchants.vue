<template>
 
  <div id="app">
    <h1>Simple Element UI Example</h1>
    
    <!-- 标签部分 -->
    <el-tag type="success">标签 1</el-tag>
    <el-tag type="info">标签 2</el-tag>
    <el-tag type="warning">标签 3</el-tag>
    <el-tag type="danger">标签 4</el-tag>

    <!-- 按钮部分 -->
    <div style="margin-top: 20px;">
      <el-button type="primary" @click="handleClick">Primary Button</el-button>
      <el-button @click="handleClick">Default Button</el-button>
      <el-button type="success" @click="handleClick">Success Button</el-button>
      <el-button type="info" @click="handleClick">Info Button</el-button>
      <el-button type="warning" @click="handleClick">Warning Button</el-button>
      <el-button type="danger" @click="handleClick">Danger Button</el-button>
    </div>
  </div>
</template>

<script>



export default {
  name: 'DummyMerchants',
  methods: {
    handleClick() {
      this.$message({
        message: 'Button clicked!',
        type: 'success'
      });
    }
  }
};


</script>
<style >
#app {
  padding: 20px;
}
</style>
