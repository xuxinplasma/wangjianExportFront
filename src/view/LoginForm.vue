<template>
  <div class="login-page">
    <!-- Header with a picture -->
    <header class="login-header">
      <!--<img src="@/assets/header-logo.png" alt="Header Logo" class="header-image" />-->
    </header>

    <!-- Main login form section -->
    <div class="login-container">
      <form @submit.prevent="login">
        <h2>Login</h2>
        <div class="form-group">
          <label for="userId">User ID</label>
          <input
            type="text"
            v-model="userId"
            id="userId"
            placeholder="Enter your User ID"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            v-model="password"
            id="password"
            placeholder="Enter your Password"
            required
          />
        </div>
        <div class="form-group">
          <button type="submit">Login</button>
        </div>
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      </form>
    </div>

    <!-- Footer Section -->
    <footer class="login-footer">
      <p>&copy; 2024 MyCompany. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'LoginForm',
  data() {
    return {
      userId: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async login() {
      if (!this.userId || !this.password) {
        this.errorMessage = "Please fill in both fields.";
        return;
      }
      try {
        const response = await axios.post("http://localhost:8092/api/login", {
          userId: this.userId,
          password: this.password,
        });
        console.log(response.data);
      } catch (error) {
        this.errorMessage = "Login failed. Please try again.";
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-header {
  text-align: center;
  margin-top: 20px;
}

.login-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

form {
  max-width: 400px;
  width: 100%;
  padding: 30px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

button[type="submit"] {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}

.login-footer {
  text-align: center;
  padding: 15px;
  background-color: #f1f1f1;
  width: 100%;
}
</style>
