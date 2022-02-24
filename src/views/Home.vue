<template>
  <div class="home-container" id="home-container">
    <el-container ref="homePage">
      <el-header height="78px">
        <div class="main-top-right">
          <div class="left-con">
            <p class="left-font-one">兑换平台</p>
            <div style="display: flex;">
              <p class="update" @click="pswUpdate">修改密码</p>
              <el-dialog
                class="uuupdate"
                title="修改密码"
                :visible.sync="pswDialogVisible"
                :append-to-body="true"
                :close-on-press-escape="false"
                :close-on-click-modal="false"
              >
                <div style="width:100%;display:flex;">
                  <p class="font">旧密码：</p>
                  <input
                    class="update-nick"
                    type="text"
                    v-model="oldPsw"
                    placeholder="请输入旧密码"
                  />
                </div>
                <div style="width:100%;margin-top:15px;display:flex;">
                  <p class="font">新密码：</p>
                  <input
                    class="update-nick"
                    type="text"
                    v-model="newPsw"
                    placeholder="请输入新密码"
                  />
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button
                    @click="pswDialogVisible = false"
                    style="margin-left: 35%;"
                    >取 消</el-button
                  >
                  <el-button type="primary" @click="updatePsw" v-preventClick
                    >确 定</el-button
                  >
                </span>
              </el-dialog>
              <div class="log-out">
                <img
                  src="../assets/imgs/logOut.png"
                  style="width: 20px;height:20px;"
                  title="退出登录"
                  @click="logOut"
                />
              </div>
            </div>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="218px">
          <ul class="aside-ul-dad">
            <li class="dad-li">
              <ul class="aside-ul-son">
                <li
                  class="son-li"
                  @click="checkedPage01"
                  :style="{
                    backgroundColor:
                      pageSelect == 1 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 1"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 1 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/11.png"
                      />
                    </div>
                    <p class="center-font">商品查询</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
                <li
                  class="son-li"
                  style="margin-top: 30px;"
                  @click="checkedPage02"
                  :style="{
                    backgroundColor:
                      pageSelect == 2 ? '#303e53' : 'transparent',
                  }"
                >
                  <p class="son-li-line" v-if="pageSelect == 2"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: pageSelect == 2 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../assets/imgs/home/01.png"
                      />
                    </div>
                    <p class="center-font">状态查询</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </el-aside>
        <el-main class="home-container-main">
          <!-- 商品查询 -->
          <PurchaseAdmin v-if="pageSelect == 1"></PurchaseAdmin>
          <!-- 兑换查询 -->
          <ConversionRecord v-if="pageSelect == 2"></ConversionRecord>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import md5 from "js-md5";
import PurchaseAdmin from "@/components/Purchase-admin";
import ConversionRecord from "@/components/Conversion-record";

