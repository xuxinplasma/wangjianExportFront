<template>
  <div id="order-form">
    <el-form ref="orderForm" :model="orderForm" :rules="rules" label-width="100px">
      <el-form-item label="Customer Name" prop="customerName">
        <el-input v-model="orderForm.customerName" placeholder="Enter your name"></el-input>
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
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="Date" width="180"></el-table-column>
      <el-table-column prop="name" label="Name" width="180"></el-table-column>
      <el-table-column prop="address" label="Address"></el-table-column>
    </el-table>
  </div>
  
</template>

<script>

import axiosAPI from 'axios'
export default {
  name: 'OrderForm',
  data() {
    return {
      orderForm: {
        customerName: '',
        product: '',
        quantity: 1,
        address: '',
      },
      tableData: [
        {
          date: '2024-09-07',
          name: 'John Doe',
          address: '123 Main St.'
        },
        {
          date: '2024-09-08',
          name: 'Jane Doe',
          address: '456 Elm St.'
        },
        {
          date: '2024-09-09',
          name: 'Sam Smith',
          address: '789 Oak St.'
        }
      ],
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
#order-form {
  width: 400px;
  margin: 50px auto;
}

.el-form-item {
  margin-bottom: 20px;
}
</style>
