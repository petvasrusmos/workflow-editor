<template>
	<form class="mb-3" @submit="onSave">
		<div class="row mb-3" v-if="!model">
			<div class="col" v-if="$page.props.user.current_company_id">
				Будет создан в текущей компании.
			</div>
			<div class="col" v-else>
				Будет виден всем компаниям.
			</div>
			<div class="col"></div>
		</div>
		<div class="row mb-3">
			<div class="col">
				<label for="name" class="form-label">Шаблон команды</label>
				<input type="text" class="form-control" :class="errors.name ? 'is-invalid' : ''"
				       id="name" name="name" v-model="item.name" :maxlength="64" ref="name">
				<Errors :errors="errors.name"/>
			</div>
			<div class="col"></div>
		</div>
		<div class="row mb-3">
			<div class="col">
				<label for="notes" class="form-label">Примечания</label>
				<textarea v-model="item.notes" class="form-control"
				          :class="errors.notes ? 'is-invalid' : ''"
				          id="notes" ref="notes"></textarea>
				<Errors :errors="errors.notes"/>
			</div>
			<div class="col"></div>
		</div>
		<div class="row mb-3">
			<div class="col">
				<label for="name_template" class="form-label">Шаблон имени команды</label>
				<input type="text" class="form-control"
				       :class="errors.name_template ? 'is-invalid' : ''"
				       id="name_template" name="name_template"
				       v-model="item.name_template" :maxlength="128">
				<Errors :errors="errors.name_template"/>
				<div class="form-text">Поля объекта команды: <code>{object.fields.field_name}</code></div>
			</div>
			<div class="col"></div>
		</div>
		<div class="row mb-3">
			<div class="col">
				<label for="notes_template" class="form-label">Шаблон примечаний команды</label>
				<textarea v-model="item.notes_template" class="form-control"
				          :class="errors.notes_template ? 'is-invalid' : ''"
				          id="notes_template"></textarea>
				<Errors :errors="errors.notes_template"/>
				<div class="form-text">Поля объекта команды: <code>{object.fields.field_name}</code></div>
			</div>
			<div class="col"></div>
		</div>
		<div class="row mb-3">
			<div class="col">
				<label for="object_templates" class="form-label">Шаблоны объектов</label>
				<vSelect :options="optionsObjectTemplates" @search="onSearchObjectTemplates"
				         id="object_templates" name="object_templates"
				         v-model="item.object_templates"
				         label="name" multiple />
				<span :class="errors.object_templates ? 'is-invalid' : ''"></span>
				<Errors :errors="errors.object_templates"/>
			</div>
			<div class="col"></div>
		</div>
		<div class="row mb-3">
			<div class="col">
				<label for="series" class="form-label">Серии локомотивов</label>
				<vSelect :options="optionsSeries" @search="onSearchSeries"
				         id="series" name="series" v-model="item.series"
				         label="name" multiple/>
				<span :class="errors.series ? 'is-invalid' : ''"></span>
				<Errors :errors="errors.series"/>
			</div>
			<div class="col"></div>
		</div>
		<div class="row mb-3">
			<div class="col">
				<label for="duties" class="form-label">Должности</label>
				<vSelect :options="optionsDuties" @search="onSearchDuties"
				         id="duties" name="duties" v-model="item.duties"
				         label="name" multiple/>
				<span :class="errors.duties ? 'is-invalid' : ''"></span>
				<Errors :errors="errors.duties"/>
			</div>
			<div class="col"></div>
		</div>
		<div class="row mb-3">
			<div class="col">
				<label for="estimated_time" class="form-label">Время на выполнение</label>
				<input type="time" class="form-control" :class="errors.estimated_time ? 'is-invalid' : ''"
				       id="estimated_time" name="estimated_time" v-model="item.estimated_time"
				       min="00:05" max="23:55">
				<Errors :errors="errors.estimated_time"/>
			</div>
			<div class="col">
				<div class="form-check form-switch">
					<input class="form-check-input" type="checkbox" id="is_video_required"
					       v-model="item.is_video_required">
					<label class="form-check-label" for="is_video_required">
						Видеофиксация
					</label>
				</div>
				<Errors :errors="errors.is_video_required"/>
			</div>
			<div class="col"></div>
			<div class="col"></div>
		</div>
		<div class="row mb-3">
			<div class="col">
				<label>Тип подтверждения</label>
				<div v-if="confirmationTypesLoading" class="spinner-border text-primary"
				     role="status" title="Загрузка...">
					<span class="visually-hidden">Загрузка...</span>
				</div>
				<div v-for="type of confirmationTypes" class="form-check"
				     :key="'confirmation_type_' + type.id">
					<label class="form-check-label"
					       :style="'opacity: ' + (type.id === 'external' ? '0.5' : '1')">
						<input type="radio" class="form-check-input"
						       :disabled="type.id === 'external'"
						       v-model="item.confirmation_type_id"
						       :value="type.id" name="confirmation_type_id">
						{{ type.name }}
					</label>
				</div>
			</div>
			<div class="col"></div>
		</div>
		<div class="row mb-3" v-if="item.confirmation_type_id === 'checklist'">
			<div class="col">
				<label for="confirmation_template" class="form-label">Шаблон контрольной карты</label>
				<vSelect :options="optionsChecklistTemplates" @search="onSearchChecklistTemplates"
				         id="confirmation_template" name="confirmation_template"
				         v-model="item.confirmation_template" label="name" />
				<span :class="errors['confirmation_template.id'] ? 'is-invalid' : ''"></span>
				<Errors :errors="errors['confirmation_template.id']"/>
			</div>
			<div class="col"></div>
		</div>
		<div class="row mb-3" v-if="item.confirmation_type_id === 'barcode'">
			<div class="col">
				<label for="barcode-0" class="form-label">Штрихкоды</label>
				<ul class="list-unstyled">
					<li v-for="(barcode, index) of barcodes" :key="barcode- + index" class="mb-1">
						<textarea class="form-control" :id="'barcode-' + index"
						          v-model="barcodes[index]"
						          placeholder="Текст кода (цифры, знаки препинания, латинские буквы)"
						          required></textarea>
						<button class="btn btn-danger btn-sm" title="Удалить"
						        :disabled="barcodes.length < 2"
						        @click="onBarcodeDelete(index, $event)">
							<i class="bi bi-trash"></i>
						</button>
					</li>
				</ul>
				<button class="btn btn-outline-primary btn-sm" @click="onBarcodeAdd">
					<i class="bi bi-plus-circle-dotted"></i>
					Добавить код
				</button>
				<span :class="errors.barcodes ? 'is-invalid' : ''"></span>
				<Errors :errors="errors.barcodes"/>
			</div>
			<div class="col"></div>
		</div>
		<div class="row mb-3" v-if="item.confirmation_type_id === 'position'">
			<div class="col">
				<div class="col">
					<label for="zone-0" class="form-label">Зоны</label>
					<ul class="list-unstyled">
						<li v-for="(zone, index) of zones" :key="zone + index" class="mb-1">
							<div class="input-group">
								<input type="text" class="form-control"
								       :id="'zone-' + index"
								       v-model="zones[index]" required
								       placeholder="Наименование зоны"
								       aria-label="Наименование зоны">
								<button class="btn btn-danger btn-sm" title="Удалить"
								        :disabled="zones.length < 2"
								        @click="onZoneDelete(index, $event)">
									<i class="bi bi-trash"></i>
								</button>
							</div>
						</li>
					</ul>
					<button class="btn btn-outline-primary btn-sm" @click="onZoneAdd">
						<i class="bi bi-plus-circle-dotted"></i>
						Добавить зону
					</button>
					<span :class="errors.zones ? 'is-invalid' : ''"></span>
					<Errors :errors="errors.zones"/>
				</div>
			</div>
			<div class="col"></div>
		</div>
		<div class="row mb-3">
			<div class="col">
				<label for="close_event_template" class="form-label">Событие при закрытии</label>
				<vSelect :options="optionsEventTemplates" @search="onSearchEventTemplates"
				         id="close_event_template" name="close_event_template"
				         v-model="item.close_event_template" label="name" />
				<span :class="errors['close_event_template.id'] ? 'is-invalid' : ''"></span>
				<Errors :errors="errors['close_event_template.id']"/>
			</div>
			<div class="col"></div>
		</div>
		<div class="row mb-3">
			<div class="col">
				<label for="reject_event_template" class="form-label">Событие при отклонении</label>
				<vSelect :options="optionsEventTemplates" @search="onSearchEventTemplates"
				         id="reject_event_template" name="reject_event_template"
				         v-model="item.reject_event_template" label="name" />
				<span :class="errors['reject_event_template.id'] ? 'is-invalid' : ''"></span>
				<Errors :errors="errors['reject_event_template.id']"/>
			</div>
			<div class="col"></div>
		</div>
		<button type="submit" class="btn btn-primary" :disabled="submitted">Сохранить</button>
		<span v-if="errors.message" class="text-danger">{{ errors.message }}</span>
		<span v-if="successMessage" class="text-success">{{ successMessage }}</span>
	</form>

