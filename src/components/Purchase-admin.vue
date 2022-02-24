<template>
  <div class="purchase-admin-container" id="stock-inquiry">
    <!-- <h1>库存管理</h1> -->
    <el-table
      :data="stockList"
      border
      style="width: 95%;"
      @row-click="getRowDetail"
      :row-key="getRowKeys"
    >
      <el-table-column prop="equityName" label="权益名称"> </el-table-column>
      <el-table-column prop="equityPrice" label="权益价格"> </el-table-column>
      <el-table-column prop="stockTotal" label="累计库存"> </el-table-column>
      <el-table-column :label="'累计金额' + '（ 合计：' + total + ' ）'">
        <template slot-scope="scope">
          <div>
            {{ scope.row.stockTotal * scope.row.equityPrice }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="当前库存">
        <template slot-scope="scope">
          <div style="font-weight: bold;">
            {{ scope.row.stock }}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="'当前余额' + '（ 合计：' + nowTotal + ' ）'">
        <template slot-scope="scope">
          <div>
            {{ scope.row.stock * scope.row.equityPrice }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250px" align="center">
        <template slot-scope="scope">
          <div>
            <el-button
              v-if="scope.row.id > 7"
              type="text"
              @click="addStock(scope.row.id)"
              >增加库存</el-button
            >
            <el-button
              v-if="scope.row.id > 7"
              type="text"
              @click="forGoods(scope.row)"
              >获取卡密</el-button
            >
            <el-dialog
              title="增加库存"
              :visible.sync="dialogStockAddVisible"
              :close-on-press-escape="false"
              :close-on-click-modal="false"
              :modal-append-to-body="false"
              :append-to-body="false"
              id="goods"
            >
              <el-form
                ref="stockAddForm"
                :model="addModel"
                :rules="addRules"
                label-width="75px"
              >
                <el-form-item label="数量：" prop="addNum">
                  <el-input
                    v-model="addModel.addNum"
                    style="width: 350px;"
                  ></el-input>
                </el-form-item>
                <el-form-item style="text-align: right;">
                  <el-button @click="dialogStockAddVisible = false"
                    >取 消</el-button
                  >
                  <el-button
                    type="primary"
                    @click="addStockSure('stockAddForm')"
                    >确 定</el-button
                  >
                </el-form-item>
              </el-form>
            </el-dialog>
            <el-dialog
              title="权益信息"
              v-if="dialogProductDetailVisible"
              :visible.sync="dialogProductDetailVisible"
              :close-on-press-escape="false"
              :close-on-click-modal="false"
              :modal-append-to-body="false"
              :append-to-body="false"
            >
              <div id="invenSome" style="margin-bottom: 30px;">
                <p class="font-title-style" style="margin-top: 0;">权益信息</p>
                <div class="font-div">
                  <div class="div-one">
                    <div class="one-left">
                      权益ID
                    </div>
                    <div class="one-right">
                      {{ productDetails.equityId }}
                    </div>
                  </div>
                  <div class="div-one">
                    <div class="one-left">
                      权益管理员ID
                    </div>
                    <div class="one-right">
                      {{ productDetails.adminId }}
                    </div>
                  </div>
                  <div class="div-one">
                    <div class="one-left">
                      租户ID
                    </div>
                    <div class="one-right">
                      {{ productDetails.tenantId }}
                    </div>
                  </div>
                  <div class="div-one">
                    <div class="one-left">
                      权益名称
                    </div>
                    <div class="one-right">
                      {{ productDetails.equityName }}
                    </div>
                  </div>
                  <div class="div-one">
                    <div class="one-left">
                      权益状态
                    </div>
                    <div class="one-right">
                      {{
                        productDetails.status == 0
                          ? "可用"
                          : productDetails.status == 1
                          ? "下线"
                          : "冻结"
                      }}
                    </div>
                  </div>
                  <div class="div-one">
                    <div class="one-left">
                      权益库存
                    </div>
                    <div class="one-right">
                      {{ productDetails.totalCount }}
                    </div>
                  </div>
                  <div class="div-one">
                    <div class="one-left">
                      权益面值
                    </div>
                    <div class="one-right">
                      {{ productDetails.value }}
                    </div>
                  </div>
                  <div class="div-one">
                    <div class="one-left">
                      权益授权类型
                    </div>
                    <div class="one-right">
                      {{ productDetails.authType == 0 ? "自动" : "合约" }}
                    </div>
                  </div>
                  <div class="div-one">
                    <div class="one-left">
                      权益锚定币种
                    </div>
                    <div class="one-right">
                      {{ productDetails.currency }}
                    </div>
                  </div>
                  <div class="div-one">
                    <div class="one-left">
                      权益默认价格
                    </div>
                    <div class="one-right">
                      {{ productDetails.defaultPrice }}
                    </div>
                  </div>
                  <div class="div-one">
                    <div class="one-left">
                      商品类型
                    </div>
                    <div class="one-right">
                      {{
                        productDetails.equityType == 0
                          ? "积分"
                          : productDetails.equityType == 1
                          ? "卡券"
                          : "实物"
                      }}
                    </div>
                  </div>
                  <div class="div-one">
                    <div class="one-left">
                      是否为公开权益
                    </div>
                    <div class="one-right">
                      {{ productDetails.isPublic == true ? "是" : "否" }}
                    </div>
                  </div>
                  <div class="div-one">
                    <div class="one-left">
                      商户每日兑换上限
                    </div>
                    <div class="one-right">
                      {{ productDetails.limitPerMerchantAndDay }}
                    </div>
                  </div>
                  <div class="div-one">
                    <div class="one-left">
                      商户每月兑换上限
                    </div>
                    <div class="one-right">
                      {{ productDetails.limitPerMerchantAndMonth }}
                    </div>
                  </div>
                  <div class="div-one">
                    <div class="one-left">
                      用户每日兑换上限
                    </div>
                    <div class="one-right">
                      {{ productDetails.limitPerUserAndDay }}
                    </div>
                  </div>
                  <div class="div-one">
                    <div class="one-left">
                      用户每月兑换上限
                    </div>
                    <div class="one-right">
                      {{ productDetails.limitPerUserAndMonth }}
                    </div>
                  </div>
                  <div class="div-one">
                    <div class="one-left">
                      权益使用有效期左闭区间
                    </div>
                    <div class="one-right">
                      {{ shellDate(productDetails.useValidNotBefore) }}
                    </div>
                  </div>
                  <div class="div-one">
                    <div class="one-left">
                      权益使用有效期右闭区间
                    </div>
                    <div class="one-right">
                      {{ shellDate(productDetails.useValidNotAfter) }}
                    </div>
                  </div>
                  <div class="div-one">
                    <div class="one-left">
                      权益兑换有效期左闭区间
                    </div>
                    <div class="one-right">
                      {{ shellDate(productDetails.validNotBefore) }}
                    </div>
                  </div>
                  <div class="div-one">
                    <div class="one-left">
                      权益兑换有效期右闭区间
                    </div>
                    <div class="one-right">
                      {{ shellDate(productDetails.validNotAfter) }}
                    </div>
                  </div>
                  <div class="div-one">
                    <div class="one-left">
                      是否计算手续费
                    </div>
                    <div class="one-right">
                      {{
                        productDetails.commissionAccepted == 0
                          ? "更新手续费版本前不再合约计算手续费"
                          : "在合约计算手续费"
                      }}
                    </div>
                  </div>
                  <div class="div-one">
                    <div class="one-left">
                      附言
                    </div>
                    <div class="one-right">
                      {{ productDetails.memo }}
                    </div>
                  </div>
                </div>
              </div>
            </el-dialog>
            <el-dialog
              title="添加用户名"
              :visible.sync="dialogAddUserVisible"
              id="add"
            >
              <el-form>
                <el-form-item label="用户名：">
                  <el-input v-model="userName" style="width: 350px;"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer">
                <el-button @click="dialogAddUserVisible = false"
                  >取 消</el-button
                >
                <el-button type="primary" @click="addUserSure">确 定</el-button>
              </div>
            </el-dialog>
            <el-dialog
              title="获取卡密"
              :visible.sync="dialogGoodsVisible"
              id="duihaun"
            >
              <div style="text-align: left;">
                <el-form
                  inline
                  ref="conversionForm"
                  :model="conversionData"
                  :rules="conversionRules"
                  label-width="110px"
                >
                  <el-form-item label="兑换数量：" prop="number">
                    <el-input
                      v-model="conversionData.number"
                      style="width: 350px;"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div slot="footer">
                <el-button @click="dialogGoodsVisible = false">取 消</el-button>
                <el-button
                  type="primary"
                  @click="forGoodsSure('conversionForm')"
                  >确 定</el-button
                >
              </div>
            </el-dialog>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    let checkNum = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("数量不能为空"));
      } else if (value < 0 || value.indexOf(".") !== -1) {
        callback(new Error("请输入正整数值"));
      } else {
        callback();
      }
    };
    return {
      stockList: [],
      addId: 0,
      dialogStockAddVisible: false,
      addModel: {
        addNum: "",
      },
      addRules: {
        addNum: [{ validator: checkNum, required: true, trigger: "blur" }],
      },
      total: 0,
      nowTotal: 0,
      conversionData: {
        localId: "",
        number: "",
      },
      conversionRules: {
        number: [{ validator: checkNum, required: true, trigger: "blur" }],
      },

      productDetails: {},
      dialogProductDetailVisible: false,

      dialogAddUserVisible: false,
      userName: "",
      equityId: "",

      dialogGoodsVisible: false,
      quanyiPrice: 0,
      memoNumber: 0,
    };
  },
  created() {
    this.getStockList();
    this.getUserName();
  },
  methods: {
    // 兑换商品
    forGoods(val) {
      console.log("传的ID");
      console.log(val);
      this.equityId = val.equityId;
      this.quanyiPrice = val.equityPrice;
      this.memoNumber = val.stock;
      if (
        this.conversionData.localId == "" ||
        this.conversionData.localId == null ||
        this.conversionData.localId == undefined
      ) {
        this.$message.error({
          message: "请添加用户名",
          showClose: true,
          duration: 2000,
        });
        this.userName = "";
        this.dialogAddUserVisible = true;
      } else {
        this.conversionData.number = "";
        this.dialogGoodsVisible = true;
      }
    },
    // 确定
    forGoodsSure(formName) {
      console.log(this.equityId);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.conversionData.number > this.memoNumber) {
            this.$message.error({
              message: "兑换数量不能大于当前库存",
              showClose: true,
              duration: 2000,
            });
          } else {
            this.dialogGoodsVisible = false;
            this.$axios
              .post(this.$store.state.baseUrl + "/baas/exchange", {
                equityId: this.equityId,
                localId: this.conversionData.localId,
                equityPrice: this.quanyiPrice,
                number: Number(this.conversionData.number),
              })
              .then((res) => {
                console.log("兑换商品");
                console.log(res);
                if (res.data.code < 500) {
                  this.$message.success({
                    message: "获取卡密成功",
                    showClose: true,
                    duration: 2000,
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 查看商品信息
    getRowDetail(row, column, e) {
      console.log("22222222");
      console.log(row);
      console.log(column);
      console.log(e);
      if (column !== undefined) {
        if (column.label !== "操作") {
          this.equityId = row.equityId;
          this.getEquityMsg();
        }
      }
    },
    getRowKeys(row) {
      return row.id;
    },
    // 获取商品信息
    getEquityMsg() {
      this.$axios
        .get(this.$store.state.baseUrl + "/baas/equity/" + this.equityId)
        .then((res) => {
          console.log("商品信息");
          console.log(res);
          if (res.data.code < 500) {
            this.productDetails = res.data.data;
            this.dialogProductDetailVisible = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 确定新增用户
    addUserSure() {
      this.dialogAddUserVisible = false;
      this.$axios
        .post(this.$store.state.baseUrl + "/baas/createUser", {
          localId: this.userName,
        })
        .then((res) => {
          console.log("新增用户");
          console.log(res);
          if (res.data.code < 500) {
            this.$message.success({
              message: "添加成功",
              showClose: true,
              duration: 2000,
            });
            this.getUserName();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取用户名
    getUserName() {
      this.conversionData.localId = "";
      this.$axios
        .get(this.$store.state.baseUrl + "/baas/localId")
        .then((res) => {
          console.log("用户名");
          console.log(res);
          if (res.data.code < 500) {
            this.conversionData.localId = res.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 增加库存
    addStock(id) {
      this.addId = id;
      this.addModel.addNum = "";
      this.dialogStockAddVisible = true;
    },
    // 确定增加
    addStockSure(formName) {
      console.log("000000000");
      console.log(this.$refs[formName]);
      this.$refs[formName].validate((valid) => {
        console.log("99999999999");
        if (valid) {
          this.dialogStockAddVisible = false;
          this.$axios
            .post(this.$store.state.baseUrl + "/baas/stockAdd", {
              id: this.addId,
              add: Number(this.addModel.addNum),
            })
            .then((res) => {
              console.log("增加库存");
              console.log(res);
              if (res.data.code < 500) {
                this.$message.success({
                  message: "增加成功",
                  showClose: true,
                  duration: 2000,
                });
                this.getStockList();
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 获取库存列表
    getStockList() {
      this.stockList = [];
      this.total = 0;
      this.nowTotal = 0;
      this.$axios
        .get(this.$store.state.baseUrl + "/baas/stockList")
        .then((res) => {
          console.log("库存列表");
          console.log(res);
          if (res.data.code < 500) {
            this.stockList = res.data.data;
            for (const item of this.stockList) {
              this.total += item.stockTotal * item.equityPrice;
              this.nowTotal += item.stock * item.equityPrice;
            }
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.purchase-admin-container {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;

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
        width: 230px;
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
#stock-inquiry {
  .el-dialog__body {
    height: 700px;
    margin-top: 20px;
    overflow: auto;
    padding: 0 20px;
  }

  #set {
    .el-dialog__body {
      height: 140px;
      margin-top: 20px;
      overflow: auto;
      padding: 0 20px;
    }

    .el-form-item__content {
      display: flex;
    }
  }

  #add {
    .el-dialog__body {
      height: 80px;
      margin-top: 20px;
      overflow: auto;
      padding: 0 20px;
    }
  }

  #goods {
    .el-dialog__body {
      height: 135px;
      margin-top: 20px;
      overflow: auto;
      padding: 0 20px;
    }
  }

  #duihaun {
    .el-dialog__body {
      height: 80px;
      margin-top: 20px;
      overflow: auto;
      padding: 0 20px;
    }
  }
}
</style>
