<template>
    <section>
        <section class="container">
            <span class="item">
                <v-select
                    v-model="country"
                    label="name"
                    :selectedValue="country"
                    @input="fetchCountryById"
                    :options="datalist"
                    title="Country Name"
                >
                </v-select>
                <!-- <b-form-select v-model="vm.countryName" :options="datalist" value-field="name" text-field="name" size="sm" class="mt-3"></b-form-select> -->
            </span>
            <span>
                <b-button variant="primary" @click="$bvModal.show('modal-add-country')">Add New Country</b-button>
                <b-modal id="modal-add-country" size="xl">
                    <template #modal-header>
                        Add New Country
                    </template>
                    <div class="">
                        <ValidationObserver ref="formObserver" slim>
                            <b-form autocomplete="off" @submit.prevent="structureSubmit">
                                <div class="btn-hidden">
                                    <b-button id="submit_form" type="submit" variant="primary"
                                        >Submit</b-button
                                    >
                                </div>
                                <div class="grid grid--4">
                                    <FormElement
                                        v-for="(item, index) in el.countryEl"
                                        :key="`countryEl${index}`"
                                        :item="item"
                                        v-model="vm[item.name]"
                                        :dataset="ds[item.ds]"
                                        :locale="localeEl.fields"
                                    >
                                    </FormElement>
                                </div>
                            </b-form>
                            </ValidationObserver>
                    </div>
                    <template #modal-footer>
                        <label for="submit_form" class="btn btn-primary">
                            Save
                        </label>
                    </template>
                </b-modal>
            </span>
            <div v-if="vm_country.flag">
                <span class="wrapper">
                    <span class="rank">{{vm_country.rank}}</span>
                    <span class="title">{{vm_country.name}}</span>
                    <!-- <span class="sub-title">Asia</span> -->
                    <span class="img">
                        <!-- {{vm_country.flag}} -->
                        <img :src="`../${vm_country.flag}`" />
                    </span>
                </span>
            </div>
        </section>
        
    </section>
</template>

<script>
import FormElement from './FormElement.vue'
export default {
    name: "CountryMaster",
    components:{FormElement},
    data() {
        return {
            collectionName: 'country',
            vm: {},
            datalist:[],
            datalist_continent: [],
            ds:[],
            vm_country: {},
            localeEl: {},
            country: {}
        }
    },
    watch: {
    },
    computed: {
		el() {
			return getEl(this);
		},
    },
    created(){
       console.log(this.$appName);
       this.fetchCountryData();
       this.fetchContinentData();
    },
    methods: {
        fetchCountryById() {
            // console.log(this.country);
            const vObj={};
            this.$REST
					.collection(`country1/read/${this.country.id}`)
					.read({body: vObj})
					.then(response => {
						if (response && response.status == "unsuccess") {
							this.$_errorMessage(
								response.message || response.error || `Error while processing`
							);
						}
						else{
                            console.log("response :", response);
                            this.vm_country = response;
						}
					})
					.catch(error => {
						console.error(error)
					});
        },
        fetchCountryData() {
            const vObj={};
            this.$REST
					.collection(`${this.collectionName}/read`)
					.read({body: vObj})
					.then(response => {
						if (response && response.status == "unsuccess") {
							this.$_errorMessage(
								response.message || response.error || `Error while processing`
							);
						}
						else{
                            console.log("response :", response);
                            this.datalist = response;
                            this.country = {
                                id: 0, name: 'Select a Country'
                            }
                            this.vm={}
                            // this.vm.id = 1
						}
					})
					.catch(error => {
						console.error(error)
					});
        },
        fetchContinentData() {
            const vObj={};
            this.$REST
					.collection(`continent/read`)
					.read({body: vObj})
					.then(response => {
						if (response && response.status == "unsuccess") {
							this.$_errorMessage(
								response.message || response.error || `Error while processing`
							);
						}
						else{
                            console.log("response :", response);
                            this.datalist_continent = response;
                            // this.vm.countryName = "India"
						}
					})
					.catch(error => {
						console.error(error)
					});
        },
        async structureSubmit(){
            console.log("Submit");
            const success = await this.$refs.formObserver.validate();
			if (!success) {
				// this.$de_showErrors(this.$refs.formObserver)
				return;
			}
            const fileName = this.vm.flag.name;
            var vObj=this.vm;
            console.log("vObj :", vObj);
            vObj.flag = 'images/' + fileName;
            this.$REST
					.collection(`${this.collectionName}/create`)
					.create(vObj)
					.then(response => {
						if (response && response.status == "unsuccess") {
							this.$_errorMessage(
								response.message || response.error || `Error while processing`
							);
						}
						else{
                            console.log("response :", response);
                            this.$bvModal.hide('modal-add-country')
                            this.fetchCountryData();
						}
					})
					.catch(error => {
						console.error(error)
					});
        }
   
    }
}
function getEl(vm){
    return {
        countryEl: [
            {
                type: "text",
                name: "name",
                label: "Country",
                rules: {required: true}
            },
            {
                type: "select",
                name: "continent",
                label: "Continent",
                ds: vm.datalist_continent,
                "ds-name": "name",
                "ds-code": "name",
                rules: {required: true}
            },
            {
                type: "number",
                name: "rank",
                label: "Rank",
                rules: {required: true}
            },
            {
                type: "filefield",
                name: "flag",
                label: "Flag",
                rules: {required: true, max_file_size: ['4']}
            }
        ]
    };
}
</script>

<style lang="scss">
/* section .container {display: flex;} */
section {
    .container {
        min-width: 50vw;
        min-height: 70vh;
        background: #23405e;
        box-shadow: 0 0 8px 0px #767676a1;
        max-width: -moz-max-content;
        max-width: max-content;

        span {display:inline-block;}

        .item {
            width: 40%;
            margin: 20px;
        }
    }

    .wrapper {
        .rank {
            font-size: 2em;
            position: relative;
            font-weight: bold;
            background: #ffffff;
            padding: 30px 25px;
            width: 100px;
            height: 100px;
            border-radius: 70px;
            z-index: 3;
            display: inline-block;
            box-shadow: 0 0 8px 0 #555555ba;
        }

        .title {
                background: #fff;
                // border: 2px solid hsl(217deg 99% 67%);
                padding: 5px 64px;
                border-radius: 5px;
                font-size: 1.5rem;
                position: relative;
                display: inline-block;
                width: 550px;
                /* top: 0px; */
                left: -30px;
                z-index: 2;
                box-shadow: -2px 0px 7px 0 #69696963;
        }

        .img {
            width: 500px;
            position: relative;
            top: -30px;
            left: 70px;
            display: block;
            background: white;

            img {
                width: inherit;
                padding: 20px;
            }
        }
    }
}   
</style>