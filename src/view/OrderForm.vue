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
          <el-menu-item index="2">ProformaInvoice</el-menu-item>
          <el-menu-item index="3">PurchaseOrder</el-menu-item>
        </el-menu>
      </el-aside>
       <el-main>
        <!-- Form Section -->
        <el-form ref="orderForm" :model="orderForm" label-width="200px" style="margin-bottom: 20px;">
          <el-form-item label="ProformaInvoiceNum" prop="proformaInvoiceNum">
            <el-input v-model="orderForm.proformaInvoiceNum" placeholder="Enter your ProformaInvoiceNum" style="text-align: left;"></el-input>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="StartDate" prop="startDate" style="text-align: left;">
                <el-date-picker 
                v-model="orderForm.startDate" 
                type="date" 
                placeholder="Select Start Date" 
                style="width: 100%;">
              </el-date-picker>
              </el-form-item>
            </el-col>
            
            <el-col :span="12">
              <el-form-item label="EndDate" prop="endDate" style="text-align: left;">
                <el-date-picker 
                v-model="orderForm.startDate" 
                type="date" 
                placeholder="Select Start Date" 
                style="width: 100%;">
              </el-date-picker>
              </el-form-item>
            </el-col>
        </el-row>
           <el-form-item label="Product" prop="product" style="text-align: left;">
            <el-select v-model="orderForm.product" placeholder="Select a product" >
              <el-option label="Product A" value="productA"></el-option>
              <el-option label="Product B" value="productB"></el-option>
              <el-option label="Product C" value="productC"></el-option>
            </el-select>
          </el-form-item>
         <el-form-item label="Quantity" prop="quantity" style="text-align: left;">
            <el-input-number v-model="orderForm.quantity" :min="1"></el-input-number>
          </el-form-item>
          
          <el-form-item label="Address" prop="address" style="text-align: left;">
            <el-input v-model="orderForm.address" type="textarea" placeholder="Enter your address"></el-input>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="submitOrder('orderForm')">Submit Orders</el-button>
            <el-button @click="resetOrder('orderForm')">Reset</el-button>
          </el-form-item>
        </el-form>

        <!-- Table Section -->
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column prop="proformaInvoiceNum" label="proformaInvoiceNum" width="100"></el-table-column>
          <el-table-column prop="shippingMethod" label="shippingMethod"></el-table-column>
          <el-table-column prop="paymentMethod" label="paymentMethod"></el-table-column>
          <el-table-column prop="importMerchant" label="importMerchant"></el-table-column>
          <el-table-column prop="broker" label="出口代理商"></el-table-column>
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
        proformaInvoiceNum: '',
        startDate: '',
        endDate: '',
        product: '',
        quantity: 1,
        address: '',
      },
      tableData: [
        { proformaInvoiceNum: '22W-012', broker: 'ZEC IMPORT AND EXPORT', importMerchant: 'QUALITY GEAR INC.', shippingMethod: 'By Sea', paymentMethod: 'CIF', date: '2024-09-09' },
        { proformaInvoiceNum: '22W-013', broker: 'ZEC IMPORT AND EXPORT', importMerchant: 'QUALITY GEAR INC.',shippingMethod: 'By Sea', paymentMethod: 'CIF', date: '2024-09-08' },
        { proformaInvoiceNum: '22W-014', broker: 'ZEC IMPORT AND EXPORT', importMerchant: 'QUALITY GEAR INC.',shippingMethod: 'By Sea', paymentMethod: 'CIF', date: '2024-09-07' }
      ]
      ,
      rules: {
        proformaInvoiceNum: [
          { required: true, message: 'Please input the proformaInvoiceNum', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: 'Please input the startDate', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: 'Please input the endDate', trigger: 'blur' }
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
  max-width: 600px;
  margin: 7 auto;
}

.el-table {
  margin-top: 20px;
}
</style>
