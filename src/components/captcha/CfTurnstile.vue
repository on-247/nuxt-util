<script setup lang="ts">
import { onMounted } from "vue";
import { onBeforeUnmount } from "vue";

const CB_EXP = 'expired-callback';
const CB_ERR = 'error-callback';

type Appearance = "always" | "execute" | "interaction-only";
type Theme = "auto" | "light" | "dark";
type Language = "auto" | "en" | "de" | "nl";
type Emits = {
	(e: "update:modelValue", token?: string): void;
	(e: "verify", token: string): void;
	(e: "expire"): void;
	(e: "fail"): void;
};
type Props = {
	sitekey: string;
	appearance?: Appearance;
	theme?: Theme;
	lang?: Language;
	formFieldName?: string;
};

const emit = defineEmits<Emits>();
const prop = withDefaults(defineProps<Props>(), {
	appearance: "always",
	theme: "auto",
	lang: "auto",
	formFieldName: "cf-turnstile-response",
});

const widgetId = `#turnstile-widget`;
const scriptId = "#turnstile-script";
const renderTurnstile = () => { // @ts-ignore
	window.turnstile?.render(widgetId, {
		sitekey: prop.sitekey,
		appearance: prop.appearance,
		theme: prop.theme,
		language: prop.lang,
		"response-field-name": prop.formFieldName,
		callback: (token: string) => {
			emit("update:modelValue", token);
			emit("verify", token);
		},
		[CB_EXP]: () => {
			emit("update:modelValue", undefined);
			emit("expire");
		},
		[CB_ERR]: () => {
			emit("update:modelValue", undefined);
			emit("fail");
		},
	});
};

onMounted(() => {
	if (document.querySelector(scriptId)) {
		return renderTurnstile();
	}
	const script = document.createElement("script");
	script.id = "turnstile-script";
	script.src =
		"https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback";
	script.async = true;
	script.defer = true;
	document.head.appendChild(script);
	// @ts-ignore
	window.onloadTurnstileCallback = () => renderTurnstile();
});

onBeforeUnmount(() => { // @ts-ignore
	window?.turnstile?.remove(widgetId);
});
</script>

<template>
  <div :id="widgetId.replace('#', '')" />
</template>