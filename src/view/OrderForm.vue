<template>
  <el-container style="height: 100vh;">
        <!-- Header -->
    <el-header style="background-color: #409EFF; color: white; text-align: center;">
      <h2>Export Application</h2>
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
       <el-main>
        <!-- Form Section -->
        <el-form ref="orderForm" :model="orderForm" label-width="100px" style="margin-bottom: 20px;">
          <el-form-item label="Name" prop="customerName">
            <el-input v-model="orderForm.name" placeholder="Enter your name"></el-input>
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="orderForm.email"></el-input>
          </el-form-item>
           <el-form-item label="Product" prop="product">
            <el-select v-model="orderForm.product" placeholder="Select a product">
              <el-option label="Product A" value="productA"></el-option>
              <el-option label="Product B" value="productB"></el-option>
              <el-option label="Product C" value="productC"></el-option>
            </el-select>
          </el-form-item>
         <el-form-item label="Quantity" prop="quantity">
            <el-input-number v-model="orderForm.quantity" :min="1"></el-input-number>
          </el-form-item>
          
          <el-form-item label="Address" prop="address">
            <el-input v-model="orderForm.address" type="textarea" placeholder="Enter your address"></el-input>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="submitOrder('orderForm')">Submit Orders</el-button>
            <el-button @click="resetOrder('orderForm')">Reset</el-button>
          </el-form-item>
        </el-form>

        <!-- Table Section -->
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column prop="name" label="Name" width="180"></el-table-column>
          <el-table-column prop="email" label="Email"></el-table-column>
          <el-table-column prop="date" label="Date" width="180"></el-table-column>
        </el-table>
      </el-main>
      <!-- Body Content -->

    </el-container>

    <!-- Footer -->
    <el-footer style="background-color: #f2f2f2; text-align: center;">
      &copy; 2024 My Application
    </el-footer>
  </el-container>
  
</template>

<script>

import axiosAPI from 'axios'
export default {
  name: 'OrderForm',
  data() {
    return {
      orderForm: {
        name: '',
        email: '',
        product: '',
        quantity: 1,
        address: '',
      },
      tableData: [
        { name: 'John Doe', email: 'john@example.com', date: '2024-09-09' },
        { name: 'Jane Roe', email: 'jane@example.com', date: '2024-09-08' },
        { name: 'Richard Roe', email: 'richard@example.com', date: '2024-09-07' }
      ]
      ,
      rules: {
        customerName: [
          { required: true, message: 'Please input the customer name', trigger: 'blur' }
        ],
        product: [
          { required: true, message: 'Please select a product', trigger: 'change' }
        ],
        quantity: [
          { required: true, message: 'Please input the quantity', trigger: 'change' },
          { type: 'number', min: 1, message: 'Quantity must be at least 1', trigger: 'change' }
        ],
        address: [
          { required: true, message: 'Please input the address', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitOrder(formName) {
      let searchData = {
          
        }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            message: 'Order submitted successfully!',
            type: 'success'
          });
        } else {
          console.log('Order submission failed!');
          return false;
        }

        axiosAPI.get('http://localhost:8092/proformalInvoice',searchData)
                .then(response => {
                  const dataVal = response.data;
                  console.log("dataval " + dataVal.merchantAddress);
                }).catch( error => {
                  console.error(error)
                });
        this.$message({
            message: 'call axios after',
            type: 'success'
          });
      });
    },
    resetOrder(formName) {
      this.$refs[formName].resetFields();
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
