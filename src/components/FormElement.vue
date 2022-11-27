<template>
	<ValidationProvider
		:class="[
			{ item: item.type != 'hidden' },
			item['class'],
			{ disabled: vdisabled() },
			{
				isRequired:
					{ ...rules, ...((customValidation.validate || {})[item['name']] || {}) }
						.required === true,
			},
		]"
		:style="item['style']"
		:ref="`validation-provider-${item['name']}`"
		:vid="item['name']"
		:name="(locale ? locale[item['name']] : '') || item['label']"
		:rules="{ ...rules, ...customValidation.validate[item['name']] }"
		v-slot="{ valid, errors }"
	>
		<b-form-group
			:class="`form-group-${item['type']}`"
			:id="`input-group-${item['name']}`"
			:label-for="item['name']"
			:description="item['description']"
			label-class="form-group-label"
		>
			<template v-slot:label>
				{{
					item.type != "hidden" &&
					item["type"] != "checkbox" &&
					item["type"] != "radio"
						? (locale && locale.hasOwnProperty(item["name"])
								? locale[item["name"]]
								: item["name"]) || item["label"]
						: ""
				}}
				<span
					v-if="
						item['type'] != 'hidden' &&
						item['type'] != 'checkbox' &&
						item['type'] != 'radio' &&
						{ ...rules, ...((customValidation.validate || {})[item['name']] || {}) }
							.required === true
					"
					class="text-danger"
					>*</span
				>

				<span
					v-if="
						item['type'] != 'hidden' &&
						item['type'] != 'checkbox' &&
						item['type'] != 'radio' &&
						(item['info']?item['info']['show']:false)
						"
						class="text-info mx-1"
					>
					<b-icon-info-circle v-b-tooltip.hover="{ variant: 'light' }" :title="item['info']['msg']" /> 
				</span>


			</template>

			<!-- {{item['type']}} -->

			<b-form-input
				v-if="item['type'] == 'text' || item['type'] == 'email'"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				v-model="innerValue"
				v-on="item.handlers || {}"
			>
			</b-form-input>

			<b-form-input
				autocomplete="off"
				v-if="item['type'] == 'number'"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				v-model="innerValue"
				v-on="item.handlers || {}"
			>
			</b-form-input>

			<b-form-input
				v-if="item['type'] == 'day'"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				v-model="innerValue"
				v-on="item.handlers || {}"
				v-dayFormat
			>
			</b-form-input>
			
			<v-select
				v-if="item['type'] == 'select'"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				v-model="innerValue"
				@input="changedSelectValue"
				:class="{ 'is-invalid': !!errors.length }"
				:label="item['ds-name'] || 'name'"
				:options="item.ds"
				:title="getTitle"
				:reduce="
					(a) => (a[item['ds-code']] ? a[item['ds-code']].toString() : a['code'])
				"
			>
			</v-select>
			<b-form-checkbox
				v-if="item['type'] == 'checkbox'"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				:value="item['checked-val'] || 'Y'"
				:unchecked-value="item['unchecked-val'] || 'N'"
				v-model="innerValue"
				v-on="item.handlers || {}"
				:switch="item['switch'] || false"
			>
				{{ (locale ? locale[item["name"]] : "") || item["label"] }}
			</b-form-checkbox>

			<b-form-radio
				v-if="item['type'] == 'radio'"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				:value="item['checked-val']"
				v-model="innerValue"
				v-on="item.handlers || {}"
			>
				{{ (locale ? locale[item["name"]] : "") || item["label"] }}
			</b-form-radio>

			<b-form-checkbox-group
				v-if="item['type'] == 'checkbox-group'"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				v-model="innerValue"
				v-on="item.handlers || {}"
			>
				<b-form-checkbox
					:value="li.value || li"
					v-for="(li, index) in dataset"
					:key="`${item['name']}_${index}`"
				>
					{{ li.text || li }}
				</b-form-checkbox>
			</b-form-checkbox-group>
			<b-form-radio-group
				v-if="item['type'] == 'radio-group'"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				v-model="innerValue"
				v-on="item.handlers || {}"
				button-variant="outline-info"
				size="sm"
				buttons
			>
				<b-form-radio
					:value="item.ds ? li.value || li[item['ds-code']] : li"
					v-for="(li, index) in item.ds || dataset"
					:key="`${item['name']}_${index}`"
				>
					{{ item.ds ? li.text || li[item['ds-name']]: li }}
				</b-form-radio>
			</b-form-radio-group>

			<b-form-textarea
				v-if="item['type'] == 'textarea'"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				v-model="innerValue"
				v-on="item.handlers || {}"
			>
				<slot />
			</b-form-textarea>

			<b-form-file
				v-if="item['type'] == 'filefield'"
				accept="image/jpeg, image/png"
				v-bind="item_attr"
				:state="errors[0] ? false : valid ? true : null"
				v-model="innerValue"
				v-on="item.handlers || {}"
			></b-form-file>
			<div
				class="character-count"
				v-if="
					!errors[0] &&
					maxCharacters &&
					(	item['type'] == 'text' ||
						item['type'] == 'textarea' ||
						item['type'] == 'email'
					)
				"
			>
				{{ maxCharacters }} characters left
			</div>
			<b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
		</b-form-group>
	</ValidationProvider>
