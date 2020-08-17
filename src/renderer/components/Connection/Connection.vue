<template>

	<div class="wrapper">

		<a-row>
			<a-col :span="12">
				<span class="customSpan">{{connectionName}}</span>
				<!--				<span>{{connection.state}}</span>-->
				<a-tag v-if="connection.state === 'authenticated' || connection.state === 'connected'" color="#f50">已连接</a-tag>
				<a-tag v-if="connection.state === 'disconnected'" color="#f50">已断开</a-tag>
			</a-col>
			<a-col :span="12">
				<a-button style="float: right;margin-right: 10px" @click="connectToDB(config)" type="primary"
									:loading="connecting">连接{{connectionName}}财报数据
				</a-button>
				<a-button style="float: right;margin-right: 10px" @click="disconnect()" type="primary"
									:loading="disconnecting">
					断连{{connectionName}}财报数据
				</a-button>
			</a-col>
		</a-row>

		<div class="item">
			<a-input addon-before="主机地址" v-model="config.host"/>
		</div>
		<div class="item">
			<a-input addon-before="端口号" v-model="config.port"/>
		</div>
		<div class="item">
			<a-input addon-before="数据库" v-model="config.database"/>
		</div>
		<div class="item">
			<a-input addon-before="用户名" v-model="config.user"/>
		</div>
		<div class="item">
			<a-input addon-before="密码" v-model="config.password" type="password"/>
		</div>

		<a-divider></a-divider>
		<div class="item">
			<span>财报指标</span>
			<a-select style="width: 150px" @change="reportTypeChange" v-model="reportType">
				<a-select-option v-for="(type,index) in reportTypeData" :key="index">
					{{ type }}
				</a-select-option>
			</a-select>
			<a-select style="width: 250px" v-model="indicatorName">
				<a-select-option v-for="(name,index) in indicatorNames" :key="index">
					{{ name }}
				</a-select-option>
			</a-select>
		</div>

		<div class="item">
			<span>财报周期</span>
			<a-select style="width: 100px" v-model="year">
				<a-select-option :value="i" v-for="(i,n) in years">
					{{i}}
				</a-select-option>
			</a-select>
			<a-select style="width: 100px" v-model="season.value">
				<a-select-option :value="i.value" v-for="(i,n) in seasons">
					{{i.label}}
				</a-select-option>
			</a-select>
		</div>

		<div class="item">
			<span>财报数据</span>
			<a-input-number :min="0" :max="9999" :step="step" :disabled="disabled" v-model="indicatorData"/>
			<span>单位</span>
			<a-select default-value="亿" style="width: 100px" v-model="unit">
				<a-select-option value="亿">
					亿
				</a-select-option>
				<a-select-option value="万">
					万
				</a-select-option>
				<a-select-option value="%">
					%
				</a-select-option>
			</a-select>

		</div>

		<div class="item">
			<a-button @click="quickMatch()" type="primary" :loading="matching">开始匹配</a-button>
		</div>
		<div class="result">
			<ul>
				<li v-for="(value,index) in result">
					<a @click="gotoTHS(value.codeStr)">{{value.codeStr}} {{value.name}}</a>
				</li>
			</ul>

		</div>
	</div>

</template>

