<template>
  <div class="withdraw">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">eslint</a></li>
    </ul>

  
    <el-form :model="searchData" :inline="true" size="mini" labelWidth="75px" labelPosition="left"
             @keydown.enter.stop.native="!loading && search()" class="search-form">
      <el-row>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="提币时间" class="date-editor">
            <el-date-picker v-model="date" type="daterange" value-format="yyyy-MM-dd" range-separator="-"
                            start-placeholder="开始日期" end-placeholder="结束日期" @change="search('date')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="提币状态">
            <el-select v-model="searchData.status" placeholder="请选择提币状态" @change="search">
              <el-option value="" label="全部"></el-option>
              <el-option value="0" label="待商家审核"></el-option>
              <el-option value="1" label="待平台审核"></el-option>
              <el-option value="2" label="待节点确认"></el-option>
              <el-option value="3" label="节点已确认"></el-option>
              <el-option value="4" label="提现成功"></el-option>
              <el-option value="5" label="审核拒绝"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <search-coins v-model="searchData.coinId" @change="search"></search-coins>
        <search-merchants v-model="searchData.merchantId" @change="search"></search-merchants>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="交易hash">
            <el-input v-model="searchData.txHash" :maxlength="256" placeholder="请输入交易hash"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="转帐地址">
            <el-input v-model="searchData.fromAddress" :maxlength="256" placeholder="请输入转帐地址"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="收账地址">
            <el-input v-model="searchData.toAddress" :maxlength="256" placeholder="请输入收账地址">
              <el-button slot="append" @click.stop="search()" icon="el-icon-search" class="query-button"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-loading="loading" class="table-content">
      <div class="table-operate table-operate-tag clearfix">
        <el-tag v-for="item in settlementInfo" :key="item.coinCode">{{item.coinCode}}：{{item.amount | moneyFormat}}</el-tag>
      </div>
      <el-table :data="tableData" :border="true">
        <el-table-column prop="orderNo" fixed="left" align="center" label="订单号" minWidth="150"></el-table-column>
        <el-table-column prop="merchantName" fixed="left" align="center" label="商家名称" minWidth="150"></el-table-column>
        <el-table-column fixed="left" align="center" label="提币金额" minWidth="150">
          <template slot-scope="scope">
            <span>{{scope.row.amount | moneyFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="coinCode" fixed="left" align="center" label="币种" minWidth="150"></el-table-column>
        <el-table-column align="center" label="提币状态" minWidth="100">
          <template slot-scope="scope">
            <el-tag :type="['warning', 'warning', 'warning', '', 'success', 'danger'][scope.row.status]">
              {{['待商家审核', '待平台审核 ', '待节点确认', '节点已确认', '提现成功', '审核拒绝'][scope.row.status]}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="memo" align="center" label="提币备注" minWidth="200"></el-table-column>
        <el-table-column align="center" label="交易手续费" minWidth="150">
          <template slot-scope="scope">
            <span>{{scope.row.charge | moneyFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="链上矿工费" minWidth="150">
          <template slot-scope="scope">
            <span>{{scope.row.fee | moneyFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="交易类型" minWidth="120">
          <template slot-scope="scope">
            <el-tag>{{['用户提现', '商家后台提现', '总后台提现'][scope.row.tradeType]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="confirmNum" align="center" label="交易已确认的块数" minWidth="150"></el-table-column>
        <el-table-column prop="fromAddress" align="center" label="转帐地址" minWidth="200"></el-table-column>
        <el-table-column prop="toAddress" align="center" label="收账地址" minWidth="200"></el-table-column>
        <el-table-column prop="txHash" align="center" label="交易hash" minWidth="300"></el-table-column>
        <el-table-column prop="callbackNum" align="center" label="回调次数" minWidth="100"></el-table-column>
        <el-table-column align="center" label="回调结果" minWidth="80">
          <template slot-scope="scope">
            <el-tag v-if="![null, undefined].includes(scope.row.callbackResult)"
                    :type="['danger', 'success'][scope.row.callbackResult]">
              {{['失败', '成功'][scope.row.callbackResult]}}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="callbackTime" align="center" label="最后回调时间" minWidth="100"></el-table-column>
        <el-table-column prop="createTime" align="center" label="提币时间" minWidth="100"></el-table-column>
        <el-table-column prop="updateTime" align="center" label="更新时间" minWidth="100"></el-table-column>
        <el-table-column v-if="useEdit" fixed="right" align="center" label="操作" minWidth="80">
          <template slot-scope="scope">
            <a v-if="[1, 5].includes(scope.row.status)" href="javascript:void(0);"
               @click.stop="openAudit(scope.row)">审核</a>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
      <paging :pageNo.sync="searchData.offset" :pageSize.sync="searchData.limit" :total="total"
              @change="getData"></paging>
    </div>
    <el-dialog v-if="useEdit" :visible.sync="dialog" title="订单审核" top="30vh" width="500px">
      <el-form :model="formData" :rules="formRules" size="small" ref="formRef" labelWidth="95px"
               @keydown.enter.stop.native="!loadingServer.audit && audit()">
        <el-form-item prop="orderNo" label="订单号：" class="is-required">
          <span v-text="formData.orderNo"></span>
        </el-form-item>
        <el-form-item prop="auditStatus" label="审核结果：">
          <el-radio-group v-model="formData.auditStatus">
            <el-radio :label="1">成功</el-radio>
            <el-radio :label="0">失败</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="loadingServer.audit" @click.stop="audit()">保 存</el-button>
        <el-button type="danger" size="small" @click.stop="dialog = false">取 消</el-button>
      </div>
    </el-dialog>



  </div>
  <!--<el-col v-if="useQuery" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
    <el-form-item label="商家名称">
      <el-select v-model="merchantId" filterable placeholder="请选择商家名称" @change="change">
        <el-option value="" label="全部"></el-option>
        <el-option v-for="item in merchants" :key="item.id" :value="item.id" :label="item.name"></el-option>
      </el-select>
    </el-form-item>
  </el-col>-->
</template>

<script>
export default {
  name: 'SearchMerchants',

}


</script>
<style lang="scss" scoped>
</style>