</template>

<script>
import autosize from 'autosize';
import vSelect from 'vue-select';
import { responseToFormErrors, debouncedGet } from '@/modules/form-helpers.ts';
import Errors from '@/Widgets/Errors.vue';
import axios from 'axios';

export default {
	name: 'CommandTemplateForm',
	components: { Errors, vSelect },
	props: { model: null, types: [] },
	data() {
		return {
			optionsObjectTemplates: [],
			optionsSeries: [],
			optionsDuties: [],
			optionsChecklistTemplates: [],
			optionsEventTemplates: [],
			confirmationTypes: this.types || [],
			confirmationTypesLoading: false,

			item: this.model || {},
			itemDefault: { confirmation_type_id: 'button' },
			errors: {},
			submitted: false,
			successMessage: null,

			barcodes: [],
			zones: [],
		};
	},
	mounted() {
		this.loadConfirmationTypes();
		autosize(this.$refs.notes);
		this.$refs.name.focus();
		this.item = this.model || { ...this.itemDefault };
		this.barcodes = [];
		(this.item.barcodes || ['barcode text']).forEach(item => {
			this.barcodes.push(item.code || item);
		});
		this.zones = [];
		(this.item.zones || ['']).forEach(item => this.zones.push(item.name || item));
	},
	methods: {
		onSave(event) {
			event.preventDefault();

			this.item.barcodes = undefined;
			this.item.zones = undefined;
			switch (this.item.confirmation_type_id) {
				case 'barcode':
					this.item.barcodes = [];
					this.barcodes.forEach(item => {
						this.item.barcodes.push(item.code || item);
					});
					break;
				case 'position':
					this.item.zones = [];
					this.zones.forEach(item => this.item.zones.push(item.name || item));
					break;
			}

			this.submitted = true;
			this.successMessage = null;
			const isNew = !this.item.id;
			const promise = isNew ?
				axios.post('/api/v1/commands/templates', this.item) :
				axios.put(`/api/v1/commands/templates/${this.item.id}`, this.item);

			promise.then(response => {
				this.item = isNew ? { ...this.itemDefault } : response.data;
				this.errors = {};
				this.successMessage = 'Сохранено.';
				this.$emit('saved', response.data);
				this.$emit(isNew ? 'created' : 'updated', response.data);
			}).catch(error => responseToFormErrors(error, this)).finally(() => {
				this.submitted = false;
			});
		},
		loadConfirmationTypes() {
			if (this.confirmationTypes.length > 0) {
				return;
			}
			this.confirmationTypesLoading = true;
			axios.get('/api/v1/confirmation/types?sort=order').then(response => {
				this.confirmationTypes = response.data.data;
				this.confirmationTypesLoading = false;
			});
		},
		onSearchObjectTemplates(search, loading) {
			debouncedGet(
				search,
				`/api/v2/templates/objects?filter[name:like]=${encodeURIComponent(search)}` +
				'&filter[takes]=commands',
				loading,
				data => this.optionsObjectTemplates = data,
			);
		},
		onSearchSeries(search, loading) {
			debouncedGet(
				search,
				`/api/v1/series?filter[name:like]=${encodeURIComponent(search)}`,
				loading,
				data => this.optionsSeries = data,
			);
		},
		onSearchDuties(search, loading) {
			debouncedGet(
				search,
				`/api/v1/duties?filter[name:like]=${encodeURIComponent(search)}`,
				loading,
				data => this.optionsDuties = data,
			);
		},
		onSearchChecklistTemplates(search, loading) {
			debouncedGet(
				search,
				`/api/v1/checklists/templates?filter[name:like]=${encodeURIComponent(search)}`,
				loading,
				data => this.optionsChecklistTemplates = data,
			);
		},
		onSearchEventTemplates(search, loading) {
			debouncedGet(
				search,
				`/api/v2/templates/events?filter[name:like]=${encodeURIComponent(search)}`,
				loading,
				data => this.optionsEventTemplates = data,
			);
		},

		onBarcodeAdd(event) {
			event.preventDefault();
			this.barcodes.push('barcode text');
		},
		onBarcodeDelete(index, event) {
			event.preventDefault();
			this.barcodes.splice(index, 1);
		},

		onZoneAdd(event) {
			event.preventDefault();
			this.zones.push('');
		},
		onZoneDelete(index, event) {
			event.preventDefault();
			this.zones.splice(index, 1);
		},
	},
};
</script>

<style scoped>

</style>