<script>


  const reportTypeData = ['主要指标', '资产负债表', '利润表', '现金流量表', '银行专项表']
  const indicatorNameData = [
    ['净利润(元)', '净利润同比增长率', '销售净利率', '净资产收益率', '扣非净利润同比增长率'],
    ['货币资金(元)', '资产总计(元)', '固定资产(元)'],
    ['经营活动产生的现金流量净额(元)', '投资支付的现金(元)'],
    ['利息收入(元)', '利息支出(元)', '投资收益(元)'],
    ['存款总额(元)', '贷款总额(元)', '不良贷款(元)', '不良贷款率']
  ];
  const marketTypes = [
    {label: '沪市', value: '0'},
    {label: '深市', value: '1'},
    // {label: '港股', value: '2'},
    // {label: '美国', value: '3'},
  ];

  const mysql = require('mysql');

  export default {
    name: "Connection",
    props: {
      config: {
        type: Object,
        required: true,
        default: () => {
          return {
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            database: '',
            password: 'rex123456'
          }
        }
      },
      connectionName: {
        type: String,
        required: true
      },
      // connection: {
      //   type: Object,
      //   required: true,
      //   default: () => {
      //     return {}
      //   }
      // }
    },
    data() {
      return {
        connection: {},
        connecting: false,
        disconnecting: false,
        matching: false,
        marketTypes: {},
        marketTypeValue: ['0', '1'],
        loading: false,
        result: [],
        disabled: false,
        step: 0.01,
        reportTypeData,
        indicatorNameData,
        reportType: reportTypeData[0],
        indicatorNames: indicatorNameData[0],
        indicatorName: indicatorNameData[0][0],
        indicatorData: 3.06,
        unit: '亿',
        year: '2018',
        years: ['2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'],
        season: {label: '年终报', value: '12-31'},
        seasons: [
          {label: '一季报', value: '03-31'},
          {label: '中季报', value: '06-30'},
          {label: '三季报', value: '09-30'},
          {label: '年终报', value: '12-31'},
        ],
      }
    },
    methods: {
      // 连接到数据库
      connectToDB(config) {
        if (this.connection.state === 'connected' || this.connection.state === '"authenticated"') {
          this.$message.info(`${this.connectionName}已经连接，不必手动连接`)
          return;
        }
        this.connecting = true;
        this.$message.info(`正在尝试连接${config.database}`)
        this.connection = {};
        let connection = mysql.createConnection(config);
        connection.connect(function (err) {
          if (err) {
            console.log(err);
            return err;
          }
        })
        console.log(connection);
        this.$message.success(`${this.connectionName}连接成功`)
        this.connecting = false;
        this.connection = connection;
        return connection;
      },
      // 让连接词 断开连接
      disconnect() {
        if (this.connection.state === 'disconnected') {
          this.$message.info(`${this.connectionName}已经断开，不必手动断开`)
          return;
        }
        this.disconnecting = true;

        this.connection.end((err, conn) => {
          if (err) {
            console.log(err);
            this.$message.error(`${this.connectionName}断开连接失败`)
            this.disconnecting = false
          }
          if (conn === undefined) {
            this.$message.success(`${this.connectionName}成功断开连接`)
            this.disconnecting = false
          }
        })

      },
      // 前往同花顺财报
      gotoTHS(code) {
        let link = `http://stockpage.10jqka.com.cn/${code}/finance/`
        this.$electron.shell.openExternal(link)
      },
      // 换选财报类型的时候
      reportTypeChange(value) {
        this.indicatorNames = this.indicatorNameData[value];
        this.indicatorName = this.indicatorNameData[value][0];
      },
      // 版块变化的时候
      onMarketTypeChange(checkedValues) {
        console.log('checked = ', checkedValues);
        console.log('value = ', this.marketTypeValue);
      },
      // 开始匹配
      quickMatch() {
        if (!this.connection) {
          this.connectToDB(this.config);
        }
        this.matching = true;
        this.$message.info('正在查询，请稍等');

        console.log('现在的连接是', this.connection.config.database);

        let tableName = 'main_indicators';
        if (this.reportType === 0) {
          tableName = 'main_indicators';
        } else if (this.reportType === 1) {
          tableName = 'balance_sheets'
        } else if (this.reportType === 2) {
          tableName = 'profit_statement'
        } else if (this.reportType === 3) {
          tableName = 'cash_flow_statement'
        } else if (this.reportType === 4) {
          tableName = 'bank_specific_indicators';
        }

        let sql = `select s.codeStr, s.name from ${tableName} report
            left join stocks s on s.codeStr = report.Code_Str
            where Indicator_Name = '${this.indicatorName}'
            and Indicator_Data like '${this.indicatorData}${this.unit.toString()}'
            and Report_Period = '${this.year}-${this.season.value}';`

        console.log(sql);

        this.connection.query(sql, '', (err, res) => {
          if (err) {
            console.log(err);
          }
          if (res.length === 0) {
            this.$message.info('无匹配结果');
          }
          this.matching = false;
          // console.log(this.res)
          // this.connection.end();
          this.result = res;
        })

      }
    },
    created() {
      this.connectToDB(this.config);
    }

  }
</script>

<style scoped>
	.wrapper {
		padding: 5px;
	}

	.item {
		display: flex;
		margin-bottom: 6px;
		padding: 5px;
		line-height: 32px;
	}

	.item span {
		font-size: 18px;
		font-family: "Microsoft YaHei";
		color: orangered;
		margin-left: 5px;
		margin-right: 5px;
	}

	.customSpan {
		font-size: 24px;
		font-family: "Microsoft YaHei";
		color: deepskyblue;
		margin-left: 5px;
		margin-right: 5px;
	}

	.ant-select {
		margin-left: 10px;
	}

	.ant-input-number {
		margin-left: 10px;
	}

	.ant-btn {
		margin-left: 10px;
	}

	.result {
		min-height: 250px;
		border: 1px groove blanchedalmond;
		padding-top: 5px;
		padding-left: 5px;
	}
</style>
