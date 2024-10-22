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

         
           <el-form-item label="Product" prop="product" style="text-align: left;">
            <el-select v-model="orderForm.product" placeholder="Select a product" >
              <el-option label="43129-4571" value="43129-4571"></el-option>
              <el-option label="43129-4632" value="43129-4632"></el-option>
              <el-option label="CENTER BEARING FROM B-0415" value="CENTER BEARING FROM B-0415"></el-option>
            </el-select>
          </el-form-item>

          
          <el-form-item>
            <el-button type="primary" @click="submitOrder('orderForm')">Submit Orders</el-button>
            <el-button @click="resetOrder('orderForm')">Reset</el-button>
          </el-form-item>
        </el-form>

        <!-- Table Section -->
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column prop="proformaInvoiceNum" label="proformaInvoiceNum" width="100"></el-table-column>
          <el-table-column prop="factoryOrderNumber" label="factoryOrderNumber"></el-table-column>
          <el-table-column prop="productModel" label="productModel"></el-table-column>
          <el-table-column prop="unitPriceRMB" label="unitPriceRMB"></el-table-column>
          <el-table-column prop="amountRMB" label="amountRMB"></el-table-column>
          <el-table-column prop="factoryQuantity" label="factoryQuantity"></el-table-column>
          <el-table-column prop="unitPriceUSD" label="unitPriceUSD"></el-table-column>
          <el-table-column prop="amountUSD" label="amountUSD"></el-table-column>
          <el-table-column prop="invoiceQuantity" label="invoiceQuantity" ></el-table-column>
          <el-table-column prop="proformaInvoiceDate" label="proformaInvoiceDate" ></el-table-column>
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
        proformaInvoiceNum: '123',
        startDate: '',
        endDate: '',
        product: 'test',
        quantity: 1,
        address: '',
      },
      tableData: [],
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

    fetchProductList() {
      console.log('fetchProductList ' );
      axios
        .get('http://localhost:8092/proformalInvoice/findProductModels') // Adjust the endpoint to match your server's API
        .then((response) => {
          this.productList = response.data; // Assuming the response returns a list of products
        })
        .catch((error) => {
          console.error('Error fetching product list:', error);
        });
    },

    submitOrder(formName) {

      console.log('submitOrder ' );
       console.log('productModel in form ' + this.orderForm.product);
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
 
        let productModel = this.orderForm.product;
        console.log('productModel ' + productModel);
        axiosAPI.get(`http://localhost:8092/proformalInvoice/findProformaInvoiceByProductModel/${productModel}`)
                .then(response => {
                  this.tableData = response.data;

                  this.tableData.forEach(item => {
                    console.log('Proforma Invoice Num:', item.proformaInvoiceNum);
                    console.log('Product Model:', item.productModel);
                    console.log('Unit Price USD:', item.unitPriceUsd);
                    console.log('Amount USD:', item.amountUsd);
                    console.log('Quantity:', item.quantity);
                    console.log('Invoice Date:', item.proformaInvoiceDate);
                    // Add more fields as necessary based on the structure of your DTO
                  });
                

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
