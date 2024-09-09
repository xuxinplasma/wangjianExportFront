<template>
  <el-container style="height: 100vh;">
    <!-- Header -->
    <el-header style="background-color: #409EFF; color: white; text-align: center;">
      <h2>My Application</h2>
    </el-header>

    <el-container>
      <!-- Left Side Menu -->
      <el-aside width="200px" style="background-color: #f2f2f2;">
        <el-menu default-active="1">
          <el-menu-item index="1">Home</el-menu-item>
          <el-menu-item index="2">About</el-menu-item>
          <el-menu-item index="3">Contact</el-menu-item>
        </el-menu>
      </el-aside>

      <!-- Body Content -->
      <el-main>
        <!-- Form Section -->
        <el-form :model="formData" label-width="100px" style="margin-bottom: 20px;">
          <el-form-item label="Name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="Email">
            <el-input v-model="formData.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">Submit</el-button>
          </el-form-item>
        </el-form>

        <!-- Table Section -->
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column prop="name" label="Name" width="180"></el-table-column>
          <el-table-column prop="email" label="Email"></el-table-column>
          <el-table-column prop="date" label="Date" width="180"></el-table-column>
        </el-table>
      </el-main>
    </el-container>

    <!-- Footer -->
    <el-footer style="background-color: #f2f2f2; text-align: center;">
      &copy; 2024 My Application
    </el-footer>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: '',
        email: ''
      },
      tableData: [
        { name: 'John Doe', email: 'john@example.com', date: '2024-09-09' },
        { name: 'Jane Roe', email: 'jane@example.com', date: '2024-09-08' },
        { name: 'Richard Roe', email: 'richard@example.com', date: '2024-09-07' }
      ]
    };
  },
  methods: {
    submitForm() {
      if (this.formData.name && this.formData.email) {
        this.tableData.push({
          name: this.formData.name,
          email: this.formData.email,
          date: new Date().toISOString().split('T')[0]
        });
        this.formData.name = '';
        this.formData.email = '';
      } else {
        this.$message.error('Please fill out both fields.');
      }
    }
  }
};
</script>

<style scoped>
/* Style for the layout */
.el-header {
  height: 60px;
  line-height: 60px;
}

.el-aside {
  padding: 20px;
}

.el-footer {
  height: 40px;
  line-height: 40px;
}

.el-main {
  padding: 20px;
}

h2 {
  margin: 0;
}

/* Style for form and table */
.el-form {
  max-width: 500px;
  margin: 0 auto;
}

.el-table {
  margin-top: 20px;
}
</style>
