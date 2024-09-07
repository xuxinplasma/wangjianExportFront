<template>
  <div class="withdraw">
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
</template>
<script>
  import { LOADING_SET, LOADING_CHANGE } from '../../store/loading-server'
  import {
    Button,
    Col,
    DatePicker,
    Dialog,
    Form,
    FormItem,
    Input,
    Option,
    Radio,
    RadioGroup,
    Row,
    Select,
    Table,
    TableColumn,
    Tag
  } from 'element-ui'
  import SearchCoins from '../../component/search/search-coins.vue'
  import SearchMerchants from '../../component/search/search-merchants.vue'
  import Paging from '../../component/paging/index.vue'

  export default {
    name: 'withdraw',
    data() {
      return {
        loading: false, // 加载状态
        date: '', // 日期对象
        searchData: {
          beginTime: '',
          endTime: '',
          status: '',
          coinId: '',
          merchantId: '',
          txHash: '',
          fromAddress: '',
          toAddress: '',
          offset: 1,
          limit: 10,
        }, // 查询对象
        settlementInfo: {}, // 提现订单统计对象
        total: 0, // 提现订单总条数
        tableData: [], // 提现订单列表
        dialog: false, // 弹窗显示状态
        formData: {
          id: '',
          orderNo: '',
          auditStatus: 1,
        }, // 审核对象
        formRules: {
          auditStatus: [
            { required: true, message: '请选择审核结果', trigger: 'change' }
          ],
        }, // 审核验证对象
      }
    },
    computed: {
      useEdit() {
        return this.$store.state.user.permissions.includes('admin:withdraworder:edit');
      }, // 是否有编辑权限
      loadingServer() {
        return this.$store.state.loadingServer;
      }, // 按钮级loading对象
    },
    created() {
      this.$store.dispatch(LOADING_SET, { names: 'audit' });
      this.getData();
    },
    methods: {
      search() {
        this.searchData.offset = 1;
        this.getData();
      }, // 搜索
      getData() {
        this.loading = true;
        let [beginTime, endTime] = this.date || ['', ''];
        let searchData = Object.assign({}, this.searchData, { beginTime, endTime, offset: this.searchData.offset - 1 });
        Promise.all([this.$axios.get('admin/withdrawOrderes/stat', searchData), this.$axios.get('admin/withdrawOrderes', searchData)]).then(response => {
          ([{ data: this.settlementInfo }, { data: { data: this.tableData, recordsTotal: this.total } }] = response);
          this.loading = false;
        });
      }, // 查询提现订单列表
      openAudit({ id, orderNo } = {}) {
        this.formData = { id, orderNo, auditStatus: 1 };
        this.dialog = true;
      }, // 打开审核弹窗
      audit() {
        let { id, auditStatus } = this.formData;
        this.$store.dispatch(LOADING_CHANGE, { audit: true });
        this.$axios.put(`admin/withdrawOrderes/${id}/${auditStatus}`).then(() => {
          this.$message({
            message: '审核成功', onClose: () => {
              this.getData();
              this.dialog = false;
              this.$store.dispatch(LOADING_CHANGE, { audit: false });
            }
          });
        });
      }, // 订单审核
    },
    components: {
      ElButton: Button,
      ElCol: Col,
      ElDatePicker: DatePicker,
      ElDialog: Dialog,
      ElForm: Form,
      ElFormItem: FormItem,
      ElInput: Input,
      ElOption: Option,
      ElRadio: Radio,
      ElRadioGroup: RadioGroup,
      ElRow: Row,
      ElSelect: Select,
      ElTable: Table,
      ElTableColumn: TableColumn,
      ElTag: Tag,
      SearchCoins,
      SearchMerchants,
      Paging,
    },
  }
</script>
<style lang="scss" scoped>
  .withdraw {
  }
</style>