</template>


<script>
import { ValidationProvider } from "vee-validate";

export default {
	components: {
		ValidationProvider
	},
	props: {
		item: {
			type: [Object, String],
			default: "",
		},
		// must be included in props
		value: {
			type: null,
		},
		locale: {
			type: null,
		},
		dataset: {
			type: [Array, String],
			default: "",
		},
		customValidation: {
			type: Object,
			default: function () {
				return {
					hide: {},
					disabled: {},
					validate: {},
				};
			},
		},
		filterView: {
			type: Boolean,
			default: false,
		},
		isDatalist: {
			type: Boolean,
			default: false,
		},
		refsModel: {
			type: String,
		},
	},

	data() {
		const val = this.item.type == "checkbox-group" ? [] : this.value;
		return {
			innerValue: val,
			getTitle: "",
			uniqueDatasetValues:[]
		};
	},
	computed: {
		maxCharacters() {
			if (
				this.innerValue &&
				this.item.rules &&
				this.item.rules.min &&
				this.item.rules.min[0] >= this.innerValue.length
			) {
				return this.item.rules.min[0] - this.innerValue.length;
			} else {
				return "";
			}
		},
		item_attr() {
			return {
				name: this.item["name"],
				// id:this.item['name'],
				placeholder: this.placeholder_str,
				ref: `el_${this.item["name"]}`,
				stacked: this.item["stacked"],
				multiple: this.item["multiple"],
				taggable: this.item["taggable"],
				tabindex: this.item["tabindex"],
				// maxlength: this.item["maxlength"],
				maxlength: this.item.rules && this.item.rules.max ? this.item.rules.max[0] : this.item["maxlength"],
				accept: this.item["accept"] || '',
				disabled: this.vdisabled(),
			};
		},
		placeholder_str() {
			if(this.item.disabled)
				return ""
			let placeholder_str = this.item["placeholder"] || this.item["name"]
				// this.locale && this.locale.hasOwnProperty(this.item["name"])
				// 	? `${this.locale[this.item["name"]]}`
				// 	: this.item["placeholder"] || this.item["name"];

			let str =
				this.item.type == "select" ||
				this.item.type == "remote-select" ||
				this.item.type == "date" ||
				this.item.type == "datetime" ||
				this.item.type == "time12" ||
				this.item.type == "time24" ||
				this.item.type == "filefield" ||
				this.item.type == "time"
					? `Select ${placeholder_str}`
					: `Enter ${placeholder_str}`;
				
			return str;
		},
		rules() {
			if (this.item["type"] == "number") {
				return { numeric_comma: true, ...this.item["rules"] };
			} else if (this.item["type"] == "numericOnly") {
				return { numeric: true, ...this.item["rules"] };
			} else {
				return { ...this.item["rules"] };
			}
		},
		/*uniqueDatasetValues() {
			if (
				this.dataset.length &&
				this.item.isDatalist == false &&
				!this.filterView
			) {
				const arrayUniqueByKey = [
					...new Map(this.dataset.map((a) => [a[this.item["ds-code"]], a])).values(),
				];
				const authoriseFilter = arrayUniqueByKey.filter(
					(b) => b.AUTHORIZATION_STATUS == "1"
				);
				return authoriseFilter;
			} else {
				return this.dataset || [];
			}
		},*/
	},
	watch: {
		// Handles internal model changes.
		dataset(newval){
			// console.log(newval)
			if (
				newval.length &&
				this.item.isDatalist == false &&
				!this.filterView
			) {
				const arrayUniqueByKey = [
					...new Map(newval.map((a) => [a[this.item["ds-code"]], a])).values(),
				];
				const authoriseFilter = arrayUniqueByKey.filter(
					(b) => b.AUTHORIZATION_STATUS == "1"
				);
				this.uniqueDatasetValues = authoriseFilter;
			} else {
				const arrayUniqueByKey = [
					...new Map(newval.map((a) => [a[this.item["ds-code"]], a])).values(),
				];
				this.uniqueDatasetValues = arrayUniqueByKey || [];
			}
		},
		innerValue(newVal) {
			// console.log(newVal);
			// console.log(this.$refs[this.item['name']]);
			this.$emit("input", newVal || "");
			

			if (this.item.type == "select" && this.dataset && newVal) {
				this.formatSelectValue(newVal, this.dataset)
			}
			if (this.item.type == "select" && this.item.static && newVal) {
				this.formatSelectValue(newVal,  this.item.ds)
			}
			

			if (this.item["ds-group"] && this.dataset) {
				this.dataset.filter((i) => {
					if (i[this.item["ds-code"]] == this.innerValue) {
						this.innerValue = this.innerValue + " " + i[this.item["ds-group"]];
					}
				});
			}
		},
		// Handles external model changes.
		value(newVal) {
			this.innerValue = newVal;
		},
	},
	created() {
		if (this.value) {
			this.innerValue = this.value;
		}
		if (this.item.value) {
			this.innerValue = this.item.value;
		}
		if (this.item.type == "checkbox") {
			this.innerValue = this.item.value || "N";
		}
	},
	methods: {
		changedSelectValue(){
			if(this.item.handlers){
				this.item.handlers.change()
			}
		},
		vdisabled() {
			let isDisabled =
				((this.customValidation || {}).disabled || {})[this.item.name] ||
				this.item["disabled"];
			return isDisabled;
		},
		disabledDates(date) {
			var futureDate = new Date(date);
			// add a day
			futureDate.setDate(date.getDate() + 1);


			return this.item["futureDates"] == true
				? this.futureDatesEnable(date)
				: this.futureDatesDisable(futureDate);
		},
		futureDatesDisable: (date) => date >= new Date(),
		// futureDatesEnable: (date) => date < new Date(),
		// by defualt, futureDatesEnable() disables current date, so inorder to enable current date, have set the time as 0, because when dates are compared time is compared too, and thus it return true;
		futureDatesEnable(date){ 
				var currentDate = new Date()
				currentDate.setHours(0,0,0,0)
				return date < currentDate
			},

		getSelectedValue(val) {
			// console.log( this.refsModel, this.item.nameRef)
			this.$emit("getSelectedValue", {
				refsModel: this.refsModel,
				nameRef: this.item.nameRef,
				val: val,
			});
		},
		formatSelectValue(newVal, arr){
			if(this.item.multiple!=true)
				this.innerValue = newVal.toString();

			const _filterd = arr.filter((i) => {
				if (i[this.item["ds-code"]] == newVal) {
					return i[this.item["ds-code"]] == newVal;
				}
			});

			if (_filterd && _filterd[0]) {
				this.getTitle = _filterd ? _filterd[0][this.item["ds-name"]] : [];
				this.getSelectedValue(this.getTitle);
			}
		}
	},
};
</script>
