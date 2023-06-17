<template>
	<div class="invalid-feedback">
		<div v-for="(error, index) of preparedErrors" :key="error + '_' + index">{{ error }}</div>
	</div>
</template>

<script>
export default {
	name: 'Errors',
	props: { errors: null, multiple: String },
	computed: {
		// геттер вычисляемого значения
		preparedErrors: function () {
			if (!this.multiple) {
				return this.errors;
			}
			const result = [];
			for (let key in this.errors) {
				if (key.startsWith(this.multiple + '.')) {
					for (let i in this.errors[key]) {
						result.push(this.errors[key][i]);
					}
				}
			}
			return result;
		},
	},
};
</script>

<style lang="scss" scoped>

</style>
