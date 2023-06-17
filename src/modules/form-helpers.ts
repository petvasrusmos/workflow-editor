/**
 *
 * @author MaximAL
 * @since 2021-11-16 Переписал на TypeScript
 * @since 2021-11-15
 * @date 2021-11-15
 * @time 14:58
 * @copyright © MaximAL, Sijeko 2021
 */

import axios from 'axios';
import _ from 'lodash';

type TAxiosError = {
	response: {
		data: {
			errors: unknown,
			message: string,
		},
		status: number,
	},
	message: string,
};

type TVueComponent = any & {
	errors: object,
};

/**
 * Передать ошибки HTTP-запроса в результаты валидацию формы Vue-компонента
 */
export function responseToFormErrors(
	httpError: TAxiosError,
	vueComponent: TVueComponent,
	needAlert = false
): void {
	const response = httpError.response;
	if (!response) {
		return;
	}
	if (response.status === 422) {
		vueComponent.errors = response.data.errors;
	} else {
		vueComponent.errors = { message: response.data.message || httpError.message };
	}
	vueComponent.errors.message = response.data.message || httpError.message;
	if (needAlert) {
		alert(vueComponent.errors.message);
	}
	vueComponent.$emit('error', vueComponent.errors);
}

/**
 * Запустить GET-запрос с дебаунсом.
 */
export function debouncedGet(
	search: string,
	url: string,
	// eslint-disable-next-line no-unused-vars
	loading: (inProgress: boolean) => void,
	// eslint-disable-next-line no-unused-vars
	done: (data: any) => void
): void {
	if (search.trim().length) {
		loading(true);
		debounced(url, loading, done);
	}
}

const debounced = _.debounce((
	url: string,
	// eslint-disable-next-line no-unused-vars
	loading: (inProgress: boolean) => void,
	// eslint-disable-next-line no-unused-vars
	done: (data: any) => void
) => {
	axios.get(url).then((res: any) => {
		done(res.data.data);
		loading(false);
	});
}, 500);
