<template>
	<div id="components-layout-demo-basic">
		<a-layout>

			<a-layout-header>
				<div class="logo">
					<img id="logo" src="~@/assets/logo.png" alt="electron-vue">
				</div>
			</a-layout-header>

			<a-layout-content>
				<a-row>
					<a-col :span="12" :push="0">
						<!--						<system-information></system-information>-->
						<connection :connectionName="'上海'" :config="config0"></connection>
					</a-col>
					<a-col :span="12" :pull="0">
						<connection :connectionName="'深圳'" :config="config1"></connection>
					</a-col>
				</a-row>
			</a-layout-content>

			<a-layout-footer>

			</a-layout-footer>

		</a-layout>
	</div>


</template>

<script>
  import SystemInformation from '../SystemInformation/SystemInformation'
  import Connection from "../Connection/Connection";
  import {mapMutations} from 'vuex'
  import {mapActions} from 'vuex'

  export default {
    name: 'home',
    props: {},
    components: {
      Connection,
      SystemInformation
    },
    data() {
      return {
        config0: {
          host: '127.0.0.1',
          user: 'root',
          password: 'rex123456',
          database: 'sh_finance',
          port: 3306
        },
        config1: {
          host: '127.0.0.1',
          user: 'root',
          password: 'rex123456',
          database: 'sz_finance',
          port: 3306
        },
      }
    },
    methods: {
      add(payload) {
        console.log(payload);
        console.log('count in store:', this.$store.state.count);
      },
      actAddition() {
        console.log('提交dispatch之后', this.$store.state.count);
      }
    },
    // 映射 改变行为
    ...mapMutations(['add']),
    // 映射 提交行为
    ...mapActions({
      actAddition: 'actionB'
    }),
    created() {
      this.$message.config({
        duration: 3
      })
      // 执行请求，暂存
      this.add({
        msg: 'page not found!',
        code: 404
      })
      // 提交请求
      this.actAddition();
    }
  }
</script>

<style lang="css">
	@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

	* {
		box-sizing: border-box;
		/*margin: 0;*/
		/*padding: 0;*/
	}

	body {
		font-family: 'Source Sans Pro', sans-serif;
		height: 100%;
		width: 100%;
	}

	#components-layout-demo-basic {
		background: radial-gradient(
						ellipse at top left,
						rgba(255, 255, 255, 1) 40%,
						rgba(229, 229, 229, .9) 100%
		);
		height: inherit;
		width: inherit;
		padding: 3px;
	}

	#components-layout-demo-basic .ant-layout {
		height: 100%;
	}

	#components-layout-demo-basic .ant-layout-header,
	#components-layout-demo-basic .ant-layout-footer {
		background: #7dbcea;
		color: #fff;
	}

	#components-layout-demo-basic .ant-layout-header {
		height: 10%;
		padding: 5px;
	}

	#components-layout-demo-basic .ant-layout-content {
		height: 85%;
		padding: 5px;
		overflow-y: scroll;
	}

	#components-layout-demo-basic .ant-layout-content::-webkit-scrollbar {
		width: 5px;
		/*display: none;*/
		background-color: deepskyblue;
	}

	#components-layout-demo-basic .ant-layout-footer {
		line-height: 1.0;
		height: 5%;
		padding: 5px;
	}

	#logo {
		height: auto;
		margin-bottom: 20px;
		width: 420px;
	}

	.logo {
		text-align: center;
	}

	main {
		height: auto;
	}

	a-row {
		height: inherit;
	}

	.result ul li {
		font-size: 18px;
		padding: 3px;
	}

	.result ul {
		padding-left: 50px;
	}

</style>
