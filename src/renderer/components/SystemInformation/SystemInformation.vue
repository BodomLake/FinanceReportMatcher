<template>
	<div class="system-info">
		<!--        <div class="title">Information:
								<a-button type="primary" @click="open('https://simulatedgreg.gitbooks.io/electron-vue/content/')">
										Read the Docs
								</a-button>
						</div>-->
		<h1 style="text-align: center">平台&&程序信息</h1>
		<div class="items">

			<div class="item">
				<div class="name">Path:</div>
				<div class="value">{{ path }}</div>
			</div>
			<div class="item">
				<div class="name">Route Name:</div>
				<div class="value">{{ name }}</div>
			</div>
			<div class="item">
				<div class="name">Vue.js:</div>
				<div class="value">{{ vue }}</div>
			</div>
			<div class="item">
				<div class="name">Electron:</div>
				<div class="value">{{ electron }}</div>
			</div>
			<div class="item">
				<div class="name">Node:</div>
				<div class="value">{{ node }}</div>
			</div>
			<div class="item">
				<div class="name">Platform:</div>
				<div class="value">{{ platform }}</div>
			</div>


		</div>
	</div>
</template>

<script>

  export default {
    data() {
      return {
        electron: process.versions.electron,
        name: this.$route.name,
        node: process.versions.node,
        path: this.$route.path,
        platform: require('os').platform(),
        vue: require('vue/package.json').version,
      }
    },
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link)
      }
    },
    created() {

    }
  }
</script>

<style scoped>
	.system-info {
		border: 1px solid black;
		margin: 10px;
		padding: 5px;
	}

	.title {
		color: #888;
		font-size: 18px;
		font-weight: initial;
		letter-spacing: .25px;
		margin-top: 10px;
	}

	.items {
		margin-top: 8px;
	}

	.item {
		display: flex;
		margin-bottom: 6px;
	}

	.item .name {
		color: #6a6a6a;
		margin-right: 6px;
	}

	.item .value {
		color: #35495e;
		font-weight: bold;
	}

	div.a-row div.a-col span {
		font-size: 18px;
		color: darkred;
	}

	.item button {
		margin-left: 200px;
	}
</style>