export default {
  name: "Home",
  components: {
    ConversionRecord,
    PurchaseAdmin,
  },
  data() {
    return {
      pageSelect: 1,
      clientHeight: "",
      oldPsw: "",
      newPsw: "",
      pswDialogVisible: false,
    };
  },
  created() {
    this.checkedPage01();
  },
  mounted() {
    this.clientHeight = document.documentElement.clientHeight;
    this.$refs.homePage.$el.style.height = this.clientHeight + "px";
    window.onresize = () => {
      this.clientHeight = document.documentElement.clientHeight;
      this.$refs.homePage.$el.style.height = this.clientHeight + "px";
    };
  },
  methods: {
    // 修改密码
    pswUpdate() {
      this.oldPsw = "";
      this.newPsw = "";
      this.pswDialogVisible = true;
    },
    // 确定修改
    updatePsw() {
      console.log(sessionStorage.getItem("token"));
      console.log(sessionStorage.getItem("userName"));
      console.log(this.oldPsw, this.newPsw);
      this.pswDialogVisible = false;
      this.$axios
        .post(this.$store.state.baseUrl + "/user/password", {
          loginName: sessionStorage.getItem("userName"),
          password1: md5(this.oldPsw),
          password2: md5(this.newPsw),
        })
        .then((res) => {
          console.log(res);
          if (res.data.code < 500) {
            this.$message.success({
              message: "密码修改成功",
              showClose: true,
              duration: 2000,
            });
            sessionStorage.setItem("token", res.data.data);
          }
          console.log(sessionStorage.getItem("token"));
        });
    },
    // 退出登录
    logOut() {
      this.$router.push("/");
      this.$store.dispatch("setToken", null);
    },
    // 商品查询
    checkedPage01() {
      this.pageSelect = 1;

      this.backTop();
    },
    // 待入库
    checkedPage02() {
      this.pageSelect = 2;

      this.backTop();
    },

    // 页面回到顶部
    backTop() {
      let timer = null;
      cancelAnimationFrame(timer);
      timer = requestAnimationFrame(function fn() {
        var oTop =
          document.body.scrollTop || document.documentElement.scrollTop;
        if (oTop > 0) {
          document.body.scrollTop = document.documentElement.scrollTop =
            oTop - 100;
          timer = requestAnimationFrame(fn);
        } else {
          cancelAnimationFrame(timer);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
ul li {
  list-style: none;
  text-align: left;
  cursor: pointer;
}

ul li a {
  text-decoration: none;
}

.font {
  width: 57px;
  margin: 0;
  margin-right: 10px;
  font-size: 14px;
  line-height: 40px;
}

.update-nick {
  width: 390px;
  height: 38px;
  line-height: 38px;
  padding: 0;
  padding-left: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
  outline: none;
}

.home-container {
  height: 100%;
  position: relative;

  .main-top-right {
    width: 100%;
    height: 78px;
    position: relative;

    .left-con {
      position: absolute;
      left: 40px;
      right: 100px;
      display: flex;
      justify-content: space-between;

      .left-font-one {
        margin: 0;
        line-height: 78px;
        font-size: 25px;
        font-weight: 600;
        color: #fff;
      }

      .update {
        margin: 0;
        line-height: 78px;
        font-size: 16px;
        font-weight: 500;
        color: #fff;
        cursor: pointer;
      }

      .log-out {
        margin-left: 20px;
        line-height: 78px;
        padding-top: 4px;
        cursor: pointer;
      }
    }
  }

  .aside-ul-dad {
    padding: 30px 0 30px 10px;
    // padding-top: 0;
    margin: 0;
    color: #fff;

    p {
      margin: 0;
    }

    .dad-li {
      margin-top: 30px;

      .dad-li-font {
        font-size: 12px;
        color: #6f84a8;
      }

      .aside-ul-son {
        padding: 20px 0 0 0;

        .son-li {
          height: 56px;
          line-height: 56px;
          padding-right: 20px;
          display: flex;
          justify-content: space-between;

          .son-li-line {
            width: 4px;
            height: 56px;
            background-color: #3d81fd;
          }

          .son-li-center {
            display: flex;

            .center-img-div {
              padding-top: 3px;
              margin-right: 10px;

              .center-img {
                width: 18px;
                height: 18px;
              }
            }

            .center-font {
              font-size: 14px;
              color: #b7bdc6;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
#home-container {
  .el-form-item__label {
    font-size: 16px;
    color: #000;
  }

  .el-button.is-disabled {
    cursor: auto;
  }

  .el-header {
    position: relative;
    width: 100%;
    height: 78px;
    padding: 0;
    background-color: #26303c;
  }

  .el-aside {
    position: absolute;
    left: 0;
    top: 78px;
    bottom: 0;
    // min-height: 859px;
    background-color: #202732;
  }

  .el-aside::-webkit-scrollbar {
    width: 0;
  }

  .el-main {
    position: absolute;
    left: 218px;
    right: 0;
    top: 78px;
    bottom: 0;
    overflow-y: scroll;

    padding: 20px;
    background-color: #ececec;
  }

  .el-pagination__editor.el-input .el-input__inner {
    height: 28px;
  }

  .el-input__inner {
    height: 40px;
  }
}

.el-dialog {
  width: 550px;
  border-radius: 10px !important;
}

.el-dialog__header {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: #3d82fe;
}

.el-dialog__title {
  color: #fff;
  font-weight: bold;
}

.el-dialog__headerbtn {
  font-size: 18px;
}

.el-dialog__headerbtn .el-dialog__close {
  color: #fff;
}

.el-dialog__headerbtn .el-dialog__close:hover {
  color: #000;
}

[class*=" el-icon-"],
[class^="el-icon-"] {
  font-weight: bolder;
}

.el-dialog__body {
  text-align: left;
}

.el-dialog__footer {
  padding: 10px 20px 30px 0;
  text-align: right;
}

.el-button + .el-button {
  margin-left: 30px;
}

.el-scrollbar__wrap {
  overflow: auto;
  height: 100%;
  margin-bottom: 0 !important;
}

.el-cascader-node__postfix {
  position: absolute;
  right: 22px !important;
}

.el-table--border:after,
.el-table--group:after,
.el-table:before {
  background-color: #ccc;
}

.el-table--border,
.el-table--group {
  border-color: #ccc;
}

.el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid #ccc;
}

.el-table--border th,
.el-table--border th.gutter:last-of-type {
  border-bottom: 1px solid #ccc;
}

.el-table--border td,
.el-table--border th {
  border-right: 1px solid #ccc;
}

.el-table th {
  background-color: #f2f2f2;
}

.el-table {
  color: #666;
}

.el-table thead {
  color: #666;
}

.el-button--primary {
  color: #fff;
  background-color: #3d81fd;
  border-color: #3d81fd;
}

.el-drawer__header {
  text-align: left;
}

.el-drawer__header > :first-child {
  flex: 1;
  outline: 0;
}

.el-table__body,
.el-table__footer,
.el-table__header {
  width: 100% !important;
}

.el-table--border::after,
.el-table--group::after {
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
}

.el-drawer {
  overflow: scroll;
}
</style>
