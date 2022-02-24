<template>
  <div class="stock-pending-container">
    <!-- <h1>兑换记录</h1> -->
    <el-form :inline="true" :model="recordData" label-width="95px">
      <el-form-item label="流水状态：">
        <div style="display: flex">
          <el-select
            v-model="recordData.status"
            placeholder="请选择"
            @change="stateChange"
          >
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dataExcel">数量导出</el-button>
        <el-button type="primary" @click="exportAll">历史导出</el-button>
        <el-dialog
          title="数量导出"
          :visible.sync="dialogDataExcelVisible"
          v-if="dialogDataExcelVisible"
        >
          <div>
            <el-table :data="exportList" style="width: 100%" border>
              <el-table-column prop="name" label="商品名称"> </el-table-column>
              <el-table-column prop="number" label="已发货数量">
              </el-table-column>
              <el-table-column prop="number2" label="导出数量" width="150px">
                <template slot-scope="scope">
                  <div>
                    <el-input
                      v-model="scope.row.number2"
                      placeholder="请输入导出数量"
                    ></el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <div>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="dataExcelSure(scope.row)"
                      >导出</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div></div>
        </el-dialog>
        <el-dialog
          title="商品卡密"
          :visible.sync="dialogMemoVisible"
          id="kami"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <div>
            <div v-html="exportStr"></div>
          </div>
          <div
            slot="footer"
            style="padding: 0 20px;display: flex;justify-content: space-between;"
          >
            <div>
              <el-button
                type="primary"
                class="tag-read"
                :data-clipboard-text="copyStr"
                @click="copyBankAccount"
              >
                复制卡密</el-button
              >
            </div>
            <div>
              <el-button @click="dialogMemoVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogMemoVisible = false"
                >确 定</el-button
              >
            </div>
          </div>
        </el-dialog>
      </el-form-item>
    </el-form>
    <div>
      <el-table
        :data="recordList"
        border
        style="width: 95%;"
        v-loading="loading"
        @row-click="handleDetails"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <!-- 名称，价格，状态，卡密 -->
        <el-table-column prop="equityName" label="商品名称"> </el-table-column>
        <el-table-column prop="memo" label="卡密" width="330">
          <template slot-scope="scope">
            <div style="display: flex;">
              <span>{{ b64DecodeUnicode(scope.row.memo) }}</span>
              <p
                v-if="scope.row.memo"
                style="margin: 0;margin-left: 10px;cursor: pointer;color: #0aa1ed;"
                class="tag-read"
                :data-clipboard-text="b64DecodeUnicode(scope.row.memo)"
                @click="copyBankAccount"
              >
                复制
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="timeStamp" label="交易时间">
          <template slot-scope="scope">
            <div>
              <span>{{ shellDate(scope.row.timeStamp) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="流水状态" width="180">
          <template slot-scope="scope">
            <div>
              <span
                :style="{
                  color:
                    scope.row.status == 2
                      ? 'green'
                      : scope.row.status == 4
                      ? 'red'
                      : '#666',
                }"
                >{{
                  scope.row.status == 0
                    ? "创建"
                    : scope.row.status == 1
                    ? "接单"
                    : scope.row.status == 2
                    ? "已发货"
                    : scope.row.status == 3
                    ? "已确认收货"
                    : "缺货"
                }}</span
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="width: 100%; height: 50px">
        <div style="margin: 15px 0; position: absolute; right: 6%">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="page"
            layout="total, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
      <el-dialog
        title="兑换单详情"
        v-if="dialogRecordDetailsVisible"
        :visible.sync="dialogRecordDetailsVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :append-to-body="false"
        id="invenSome"
      >
        <div style="margin-bottom: 30px;">
          <p class="font-title-style" style="margin-top: 0">兑换单信息</p>
          <div class="font-div">
            <div class="div-one">
              <div class="one-left">商品ID</div>
              <div class="one-right">
                {{ recordDetails.equityId }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">受益用户</div>
              <div class="one-right">
                {{ recordDetails.userId }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">商品名称</div>
              <div class="one-right">
                {{ recordDetails.equityName }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">兑换单ID</div>
              <div class="one-right">
                {{ recordDetails.id }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">发起兑换的租户ID</div>
              <div class="one-right">
                {{ recordDetails.optTenantId }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">业务交易ID</div>
              <div class="one-right">
                {{ recordDetails.outBizId }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">商品归属租户ID</div>
              <div class="one-right">
                {{ recordDetails.tenantId }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">资产ID</div>
              <div class="one-right">
                {{ recordDetails.assetId }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">资产汇率</div>
              <div class="one-right">
                {{ recordDetails.assetRate }}
              </div>
            </div>
            <!-- <div class="div-one">
              <div class="one-left">当前块高</div>
              <div class="one-right">
                {{ recordDetails.blockNumber }}
              </div>
            </div> -->
            <div class="div-one">
              <div class="one-left">是否收取手续费</div>
              <div class="one-right">
                {{ recordDetails.commissionCharged == 0 ? "不收取" : "收取" }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">手续费ID</div>
              <div class="one-right">
                {{ recordDetails.commissionId }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">手续费率</div>
              <div class="one-right">
                {{ recordDetails.commissionRate }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">手续费状态</div>
              <div class="one-right">
                {{ recordDetails.commissionStatus == 0 ? "未提现" : "已提现" }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">手续费子ID</div>
              <div class="one-right">
                {{ recordDetails.commissionSubId }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">收取手续费的租户id</div>
              <div class="one-right">
                {{ recordDetails.commissionTenantId }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">资产消耗数量</div>
              <div class="one-right">
                {{ recordDetails.deductAssetAmount }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">资产手续费扣减数量/个</div>
              <div class="one-right">
                {{ recordDetails.deductAssetCommission }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">扣减授信额</div>
              <div class="one-right">
                {{ recordDetails.deductCreditAmount }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">手续费扣减商户备付金授信额/元</div>
              <div class="one-right">
                {{ recordDetails.deductCreditCommission }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">扣减余额</div>
              <div class="one-right">
                {{ recordDetails.deductDebitAmount }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">手续费扣减商户备付金余额/元</div>
              <div class="one-right">
                {{ recordDetails.deductDebitCommission }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">备付⾦扣减租户id</div>
              <div class="one-right">
                {{ recordDetails.deductTenantId }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">手续费/元</div>
              <div class="one-right">
                {{ recordDetails.instructionCommission }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">兑换单状态</div>
              <div class="one-right">
                {{
                  recordDetails.status == 0
                    ? "创建"
                    : recordDetails.status == 1
                    ? "接单"
                    : recordDetails.status == 2
                    ? "发货"
                    : recordDetails.status == 3
                    ? "确认收货"
                    : "缺货"
                }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">交易时间</div>
              <div class="one-right">
                {{ shellDate(recordDetails.timeStamp) }}
              </div>
            </div>
          </div>
          <p class="font-title-style">卡密信息</p>
          <div style="display: flex">
            卡密：{{
              recordDetails.memo ? b64DecodeUnicode(recordDetails.memo) : "暂无"
            }}
            <p
              v-if="recordDetails.memo"
              style="margin: 0;margin-left: 10px;cursor: pointer;color: #0aa1ed;"
              class="tag-read"
              :data-clipboard-text="b64DecodeUnicode(recordDetails.memo)"
              @click="copyBankAccount"
            >
              复制
            </p>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Clipboard from "clipboard";
export default {
  data() {
    return {
      recordData: {
        status: -1,
      },
      statusList: [
        {
          id: -1,
          name: "全部",
        },
        {
          id: 0,
          name: "创建",
        },
        {
          id: 1,
          name: "接单",
        },
        {
          id: 2,
          name: "已发货",
        },
        {
          id: 3,
          name: "已确认收货",
        },
        {
          id: 4,
          name: "缺货",
        },
      ],
      page: 1,
      total: 0,
      recordList: [],
      dialogRecordDetailsVisible: false,
      recordDetails: {},
      loading: true,
      dialogDataExcelVisible: false,
      exportList: [],
      excelDetails: {},
      exportStr: "",
      copyStr: "",
      dialogMemoVisible: false,
      // loading: true,
    };
  },
  created() {
    this.getIinstructions();
  },
  methods: {
    // 导出表格
    dataExcel() {
      this.getExportList();
      this.dialogDataExcelVisible = true;
    },
    // 确定导出
    dataExcelSure(data) {
      console.log(data);
      this.exportStr = "";
      this.copyStr = "";
      this.excelDetails = data;
      if (!this.excelDetails.number2 || this.excelDetails.number2 == "") {
        this.$message.error({
          message: "请输入导出数量",
          showClose: true,
          duration: 2000,
        });
      } else {
        if (this.excelDetails.number2 > this.excelDetails.number) {
          this.$message.error({
            message: "导出数量不能大于已发货数量",
            showClose: true,
            duration: 2000,
          });
        } else {
          console.log("发送请求");
          this.dialogDataExcelVisible = false;
          this.loading = true;
          this.$axios
            .post(this.$store.state.baseUrl + "/baas/export", {
              name: this.excelDetails.name,
              number: Number(this.excelDetails.number2),
            })
            .then((res) => {
              if (res.data.code < 500) {
                console.log("导出商品卡密");
                console.log(res);
                this.loading = false;
                let list = res.data.data;
                this.copyStr = "兑换时间,商品名称,卡密\r\n";
                for (const item of list) {
                  this.exportStr +=
                    this.shellDate(item.timeStamp) +
                    "&nbsp;&nbsp;&nbsp;&nbsp;" +
                    item.name +
                    "&nbsp;&nbsp;&nbsp;&nbsp;" +
                    this.b64DecodeUnicode(item.memo) +
                    "<br>";
                  this.copyStr +=
                    this.shellDate(item.timeStamp) +
                    "," +
                    item.name +
                    "," +
                    this.b64DecodeUnicode(item.memo) +
                    "\r\n";
                }
                this.dialogMemoVisible = true;

                //定义文件内容，类型必须为Blob 否则createObjectURL会报错
                // let content = new Blob([this.copyStr]);
                //生成url对象
                // let urlObject = window.URL || window.webkitURL || window;
                // let url = urlObject.createObjectURL(content);
                let url =
                  "data:text/csv;charset=utf-8,\ufeff" +
                  encodeURIComponent(this.copyStr);
                //生成<a></a>DOM元素
                let el = document.createElement("a");
                //链接赋值
                el.href = url;
                el.download = "商品卡密" + ".csv";
                //必须点击否则不会下载
                el.click();
                //移除链接释放资源
                // urlObject.revokeObjectURL(url);

                // setTimeout(() => {
                //   this.getIinstructions();
                // }, 5000);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    },
    // 全部导出
    exportAll() {
      this.loading = true;
      this.exportStr = "";
      this.copyStr = "";
      this.$axios
        .post(this.$store.state.baseUrl + "/baas/exportOld")
        .then((res) => {
          if (res.data.code < 500) {
            console.log("导出商品卡密");
            console.log(res);
            this.loading = false;
            let list = res.data.data;
            this.copyStr = "兑换时间,商品名称,卡密\r\n";
            for (const item of list) {
              this.exportStr +=
                this.shellDate(item.timeStamp) +
                "&nbsp;&nbsp;&nbsp;&nbsp;" +
                item.name +
                "&nbsp;&nbsp;&nbsp;&nbsp;" +
                this.b64DecodeUnicode(item.memo) +
                "<br>";
              this.copyStr +=
                this.shellDate(item.timeStamp) +
                "," +
                item.name +
                "," +
                this.b64DecodeUnicode(item.memo) +
                "\r\n";
            }
            this.dialogMemoVisible = true;

            //定义文件内容，类型必须为Blob 否则createObjectURL会报错
            // let content = new Blob([this.copyStr]);
            //生成url对象
            // let urlObject = window.URL || window.webkitURL || window;
            // let url = urlObject.createObjectURL(content);
            let url =
              "data:text/csv;charset=utf-8,\ufeff" +
              encodeURIComponent(this.copyStr);
            //生成<a></a>DOM元素
            let el = document.createElement("a");
            //链接赋值
            el.href = url;
            el.download = "商品卡密" + ".csv";
            //必须点击否则不会下载
            el.click();
            //移除链接释放资源
            // urlObject.revokeObjectURL(url);

            // setTimeout(() => {
            //   this.getIinstructions();
            // }, 5000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取可导出数据列表
    getExportList() {
      this.exportList = [];
      this.$axios
        .get(this.$store.state.baseUrl + "/baas/exportList")
        .then((res) => {
          if (res.data.code < 500) {
            console.log("可导出列表");
            console.log(res);
            this.exportList = res.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 复制卡密
    copyBankAccount() {
      let clipboard = new Clipboard(".tag-read");
      clipboard.on("success", (e) => {
        this.$message.success({
          message: "复制成功",
          showClose: true,
          duration: 2000,
        });
        console.log("复制成功", e);
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        // 不支持复制
        this.$message.error({
          message: "复制失败，该浏览器不支持自动复制",
          showClose: true,
          duration: 2000,
        });
        console.log("该浏览器不支持自动复制", e);
        // 释放内存
        clipboard.destroy();
      });
    },
    b64DecodeUnicode(str) {
      console.log(str);
      if (str !== "" && str !== undefined) {
        let code = decodeURIComponent(
          atob(str)
            .split("")
            .map(function(c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
        console.log(code.split(":"));
        code = code
          .split(":")[1]
          .replace(/"/g, "")
          .replace(/}/g, "");
        return code;
      } else {
        return "";
      }
    },
    // 查看详情
    handleDetails(row, column, e) {
      console.log(row);
      console.log(e);
      if (column.label !== "流水状态" && column.label !== "卡密") {
        this.recordDetails = row;
        this.dialogRecordDetailsVisible = true;
      }
    },
    // 状态改变
    stateChange() {
      this.page = 1;
      this.getIinstructions();
    },
    // 获取兑换单列表
    getIinstructions() {
      this.loading = true;
      this.$axios
        .get(this.$store.state.baseUrl + "/baas/instructions", {
          params: {
            pageNumber: this.page,
            status:
              this.recordData.status == -1 ? null : this.recordData.status,
          },
        })
        .then((res) => {
          console.log("兑换单列表");
          console.log(res);
          this.loading = false;
          if (res.data.code < 500) {
            this.recordList = res.data.data.list;
            this.total = res.data.data.totalCount;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.getIinstructions();
      (function smoothscroll() {
        let currentScroll =
          document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
          window.requestAnimationFrame(smoothscroll);
          window.scrollTo(0, currentScroll - currentScroll / 5);
        }
      })();
    },
  },
};
</script>

<style lang="scss" scoped>
.stock-pending-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;
  text-align: left;

  .font-title-style {
    margin-top: 20px;
    margin-bottom: 10px;
    color: #6a6a6a;
    font-size: 18px;
    font-weight: bold;
    text-align: left;
  }

  .font-div {
    border: 1px solid #ccc;
    border-bottom: none;

    .div-one {
      // height: 34px;
      display: flex;
      line-height: 34px;
      border-bottom: 1px solid #ccc;

      .one-left {
        width: 280px;
        border-right: 1px solid #ccc;
        text-align: center;
        background-color: #f2f2f2;
      }

      .one-right {
        width: 373px;
        padding-left: 10px;
      }

      .qrcodeClick {
        width: 100px;
        height: 34px;
        float: right;
        line-height: 34px;
        background-color: #3d82fe;
        color: #fff;
        font-size: 13px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
}
</style>
<style lang="scss">
#invenSome {
  .el-dialog__body {
    height: 600px;
    margin-top: 20px;
    overflow: auto;
    padding: 0 20px;
  }
}

#kami {
  .el-dialog__body {
    max-height: 600px;
    margin-top: 20px;
    overflow: auto;
    padding: 0 20px;
  }
}
</style>
